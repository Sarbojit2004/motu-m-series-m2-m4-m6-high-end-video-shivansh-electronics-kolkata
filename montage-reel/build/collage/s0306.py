"""03-06."""
import lib, slide as S, deck as D
from lib import BLACK, RED, YELLOW, CREAM
from slide import scrap, photo, frag, letters, spray_patch, halftone_patch
STROKE = '-webkit-text-stroke:4px #F0E8D8;paint-order:stroke fill;'
DARKSTROKE = '-webkit-text-stroke:4px #0C0C0E;paint-order:stroke fill;'

# =============================================================== 03 macro detail
def s03():
    b = []
    b.append(D.zones([(33,34,0.130,0.318,CREAM,26,20), (43,44,0.262,0.858,RED,25,30)]))
    b.append(D.vband(81, 82, 0.735, 1.03, YELLOW, z=3, amp=20))
    b.append(D.drip(60, 846, 560, 140, 25, RED, n=17))
    b.append(spray_patch(-40, 200, 480, 380, seed=74, colour=(12,12,14), n=3800, z=7, op=.8))
    b.append(halftone_patch(320, 214, 380, 290, seed=75, colour=(12,12,14), step=12, z=8, op=.72, rot=5))
    b.append(halftone_patch(690, 600, 320, 250, seed=76, colour=(12,12,14), step=11, z=8, op=.55, rot=-7, fade='y'))

    b.append(photo(301, 'MOTU M6 (10).jpg', 620, 258, 372, 252, rot=5.0, z=12, amp=10, pos='58% 62%'))
    # anchor: the meter macro, big and torn — full colour
    b.append(photo(302, 'MOTU M6 (1).jpg', 26, 560, 646, 330, rot=-2.6, z=18, amp=13))
    b.append(photo(303, 'MOTU M6 (10).jpg', 676, 596, 300, 214, rot=7.5, z=19, amp=9, pos='24% 66%'))

    b.append(letters([
        dict(t='c', font='Yeseva',   size=142, c=RED, rot=-4, dy=4),
        dict(t='A', font='Yeseva',   size=172, c=RED, rot=3,  dy=8),
        dict(t='N', font='Playfair', size=142, c=RED, style='italic', w=900, rot=-6, dy=-2),
        dict(t='y', font='Marker',   size=112, c=RED, rot=11, dy=-16, ml=10),
        dict(t='O', font='Playfair', size=96, c=RED, style='italic', w=900, rot=3, dy=4, ml=10),
        dict(t='U', font='Anton',    size=172, c=RED, rot=2,  dy=6, ml=8, sx=.94),
    ], x=30, baseline=256, box=262, z=20, rot=-1.5, gap=7))
    b.append(D.lens(628, 34, 130, -16, 22, handle=(734,132,98)))
    b.append(frag('nothing<br>to SCAN', 852, 176, rot=-6, size=17, font='Elite', colour=BLACK, lh=1.2, z=22))

    b.append(letters([
        dict(t='Z', font='Anton',        size=196, c=YELLOW, rot=-3, dy=4),
        dict(img=S.KNOB,                 size=128, rot=10, dy=-14, ml=2, mr=2),
        dict(t='O', font='Pixel',        size=92,  c=YELLOW, rot=3,  dy=-14, ml=6, mr=8),
        dict(t='M', font='Anton',        size=196, c=YELLOW, rot=2,  dy=4),
        dict(t='i', font='Anton',        size=134, c=YELLOW, rot=-6, dy=-4, ml=24, mr=4),
        dict(t='N', font='ArchivoBlack', size=158, c=YELLOW, rot=4,  dy=6),
        dict(t='?', font='Anton',        size=216, c=YELLOW, rot=7,  dy=2, ml=6),
    ], x=22, baseline=506, box=220, z=20, rot=-0.9, gap=5,
       shadow='4px 6px 7px rgba(0,0,0,.6)'))

    b.append(frag('QUiCK<br>ZOOM<br>tOOL', 22, 286, rot=-9, size=24, lh=1.0, z=22))
    b.append(D.scribble(16, 476, 292, 52, BLACK, rot=3, z=14))
    b.append(frag('LOOK HARd<br>dREAM LiKE A MEtER', 28, 474, rot=3, size=25, lh=1.34, colour=CREAM, z=16))
    b.append(frag('I ZOOM<br>VERY QUiCK<br>JUSt LiKE', 700, 512, rot=4, size=23, font='Oswald', z=16))
    b.append(frag('MAGiC LENS tOOL', 742, 802, rot=-4, size=25, font='Oswald', colour=YELLOW, z=26,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO', 356, 522, rot=-3, size=20, font='Oswald', z=16))
    b.append(frag('CLiP', 356, 542, rot=-3, size=30, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:4px;'))
    b.append(frag('dBFS', 486, 272, rot=-7, size=19, font='Pixel', z=22, ls='0'))
    b.append(frag('SiGNAL', 214, 278, rot=-11, size=30, font='Marker', colour=BLACK, z=22))
    b.append(frag('GREEN iS GOOd', 226, 508, rot=-4, size=21, font='Oswald', z=16))
    b.append(frag('eXPANd tHE MEtER', 78, 606, rot=-2.2, size=34, font='Oswald', colour=CREAM,
                  z=24, ls='.02em', extra='opacity:.95;'))
    b.append(D.stack('NO CLiPPiNG', 956, 806, colour=BLACK))
    b.append(frag('hEAdROOM', 470, 468, rot=7, size=19, font='Elite', colour=BLACK, z=16))
    b.append(D.badge(380, 196, 782, 216, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME METER'))
    b.append(S.brand_layer(seed=920, y=832))
    return ''.join(b)

# =============================================================== 04 podcast
def s04():
    b = []
    b.append(D.zones([(35,36,0.196,0.316,CREAM,24,20), (45,46,0.262,0.612,RED,24,28)]))
    b.append(D.wedge(83, YELLOW, 'tr', y0=.108, y1=.146, span=.52, drop=150, z=3))
    b.append(D.drip(200, 600, 520, 130, 26, RED, n=16))
    b.append(spray_patch(-40, 560, 520, 400, seed=77, colour=(240,232,216), n=2600, z=7, op=.35))
    b.append(halftone_patch(560, 268, 380, 280, seed=78, colour=(12,12,14), step=12, z=8, op=.7, rot=-5))

    # anchor: the four-mic podcast table, full colour, filling the lower half
    b.append(photo(401, 'MOTU M6 (5).jpg', 24, 566, 952, 396, rot=-1.4, z=16, amp=13, pos='52% 56%'))
    b.append(D.anchor_cutout('MOTU M6 (1).png', 452, 700, 620, 3.6, z=24,
                             shadow='0 14px 24px rgba(0,0,0,.75)'))

    b.append(letters([
        dict(t='h', font='Yeseva',   size=140, c=RED, rot=-4, dy=4),
        dict(t='O', font='Yeseva',   size=168, c=RED, rot=3,  dy=8),
        dict(t='W', font='Playfair', size=144, c=RED, style='italic', w=900, rot=-6, dy=-2),
        dict(t='m', font='Marker',   size=106, c=RED, rot=11, dy=-14, ml=14),
        dict(t='A', font='Playfair', size=104, c=RED, style='italic', w=900, rot=3, dy=4, ml=8),
        dict(t='N', font='Marker',   size=116, c=RED, rot=-7, dy=0),
        dict(t='Y', font='Anton',    size=170, c=RED, rot=2,  dy=6, ml=8, sx=.94),
    ], x=28, baseline=250, box=256, z=20, rot=-1.4, gap=7))
    b.append(D.lens(752, 30, 126, -15, 22, handle=(854,126,90)))

    b.append(letters([
        dict(t='V', font='Anton',        size=196, c=YELLOW, rot=-2, dy=4),
        dict(img=S.KNOB,                 size=128, rot=9,  dy=-14, ml=2, mr=2),
        dict(t='i', font='Anton',        size=136, c=YELLOW, rot=-6, dy=-4, ml=6, mr=6),
        dict(t='C', font='ArchivoBlack', size=160, c=YELLOW, rot=4,  dy=6),
        dict(t='E', font='Pixel',        size=92,  c=YELLOW, rot=-3, dy=-12, ml=8, mr=8),
        dict(t='S', font='Anton',        size=204, c=YELLOW, rot=2,  dy=8, ml=18),
        dict(t='?', font='Anton',        size=218, c=YELLOW, rot=7,  dy=2, ml=6),
    ], x=26, baseline=546, box=222, z=20, rot=-0.8, gap=6,
       shadow='4px 6px 7px rgba(0,0,0,.55)'))

    b.append(frag('QUiCK<br>tALK<br>tOOL', 22, 288, rot=-9, size=24, lh=1.0, z=22))
    b.append(frag('I RECORd<br>VERY QUiCK<br>JUSt LiKE', 744, 300, rot=4, size=23, font='Oswald', z=16))
    b.append(frag('MAGiC MiC tOOL', 736, 388, rot=4, size=26, font='Oswald', colour=YELLOW, z=22,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO', 352, 292, rot=-3, size=20, font='Oswald', z=16))
    b.append(frag('MUtE', 352, 312, rot=-3, size=30, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:4px;'))
    b.append(frag('48kHz', 500, 246, rot=-7, size=19, font='Pixel', z=22, ls='0'))
    b.append(frag('PHANtOM', 214, 268, rot=-11, size=30, font='Marker', colour=BLACK, z=22))
    b.append(D.scribble(20, 618, 300, 53, CREAM, rot=3, z=12))
    b.append(frag('tALK HARd<br>dREAM LiKE A PREAMP', 32, 616, rot=3, size=25, lh=1.34, colour=BLACK, z=16))
    b.append(frag('eXPANd tHE ROOM', 300, 624, rot=-2, size=34, font='Oswald', colour=CREAM,
                  z=24, ls='.02em'))
    b.append(D.stack('NO BLEEd', 944, 542, colour=BLACK))
    b.append(frag('hEAdPHONE', 858, 706, rot=6, size=20, font='Elite', colour=CREAM, z=24))
    b.append(D.badge(480, 628, 636, 224, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME tALKBACK', rot=2.2))
    b.append(S.brand_layer(seed=930, y=826, flip=True))
    return ''.join(b)


# =============================================================== 05 live
def s05():
    b = []
    b.append(D.zones([(37,38,0.128,0.300,CREAM,25,20), (47,48,0.245,0.545,RED,24,29)]))
    b.append(D.wedge(85, YELLOW, 'bl', y0=.878, y1=.912, span=.66, drop=96, z=3))
    b.append(D.drip(180, 536, 540, 130, 28, RED, n=16))
    b.append(spray_patch(520, 190, 500, 400, seed=79, colour=(12,12,14), n=3400, z=7, op=.7))
    b.append(halftone_patch(-30, 268, 350, 270, seed=80, colour=(12,12,14), step=12, z=8, op=.72, rot=4))
    b.append(halftone_patch(640, 560, 340, 250, seed=87, colour=(240,232,216), step=11, z=8, op=.30, rot=-6, fade='y'))

    # anchor: the live duo, full colour, warm
    b.append(photo(501, 'MOTU M6 (7).jpg', 18, 556, 954, 306, rot=-1.6, z=16, amp=13, pos='46% 62%'))
    b.append(D.anchor_cutout('MOTU M6 (2).png', 372, 520, 620, 4.2, z=24,
                             shadow='0 12px 22px rgba(0,0,0,.8)'))
    b.append(photo(502, 'MOTU M6 (7).jpg', 26, 300, 258, 182, rot=-8.0, z=13, amp=10, pos='82% 88%'))

    b.append(letters([
        dict(t='w', font='Yeseva',   size=144, c=RED, rot=-4, dy=4),
        dict(t='H', font='Yeseva',   size=168, c=RED, rot=3,  dy=8),
        dict(t='A', font='Playfair', size=144, c=RED, style='italic', w=900, rot=-6, dy=-2),
        dict(t='t', font='Anton',    size=126, c=RED, rot=11, dy=-10, ml=12, mr=8),
        dict(t='i', font='Anton',    size=132, c=RED, rot=-5, dy=-2, ml=16, mr=10),
        dict(t='S', font='Anton',    size=170, c=RED, rot=2,  dy=6, sx=.94),
    ], x=30, baseline=242, box=250, z=20, rot=-1.5, gap=8))
    b.append(D.lens(636, 24, 128, -17, 22, handle=(738,120,96)))
    b.append(frag('nothing<br>to StOP', 828, 158, rot=-6, size=17, font='Elite', colour=BLACK, lh=1.2, z=22))
    b.append(frag('A/B<br>A/B', 898, 34, rot=9, size=25, font='Oswald', colour=CREAM, lh=1.06, z=22))

    b.append(letters([
        dict(t='L', font='Anton',        size=176, c=YELLOW, rot=-2, dy=4),
        dict(img=S.KNOB,                 size=118, rot=10, dy=-12, ml=2, mr=4),
        dict(t='U', font='Anton',        size=176, c=YELLOW, rot=3,  dy=2),
        dict(t='d', font='Anton',        size=146, c=YELLOW, rot=-6, dy=-2, ml=4, mr=6),
        dict(t='E', font='Pixel',        size=90,  c=YELLOW, rot=3,  dy=-12, ml=6, mr=8),
        dict(t='R', font='ArchivoBlack', size=150, c=YELLOW, rot=4,  dy=6),
        dict(t='?', font='Anton',        size=196, c=YELLOW, rot=7,  dy=2, ml=8),
    ], x=26, baseline=486, box=220, z=20, rot=-0.9, gap=5,
       shadow='4px 6px 7px rgba(0,0,0,.6)'))

    b.append(frag('QUiCK<br>StAGE<br>tOOL', 22, 274, rot=-9, size=24, lh=1.0, z=22))
    b.append(frag('I PLAY<br>VERY QUiCK<br>JUSt LiKE', 782, 288, rot=4, size=23, font='Oswald', z=16))
    b.append(frag('MAGiC ROOM tOOL', 760, 380, rot=4, size=26, font='Oswald', colour=YELLOW, z=22,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO', 330, 276, rot=-3, size=20, font='Oswald', z=16))
    b.append(frag('SOUNdCHECK', 330, 296, rot=-3, size=26, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:4px;'))
    b.append(frag('LiVE', 520, 232, rot=-7, size=19, font='Pixel', z=22, ls='0'))
    b.append(frag('SiGNAL', 222, 254, rot=-11, size=30, font='Marker', colour=BLACK, z=22))
    b.append(D.scribble(20, 512, 296, 54, CREAM, rot=3, z=12))
    b.append(frag('PLAY HARd<br>dREAM LiKE A ROOM', 30, 510, rot=3, size=25, lh=1.34, colour=BLACK, z=16))
    b.append(frag('eXPANd tHE StAGE', 292, 592, rot=-2, size=34, font='Oswald', colour=CREAM,
                  z=26, ls='.02em'))
    b.append(D.stack('NO SOUNdCHECK', 950, 500, colour=BLACK))
    b.append(frag('hEAdPHONE', 60, 762, rot=6, size=20, font='Elite', colour=CREAM, z=26))
    b.append(D.badge(580, 640, 720, 226, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME StAGEHANd', rot=-2.6))
    b.append(S.brand_layer(seed=940, y=830))
    return ''.join(b)

# =============================================================== 06 drum room
def s06():
    b = []
    b.append(D.zones([(39,40,0.126,0.302,CREAM,26,20), (49,50,0.250,0.848,RED,25,30)]))
    b.append(D.wedge(86, YELLOW, 'br', y0=.606, y1=.652, span=.60, drop=182, z=3))
    b.append(D.drip(80, 836, 580, 145, 30, RED, n=18))
    b.append(spray_patch(-50, 250, 500, 390, seed=88, colour=(12,12,14), n=3800, z=7, op=.8))
    b.append(halftone_patch(560, 262, 380, 290, seed=89, colour=(12,12,14), step=13, z=8, op=.7, rot=-6))

    # anchor: the drum room, full colour
    b.append(photo(601, 'MOTU M6 (4).jpg', 240, 470, 520, 396, rot=2.2, z=16, amp=12, pos='42% 52%'))
    b.append(photo(602, 'MOTU M6 (1).jpg', 12, 566, 268, 190, rot=-8.5, z=18, amp=10))
    b.append(photo(603, 'MOTU M6 (4).jpg', 728, 566, 258, 196, rot=7.0, z=18, amp=10, pos='12% 56%'))

    b.append(letters([
        dict(t='h', font='Yeseva',   size=142, c=RED, rot=-4, dy=4),
        dict(t='O', font='Yeseva',   size=172, c=RED, rot=3,  dy=8),
        dict(t='W', font='Playfair', size=146, c=RED, style='italic', w=900, rot=-6, dy=-2),
        dict(t='l', font='Marker',   size=112, c=RED, rot=11, dy=-14, ml=14),
        dict(t='O', font='Playfair', size=100, c=RED, style='italic', w=900, rot=3, dy=4, ml=8),
        dict(t='U', font='Marker',   size=116, c=RED, rot=-7, dy=0),
        dict(t='d', font='Anton',    size=172, c=RED, rot=2,  dy=6, ml=8, sx=.94),
    ], x=28, baseline=248, box=256, z=20, rot=-1.4, gap=7))
    b.append(D.lens(748, 26, 128, -14, 22, handle=(850,122,92)))
    b.append(frag('nothing<br>to tUNE', 878, 156, rot=-6, size=17, font='Elite', colour=BLACK, lh=1.2, z=22))

    b.append(letters([
        dict(t='B', font='Anton',        size=202, c=YELLOW, rot=-3, dy=4),
        dict(img=S.KNOB,                 size=136, rot=11, dy=-16, ml=4, mr=6),
        dict(t='O', font='Pixel',        size=96,  c=YELLOW, rot=3,  dy=-16, ml=8, mr=10),
        dict(t='M', font='Anton',        size=202, c=YELLOW, rot=2,  dy=6),
        dict(t='!', font='Anton',        size=216, c=YELLOW, rot=8,  dy=2, ml=10),
    ], x=88, baseline=418, box=224, z=20, rot=-1.0, gap=6,
       shadow='4px 7px 8px rgba(0,0,0,.6)'))

    b.append(frag('QUiCK<br>tUNE<br>tOOL', 22, 282, rot=-9, size=24, lh=1.0, z=22))
    b.append(frag('I HiT<br>VERY QUiCK<br>JUSt LiKE', 722, 268, rot=4, size=21, font='Oswald', z=16))
    b.append(frag('MAGiC StiCK tOOL', 712, 392, rot=4, size=24, font='Oswald', colour=YELLOW, z=22,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO OVERdUB', 118, 432, rot=-3, size=22, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:3px;'))
    b.append(frag('4/4', 566, 222, rot=-7, size=20, font='Pixel', z=22, ls='0'))
    b.append(frag('tRANSiENt', 200, 262, rot=-11, size=28, font='Marker', colour=BLACK, z=22))
    b.append(D.scribble(14, 470, 300, 55, BLACK, rot=3, z=14))
    b.append(frag('HiT HARd<br>dREAM LiKE A ROOM MiC', 26, 468, rot=3, size=24, lh=1.34, colour=CREAM, z=16))
    b.append(frag('eXPANd tHE Kit', 286, 500, rot=-2, size=34, font='Oswald', colour=CREAM,
                  z=26, ls='.02em', extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(D.stack('NO METRONOME', 958, 806, colour=BLACK))
    b.append(frag('hEAdROOM', 466, 430, rot=7, size=19, font='Elite', colour=BLACK, z=16))
    b.append(frag('OVERHEAdS', 96, 792, rot=-4, size=22, font='Oswald', colour=CREAM, z=26))
    b.append(D.badge(680, 356, 790, 224, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME dRUM tECH', rot=2.4))
    b.append(S.brand_layer(seed=950, y=828, flip=True))
    return ''.join(b)
