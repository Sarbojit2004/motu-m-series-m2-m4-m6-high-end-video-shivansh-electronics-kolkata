#!/usr/bin/env python3
"""Strips the baked-in white plate from the two supplied logo files.

WHY THIS EXISTS
---------------
Long-form Section 9 is explicit and repeated: whenever either logo appears it
must be "directly on screen as a plain image — not enclosed in a white box,
card, or plate."

Both supplied files defeat that on their own. Measured:

    MOTU LOGO.png                 opaque bbox fill 96.6%   28.3% near-white
    SHIVANSH ELECTRONICS ...png   opaque bbox fill 98.0%   77.2% near-white

i.e. each is artwork sitting on an opaque white rounded rectangle. Composited
onto this project's #F2F4F7 ground that plate reads as exactly the white pill
the section forbids.

SCOPE NOTE. Section 0's "do not remove a brand mark baked into a supplied
image" rule is scoped to sourced PRODUCT PHOTOGRAPHS, and says in terms that it
"has no bearing on the constant, deliberately-added logo branding this section
governs (Section 9)". So it does not apply here. No product photograph is
touched by this script — it reads only the two logo files.

WHAT IS AND IS NOT CHANGED. Only the white ground is keyed out. The artwork
itself is untouched: the MOTU wordmark keeps its exact brand blue and its ®,
and the Shivansh mark keeps its globe, its wordmark and its own baked tagline.
(Section 9's "no tagline" rule governs tagline text this project would ADD; it
is not licence to redraw supplied logo artwork.)

METHOD. Alpha is derived from each pixel's distance from white using the
minimum channel, so a coloured or black pixel stays fully opaque while the
white ground goes fully transparent. Colour is then un-premultiplied against
white, which is what stops anti-aliased glyph edges keeping a white fringe once
the ground behind them changes.

    python3 scripts/prep_logos.py
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MEDIA = os.environ.get("MOTU_MEDIA_DIR", ROOT)
OUT = os.path.join(ROOT, "public", "logo")

# min-channel distance from 255 over which alpha ramps 0 -> 1.
# 60 keeps the MOTU blue (min channel 96) fully opaque while pure white
# (min channel 252) goes fully clear, with a soft edge ramp between.
RAMP = 60.0

LOGOS = [
    ("MOTU LOGO.png", "motu.png"),
    ("SHIVANSH ELECTRONICS LOGO FOR VIDEO.png", "shivansh.png"),
]


def strip_plate(src_path: str, dst_path: str) -> dict:
    im = Image.open(src_path).convert("RGBA")
    a = np.array(im).astype(np.float64)
    rgb, orig_alpha = a[..., :3], a[..., 3]

    # distance from white, via the darkest channel
    mn = rgb.min(axis=2)
    key = np.clip((255.0 - mn) / RAMP, 0.0, 1.0)

    # respect whatever transparency the file already had
    alpha = key * (orig_alpha / 255.0)

    # un-premultiply against the white ground so edges do not keep a halo
    safe = np.maximum(alpha, 1e-4)[..., None]
    unmul = (rgb - (1.0 - safe) * 255.0) / safe
    out_rgb = np.where(alpha[..., None] > 0.004, unmul, rgb)
    out_rgb = np.clip(out_rgb, 0, 255)

    out = np.dstack([out_rgb, alpha * 255.0]).astype(np.uint8)
    img = Image.fromarray(out, "RGBA")

    # crop to the real artwork bounds — the plate's rounded corners left a lot
    # of now-empty margin, and cropping means a placed logo's box IS its mark,
    # so positioning is predictable
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    img.save(dst_path, "PNG", optimize=True)
    return {"size": img.size, "opaque_pct": float((np.array(img)[..., 3] > 200).mean() * 100)}


def main() -> int:
    os.makedirs(OUT, exist_ok=True)
    for src, dst in LOGOS:
        p = os.path.join(MEDIA, src)
        if not os.path.exists(p):
            print(f"  ! missing logo source: {src}")
            return 1
        before = Image.open(p).size
        info = strip_plate(p, os.path.join(OUT, dst))
        print(f"  {src}")
        print(f"      -> public/logo/{dst}   {before} -> {info['size']}"
              f"   opaque {info['opaque_pct']:.1f}%  (plate removed)")
    print("\nOK — both logos are now plain transparent artwork, no plate.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
