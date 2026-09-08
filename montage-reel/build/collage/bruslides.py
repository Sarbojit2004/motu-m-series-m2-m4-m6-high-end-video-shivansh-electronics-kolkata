"""Composer: one grid, four layout variants, shared across both product sets."""
import bru
from bru import (W, H, MARGIN, PAPER, INK, ACCENT, MUTE, x, col,
                 rule, vrule, block, label, body, mono, util, statement,
                 photo, photo_contain, headline, numeral, redpanel, redbox,
                 brandstrip, page, globe, plus, xmark, hazard, barcode,
                 meter_icon, knob_icon, jack_icon, usbc_icon)

R = W - MARGIN            # right margin line = 946
STRIP_Y = 856

ICONS = {'meter': meter_icon, 'knob': knob_icon, 'jack': jack_icon,
         'usbc': usbc_icon, 'globe': globe}

def compose(s):
    """s: dict describing one slide."""
    b = []
    n      = s['n']
    unit   = s['unit']                       # 'M2' | 'M4'
    tag    = f'NO.{n:02d}'
    b.append(bru.block(0, 0, W, H, PAPER, z=1))

    # ---- top-left: sequence device (reference's "DAY 04" block)
    b.append(label(f'FRAME {n:02d}', MARGIN, MARGIN, INK, size=26, ls='.06em'))
    b.append(rule(MARGIN, MARGIN+34, 96, INK, 3.4, 12))
    b.append(body(f'{unit} SERIES<br>TEN FRAMES', MARGIN, MARGIN+46, 190, INK, size=13, lh=1.42))

    # ---- top-centre: attitude statement
    b.append(statement(s['top'], x(4)+6, MARGIN+2, 218, INK, size=15.5))

    # ---- top-right: flat accent panel
    b.append(redpanel(770, MARGIN-14, 176, 190, s['panel'], tag))

    # ---- the dominant stacked headline
    hx, hy, hw = s.get('hx', MARGIN), s.get('hy', 236), s.get('hw', 452)
    b.append(headline(s['head'], hx, hy, hw, s.get('headc', INK),
                      maxh=s.get('maxh', 430)))

    # ---- photography, always full colour
    for p in s['photos']:
        b.append(bru.photo_fit(p['src'], p['x'], p['y'], p['maxw'], p['maxh'],
                               z=p.get('z', 8), frame=p.get('frame', False),
                               anchor=p.get('anchor', 'tl'), plate=p.get('plate')))

    # ---- accent statement box
    if s.get('box'):
        bx = s['box']
        b.append(redbox(bx['t'], bx['x'], bx['y'],
                        bx.get('w', bx.get('maxw')), bx.get('h', bx.get('maxh')),
                        size=bx.get('size', 29)))

    # ---- left rail: small accent square, plus marks, hazard swatch
    rail = s.get('rail', True)
    if rail:
        RAIL = 24                      # narrow rail, left of the content column
        b.append(block(RAIL, 196, 18, 44, ACCENT, z=6))
        b.append(f'<div style="position:absolute;left:{RAIL}px;top:400px;z-index:12">{plus(18, INK, 2.2)}</div>')
        b.append(f'<div style="position:absolute;left:{RAIL}px;top:692px;z-index:12">{plus(18, INK, 2.2)}</div>')
    if s.get('hazard'):
        hz = s['hazard']
        b.append(f'<div style="position:absolute;left:{hz[0]}px;top:{hz[1]}px;z-index:12">'
                 f'{hazard(52, 21, INK, seed=n)}</div>')

    # ---- left-column utility captions
    for u in s.get('utils', []):
        b.append(util(u['l'], u.get('b', ''), u['x'], u['y'], u.get('w', 150), z=13))

    # ---- optional line-icon punctuation
    for ic in s.get('icons', []):
        fn = ICONS[ic['k']]
        b.append(f'<div style="position:absolute;left:{ic["x"]}px;top:{ic["y"]}px;z-index:13">'
                 f'{fn(ic.get("s", 26), ic.get("c", INK))}</div>')
    if s.get('xmark'):
        xm = s['xmark']
        b.append(f'<div style="position:absolute;left:{xm[0]}px;top:{xm[1]}px;z-index:14">'
                 f'{xmark(xm[2] if len(xm) > 2 else 58, ACCENT, 5.5)}</div>')

    # ---- big sequence numeral
    nz = s.get('num', (MARGIN, 716, 128))
    b.append(numeral(f'{n:02d}', nz[0], nz[1], nz[2], ACCENT, z=12))

    # ---- bottom-right technical tag + barcode
    b.append(f'<div style="position:absolute;left:{R-152}px;top:{STRIP_Y-64}px;z-index:12">'
             f'{barcode(152, 34, seed=n*5+3, c=INK)}</div>')
    b.append(mono(f'MOTU&reg; {unit}  &middot;  {n:02d}/10', R-152, STRIP_Y-24, INK, 11))

    # ---- the four permitted brand items
    b.append(brandstrip(STRIP_Y, uid=f'wa{unit}{n}'))
    return page(''.join(b), seed=n + (0 if unit == 'M2' else 40))


def render(s, out):
    import render as R_
    import slide as _S
    html = f'/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/out/{s["unit"]}_{s["n"]:02d}.html'
    open(html, 'w').write(compose(s))
    R_.render(html, out, 1000, 2)
    return out
