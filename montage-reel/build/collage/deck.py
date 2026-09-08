"""Shared composition helpers for slides 02-10."""
import lib, slide as S, brand, assets_io as A
from lib import BLACK, RED, YELLOW, CREAM
from slide import W, H, clip, scrap, photo, frag, letters, spray_patch, halftone_patch

# ---------------------------------------------------------------- zone builders
def zones(bands, base=BLACK):
    """bands = [(seed_top, seed_bot, y_top, y_bot, colour, amp_t, amp_b), ...]"""
    out = [f'<rect width="{W}" height="{H}" fill="{base}"/>']
    for sd_t, sd_b, yt, yb, col, at, ab in bands:
        out.append(f'<path d="{lib.zone_path(sd_t, sd_b, yt, yb, W, H, at, ab)}" fill="{col}"/>')
    return (f'<svg width="{W}" height="{H}" style="position:absolute;inset:0;z-index:1">'
            f'{"".join(out)}</svg>')

def wedge(seed, colour, corner='br', y0=.66, y1=.70, span=.70, drop=170, z=2, amp=18):
    """A torn wedge bleeding off two frame edges."""
    pts = lib.torn_edge(seed, n=170, amp=amp)
    if corner == 'br':
        d = [f'M {W} {y0*H:.1f}']
        for t, o in pts: d.append(f'L {W-t*span*W:.1f} {y1*H+o+t*drop:.1f}')
        d.append(f'L {W*(1-span):.1f} {H} L {W} {H} Z')
    elif corner == 'bl':
        d = [f'M 0 {y0*H:.1f}']
        for t, o in pts: d.append(f'L {t*span*W:.1f} {y1*H+o+t*drop:.1f}')
        d.append(f'L {W*span:.1f} {H} L 0 {H} Z')
    elif corner == 'tr':
        d = [f'M {W} {y0*H:.1f}']
        for t, o in pts: d.append(f'L {W-t*span*W:.1f} {y1*H+o-t*drop:.1f}')
        d.append(f'L {W*(1-span):.1f} 0 L {W} 0 Z')
    else:  # tl
        d = [f'M 0 {y0*H:.1f}']
        for t, o in pts: d.append(f'L {t*span*W:.1f} {y1*H+o-t*drop:.1f}')
        d.append(f'L {W*span:.1f} 0 L 0 0 Z')
    return (f'<svg width="{W}" height="{H}" style="position:absolute;inset:0;z-index:{z}">'
            f'<path d="{" ".join(d)}" fill="{colour}"/></svg>')

def vband(seed_l, seed_r, x0, x1, colour, z=2, amp=22):
    """A torn vertical band."""
    l = lib.torn_edge(seed_l, amp=amp); r = lib.torn_edge(seed_r, amp=amp)
    d = [f'M {x0*W+l[0][1]:.1f} 0']
    for t, o in l[1:]: d.append(f'L {x0*W+o:.1f} {t*H:.1f}')
    d.append(f'L {x1*W+r[-1][1]:.1f} {H}')
    for t, o in reversed(r[:-1]): d.append(f'L {x1*W+o:.1f} {t*H:.1f}')
    d.append('Z')
    return (f'<svg width="{W}" height="{H}" style="position:absolute;inset:0;z-index:{z}">'
            f'<path d="{" ".join(d)}" fill="{colour}"/></svg>')

def drip(x, y, w, h, seed, colour, n=16, flip=False, z=9):
    return (f'<svg width="{w}" height="{h}" style="position:absolute;left:{x}px;top:{y}px;'
            f'z-index:{z};{"transform:rotate(180deg);" if flip else ""}">'
            f'{lib.drips(w,h,seed=seed,n=n,colour=colour)}</svg>')

def scribble(x, y, w, seed, colour=BLACK, rot=0, z=12, rows=3):
    import random
    rng = random.Random(seed); out = []
    for i in range(rows):
        yy = 22+i*38; sw = 27-i*5
        out.append(f'<path d="M {rng.uniform(2,14):.0f} {yy} '
                   f'C {w*.3:.0f} {yy-rng.uniform(20,34):.0f}, {w*.62:.0f} {yy+rng.uniform(18,34):.0f}, '
                   f'{w-rng.uniform(6,40):.0f} {yy-rng.uniform(6,26):.0f}" '
                   f'stroke="{colour}" stroke-width="{sw}" fill="none" stroke-linecap="round"/>')
    return (f'<svg width="{w}" height="{22+rows*38}" style="position:absolute;left:{x}px;'
            f'top:{y}px;z-index:{z};transform:rotate({rot}deg)">{"".join(out)}</svg>')

def badge(seed, x, y, w, h, l1, l2, rot=-2.4, z=26, fg=CREAM, bg=BLACK, size=15):
    return scrap(seed, x, y, w, h, bg, rot=rot, z=z, amp=4, pad=6,
                 inner=f'<div style="font-family:Elite;font-size:{size}px;color:{fg};'
                       f'text-align:center;line-height:1.26;letter-spacing:.04em">'
                       f'{l1}<br>{l2}</div>')

def stack(text, x, y, rot=-90, n=6, colour=CREAM, size=12, z=24):
    return frag('<br>'.join([text]*n), x, y, rot=rot, size=size, font='Oswald',
                colour=colour, lh=1.5, z=z, ls='.07em')

def anchor_cutout(src, x, y, w, rot, z=18, shadow='0 18px 30px rgba(0,0,0,.7)'):
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;z-index:{z};'
            f'transform:rotate({rot}deg);filter:drop-shadow({shadow})">'
            f'<img src="{A.img(src)}" style="width:100%;display:block"></div>')

def lens(x, y, size=132, rot=-14, z=22, handle=None, hcol=RED):
    o = ''
    if handle:
        hx, hy, hl = handle
        o = (f'<svg width="{hl+30}" height="{hl+30}" style="position:absolute;left:{hx}px;'
             f'top:{hy}px;z-index:{z-1}"><path d="M 8 8 L {hl} {hl*1.12:.0f}" stroke="{hcol}" '
             f'stroke-width="17" stroke-linecap="round"/></svg>')
    return o + (f'<img src="{A.img(S.LENS)}" style="position:absolute;left:{x}px;top:{y}px;'
                f'width:{size}px;height:{size}px;z-index:{z};transform:rotate({rot}deg);'
                f'filter:drop-shadow(3px 6px 9px rgba(0,0,0,.6))">')

def render_slide(num, body, path_out):
    import render
    html = f'/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/out/slide{num:02d}.html'
    open(html, 'w').write(S.page(body))
    S._clips.clear()
    render.render(html, path_out, 1000, 2)
    return path_out
