"""Render specific timestamps as a contact sheet for visual QC."""
import sys
from PIL import Image, ImageDraw, ImageFont
import motion as MO, shots as SH, transitions as TR, montage as MG
SZ = int(sys.argv[1]) if len(sys.argv) > 1 else 720
MO.SIZE = SZ; SH.SIZE = SZ; TR.SIZE = SZ
import build_reel as BR
from grade import Grade
g = Grade(SZ)
ts = [float(x) for x in sys.argv[2].split(',')]
cell = 360; cols = min(6, len(ts)); rows = (len(ts)+cols-1)//cols
sheet = Image.new('RGB', (cols*cell+ (cols+1)*6, rows*(cell+22)+6), (16,16,18))
d = ImageDraw.Draw(sheet)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
for i, t in enumerate(ts):
    im = g.apply(BR.frame_at(t, SZ), int(t*30)).resize((cell, cell), Image.LANCZOS)
    x = 6 + (i%cols)*(cell+6); y = 6 + (i//cols)*(cell+22)
    sheet.paste(im, (x, y)); d.text((x+2, y+cell+3), f'{t:.2f}s', fill=(255,255,255), font=f)
sheet.save('/tmp/stills.png'); print('/tmp/stills.png', sheet.size)
