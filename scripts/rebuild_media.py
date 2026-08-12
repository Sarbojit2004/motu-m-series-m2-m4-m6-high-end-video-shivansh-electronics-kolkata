#!/usr/bin/env python3
"""Rebuilds public/img from the repository's source images, using the ledger.

Copies the chosen representative of every deduplicated cluster to
public/img/<slug>, downscaled so the long edge is at most MAX_EDGE px. The
widest box any scene draws is 936 px (the primary safe rect), so 1800 px keeps
a comfortable oversample for the gentle plate-scale push-ins while cutting
decode cost across a 2640-frame render.

Alpha is preserved: the six panel cutouts are transparent PNGs and must stay
that way — they are composited onto a light plate, and flattening them onto
white would put a hard rectangle around each one.

Nothing is cropped here. Only uniform scaling is applied, so every image keeps
its exact aspect ratio and its full framing; the ledger records the resulting
w/h and layout code sizes boxes to match.

The two logo files carry no slug and are skipped, so they are never present in
public/img and cannot be referenced by a scene.

    python3 scripts/rebuild_media.py
"""
import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.environ.get("MOTU_MEDIA_DIR", ROOT)
OUT = os.path.join(ROOT, "public", "img")
LEDGER = os.path.join(ROOT, "src", "lib", "ledger.json")

MAX_EDGE = 1800


def main() -> int:
    ledger = json.load(open(LEDGER))
    os.makedirs(OUT, exist_ok=True)

    written = skipped = missing = 0
    for e in ledger:
        if not e["slug"]:
            skipped += 1  # an excluded logo
            continue
        src = os.path.join(MEDIA, e["source"])
        if not os.path.exists(src):
            print(f"  ! missing source: {e['source']}")
            missing += 1
            continue

        dst = os.path.join(OUT, e["slug"])
        with Image.open(src) as im:
            w, h = im.size
            scale = min(1.0, MAX_EDGE / max(w, h))
            if scale < 1.0:
                nw, nh = max(1, round(w * scale)), max(1, round(h * scale))
                im = im.resize((nw, nh), Image.LANCZOS)
            else:
                nw, nh = w, h

            if e["slug"].lower().endswith(".png"):
                im.convert("RGBA").save(dst, "PNG", optimize=True)
            else:
                im.convert("RGB").save(dst, "JPEG", quality=94, subsampling=1,
                                       optimize=True, progressive=True)
        written += 1
        tag = "alpha" if e["alpha"] else "     "
        print(f"  {e['id']:>2d} {e['slug']:<26s} {w}x{h} -> {nw}x{nh}  {tag}  {e['role']}")

    print(f"\nimages written : {written}")
    print(f"logos skipped  : {skipped}  (excluded from reel content by design)")
    if missing:
        print(f"\n✗ {missing} source file(s) missing — point MOTU_MEDIA_DIR at the")
        print("  directory holding the 34 raw media files and run again.")
        return 1
    print(f"\nOK — {written} files in public/img")
    return 0


if __name__ == "__main__":
    sys.exit(main())
