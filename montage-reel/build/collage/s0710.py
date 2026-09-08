"""07-10."""
import lib, slide as S, deck as D
from lib import BLACK, RED, YELLOW, CREAM
from slide import scrap, photo, frag, letters, spray_patch, halftone_patch
STROKE = '-webkit-text-stroke:4px #F0E8D8;paint-order:stroke fill;'

# =============================================================== 07 home studio
def s07():
    b = []
    b.append(D.zones([(53,54,0.126,0.300,CREAM,26,20), (55,56,0.248,0.846,RED,25,30)]))
    b.append(D.vband(90, 91, -0.03, 0.225, YELLOW, z=3, amp=20))
    b.append(D.drip(360, 834, 560, 142, 31, RED, n=17))
    b.append(spray_patch(500, 250, 520, 400, seed=92, colour=(12,12,14), n=3600, z=7, op=.75))
    b.append(halftone_patch(210, 262, 370, 280, seed=93, colour=(12,12,14), step=12, z=8, op=.7, rot=5))

    b.append(photo(701, 'MOTU M6 (6).jpg', 706, 250, 286, 230, rot=4.6, z=12, amp=10, pos='46% 60%'))
    # anchor: the wide home studio, full colour
    b.append(photo(702, 'MOTU M6 (8).jpg', 30, 512, 700, 452, rot=-1.8, z=16, amp=13, pos='46% 44%'))
    b.append(photo(703, 'MOTU M6 (6).jpg', 700, 560, 288, 208, rot=7.4, z=18, amp=10, pos='50% 62%'))

    b.append(letters([
        dict(t='h', font='Yeseva',   size=140, c=RED, rot=-4, dy=4),
        dict(t='O', font='Yeseva',   size=170, c=RED, rot=3,  dy=8),
        dict(t='W', font='Playfair', size=144, c=RED, style='italic', w=900, rot=-6, dy=-2),
        dict(t='m', font='Marker',   size=108, c=RED, rot=11, dy=-14, ml=14),
        dict(t='U', font='Playfair', size=100, c=RED, style='italic', w=900, rot=3, dy=4, ml=8),
        dict(t='C', font='Marker',   size=116, c=RED, rot=-7, dy=0),
        dict(t='h', font='Anton',    size=168, c=RED, rot=2,  dy=6, ml=8, sx=.94),
    ], x=30, baseline=246, box=254, z=20, rot=-1.4, gap=7))
    b.append(D.lens(766, 24, 126, -15, 22, handle=(866,120,88)))
    b.append(frag('nothing<br>to tidy', 852, 168, rot=-6, size=17, font='Elite', colour=BLACK, lh=1.2, z=22))

    b.append(letters([
        dict(t='R', font='Anton',        size=194, c=YELLOW, rot=-3, dy=4),
        dict(img=S.KNOB,                 size=130, rot=11, dy=-14, ml=4, mr=6),
        dict(t='O', font='Pixel',        size=94,  c=YELLOW, rot=3,  dy=-16, ml=8, mr=10),
        dict(t='M', font='Anton',        size=194, c=YELLOW, rot=2,  dy=6),
        dict(t='?', font='Anton',        size=210, c=YELLOW, rot=8,  dy=2, ml=10),
    ], x=86, baseline=442, box=218, z=20, rot=-1.0, gap=6,
       shadow='4px 7px 8px rgba(0,0,0,.6)'))

    b.append(frag('QUiCK<br>tidY<br>tOOL', 24, 286, rot=-9, size=24, lh=1.0, z=22, colour=BLACK))
    b.append(frag('I FiLE<br>VERY QUiCK<br>JUSt LiKE', 726, 500, rot=4, size=21, font='Oswald', z=16))
    b.append(frag('MAGiC dESK tOOL', 646, 464, rot=4, size=24, font='Oswald', colour=YELLOW, z=22,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO', 436, 460, rot=-3, size=20, font='Oswald', z=16))
    b.append(frag('REWiRE', 436, 480, rot=-3, size=28, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:4px;'))
    b.append(frag('DESK', 556, 232, rot=-7, size=19, font='Pixel', z=22, ls='0'))
    b.append(frag('ROUtiNG', 196, 262, rot=-11, size=28, font='Marker', colour=BLACK, z=22))
    b.append(D.scribble(16, 470, 296, 57, BLACK, rot=3, z=14))
    b.append(frag('BUiLd HARd<br>dREAM LiKE A StUdiO', 28, 468, rot=3, size=24, lh=1.34, colour=CREAM, z=16))
    b.append(frag('eXPANd tHE dESK', 300, 540, rot=-2, size=34, font='Oswald', colour=CREAM,
                  z=26, ls='.02em', extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(D.stack('NO CABLE MESS', 958, 808, colour=BLACK))
    b.append(frag('hEAdROOM', 872, 476, rot=7, size=19, font='Elite', colour=BLACK, z=16))
    b.append(D.badge(780, 322, 792, 226, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME dESK tECH', rot=2.4))
    b.append(S.brand_layer(seed=960, y=828))
    return ''.join(b)

# =============================================================== 08 couch / mobile
def s08():
    b = []
    b.append(D.zones([(57,58,0.176,0.322,CREAM,24,20), (59,60,0.268,0.606,RED,24,28)]))
    b.append(D.wedge(94, YELLOW, 'br', y0=.640, y1=.680, span=.56, drop=176, z=3))
    b.append(D.drip(240, 596, 520, 132, 32, RED, n=16))
    b.append(spray_patch(-40, 560, 520, 400, seed=95, colour=(240,232,216), n=2400, z=7, op=.30))
    b.append(halftone_patch(548, 274, 370, 280, seed=96, colour=(12,12,14), step=12, z=8, op=.7, rot=-5))

    # anchor: the couch set-up, full colour
    b.append(photo(801, 'MOTU M6 (9).jpg', 24, 604, 560, 372, rot=-2.0, z=16, amp=13, pos='52% 44%'))
    b.append(photo(802, 'MOTU M6 (2).jpg', 600, 620, 384, 268, rot=3.6, z=17, amp=11, pos='64% 58%'))

    b.append(letters([
        dict(t='i', font='Yeseva',   size=134, c=RED, rot=-4, dy=4),
        dict(t='S', font='Yeseva',   size=168, c=RED, rot=3,  dy=8),
        dict(t='t', font='Anton',    size=126, c=RED, rot=11, dy=-8, ml=14, mr=8),
        dict(t='H', font='Playfair', size=146, c=RED, style='italic', w=900, rot=-6, dy=-2),
        dict(t='i', font='Anton',    size=132, c=RED, rot=8,  dy=-4, ml=14, mr=8),
        dict(t='S', font='Anton',    size=170, c=RED, rot=2,  dy=6, ml=8, sx=.94),
    ], x=32, baseline=250, box=258, z=20, rot=-1.5, gap=8))
    b.append(D.lens(668, 30, 126, -16, 22, handle=(768,126,92)))
    b.append(frag('nothing<br>to unpack', 798, 240, rot=-6, size=17, font='Elite', colour=CREAM, lh=1.2, z=22))
    b.append(frag('A/B<br>A/B', 902, 32, rot=9, size=25, font='Oswald', colour=CREAM, lh=1.06, z=22))

    b.append(letters([
        dict(t='W', font='Anton',        size=206, c=YELLOW, rot=-2, dy=4),
        dict(img=S.KNOB,                 size=134, rot=10, dy=-14, ml=4, mr=6),
        dict(t='R', font='ArchivoBlack', size=168, c=YELLOW, rot=4,  dy=6),
        dict(t='K', font='Anton',        size=206, c=YELLOW, rot=-3, dy=6),
        dict(t='?', font='Anton',        size=224, c=YELLOW, rot=7,  dy=2, ml=8),
    ], x=112, baseline=548, box=230, z=20, rot=-0.9, gap=6,
       shadow='4px 6px 7px rgba(0,0,0,.55)'))

    b.append(frag('QUiCK<br>SOFA<br>tOOL', 24, 292, rot=-9, size=24, lh=1.0, z=22))
    b.append(frag('I dRiFt<br>VERY QUiCK<br>JUSt LiKE', 736, 294, rot=4, size=23, font='Oswald', z=16))
    b.append(frag('MAGiC COUCH tOOL', 726, 384, rot=4, size=25, font='Oswald', colour=YELLOW, z=22,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO', 348, 296, rot=-3, size=20, font='Oswald', z=16))
    b.append(frag('SEt UP', 348, 316, rot=-3, size=30, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:4px;'))
    b.append(frag('BUS-POWEREd', 486, 248, rot=-7, size=18, font='Pixel', z=22, ls='0'))
    b.append(frag('POStURE', 214, 272, rot=-11, size=28, font='Marker', colour=BLACK, z=22))
    b.append(D.scribble(20, 618, 292, 61, CREAM, rot=3, z=12))
    b.append(frag('SiT HARd<br>dREAM LiKE A SOFA', 32, 616, rot=3, size=25, lh=1.34, colour=BLACK, z=16))
    b.append(frag('eXPANd tHE COUCH', 296, 654, rot=-2, size=32, font='Oswald', colour=CREAM,
                  z=26, ls='.02em', extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(D.stack('NO dESK', 946, 546, colour=BLACK))
    b.append(frag('hEAdPHONE', 250, 792, rot=6, size=20, font='Elite', colour=CREAM, z=26))
    b.append(D.badge(880, 590, 566, 228, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME SOFA RiG', rot=2.4))
    b.append(S.brand_layer(seed=970, y=826, flip=True))
    return ''.join(b)


# =============================================================== 09 studio desk
def s09():
    b = []
    b.append(D.zones([(61,62,0.118,0.286,CREAM,25,20), (63,64,0.235,0.592,RED,24,28),
                      (65,66,0.566,0.858,YELLOW,26,28)]))
    b.append(D.drip(120, 580, 540, 128, 33, RED, n=16))
    b.append(D.drip(420, 846, 500, 130, 34, YELLOW, n=15))
    b.append(spray_patch(520, 236, 500, 390, seed=97, colour=(12,12,14), n=3400, z=7, op=.72))
    b.append(halftone_patch(-30, 250, 350, 270, seed=98, colour=(12,12,14), step=12, z=8, op=.7, rot=4))
    b.append(halftone_patch(640, 600, 340, 250, seed=99, colour=(12,12,14), step=11, z=8, op=.5, rot=-6, fade='y'))

    # anchor: the studio desk, full colour
    b.append(photo(901, 'MOTU M6 (6).jpg', 34, 596, 574, 306, rot=-2.0, z=16, amp=12, pos='48% 56%'))
    b.append(photo(902, 'MOTU M6 (3).jpg', 626, 606, 348, 250, rot=4.4, z=17, amp=11, pos='54% 62%'))

    b.append(letters([
        dict(t='w', font='Yeseva',   size=148, c=RED, rot=-4, dy=4),
        dict(t='H', font='Yeseva',   size=178, c=RED, rot=3,  dy=8),
        dict(t='O', font='Playfair', size=152, c=RED, style='italic', w=900, rot=-6, dy=-2),
        dict(t='S', font='Marker',   size=118, c=RED, rot=11, dy=-12, ml=14),
        dict(t='E', font='Anton',    size=176, c=RED, rot=2,  dy=6, ml=12, sx=.94),
    ], x=34, baseline=254, box=262, z=20, rot=-1.5, gap=9))
    b.append(D.lens(748, 24, 124, -15, 22, handle=(846,118,88)))
    b.append(frag('nothing<br>to label', 858, 158, rot=-6, size=17, font='Elite', colour=BLACK, lh=1.2, z=22))

    b.append(letters([
        dict(t='K', font='Anton',        size=186, c=YELLOW, rot=-2, dy=4),
        dict(t='N', font='Anton',        size=186, c=YELLOW, rot=3,  dy=2),
        dict(img=S.KNOB,                 size=126, rot=10, dy=-14, ml=4, mr=6),
        dict(t='B', font='ArchivoBlack', size=152, c=YELLOW, rot=4,  dy=6),
        dict(t='S', font='Anton',        size=194, c=YELLOW, rot=-3, dy=8),
        dict(t='?', font='Anton',        size=208, c=YELLOW, rot=7,  dy=2, ml=8),
    ], x=40, baseline=520, box=214, z=20, rot=-0.9, gap=6,
       shadow='4px 6px 7px rgba(0,0,0,.55)'))

    b.append(frag('QUiCK<br>LABEL<br>tOOL', 22, 272, rot=-9, size=24, lh=1.0, z=22))
    b.append(frag('I tWEAK<br>VERY QUiCK<br>JUSt LiKE', 716, 296, rot=4, size=23, font='Oswald', z=16))
    b.append(frag('MAGiC KNOB tOOL', 706, 386, rot=4, size=25, font='Oswald', colour=YELLOW, z=22,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO', 340, 292, rot=-3, size=20, font='Oswald', z=16))
    b.append(frag('RECALL', 340, 312, rot=-3, size=28, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:4px;'))
    b.append(frag('GAiN', 546, 250, rot=-7, size=19, font='Pixel', z=22, ls='0'))
    b.append(frag('tRiM', 214, 262, rot=-11, size=28, font='Marker', colour=BLACK, z=22))
    b.append(D.scribble(16, 540, 292, 67, BLACK, rot=3, z=14))
    b.append(frag('tWEAK HARd<br>dREAM LiKE A KNOB', 28, 538, rot=3, size=24, lh=1.34, colour=CREAM, z=16))
    b.append(frag('eXPANd tHE tOP', 288, 626, rot=-2, size=32, font='Oswald', colour=CREAM,
                  z=26, ls='.02em', extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(D.stack('NO RECALL', 958, 812, colour=BLACK))
    b.append(frag('hEAdROOM', 638, 556, rot=7, size=19, font='Elite', colour=BLACK, z=16))
    b.append(D.badge(980, 638, 566, 226, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME KNOB tECH', rot=2.4))
    b.append(S.brand_layer(seed=980, y=830))
    return ''.join(b)

# =============================================================== 10 closer
def s10():
    b = []
    b.append(D.zones([(67,68,0.118,0.276,CREAM,25,20), (69,70,0.215,0.862,YELLOW,24,29)]))
    b.append(D.wedge(101, RED, 'bl', y0=.560, y1=.606, span=.58, drop=196, z=3))
    b.append(D.drip(300, 852, 560, 138, 35, YELLOW, n=17))
    b.append(spray_patch(520, 214, 520, 400, seed=102, colour=(12,12,14), n=3600, z=7, op=.7))
    b.append(halftone_patch(120, 232, 360, 280, seed=103, colour=(12,12,14), step=12, z=8, op=.66, rot=5))

    b.append(photo(1001, 'MOTU M6 (10).jpg', 528, 206, 452, 302, rot=4.2, z=12, amp=11, pos='54% 58%'))

    b.append(letters([
        dict(t='i', font='Yeseva',   size=112, c=RED, rot=-4, dy=4),
        dict(t='t', font='Anton',    size=126, c=RED, rot=9,  dy=-4, ml=10, mr=8),
        dict(t='S', font='Yeseva',   size=140, c=RED, rot=3,  dy=6),
        dict(t='J', font='Yeseva',   size=132, c=RED, rot=-5, dy=0, ml=16, mr=6),
        dict(t='U', font='Marker',   size=104, c=RED, rot=10, dy=-10, ml=8),
        dict(t='S', font='Playfair', size=96,  c=RED, style='italic', w=900, rot=3, dy=4, ml=8),
        dict(t='t', font='Anton',    size=140, c=RED, rot=2,  dy=6, ml=8, sx=.94),
    ], x=32, baseline=204, box=212, z=20, rot=-1.5, gap=7))
    b.append(D.lens(620, 22, 120, -16, 22, handle=(716,114,86)))

    # the product name as the collage's central typographic subject
    b.append(letters([
        dict(t='M', font='Anton',        size=268, c=BLACK, rot=-3, dy=4, extra=STROKE),
        dict(t='6', font='ArchivoBlack', size=252, c=BLACK, rot=4,  dy=8, ml=8, extra=STROKE),
        dict(t='!', font='Anton',        size=286, c=RED,   rot=8,  dy=2, ml=12, extra=STROKE),
    ], x=44, baseline=452, box=296, z=20, rot=-1.0, gap=6,
       shadow='5px 8px 9px rgba(0,0,0,.5)'))

    b.append(frag('NO MORE', 52, 470, rot=-2.2, size=96, font='Anton', colour=RED, z=22, ls='.01em'))
    b.append(frag('QUEStiONS!', 52, 556, rot=-1.4, size=96, font='Anton', colour=RED, z=22, ls='.01em'))

    # both panel cutouts, full colour, collaged at competing angles
    b.append(D.anchor_cutout('MOTU M6 (2).png', 556, 610, 440, 7.0, z=17,
                             shadow='0 12px 20px rgba(0,0,0,.6)'))
    b.append(D.anchor_cutout('MOTU M6 (1).png', 22, 648, 662, -2.6, z=19))

    b.append(frag('QUiCK<br>LASt<br>tOOL', 830, 106, rot=-9, size=24, lh=1.0, z=22))
    b.append(frag('I StOP<br>VERY QUiCK<br>JUSt LiKE', 748, 528, rot=4, size=23, font='Oswald', z=16))
    b.append(frag('MAGiC ENd tOOL', 742, 604, rot=4, size=25, font='Oswald', colour=CREAM, z=26,
                  extra=f'text-shadow:2px 2px 0 {BLACK};'))
    b.append(frag('NOtHiNG tO', 726, 730, rot=-3, size=20, font='Oswald', z=16))
    b.append(frag('ASK', 726, 750, rot=-3, size=30, font='Oswald', z=16,
                  extra='text-decoration:line-through;text-decoration-thickness:4px;'))
    b.append(frag('tHE ENd', 626, 452, rot=-11, size=28, font='Marker', colour=BLACK, z=22))
    b.append(frag('EOF', 486, 512, rot=-7, size=19, font='Pixel', z=22, ls='0'))
    b.append(D.stack('NO MORE', 958, 810, colour=BLACK))
    b.append(frag('eXPANd tHE ENd', 300, 690, rot=-2, size=32, font='Oswald', colour=CREAM,
                  z=26, ls='.02em'))
    b.append(frag('hEAdPHONE', 132, 776, rot=6, size=19, font='Elite', colour=CREAM, z=26))
    b.append(D.badge(1080, 396, 792, 226, 54, 'M6&nbsp; M6&nbsp; M6', 'ALL-tiME SiGN-OFF', rot=-2.4))
    b.append(S.brand_layer(seed=990, y=830, flip=True))
    return ''.join(b)
