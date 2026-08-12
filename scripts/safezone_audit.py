#!/usr/bin/env python3
"""Pixel-level safe-zone audit for rendered stills and thumbnails.

    python3 scripts/safezone_audit.py stills/p1/*.png thumbnails/*.png

WHAT IT CHECKS, AND WHY THIS IS A VALID TEST

The side margins (x 0..71 and x 1008..1079) must contain no text and no
critical visual detail. Inside the primary band (y 250..1579) the Stage's
ambient photo wash is masked out entirely, so the only thing that can legally
appear in a side margin there is the light background itself. Any genuinely
dark pixel in that region is therefore text, a plate edge or product detail
that has escaped the margin — a real violation, not a false positive.

The top (0..249) and bottom (1580..1919) ambient strips are deliberately filled
with a blurred, desaturated photo wash, so darkness there is expected and is not
evidence of anything. Those bands are instead checked for *sharp* content: text
and plate edges produce strong local gradients, while a 40px-blurred wash
cannot. A high edge-energy reading in an ambient strip means real content has
leaked out of the safe area.

Thresholds are deliberately loose enough not to trip on the faint schematic grid
and measurement rails, which are part of the ambient design.
"""
import sys

import numpy as np
from PIL import Image

MARGIN = 72
TOP_END = 250
BOT_START = 1580
W, H = 1080, 1920

# A pixel this dark inside a side margin in the primary band is content.
DARK_LUMA = 118
# Allow a handful of stray antialiased pixels before calling it a violation.
DARK_TOLERANCE = 220
# Mean |gradient| above this in an ambient strip means sharp content, not wash.
EDGE_LIMIT = 5.6


def luma(a):
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def audit(path):
    im = Image.open(path).convert("RGB")
    if im.size != (W, H):
        return [f"unexpected size {im.size}, expected {(W, H)}"], {}
    a = np.asarray(im).astype(np.float32)
    L = luma(a)
    problems = []

    # --- side margins, primary band only -----------------------------------
    band = L[TOP_END:BOT_START, :]
    left = band[:, :MARGIN]
    right = band[:, W - MARGIN:]
    nl = int((left < DARK_LUMA).sum())
    nr = int((right < DARK_LUMA).sum())
    if nl > DARK_TOLERANCE:
        ys = np.where((left < DARK_LUMA).any(axis=1))[0] + TOP_END
        problems.append(f"LEFT margin has {nl} dark px (y {ys.min()}..{ys.max()})")
    if nr > DARK_TOLERANCE:
        ys = np.where((right < DARK_LUMA).any(axis=1))[0] + TOP_END
        problems.append(f"RIGHT margin has {nr} dark px (y {ys.min()}..{ys.max()})")

    # --- ambient strips: sharpness, not darkness ---------------------------
    def edge_energy(sub):
        if sub.shape[0] < 3:
            return 0.0
        gy = np.abs(np.diff(sub, axis=0)).mean()
        gx = np.abs(np.diff(sub, axis=1)).mean()
        return float((gy + gx) / 2)

    top_e = edge_energy(L[0:TOP_END, :])
    bot_e = edge_energy(L[BOT_START:H, :])
    if top_e > EDGE_LIMIT:
        problems.append(f"TOP ambient strip is too sharp ({top_e:.2f}) — content leaked in")
    if bot_e > EDGE_LIMIT:
        problems.append(f"BOTTOM ambient strip is too sharp ({bot_e:.2f}) — content leaked in")

    stats = {"L": nl, "R": nr, "topE": top_e, "botE": bot_e}
    return problems, stats


def main(paths):
    bad = 0
    print(f"\nSAFE-ZONE AUDIT  ({len(paths)} file(s))")
    print(f"  side margins {MARGIN}px · primary band {TOP_END}..{BOT_START - 1}")
    print("=" * 84)
    for p in sorted(paths):
        problems, s = audit(p)
        name = p.split("/")[-1]
        if problems:
            bad += 1
            print(f"  ✗ {name}")
            for pr in problems:
                print(f"      {pr}")
        else:
            print(
                f"  ✓ {name:<46s} margin dark L/R {s['L']:>4d}/{s['R']:<4d} "
                f"edge T/B {s['topE']:.2f}/{s['botE']:.2f}"
            )
    print("=" * 84)
    print(f"{bad} file(s) with safe-zone violations")
    return 1 if bad else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: safezone_audit.py <png> [png ...]")
        sys.exit(2)
    sys.exit(main(sys.argv[1:]))
