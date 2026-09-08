"""Brutalist editorial grid system for the M2 / M4 sets.

Deliberately shares nothing with the M6 collage engine: hard edges only,
one flat accent, strict modular grid, generous negative space.
"""
import base64, io, math, random
import assets_io as A

# ---------------------------------------------------------------- canvas + grid
W = H  = 1000
MARGIN = 54
COLS, GUT = 12, 14
COLW  = (W - 2*MARGIN - (COLS-1)*GUT) / COLS
U     = 8                                    # baseline unit

def col(n):      return n*(COLW+GUT)                    # width of n columns
def x(n):        return MARGIN + n*(COLW+GUT)           # left edge of column n

# ---------------------------------------------------------------- palette
PAPER  = '#E6E4DE'
INK    = '#141414'
ACCENT = '#DC2A1E'
MUTE   = '#8C8A85'

# ---------------------------------------------------------------- type scale
T_LABEL = 12.5     # utility label, tracked out
T_BODY  = 15
T_STATE = 17.5     # declarative statement
T_MONO  = 11.5

# ---------------------------------------------------------------- textures
def _b64(im):
    b = io.BytesIO(); im.save(b, 'PNG')
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode()

def paper_grain(size=340, seed=11, strength=26):
    """Fine paper grain — much quieter than the collage job's spray."""
    from PIL import Image, ImageFilter
    rng = random.Random(seed)
    g = Image.new('L', (size, size))
    g.putdata([rng.randint(96, 160) for _ in range(size*size)])
    g = g.filter(ImageFilter.GaussianBlur(0.35))
    out = Image.new('RGBA', (size, size)); px = g.load(); op = out.load()
    for yy in range(size):
        for xx in range(size):
            v = px[xx, yy]
            op[xx, yy] = (v, v, v, strength)
    return _b64(out)

def concrete(size=420, seed=5, opacity=30):
    """Low-frequency mottling — the 'cheap stock / concrete' unevenness."""
    from PIL import Image, ImageFilter
    rng = random.Random(seed)
    small = Image.new('L', (size//14, size//14))
    small.putdata([rng.randint(70, 185) for _ in range((size//14)**2)])
    big = small.resize((size, size), Image.BICUBIC).filter(ImageFilter.GaussianBlur(5))
    out = Image.new('RGBA', (size, size)); px = big.load(); op = out.load()
    for yy in range(size):
        for xx in range(size):
            v = px[xx, yy]
            op[xx, yy] = (v, v, v, opacity)
    return _b64(out)

def scratches(seed=3, n=26):
    """Sparse hairline scratches as an SVG overlay — light print degradation."""
    rng = random.Random(seed); out = []
    for _ in range(n):
        x0, y0 = rng.uniform(0, W), rng.uniform(0, H)
        ln = rng.uniform(18, 190); ang = rng.uniform(-0.5, 0.5) + rng.choice([0, math.pi/2])
        x1, y1 = x0 + math.cos(ang)*ln, y0 + math.sin(ang)*ln
        c = rng.choice(['#ffffff', '#000000'])
        out.append(f'<line x1="{x0:.0f}" y1="{y0:.0f}" x2="{x1:.0f}" y2="{y1:.0f}" '
                   f'stroke="{c}" stroke-width="{rng.uniform(.5,1.3):.2f}" '
                   f'opacity="{rng.uniform(.05,.16):.2f}"/>')
    return (f'<svg width="{W}" height="{H}" style="position:absolute;inset:0;z-index:70;'
            f'pointer-events:none">{"".join(out)}</svg>')

# ---------------------------------------------------------------- line icons
def globe(s=22, c=INK, sw=1.5):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" '
            f'stroke-width="{sw}" xmlns="http://www.w3.org/2000/svg">'
            f'<circle cx="12" cy="12" r="9.2"/><ellipse cx="12" cy="12" rx="4" ry="9.2"/>'
            f'<path d="M2.9 9h18.2M2.9 15h18.2"/></svg>')

def plus(s=20, c=INK, sw=2.2):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" stroke="{c}" '
            f'stroke-width="{sw}" xmlns="http://www.w3.org/2000/svg">'
            f'<path d="M12 3v18M3 12h18"/></svg>')

def xmark(s=64, c=ACCENT, sw=5.5):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" stroke="{c}" '
            f'stroke-width="{sw}" stroke-linecap="butt" xmlns="http://www.w3.org/2000/svg">'
            f'<path d="M4 4L20 20M20 4L4 20"/></svg>')

def hazard(w=54, h=22, c=INK, seed=1):
    """Striped hazard-tape swatch."""
    bars = ''.join(f'<path d="M{i-10} {h} L{i+4} 0" stroke="{c}" stroke-width="4.4"/>'
                   for i in range(0, w+22, 11))
    return (f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
            f'xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#hz{seed})">{bars}</g>'
            f'<defs><clipPath id="hz{seed}"><rect width="{w}" height="{h}"/></clipPath></defs>'
            f'<rect width="{w}" height="{h}" fill="none" stroke="{c}" stroke-width="1.4"/></svg>')

def barcode(w=150, h=42, seed=7, c=INK):
    rng = random.Random(seed); bars = []; cx = 0
    while cx < w-2:
        bw = rng.choice([1,1,1.6,2,2,3.2])
        if rng.random() < .72:
            bars.append(f'<rect x="{cx:.1f}" y="0" width="{bw:.1f}" height="{h}" fill="{c}"/>')
        cx += bw + rng.choice([1,1,1.6,2.4])
    return (f'<svg width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
            f'xmlns="http://www.w3.org/2000/svg">{"".join(bars)}</svg>')

def meter_icon(s=26, c=INK):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="{c}" '
            f'xmlns="http://www.w3.org/2000/svg">'
            f'<rect x="3" y="12" width="3.2" height="9"/><rect x="8.4" y="6" width="3.2" height="15"/>'
            f'<rect x="13.8" y="9" width="3.2" height="12"/><rect x="19.2" y="3" width="3.2" height="18"/></svg>')

def knob_icon(s=26, c=INK, sw=1.7):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" '
            f'stroke-width="{sw}" xmlns="http://www.w3.org/2000/svg">'
            f'<circle cx="12" cy="12" r="8.4"/><path d="M12 4.2V12"/></svg>')

def jack_icon(s=26, c=INK, sw=1.7):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" '
            f'stroke-width="{sw}" xmlns="http://www.w3.org/2000/svg">'
            f'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.2"/>'
            f'<circle cx="7.2" cy="16.6" r="1.3" fill="{c}"/><circle cx="16.8" cy="16.6" r="1.3" fill="{c}"/></svg>')

def usbc_icon(s=26, c=INK, sw=1.7):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" '
            f'stroke-width="{sw}" xmlns="http://www.w3.org/2000/svg">'
            f'<rect x="2.5" y="8.5" width="19" height="7" rx="3.5"/>'
            f'<rect x="6" y="11" width="12" height="2.2" rx="1.1" fill="{c}" stroke="none"/></svg>')

# ---------------------------------------------------------------- components
def rule(xx, yy, w, c=INK, t=1.4, z=10):
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{w}px;'
            f'height:{t}px;background:{c};z-index:{z}"></div>')

def vrule(xx, yy, h, c=INK, t=1.2, z=10):
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{t}px;'
            f'height:{h}px;background:{c};z-index:{z}"></div>')

def block(xx, yy, w, h, c=ACCENT, z=6):
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{w}px;'
            f'height:{h}px;background:{c};z-index:{z}"></div>')

def label(text, xx, yy, c=INK, size=T_LABEL, z=12, ls='.19em', w=700):
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;z-index:{z};'
            f'font-family:Oswald;font-weight:{w};font-size:{size}px;color:{c};'
            f'letter-spacing:{ls};text-transform:uppercase;white-space:nowrap">{text}</div>')

def body(text, xx, yy, w, c=INK, size=T_BODY, z=12, lh=1.34, weight=500, ls='.055em'):
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{w}px;z-index:{z};'
            f'font-family:Oswald;font-weight:{weight};font-size:{size}px;color:{c};'
            f'line-height:{lh};letter-spacing:{ls};text-transform:uppercase">{text}</div>')

def mono(text, xx, yy, c=INK, size=T_MONO, z=12, ls='.10em'):
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;z-index:{z};'
            f'font-family:SpaceMono;font-size:{size}px;color:{c};letter-spacing:{ls};'
            f'white-space:nowrap">{text}</div>')

def util(lbl, lines, xx, yy, w, c=INK, z=12, rulewidth=None, gap=13):
    """The reference's recurring unit: short label, thin rule beneath, body lines."""
    o = [label(lbl, xx, yy, c, z=z)]
    o.append(rule(xx, yy+22, rulewidth or min(w, 46), c, 2.2, z))
    if lines:
        o.append(body(lines, xx, yy+22+gap, w, c, z=z))
    return ''.join(o)

def statement(text, xx, yy, w, c=INK, z=12, size=T_STATE):
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{w}px;z-index:{z};'
            f'font-family:Oswald;font-weight:600;font-size:{size}px;color:{c};'
            f'line-height:1.30;letter-spacing:.045em;text-transform:uppercase">{text}</div>')

def photo(src, xx, yy, w, h, pos='center', z=8, maxpx=2400):
    """Hard-edged rectangular photo block. Colour is never touched."""
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{w}px;height:{h}px;'
            f'overflow:hidden;z-index:{z}">'
            f'<img src="{A.img(src, maxpx=maxpx)}" style="width:100%;height:100%;'
            f'object-fit:cover;object-position:{pos};display:block"></div>')

_DIMS = {}
def dims(src):
    from PIL import Image as _I
    import os
    if src not in _DIMS:
        _DIMS[src] = _I.open(os.path.join(A.img.__globals__['REPO'], src)).size
    return _DIMS[src]

def photo_fit(src, xx, yy, maxw, maxh, z=8, frame=False, anchor='tl', plate=None):
    """Whole photograph, never cropped: the box is sized to the image's own aspect.

    anchor places the resulting rectangle inside the (maxw, maxh) slot."""
    iw, ih = dims(src)
    k = min(maxw / iw, maxh / ih)
    w, h = round(iw * k), round(ih * k)
    ox = {'tl': 0, 'tc': (maxw - w) // 2, 'tr': maxw - w}.get(anchor[:2] if len(anchor) > 1 else 'tl', 0)
    if anchor.endswith('c'): ox = (maxw - w) // 2
    if anchor.endswith('r'): ox = maxw - w
    x0, y0 = xx + ox, yy
    o = ''
    if plate:
        o += (f'<div style="position:absolute;left:{x0-10}px;top:{y0-10}px;width:{w+20}px;'
              f'height:{h+20}px;background:{plate};z-index:{z-1}"></div>')
    o += (f'<img src="{A.img(src)}" style="position:absolute;left:{x0}px;top:{y0}px;'
          f'width:{w}px;height:{h}px;display:block;z-index:{z}">')
    if frame:
        o += (f'<div style="position:absolute;left:{x0}px;top:{y0}px;width:{w}px;height:{h}px;'
              f'border:2px solid {INK};z-index:{z+1};pointer-events:none"></div>')
    return o

def photo_contain(src, xx, yy, w, h, z=8, bg='transparent', maxpx=2400):
    """For the transparent panel cut-outs — contained, never cropped."""
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{w}px;height:{h}px;'
            f'background:{bg};z-index:{z};display:flex;align-items:center;justify-content:center">'
            f'<img src="{A.img(src, maxpx=maxpx)}" style="max-width:100%;max-height:100%;'
            f'display:block"></div>')

def headline(lines, xx, yy, w, c=INK, z=14, lh=0.795, gap=0, maxh=430):
    """Massive condensed stack. Each line auto-fits the measure, then the whole
    stack is scaled down if it would exceed `maxh` (see FIT script)."""
    rows = ''.join(
        f'<div style="width:{w}px;overflow:visible"><div class="fit" '
        f'style="font-family:Anton;color:{c};line-height:{lh};letter-spacing:-.012em;'
        f'white-space:nowrap;display:inline-block;transform-origin:left top">{t}</div></div>'
        for t in lines)
    return (f'<div class="hstack" data-maxh="{maxh}" style="position:absolute;left:{xx}px;'
            f'top:{yy}px;width:{w}px;z-index:{z};display:flex;flex-direction:column;'
            f'gap:{gap}px">{rows}</div>')

def numeral(txt, xx, yy, size=132, c=ACCENT, z=12, font='Anton'):
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;z-index:{z};'
            f'font-family:{font};font-size:{size}px;color:{c};line-height:.78;'
            f'letter-spacing:-.02em">{txt}</div>')

def redpanel(xx, yy, w, h, lines, tag, z=9):
    """Top-right utility panel: three short lines, rule, globe, boxed tag."""
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{w}px;height:{h}px;'
            f'background:{ACCENT};z-index:{z}">'
            f'<div style="position:absolute;left:16px;top:15px;font-family:Oswald;font-weight:700;'
            f'font-size:{T_LABEL}px;color:{PAPER};letter-spacing:.19em;line-height:1.62;'
            f'text-transform:uppercase">{lines}</div>'
            f'<div style="position:absolute;left:16px;top:{h-92}px;width:34px;height:2.4px;'
            f'background:{PAPER}"></div>'
            f'<div style="position:absolute;left:16px;top:{h-78}px">{globe(26, PAPER, 1.5)}</div>'
            f'<div style="position:absolute;left:16px;top:{h-38}px;border:1.6px solid {PAPER};'
            f'padding:4px 8px;font-family:Oswald;font-weight:700;font-size:11px;color:{PAPER};'
            f'letter-spacing:.16em">{tag}</div></div>')

def redbox(text, xx, yy, w, h, z=16, size=30):
    """The 'UGLY IS POWERFUL' equivalent — flat accent block, heavy statement."""
    return (f'<div style="position:absolute;left:{xx}px;top:{yy}px;width:{w}px;height:{h}px;'
            f'background:{ACCENT};z-index:{z}">'
            f'<div style="position:absolute;left:20px;top:19px;right:18px;font-family:Oswald;'
            f'font-weight:700;font-size:{size}px;color:{INK};line-height:1.13;'
            f'letter-spacing:.005em;text-transform:uppercase">{text}</div>'
            f'<div style="position:absolute;left:20px;bottom:18px;width:40px;height:3px;'
            f'background:{INK}"></div></div>')

# ---------------------------------------------------------------- brand layer
# The full MOTU lockup (wordmark + tagline) as supplied. Used whole, unmodified.
MOTU_LOGO = '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/assets/MOTU_LOGO_FULL.png'
SHIV_LOGO = 'SHIVANSH ELECTRONICS LOGO FOR VIDEO.png'
PHONES = ['+91 98316 62458', '+91 91477 00677', '+91 89818 07755']

def _whatsapp(size=34, uid='wa'):
    """The supplied WhatsApp mark, reproduced as vector: gradient bubble, ring, handset."""
    bub = ("M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22"
           "l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65"
           "-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z")
    hs  = ("M17.07 14.53c-.28-.14-1.65-.81-1.9-.9-.26-.09-.44-.14-.63.14-.18.28-.72.9"
           "-.88 1.09-.16.18-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.38-.83-.73-1.38-1.64"
           "-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.18-.28.28-.46"
           ".09-.19.05-.35-.02-.49-.07-.14-.63-1.51-.86-2.07-.22-.54-.45-.47-.63-.48h-.53"
           "c-.18 0-.48.07-.73.35-.25.28-.96.94-.96 2.29s.99 2.66 1.13 2.85c.14.18 1.95 2.98"
           " 4.72 4.18.66.28 1.18.45 1.58.58.66.21 1.27.18 1.75.11.53-.08 1.65-.67 1.88-1.32"
           ".23-.65.23-1.21.16-1.32-.06-.12-.24-.19-.52-.33z")
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" '
            f'xmlns="http://www.w3.org/2000/svg"><defs>'
            f'<linearGradient id="{uid}" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="#5FD669"/><stop offset="1" stop-color="#23AF41"/>'
            f'</linearGradient></defs>'
            f'<path d="{bub}" fill="#fff" stroke="#fff" stroke-width="1.75" stroke-linejoin="round"/>'
            f'<path d="{bub}" fill="url(#{uid})"/><path d="{hs}" fill="#fff"/></svg>')

def brandstrip(y=856, uid='wa'):
    """The four permitted items as utility cells, identical on all 20 slides.
    Both logo files are placed whole and unmodified — nothing cropped, nothing recoloured."""
    L, R = MARGIN, W - MARGIN
    e = [L, 280, 536, R]
    o = [rule(L, y, R - L, INK, 2.2, 30)]
    for cut in e[1:-1]:
        o.append(vrule(cut, y + 12, 74, INK, 1.2, 30))
    # 1 — Shivansh logo, whole file
    o.append(f'<div style="position:absolute;left:{L}px;top:{y+20}px;width:208px;'
             f'z-index:31"><img src="{A.img(SHIV_LOGO)}" style="width:100%;display:block"></div>')
    # 2 — MOTU logo, whole file: wordmark AND tagline, transparent margin allowed to
    #     overhang the cell (invisible) so the mark reads as large as possible
    o.append(f'<div style="position:absolute;left:{e[1]+9}px;top:{y+3}px;width:238px;'
             f'z-index:31"><img src="{A.img(MOTU_LOGO)}" style="width:100%;display:block"></div>')
    # 3 — website + globe
    o.append(f'<div style="position:absolute;left:{e[2]+18}px;top:{y+17}px;z-index:31;'
             f'display:flex;align-items:center;gap:9px">{globe(20, INK, 1.6)}'
             f'<span style="font-family:Oswald;font-weight:700;font-size:15px;color:{INK};'
             f'letter-spacing:.028em">www.shivanshelectronics.in</span></div>')
    # 4 — WhatsApp mark with the three numbers kept together as one unit
    nums = '&nbsp;&nbsp;·&nbsp;&nbsp;'.join(PHONES)
    o.append(f'<div style="position:absolute;left:{e[2]+18}px;top:{y+47}px;z-index:31;'
             f'display:flex;align-items:center;gap:9px">{_whatsapp(26, uid)}'
             f'<div style="font-family:Oswald;font-weight:600;font-size:12.5px;color:{INK};'
             f'letter-spacing:.024em;white-space:nowrap">{nums}</div></div>')
    return ''.join(o)

# ---------------------------------------------------------------- page shell
FIT = """<script>
window.__fitted = false;
(function () {
  function go() {
    // 1. fit each headline line to the measure
    document.querySelectorAll('.fit').forEach(function (el) {
      var target = el.parentElement.clientWidth;
      el.style.fontSize = '200px';
      var w = el.scrollWidth || 1;
      el.style.fontSize = (200 * target / w) + 'px';
    });
    // 2. cap the whole stack's height, measuring real ink not the line box
    document.querySelectorAll('.hstack').forEach(function (st) {
      var maxh = parseFloat(st.dataset.maxh || '0');
      if (!maxh) return;
      for (var i = 0; i < 4; i++) {
        var h = st.getBoundingClientRect().height;
        if (h <= maxh + 0.5) break;
        var k = maxh / h;
        st.querySelectorAll('.fit').forEach(function (el) {
          el.style.fontSize = (parseFloat(el.style.fontSize) * k) + 'px';
        });
      }
    });
    window.__fitted = true;
  }
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(go); }
  else { window.onload = go; }
})();
</script>"""

def page(bodyhtml, seed=1):
    return f"""<html><head><meta charset="utf-8"><style>
{A.FONTS}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:{W}px;height:{H}px;overflow:hidden;background:{PAPER}}}
.stage{{position:relative;width:{W}px;height:{H}px;overflow:hidden;background:{PAPER}}}
.concrete{{position:absolute;inset:0;z-index:2;pointer-events:none;
  background-image:url({concrete(420, seed*7+3, 34)});background-size:640px 640px;
  mix-blend-mode:multiply;opacity:.85}}
.grain{{position:absolute;inset:0;z-index:72;pointer-events:none;
  background-image:url({paper_grain(300, seed*13+5, 30)});background-size:300px 300px;
  mix-blend-mode:multiply;opacity:.62}}
.grain2{{position:absolute;inset:0;z-index:73;pointer-events:none;
  background-image:url({paper_grain(220, seed*29+9, 20)});background-size:220px 220px;
  mix-blend-mode:overlay;opacity:.40}}
.vig{{position:absolute;inset:0;z-index:74;pointer-events:none;
  background:radial-gradient(ellipse at 50% 42%,rgba(0,0,0,0) 55%,rgba(0,0,0,.16) 100%)}}
</style></head><body><div class="stage">
<div class="concrete"></div>
{bodyhtml}
{scratches(seed*17+2, 26)}
<div class="grain"></div><div class="grain2"></div><div class="vig"></div>
</div>{FIT}</body></html>"""
