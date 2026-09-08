"""02 — rear panel / connectivity. Yellow-dominant field, black headline."""
import lib, slide as S, deck as D
from lib import BLACK, RED, YELLOW, CREAM
from slide import scrap, photo, frag, letters, spray_patch, halftone_patch

STROKE = '-webkit-text-stroke:4px #F0E8D8;paint-order:stroke fill;'

def build():
    b = []
    b.append(D.zones([(31,32,0.132,0.286,CREAM,26,20), (41,42,0.222,0.842,YELLOW,25,30)]))
    b.append(D.wedge(78, RED, 'bl', y0=.640, y1=.686, span=.62, drop=180, z=3))
    b.append(D.drip(300, 828, 560, 140, 24, YELLOW, n=17))
    b.append(D.drip(120, 198, 300, 80, 27, CREAM, n=10, flip=True))

    b.append(spray_patch(560, 200, 500, 400, seed=71, colour=(12,12,14), n=3600, z=7, op=.72))
    b.append(halftone_patch(-30, 232, 360, 280, seed=72, colour=(12,12,14), step=12, z=8, op=.7, rot=5))
    b.append(halftone_patch(660, 610, 340, 250, seed=73, colour=(222,26,18), step=11, z=8, op=.62, rot=-7, fade='y'))

    b.append(photo(201, 'MOTU M6 (2).jpg', 330, 236, 430, 292, rot=3.4, z=12, amp=11, pos='62% 58%'))
    b.append(photo(202, 'MOTU M6 (2).jpg', 12, 268, 232, 164, rot=-8.5, z=13, amp=10, pos='24% 70%'))

    # anchor: the rear-panel cutout, full colour, bleeding both edges
    b.append(D.anchor_cutout('MOTU M6 (2).png', -34, 566, 1074, -1.8))

    b.append(letters([
        dict(t='w', font='Yeseva',   size=150, c=RED, rot=-4, dy=4),
        dict(t='H', font='Yeseva',   size=176, c=RED, rot=3,  dy=8),
        dict(t='i', font='Anton',    size=152, c=RED, rot=11, dy=-8, ml=16, mr=12),
        dict(t='C', font='Playfair', size=158, c=RED, style='italic', w=900, rot=-5, dy=0, ml=8),
        dict(t='H', font='Anton',    size=186, c=RED, rot=2,  dy=6, ml=6, sx=.94),
    ], x=30, baseline=244, box=250, z=20, rot=-1.6, gap=8))
    b.append(D.lens(556, 20, 128, -18, 22, handle=(660,124,98)))
    b.append(frag('nothing<br>to SOLO', 792, 132, rot=-7, size=17, font='Elite', colour=CREAM, lh=1.2, z=22))
    b.append(frag('A/B<br>A/B', 892, 26, rot=9, size=25, font='Oswald', colour=CREAM, lh=1.06, z=22))

    # SOCKETS? — the O is the real XLR jack off the rear panel
    b.append(letters([
        dict(t='S', font='Anton',        size=192, c=BLACK, rot=-2, dy=4, extra=STROKE),
        dict(img=S.KNOB,                 size=122, rot=12, dy=-14, ml=8, mr=12, ring=7),
        dict(t='C', font='Anton',        size=192, c=BLACK, rot=3,  dy=2, extra=STROKE),
        dict(t='K', font='ArchivoBlack', size=156, c=RED,   rot=-4, dy=6, extra=STROKE),
        dict(t='E', font='Pixel',        size=88,  c=BLACK, rot=3,  dy=-12, ml=6, mr=6, extra=STROKE),
        dict(t='t', font='Anton',        size=176, c=BLACK, rot=-3, dy=6, extra=STROKE),
        dict(t='S', font='Anton',        size=200, c=BLACK, rot=2,  dy=8, extra=STROKE),
        dict(t='?', font='Anton',        size=212, c=RED,   rot=7,  dy=2, ml=6, extra=STROKE),
    ], x=16, baseline=492, box=214, z=20, rot=-0.8, gap=5,
   shadow='4px 6px 7px rgba(0,0,0,.45)'))

    b.append(frag('QUiCK<br>PAtCH<br>tOOL', 22, 250, rot=-9, size=24, lh=1.0, z=22))
    b.append(D.scribble(14, 508, 300, 51, BLACK, rot=3, z=14))
    b.append(frag('PLUG HARd<br>dREAM LiKE A CABLE', 26, 506, rot=3, size=25, lh=1.34, colour=CREAM, z=16))
    b.append(frag('I PAtCH<br>VERY QUiCK<br>JUSt LiKE', 700, 500, rot=4, size=23, font='Oswald', z=16))
    b.append(frag('MAGiC CABLE tOOL', 690, 600, rot=4, size=26, font='Oswald', colour=YELLOW, z=26,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO', 330, 506, rot=-3, size=20, font='Oswald', z=16))
    b.append(frag('SOLO', 330, 526, rot=-3, size=30, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:4px;'))
    b.append(frag('MIDI', 468, 236, rot=-7, size=19, font='Pixel', z=22, ls='0'))
    b.append(frag('PHANtOM', 236, 244, rot=-11, size=30, font='Marker', colour=BLACK, z=22))
    b.append(frag('LINE OUt tOOL', 460, 540, rot=-5, size=21, font='Oswald', z=16))
    b.append(frag('eXPANd tHE BACK', 262, 584, rot=-1.8, size=36, font='Oswald', colour=CREAM,
                  z=24, ls='.02em', extra='opacity:.94;'))
    b.append(D.stack('NO NOiSE', 962, 800, colour=BLACK))
    b.append(frag('BUS POWEREd', 742, 776, rot=-3, size=23, font='Oswald', colour=CREAM, z=24))
    b.append(frag('hEAdROOM', 862, 452, rot=7, size=19, font='Elite', colour=BLACK, z=16))
    b.append(D.badge(280, 380, 782, 210, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME PAtCHBAY'))
    b.append(S.brand_layer(seed=910, y=826, flip=True))
    return ''.join(b)
