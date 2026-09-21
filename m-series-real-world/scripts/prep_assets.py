#!/usr/bin/env python3
"""Builds public/img/ and writes src/assets.generated.ts.

NOTHING ABOUT AN ASSET'S SHAPE IS TYPED BY HAND. Width, height, aspect and —
the one that matters for staging — the bounding box of the actual CONTENT are
all measured off the file here, so a shot can never claim a shape the picture
does not have.

WHY THE CONTENT BOX MATTERS. Several of these are studio shots of a single
interface floating on white, and the hardware occupies very different fractions
of each canvas. Centring those by canvas puts the product off-centre on screen
and the amount it is off by changes shot to shot. Centring by content puts the
product where the composition wants it every time. For a transparent PNG the box
is the alpha bounds; for a JPEG on a near-white ground it is found by thresholding
away that ground; otherwise it is the whole canvas.

Region luminance is measured too, so a detail push into a dark rear panel and one
into a white front panel can both be normalised to a ground that 64%-opacity
white type with a hard shadow reads cleanly against.

    python3 scripts/prep_assets.py
"""
import json, os, shutil, subprocess
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.dirname(ROOT)                     # the repository root
IMG_OUT = os.path.join(ROOT, "public", "img")
BROLL_IN = os.path.join(ROOT, "public", "broll")
FF = "ffmpeg"
os.makedirs(IMG_OUT, exist_ok=True)
Image.MAX_IMAGE_PIXELS = None

# slug -> (source file, kind, model)
#
# kinds:  panel  the front/rear panel renders — transparent, very high detail,
#                and the only assets a DetailZoom is allowed to push into
#         hero   the isolated studio shot of one unit on white
#         photo  the unit in a room, as the manufacturer photographed it
SOURCES = {}
for model, jpgs in ((2, [1, 3, 4, 5, 6, 8, 10]), (4, [1, 2, 3, 4, 5, 6, 7]), (6, list(range(2, 11)))):
    for n in jpgs:
        SOURCES[f"m{model}-{n:02d}"] = (f"MOTU M{model} ({n}).jpg", "photo", model)
SOURCES["m2-08"] = ("MOTU M2 (8).jpg", "hero", 2)
SOURCES["m4-04"] = ("MOTU M4 (4).jpg", "hero", 4)
SOURCES["m2-front"] = ("MOTU M2 (2).png", "panel", 2)
SOURCES["m2-rear"]  = ("MOTU M2 (9).png", "panel", 2)
SOURCES["m4-front"] = ("MOTU M4 (1).png", "panel", 4)
SOURCES["m4-rear"]  = ("MOTU M4 (2).png", "panel", 4)
SOURCES["m6-front"] = ("MOTU M6 (1).png", "panel", 6)
SOURCES["m6-rear"]  = ("MOTU M6 (2).png", "panel", 6)
SOURCES["m6-meter"] = ("MOTU M6 (1).jpg", "panel", 6)
SOURCES["motu-logo"] = ("MOTU LOGO.png", "logo", 0)
SOURCES["shivansh-logo"] = ("SHIVANSH ELECTRONICS LOGO FOR VIDEO.png", "logo", 0)

# Deliberately unused, and why. Both are grids of plug-in screenshots supplied
# with the product set: at 4K they read as clutter rather than as a picture of
# anything, and neither film argues from bundled software.
OMITTED = {
    "MOTU M4 (8).jpg": "software bundle collage — a grid of plug-in screenshots",
    "MOTU M6 (11).jpg": "the same collage again",
}


def content_box(im):
    """[x0,y0,x1,y1] of real content, 0..1 of the canvas."""
    if im.mode == "RGBA":
        a = np.asarray(im.split()[-1])
        mask = a > 8
    else:
        g = np.asarray(im.convert("L")).astype(np.int16)
        # Only treat it as a cut-out if the border really is a flat pale ground.
        border = np.concatenate([g[0], g[-1], g[:, 0], g[:, -1]])
        if border.mean() < 232 or border.std() > 14:
            return [0.0, 0.0, 1.0, 1.0]
        mask = g < 236
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return [0.0, 0.0, 1.0, 1.0]
    H, W = mask.shape
    return [round(xs.min() / W, 4), round(ys.min() / H, 4),
            round((xs.max() + 1) / W, 4), round((ys.max() + 1) / H, 4)]


assets = []
for slug, (fname, kind, model) in sorted(SOURCES.items()):
    path = os.path.join(SRC, fname)
    if not os.path.exists(path):
        print(f"  MISSING {fname}")
        continue
    im = Image.open(path)
    transparent = im.mode == "RGBA"
    bbox = content_box(im)
    W, H = im.size
    out = os.path.join(IMG_OUT, slug + (".png" if transparent else ".webp"))
    if transparent:
        im.save(out, optimize=True)
    else:
        im.convert("RGB").save(out, "WEBP", quality=93, method=5)
    bw = (bbox[2] - bbox[0]) * W
    bh = (bbox[3] - bbox[1]) * H
    assets.append(dict(slug=slug, file="img/" + os.path.basename(out), kind=kind, model=model,
                       w=W, h=H, ar=round(bw / max(bh, 1), 4), bbox=bbox, transparent=transparent))
    print(f"  {slug:<14} {kind:<6} {W:>5}x{H:<5} bbox {bbox}  -> {os.path.basename(out)}")

# ── the three-quarter cut-outs ───────────────────────────────────────────────
#
# The M6 ships as a transparent three-quarter render showing the top lid AND the
# front panel, which is by far the best view of the hardware. The M2 and M4 have
# no equivalent PNG — only a studio JPEG on white. So the same view is cut out of
# those here, and the three then match.
#
# Two things this has to get right. The white legends and the lit colour meter
# INSIDE the unit are near-white too, so the background is found by flooding in
# from the border rather than by thresholding, or the cut punches holes straight
# through the panel. And a studio shot on white leaves a soft pale sweep under
# the unit that survives that flood and reads as a white smear on a dark ground —
# the M6 render has none, so these must not either. The chassis is near-black, so
# the unit is the largest DARK blob; everything outside its bounding box goes.
from scipy.ndimage import label, binary_closing, binary_fill_holes, gaussian_filter


def three_quarter_cut(src_name, slug, thr=246):
    src = os.path.join(SRC, src_name)
    if not os.path.exists(src):
        print(f"  MISSING {src_name}")
        return None
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    L = np.asarray(im.convert("L")).astype(np.int16)

    near_white = (a.min(axis=2) >= thr) & ((a.max(axis=2) - a.min(axis=2)) <= 6)
    lab, _ = label(near_white)
    border = set(lab[0].tolist()) | set(lab[-1].tolist()) | set(lab[:, 0].tolist()) | set(lab[:, -1].tolist())
    border.discard(0)
    subject = binary_fill_holes(binary_closing(~np.isin(lab, list(border)), np.ones((3, 3))))

    dl, dn = label(binary_closing(L < 140, np.ones((5, 5))))
    if dn:
        sizes = np.bincount(dl.ravel()); sizes[0] = 0
        ys, xs = np.where(dl == sizes.argmax())
        keep = np.zeros_like(subject)
        # padded on three sides, trimmed at the bottom: the last row or two of
        # the blob is the unit meeting its own reflection, and keeping it leaves
        # a pale sliver along the bottom edge.
        keep[max(0, ys.min() - 4):max(0, ys.max() - 2), max(0, xs.min() - 4):xs.max() + 5] = True
        subject &= keep

    alpha = np.clip((gaussian_filter(subject.astype(np.float32), 0.8) - 0.30) / 0.45, 0, 1)
    rgba = np.dstack([np.asarray(im), (alpha * 255).astype(np.uint8)])
    tmp = Image.fromarray(rgba, "RGBA")
    out_im = tmp.crop(tmp.getbbox())
    dst = os.path.join(IMG_OUT, slug + ".png")
    out_im.save(dst, optimize=True)
    W, H = out_im.size
    bbox = content_box(out_im)
    bw = (bbox[2] - bbox[0]) * W; bh = (bbox[3] - bbox[1]) * H
    print(f"  {slug:<14} 3/4cut {im.size} -> {W}x{H}")
    return dict(slug=slug, file="img/" + slug + ".png", kind="hero",
                model=int(slug[1]), w=W, h=H, ar=round(bw / max(bh, 1), 4),
                bbox=bbox, transparent=True)


for src_name, slug in (("MOTU M2 (8).jpg", "m2-3q"), ("MOTU M4 (4).jpg", "m4-3q")):
    rec = three_quarter_cut(src_name, slug)
    if rec:
        assets.append(rec)
assets.sort(key=lambda r: r["slug"])

# ── region luminance, for DetailZoom normalisation ───────────────────────────
from_assets = {a["slug"]: a for a in assets}
REGION_LUM = {}


def measure(region_name, slug, x, y, w, h):
    a = from_assets.get(slug)
    if not a:
        return
    im = Image.open(os.path.join(IMG_OUT, os.path.basename(a["file"]))).convert("L")
    W, H = im.size
    crop = im.crop((int(x * W), int(y * H), int((x + w) * W), int((y + h) * H)))
    REGION_LUM[region_name] = round(float(np.asarray(crop).mean()) / 255.0, 4)


# Rectangles read off the panel renders themselves. Every one is a crop of a
# file at least 1212 px wide on its short dimension, so even the tightest push
# lands above the frame it is rendered into.
REGIONS = {
    "m2.inputs":   ("m2-front", 0.020, 0.10, 0.360, 0.82),
    "m2.meter":    ("m2-front", 0.395, 0.12, 0.170, 0.72),
    "m2.monitor":  ("m2-front", 0.560, 0.05, 0.230, 0.90),
    "m2.phones":   ("m2-front", 0.780, 0.10, 0.200, 0.82),
    "m2.usbc":     ("m2-rear",  0.330, 0.30, 0.240, 0.46),
    "m2.midi":     ("m2-rear",  0.180, 0.22, 0.220, 0.62),
    "m4.inputs":   ("m4-front", 0.020, 0.10, 0.330, 0.82),
    "m4.mix":      ("m4-front", 0.355, 0.10, 0.145, 0.80),
    "m4.meter":    ("m4-front", 0.495, 0.12, 0.215, 0.72),
    "m4.monitor":  ("m4-front", 0.700, 0.05, 0.190, 0.90),
    "m4.rearline": ("m4-rear",  0.780, 0.15, 0.200, 0.75),
    "m6.gains":    ("m6-front", 0.045, 0.32, 0.360, 0.62),
    "m6.mix":      ("m6-front", 0.400, 0.32, 0.130, 0.62),
    "m6.meter":    ("m6-front", 0.520, 0.36, 0.180, 0.52),
    "m6.monitor":  ("m6-front", 0.690, 0.30, 0.180, 0.66),
    "m6.phones":   ("m6-front", 0.830, 0.32, 0.150, 0.62),
    "m6.rearmic":  ("m6-rear",  0.520, 0.12, 0.460, 0.80),
    "m6.power":    ("m6-rear",  0.030, 0.12, 0.220, 0.80),
}
for name, (slug, x, y, w, h) in REGIONS.items():
    measure(name, slug, x, y, w, h)
    print(f"  lum {name:<14} {REGION_LUM.get(name)}")

# ── the B-roll, if it has arrived ────────────────────────────────────────────
# Absent by design until the clips are committed: cloudfront.net is blocked from
# the build session, so they come in through the repository. Both films render
# either way — the shot plan falls back to the product photography for any clip
# it cannot find, so nothing is ever a black hole waiting for an asset.
clips = []
if os.path.isdir(BROLL_IN):
    for f in sorted(os.listdir(BROLL_IN)):
        if not f.endswith(".mp4"):
            continue
        p = os.path.join(BROLL_IN, f)
        probe = subprocess.run([FF, "-hide_banner", "-i", p], capture_output=True, text=True).stderr
        import re
        m = re.search(r"(\d{3,5})x(\d{3,5})", probe)
        d = re.search(r"Duration: (\d+):(\d+):([\d.]+)", probe)
        if not (m and d):
            print(f"  UNREADABLE {f}")
            continue
        w, h = int(m.group(1)), int(m.group(2))
        dur = int(d.group(1)) * 3600 + int(d.group(2)) * 60 + float(d.group(3))
        clips.append(dict(slug=f[:-4], file="broll/" + f, w=w, h=h,
                          ar=round(w / h, 4), dur=round(dur, 3)))
        print(f"  clip {f[:-4]:<26} {w}x{h}  {dur:.3f}s")

if not clips:
    print("  no B-roll present — both films will render on the product photography")

gen = os.path.join(ROOT, "src", "assets.generated.ts")
with open(gen, "w") as fh:
    fh.write("// GENERATED by scripts/prep_assets.py — do not edit by hand.\n")
    fh.write("// Every size and every bounding box here was measured off the file on disk.\n\n")
    fh.write('import type { Asset, Clip } from "./assets.ts";\n\n')
    fh.write("export const ASSETS: Asset[] = " + json.dumps(assets, indent=1) + ";\n\n")
    fh.write("export const CLIPS: Clip[] = " + json.dumps(clips, indent=1) + ";\n\n")
    fh.write("export const REGION_LUM: Record<string, number> = " + json.dumps(REGION_LUM, indent=1) + ";\n")

print(f"\n{len(assets)} assets, {len(clips)} clips, {len(REGION_LUM)} regions -> src/assets.generated.ts")
for f, why in OMITTED.items():
    print(f"omitted  {f:<24} {why}")
