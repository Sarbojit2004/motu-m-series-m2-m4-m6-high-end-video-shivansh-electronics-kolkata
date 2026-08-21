#!/usr/bin/env python3
"""Tiles the extracted render frames into one reviewable contact sheet."""
import glob, os, sys
from PIL import Image

src = sys.argv[1] if len(sys.argv) > 1 else "flick-output/qa/renders"
out = sys.argv[2] if len(sys.argv) > 2 else "flick-output/qa/render-contact-sheet.png"
files = sorted(glob.glob(os.path.join(src, "[0-9][0-9]-*.png")))
if not files:
    sys.exit("no frames found in " + src)
cols, W, H = 5, 216, 384
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * H), "white")
for i, f in enumerate(files):
    sheet.paste(Image.open(f).convert("RGB").resize((W, H)), ((i % cols) * W, (i // cols) * H))
sheet.save(out)
print(f"{len(files)} frames -> {out} {sheet.size}")
