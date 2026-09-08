#!/usr/bin/env python3
"""Build every derived art asset for the MOTU M-Series montage reel.

The paper world, the light streaks and the grain are procedural. The 30 raw
product photographs are used in their ORIGINAL COLOUR - cropped and given torn
paper edges so they sit in the collage, but never recoloured, posterised or
converted to duotone. Re-runnable:

    python3 montage/scripts/build_assets.py

Outputs land in montage/public/art/ and are gitignored (derived, regenerable).
"""
import json
import os
import sys
import time

import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import texlib as T                                            # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
REPO = os.path.dirname(PROJ)
ART = os.path.join(PROJ, "public", "art")
IMG = os.path.join(ART, "img")

# The reel's palette. Bone paper, ink black, a single crimson and a teal-blue
# annotation accent - deliberately no yellow. It dresses the paper, the type and
# the tags; the photography itself keeps its own colour.
PAPER_BASE = (238, 231, 220)


def log(*a):
    print(*a, flush=True)


# ---------------------------------------------------------------------------
# photography -> screenprint
# ---------------------------------------------------------------------------

def crop_to(im, out_w, out_h, focus, zoom=1.0):
    """Crop `im` to the out aspect around a normalised focus point.

    zoom > 1 takes a tighter box than the aspect alone would - used to push
    MOTU's own circular feature badge out of frame in the few source shots
    that carry one in the bottom-left corner.
    """
    W, H = im.size
    want = out_w / out_h
    have = W / H
    if have > want:                       # source too wide -> trim sides
        cw, ch = int(round(H * want)), H
    else:                                 # source too tall -> trim top/bottom
        cw, ch = W, int(round(W / want))
    if zoom > 1.0:
        cw, ch = int(round(cw / zoom)), int(round(ch / zoom))
    cx, cy = focus[0] * W, focus[1] * H
    x = int(round(min(max(cx - cw / 2, 0), W - cw)))
    y = int(round(min(max(cy - ch / 2, 0), H - ch)))
    box = im.crop((x, y, x + cw, y + ch))
    if (out_w, out_h) == box.size:
        return box
    return box.resize((out_w, out_h), Image.LANCZOS)


def auto_levels(img, lo_pct=1.5, hi_pct=97.5):
    lum = T._srgb_lum(img)
    lo = float(np.percentile(lum, lo_pct))
    hi = float(np.percentile(lum, hi_pct))
    if hi - lo < 0.18:                    # very flat source: fall back
        lo, hi = max(0.0, lo - 0.09), min(1.0, hi + 0.09)
    return lo, hi


def build_image(entry):
    """Crop one source photograph and give it torn paper edges.

    The pixels themselves are untouched - no posterisation, no duotone, no
    grade. What lands on the sheet is the product in its own colour.
    """
    src = os.path.join(REPO, entry["file"])
    im = Image.open(src)
    if im.mode == "RGBA":                 # the panel PNGs sit on transparency
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    im = im.convert("RGB")

    ow, oh = entry["out"]
    im = crop_to(im, ow, oh, entry["focus"], entry.get("zoom", 1.0))
    rgb = np.array(im)

    role = entry["role"]
    if role == "strip":
        # a cut band: torn along the long edges, clean at the ends
        sides, amp = (1, 0, 1, 0), 0.055
    else:
        sides, amp = (1, 1, 1, 1), 0.022
    mask = T.torn_edge_mask(oh, ow, sides=sides, amp=amp,
                            seed=abs(hash(entry["id"])) % 4096, feather=1.6)

    out = np.dstack([rgb, (np.clip(mask, 0, 1) * 255).astype(np.uint8)])
    Image.fromarray(out, "RGBA").save(os.path.join(IMG, entry["id"] + ".png"))
    return float(T._srgb_lum(rgb).mean())


# ---------------------------------------------------------------------------
# the paper world
# ---------------------------------------------------------------------------

def build_paper(n=4, w=1360, h=2320):
    """Backdrop sheets, oversized so the frame can drift across them."""
    for i in range(n):
        p = T.crumpled_paper(h, w, seed=17 + i * 53, base=PAPER_BASE,
                             creases=3 if i % 2 == 0 else 2)
        Image.fromarray(p).save(os.path.join(ART, f"paper-{i}.jpg"),
                                quality=93, subsampling=0)
        log(f"  paper-{i}.jpg {w}x{h}")


def build_streaks(n=3, w=1360, h=2320):
    """Blind-shadow overlays, multiplied over the sheet and slowly drifted."""
    for i in range(n):
        m = T.light_streaks(h, w, count=(5, 4, 6)[i], angle_deg=(61, 54, 68)[i],
                            depth=(0.26, 0.21, 0.30)[i],
                            softness=(0.52, 0.66, 0.44)[i], seed=3 + i * 29)
        g = (np.clip(m / 1.14, 0, 1) * 255).astype(np.uint8)
        Image.fromarray(np.dstack([g, g, g])).save(
            os.path.join(ART, f"streaks-{i}.jpg"), quality=92, subsampling=0)
        log(f"  streaks-{i}.jpg {w}x{h}")


def build_grain(size=512):
    """Tileable film grain, applied as a low-opacity overlay."""
    rng = np.random.default_rng(4)
    g = rng.normal(0, 1, (size, size)).astype(np.float32)
    g = (g + np.roll(g, 1, 0) + np.roll(g, 1, 1)) / 3.0
    g = (g - g.min()) / (np.ptp(g) + 1e-9)
    v = (g * 255).astype(np.uint8)
    Image.fromarray(np.dstack([v, v, v])).save(os.path.join(ART, "grain.png"))
    log(f"  grain.png {size}x{size}")


# ---------------------------------------------------------------------------
# branding, presented the way the reference presents everything else
# ---------------------------------------------------------------------------

def _trim_alpha(im, pad=6):
    a = np.array(im.convert("RGBA"))[..., 3]
    ys, xs = np.where(a > 12)
    if len(xs) == 0:
        return im
    x0, x1 = max(0, xs.min() - pad), min(im.width, xs.max() + pad + 1)
    y0, y1 = max(0, ys.min() - pad), min(im.height, ys.max() + pad + 1)
    return im.crop((x0, y0, x1, y1))


def build_logo_tag(src_name, out_name, target_w=1180, pad_x=64, pad_y=52,
                   seed=91):
    """Put a brand logo on a torn scrap of the same paper as the backdrop."""
    logo = _trim_alpha(Image.open(os.path.join(REPO, src_name)).convert("RGBA"))
    scale = (target_w - 2 * pad_x) / logo.width
    logo = logo.resize((int(logo.width * scale), int(logo.height * scale)),
                       Image.LANCZOS)
    W, H = target_w, logo.height + 2 * pad_y

    sheet = T.crumpled_paper(H, W, seed=seed, base=PAPER_BASE, creases=1,
                             contrast=0.75)
    card = Image.fromarray(sheet).convert("RGBA")
    card.alpha_composite(logo, (pad_x, pad_y))

    mask = T.torn_edge_mask(H, W, sides=(1, 1, 1, 1), amp=0.020, seed=seed,
                            feather=1.5)
    out = np.array(card)
    out[..., 3] = (np.clip(mask, 0, 1) * 255).astype(np.uint8)
    Image.fromarray(out, "RGBA").save(os.path.join(ART, out_name))
    log(f"  {out_name} {W}x{H}")


def _write_catalog(cat):
    """Rewrite catalog.json in place, one image per line."""
    path = os.path.join(PROJ, "catalog.json")
    lines = ["{", f'  "_note": {json.dumps(cat["_note"])},', '  "duplicatePairs": [']
    dp = cat["duplicatePairs"]
    lines += [f"    {json.dumps(p)}," for p in dp[:-1]]
    lines += [f"    {json.dumps(dp[-1])}", "  ],", '  "images": [']
    lines.append(",\n".join(f"    {json.dumps(e)}" for e in cat["images"]))
    lines += ["  ]", "}"]
    with open(path, "w") as f:
        f.write("\n".join(lines) + "\n")


def main():
    t0 = time.time()
    os.makedirs(IMG, exist_ok=True)
    cat = json.load(open(os.path.join(PROJ, "catalog.json")))

    log("paper world")
    build_paper()
    build_streaks()
    build_grain()

    log("branding")
    build_logo_tag("MOTU LOGO.png", "logo-motu.png", target_w=980, seed=91)
    build_logo_tag("SHIVANSH ELECTRONICS LOGO FOR VIDEO.png",
                   "logo-shivansh.png", target_w=1240, seed=137)

    log(f"cropping {len(cat['images'])} photographs (original colour)")
    for e in cat["images"]:
        m = build_image(e)
        # `lum` is a derived field, refreshed here on every art build: the
        # composition uses it to decide whether a headline sitting over this
        # plate should be set in ink or in bone.
        e["lum"] = round(m, 3)
        log(f"  {e['id']:11s} {e['file']:20s} {e['role']:6s} "
            f"{e['out'][0]:>4d}x{e['out'][1]:<4d} lum={m:.2f}")

    _write_catalog(cat)

    log(f"done in {time.time() - t0:.1f}s -> {ART}")


if __name__ == "__main__":
    main()
