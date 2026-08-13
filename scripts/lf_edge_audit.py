#!/usr/bin/env python3
"""Pixel-level edge audit for the long-form frames.

Section 2 asks for critical text and callouts to sit roughly 40-60px inboard of
the true frame edges so nothing is clipped by a downstream crop or re-encode.
This measures whether anything sharp actually intrudes into that band.

Method, same as the reels' safe-zone audit: the ground is a light gradient, so
"content" is any pixel materially darker than the local paper value. Ambient
washes and the blurred backdrops are allowed to touch the edge — they are not
critical content — so the test looks for SHARP dark pixels (high local
contrast), which is what text, plates and product photography produce and what
a soft gradient does not.

    python3 scripts/lf_edge_audit.py frames/lf/*.png
"""
import sys

import numpy as np
from PIL import Image

PAD = 56          # the Section 2 inset floor
DARK = 132        # luminance below this is "ink-like"
SHARP = 26        # local gradient above this means a real edge, not a wash
MAX_HITS = 40     # allow a handful of stray antialiased pixels


def audit(path: str):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.int16)
    lum = (0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2])
    h, w = lum.shape

    gx = np.abs(np.diff(lum, axis=1, prepend=lum[:, :1]))
    gy = np.abs(np.diff(lum, axis=0, prepend=lum[:1, :]))
    grad = np.maximum(gx, gy)

    sharp_dark = (lum < DARK) & (grad > SHARP)

    left = int(sharp_dark[:, :PAD].sum())
    right = int(sharp_dark[:, w - PAD:].sum())
    top = int(sharp_dark[:PAD, :].sum())
    bottom = int(sharp_dark[h - PAD:, :].sum())

    ok = max(left, right, top, bottom) <= MAX_HITS
    return ok, left, right, top, bottom, (w, h)


def main(argv):
    files = argv[1:]
    if not files:
        print("usage: lf_edge_audit.py <png...>")
        return 2
    print(f"LONG-FORM EDGE AUDIT   ({len(files)} file(s))")
    print(f"  inset {PAD}px on every edge · allow <= {MAX_HITS} sharp dark px")
    print("=" * 92)
    bad = []
    for p in sorted(files):
        ok, l, r, t, b, size = audit(p)
        name = p.split("/")[-1]
        if size != (1920, 1080):
            print(f"  ✗ {name:<26s} WRONG SIZE {size}")
            bad.append(p)
            continue
        mark = "✓" if ok else "✗"
        print(f"  {mark} {name:<26s} L{l:<5d} R{r:<5d} T{t:<5d} B{b:<5d}")
        if not ok:
            bad.append(p)
    print("=" * 92)
    print(f"{len(bad)} file(s) with edge violations")
    for p in bad:
        print(f"  ✗ {p}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
