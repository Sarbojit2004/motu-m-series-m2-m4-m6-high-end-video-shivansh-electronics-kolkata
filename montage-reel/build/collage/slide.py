"""Slide composition engine — maximalist torn-paper collage."""
# The occlusion-probe attributes were added between the M6 render and the
# M2/M4 render. They shift text antialiasing very slightly, so reproducing
# each approved set bit-for-bit means matching the markup it shipped with.
PROBE = True
import lib, brand, assets_io as A
from lib import BLACK, RED, YELLOW, CREAM

W = H = 1000
KNOB   = '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/assets/knob.png'
LENS   = '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/assets/lens.png'
METERS = '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/assets/meters.png'
MOTU_LOGO = 'MOTU LOGO.png'
SHIV_LOGO = 'SHIVANSH ELECTRONICS LOGO FOR VIDEO.png'

_clips = []
def clip(seed, w, h, amp=9):
    """Register a torn-edge clipPath sized to a scrap; return its css url()."""
    cid = f'c{seed}_{int(w)}_{int(h)}'
    _clips.append(f'<clipPath id="{cid}" clipPathUnits="userSpaceOnUse">'
                  f'<path d="{lib.scrap_path(seed, w, h, amp=amp)}"/></clipPath>')
    return f'clip-path:url(#{cid});'

def defs():
    return f'<svg width="0" height="0" style="position:absolute"><defs>{"".join(_clips)}</defs></svg>'

# ------------------------------------------------------------------ pieces
def scrap(seed, x, y, w, h, fill, rot=0, z=5, amp=8, inner='', pad=0, extra=''):
    """A torn paper scrap with optional content."""
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
            f'transform:rotate({rot}deg);z-index:{z};{extra}">'
            f'<div style="position:absolute;inset:0;background:{fill};{clip(seed,w,h,amp)}'
            f'filter:drop-shadow(2px 4px 5px rgba(0,0,0,.45));"></div>'
            f'<div style="position:absolute;inset:{pad}px;">{inner}</div></div>')

def photo(seed, src, x, y, w, h, rot=0, z=6, amp=9, fit='cover', pos='center', extra=''):
    """Torn-edged photograph. Colour is never touched — no filters applied."""
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
            f'transform:rotate({rot}deg);z-index:{z};{clip(seed,w,h,amp)}'
            f'{extra}">'
            f'<img src="{A.img(src)}" style="width:100%;height:100%;object-fit:{fit};'
            f'object-position:{pos};display:block">'
            f'</div>')

def frag(text, x, y, rot=0, size=26, font='Oswald', colour='#0C0C0E', z=14,
         weight=700, lh=1.0, ls='0.01em', extra='', align='left', w=None):
    """Small scattered text fragment — visual noise, not copy."""
    _p = f' data-frag="{text[:40]}"' if PROBE else ''
    return (f'<div{_p} style="position:absolute;left:{x}px;top:{y}px;'
            f'{f"width:{w}px;" if w else ""}transform:rotate({rot}deg);'
            f'transform-origin:left top;z-index:{z};font-family:{font};font-size:{size}px;'
            f'font-weight:{weight};color:{colour};line-height:{lh};letter-spacing:{ls};'
            f'text-align:{align};{extra}">{text}</div>')

def spray_patch(x, y, w, h, seed, colour=(12,12,14), n=3800, z=8, op=1.0, spread=.4):
    return (f'<img src="{lib.spray(600,600,seed=seed,n=n,colour=colour,spread=spread)}" '
            f'style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
            f'z-index:{z};opacity:{op};pointer-events:none">')

def halftone_patch(x, y, w, h, seed, colour=(12,12,14), step=12, z=8, op=.9, rot=0, fade='x'):
    return (f'<img src="{lib.halftone(500,500,seed=seed,step=step,colour=colour,fade=fade)}" '
            f'style="position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;'
            f'transform:rotate({rot}deg);z-index:{z};opacity:{op};pointer-events:none">')

# ------------------------------------------------------------------ letters
def letters(specs, x, baseline, box, z=20, rot=0, gap=6, shadow=None):
    """Per-letter scale/case/family chaos inside one word, on a shared baseline.

    `baseline` is the y the glyph feet sit on; `box` is the container height."""
    out = []
    for s in specs:
        if s.get('img'):
            ring = (f'border-radius:50%;box-shadow:0 0 0 {s["ring"]}px {s.get("ringc","#F0E8D8")};'
                    if s.get('ring') else '')
            out.append(f'<img src="{A.img(s["img"])}" style="width:{s["size"]}px;'
                       f'height:{s["size"]}px;display:block;flex:0 0 auto;'
                       f'{"pointer-events:auto;" if PROBE else ""}{ring}'
                       f'transform:translateY({s.get("dy",0)}px) rotate({s.get("rot",0)}deg);'
                       f'margin:0 {s.get("mr",0)}px 0 {s.get("ml",0)}px;'
                       f'filter:drop-shadow(2px 3px 5px rgba(0,0,0,.55));">')
        else:
            out.append(
                f'<span style="font-family:{s.get("font","Anton")};font-size:{s["size"]}px;'
                f'color:{s.get("c",RED)};display:inline-block;flex:0 0 auto;line-height:.78;'
                f'{"pointer-events:auto;" if PROBE else ""}'
                f'font-style:{s.get("style","normal")};font-weight:{s.get("w",400)};'
                f'transform:translateY({s.get("dy",0)}px) rotate({s.get("rot",0)}deg) '
                f'scaleX({s.get("sx",1)});'
                f'margin:0 {s.get("mr",0)}px 0 {s.get("ml",0)}px;'
                f'{s.get("extra","")}">{s["t"]}</span>')
    sh = f'filter:drop-shadow({shadow});' if shadow else ''
    return (f'<div style="position:absolute;left:{x}px;top:{baseline-box}px;'
            f'height:{box}px;display:flex;align-items:flex-end;gap:{gap}px;z-index:{z};'
            f'{"pointer-events:none;" if PROBE else ""}'
            f'transform:rotate({rot}deg);transform-origin:left bottom;'
            f'white-space:nowrap;{sh}">{"".join(out)}</div>')

# ------------------------------------------------------------------ brand layer
def brand_layer(seed=900, y=832, flip=False):
    """The four permitted items, collaged as torn scraps. Identical treatment every slide."""
    o = []
    # -- Shivansh logo on a cream scrap
    L, Rr = (470, 16) if flip else (24, 542)      # logo pair is 506 wide; keep it on-frame
    o.append(scrap(seed+1, L, y+22, 300, 106, CREAM, rot=-2.0, z=30, amp=6, pad=10,
                   inner=f'<img src="{A.img(SHIV_LOGO)}" style="width:100%;height:100%;'
                         f'object-fit:contain;display:block">'))
    # -- MOTU logo on its own scrap
    # the supplied MOTU file carries ~52% empty transparent margin; trimming it
    # lets the complete mark fill the scrap at its true 6.18 aspect, unscaled.
    o.append(scrap(seed+2, L+308, y+44, 198, 62, CREAM, rot=2.6, z=31, amp=5, pad=9,
                   inner=f'<img src="{A.img(MOTU_LOGO, trim=True)}" style="width:100%;'
                         f'height:100%;object-fit:contain;display:block">'))
    # -- website + whatsapp, grouped as one "get in touch" scrap
    inner = (
      f'<div style="display:flex;align-items:center;gap:9px;margin:0 0 7px 2px">'
      f'{brand.globe(27, BLACK, 2.0)}'
      f'<span style="font-family:Oswald;font-weight:700;font-size:25px;color:{BLACK};'
      f'letter-spacing:.005em">www.shivanshelectronics.in</span></div>'
      f'<div style="display:flex;align-items:center;gap:11px;margin-left:2px">'
      f'{brand.whatsapp(46)}'
      f'<div style="font-family:Oswald;font-weight:700;font-size:22.5px;color:{BLACK};'
      f'line-height:1.16;letter-spacing:.012em">'
      f'+91 98316 62458<br>+91 91477 00677<br>+91 89818 07755</div></div>')
    o.append(scrap(seed+3, Rr, y+10, 440, 152, CREAM, rot=-1.4, z=32, amp=6, pad=14,
                   inner=inner))
    return ''.join(o)

# ------------------------------------------------------------------ page
def page(body, bg=BLACK):
    return f"""<html><head><meta charset="utf-8"><style>
{A.FONTS}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{W}px;height:{H}px;overflow:hidden;background:{bg}}}
.stage{{position:relative;width:{W}px;height:{H}px;overflow:hidden;background:{bg}}}
.grain{{position:absolute;inset:0;z-index:60;pointer-events:none;
  background-image:url({lib.grain(300,7,46)});background-size:300px 300px;
  mix-blend-mode:overlay;opacity:.72}}
.grain2{{position:absolute;inset:0;z-index:61;pointer-events:none;
  background-image:url({lib.grain(220,19,30)});background-size:220px 220px;
  mix-blend-mode:multiply;opacity:.30}}
.vig{{position:absolute;inset:0;z-index:62;pointer-events:none;
  background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 42%,rgba(0,0,0,.42) 100%)}}
</style></head><body><div class="stage">{body}
<div class="grain"></div><div class="grain2"></div><div class="vig"></div>
</div>{defs()}</body></html>"""
