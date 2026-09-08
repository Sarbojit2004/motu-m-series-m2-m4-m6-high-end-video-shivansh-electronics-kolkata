"""Slide 01 — opener. Anchor: front-panel cutout over a full-colour hero photo."""
import lib, slide as S, brand, assets_io as A
from lib import BLACK, RED, YELLOW, CREAM
from slide import W, H, clip, scrap, photo, frag, letters, spray_patch, halftone_patch

b = []

# ---------------------------------------------------------------- torn colour zones
b.append(f'''<svg width="{W}" height="{H}" style="position:absolute;inset:0;z-index:1">
<rect width="{W}" height="{H}" fill="{BLACK}"/>
<path d="{lib.zone_path(31, 32, 0.148, 0.292, W, H, 26, 20)}" fill="{CREAM}"/>
<path d="{lib.zone_path(41, 42, 0.228, 0.845, W, H, 24, 30)}" fill="{RED}"/>
</svg>''')

# yellow torn wedge, bottom-right, bleeding off two edges
yw = lib.torn_edge(77, n=170, amp=18)
d = [f'M {W} {0.612*H:.1f}']
for t, o in yw:
    d.append(f'L {W-t*0.70*W:.1f} {0.648*H+o+t*172:.1f}')
d.append(f'L {W*0.24:.1f} {H} L {W} {H} Z')
b.append(f'<svg width="{W}" height="{H}" style="position:absolute;inset:0;z-index:2">'
         f'<path d="{" ".join(d)}" fill="{YELLOW}"/></svg>')

# drips off the torn edges
b.append(f'<svg width="620" height="150" style="position:absolute;left:36px;top:833px;'
         f'z-index:9">{lib.drips(620,150,seed=23,n=19,colour=RED)}</svg>')
b.append(f'<svg width="320" height="84" style="position:absolute;left:596px;top:206px;'
         f'z-index:9;transform:rotate(180deg)">{lib.drips(320,84,seed=29,n=11,colour=CREAM)}</svg>')

# ---------------------------------------------------------------- texture
b.append(spray_patch(-60, 210, 500, 390, seed=61, colour=(12,12,14), n=4000, z=7, op=.85))
b.append(spray_patch(520, 560, 540, 420, seed=62, colour=(12,12,14), n=2400, z=7, op=.5))
b.append(halftone_patch(548, 222, 380, 290, seed=63, colour=(12,12,14), step=13, z=8, op=.75, rot=-6))
b.append(halftone_patch(-30, 470, 320, 240, seed=64, colour=(242,222,49), step=11, z=8, op=.65, rot=4, fade='y'))

# ---------------------------------------------------------------- photo scraps, full colour
b.append(photo(103, 'MOTU M6 (10).jpg', 300, 236, 512, 330, rot=-3.2, z=12, amp=11, pos='52% 58%'))
b.append(photo(101, 'MOTU M6 (3).jpg',    2, 290, 240, 168, rot=-8.0, z=13, amp=10, pos='50% 60%'))
b.append(photo(102, 'MOTU M6 (1).jpg',  770, 272, 226, 158, rot=10.0, z=13, amp=9))

# ---------------------------------------------------------------- HERO: front-panel cutout
b.append(f'''<div style="position:absolute;left:-14px;top:548px;width:948px;z-index:18;
  transform:rotate(-2.1deg);filter:drop-shadow(0 18px 30px rgba(0,0,0,.7))">
  <img src="{A.img('MOTU M6 (1).png')}" style="width:100%;display:block"></div>''')

# ---------------------------------------------------------------- headline 1 (black zone)
b.append(letters([
    dict(t='w', font='Yeseva',   size=146, c=RED, rot=-3, dy=4),
    dict(t='H', font='Yeseva',   size=166, c=RED, rot=4,  dy=8),
    dict(t='A', font='Playfair', size=152, c=RED, style='italic', w=900, rot=-6, dy=-2),
    dict(t='t', font='Marker',   size=108, c=RED, rot=12, dy=-20, ml=4),
    dict(t='a', font='Playfair', size=92,  c=RED, style='italic', w=900, rot=3, dy=2, ml=10),
    dict(t='r', font='Marker',   size=112, c=RED, rot=-7, dy=0),
    dict(t='E', font='Anton',    size=182, c=RED, rot=2,  dy=6, ml=8, sx=.94),
], x=28, baseline=248, box=252, z=20, rot=-1.4, gap=7))

# "lens" prop over the final E — the reference's magnifying-glass move
b.append(f'''<svg width="250" height="250" style="position:absolute;left:736px;top:104px;
  z-index:21"><path d="M 8 8 L 104 118" stroke="{RED}" stroke-width="17"
  stroke-linecap="round"/></svg>''')
b.append(f'''<img src="{A.img(S.LENS)}" style="position:absolute;left:628px;top:8px;
  width:132px;height:132px;z-index:22;transform:rotate(-14deg);
  filter:drop-shadow(3px 6px 9px rgba(0,0,0,.6))">''')

# ---------------------------------------------------------------- headline 2 (red zone)
b.append(letters([
    dict(t='M', font='Anton',        size=180, c=YELLOW, rot=-2, dy=4),
    dict(img=S.KNOB,                 size=120, rot=9,  dy=-14, ml=1, mr=1),
    dict(t='N', font='Anton',        size=180, c=YELLOW, rot=3,  dy=2),
    dict(t='i', font='Anton',        size=126, c=YELLOW, rot=-6, dy=-4, ml=3, mr=3),
    dict(t='T', font='ArchivoBlack', size=148, c=YELLOW, rot=4,  dy=6),
    dict(t='O', font='Pixel',        size=88,  c=YELLOW, rot=-3, dy=-12, ml=5, mr=5),
    dict(t='R', font='Anton',        size=186, c=YELLOW, rot=2,  dy=6),
    dict(t='S', font='Anton',        size=198, c=YELLOW, rot=-3, dy=10),
    dict(t='?', font='Anton',        size=210, c=YELLOW, rot=6,  dy=2, ml=4),
], x=16, baseline=470, box=212, z=20, rot=-0.9, gap=6,
   shadow='4px 6px 7px rgba(0,0,0,.72)'))

# ---------------------------------------------------------------- scattered fragments
b.append(frag('QUiCK<br>dE-LAtENCY<br>tOOL', 20, 236, rot=-8, size=24, lh=1.0, z=22))
b.append(f'''<svg width="316" height="110" style="position:absolute;left:10px;top:482px;
  z-index:14;transform:rotate(3deg)">
  <path d="M 8 22 C 92 -6, 196 44, 300 10" stroke="{BLACK}" stroke-width="27"
   fill="none" stroke-linecap="round"/>
  <path d="M 4 60 C 100 30, 182 78, 278 44" stroke="{BLACK}" stroke-width="23"
   fill="none" stroke-linecap="round"/>
  <path d="M 12 96 C 78 72, 150 104, 218 82" stroke="{BLACK}" stroke-width="16"
   fill="none" stroke-linecap="round"/></svg>''')
b.append(frag('WORK HARd<br>dREAM LiKE A PREAMP', 22, 480, rot=3, size=25, lh=1.34,
              colour=CREAM, z=16))
b.append(frag('I&nbsp; MONiTOR<br>VERY QUiCK<br>JUSt LiKE', 690, 476, rot=4, size=23,
              font='Oswald', lh=1.12, z=16))
b.append(frag('MAGiC PREAMP tOOL', 690, 576, rot=4, size=26, font='Oswald',
              colour=YELLOW, z=26, extra=f'text-shadow:2px 2px 0 {BLACK};'))
b.append(frag('NOtHiNG tO', 322, 482, rot=-3, size=20, font='Oswald', z=16))
b.append(frag('CLiP', 322, 502, rot=-3, size=30, font='Oswald', z=16,
              extra='text-decoration:line-through;text-decoration-thickness:4px;'))
b.append(frag('USB-C', 470, 238, rot=-7, size=19, font='Pixel', z=22, ls='0'))
b.append(frag('SiGNAL', 236, 252, rot=-11, size=30, font='Marker', colour=BLACK, z=22))
b.append(frag('BLACK dROPPER tOOL', 452, 512, rot=-5, size=21, font='Oswald', z=16))

# text running across the unit — the reference's "expand appearance" on the helmet
b.append(frag('eXPANd tHE GAiN', 268, 562, rot=-2.4, size=36, font='Oswald', colour=CREAM,
              z=24, ls='.02em', extra='opacity:.94;'))
b.append(frag('MONitORPSd', 118, 748, rot=-2.0, size=26, font='Oswald', colour=CREAM, z=24,
              extra='opacity:.9;'))
b.append(frag('<br>'.join(['NO LAtENCY']*6), 956, 800, rot=-90, size=12, font='Oswald',
              colour=BLACK, lh=1.5, z=24, ls='.07em'))
b.append(frag('StANdALONE', 742, 800, rot=-3, size=24, font='Oswald', colour=CREAM, z=24))
b.append(frag('hEAdPHONE', 842, 430, rot=7, size=19, font='Elite', colour=BLACK, z=16))

b.append(frag('A/B<br>A/B<br>A/B', 906, 40, rot=8, size=26, font='Oswald',
              colour=CREAM, lh=1.06, z=22))
b.append(frag('nothing<br>to CLiP', 848, 168, rot=-6, size=17, font='Elite',
              colour=BLACK, lh=1.2, z=22))

# reference's chest name-badge move — straddling the unit's bottom edge
b.append(scrap(180, 356, 812, 206, 54, BLACK, rot=-2.4, z=26, amp=4, pad=6,
               inner=f'<div style="font-family:Elite;font-size:15px;color:{CREAM};'
                     f'text-align:center;line-height:1.26;letter-spacing:.04em">'
                     f'M6 &nbsp;M6 &nbsp;M6<br>ALL-tiME MONitOR</div>'))

# ---------------------------------------------------------------- brand layer
b.append(S.brand_layer(seed=900, y=826))

open('/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/out/slide01.html',
     'w').write(S.page(''.join(b)))
print('slide01.html written')
