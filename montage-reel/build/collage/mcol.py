"""M2 / M4 maximalist torn-paper collage — same language as the M6 set.

Two carry-overs from the later jobs are folded in here:
  * photographs are placed aspect-exact (never `object-fit:cover`), so no
    product image is ever cropped;
  * the MOTU mark is the full supplied lockup, not the padded repo file.
"""
import random
import lib, brand, deck as D, slide as S, assets_io as A
from lib import BLACK, RED, YELLOW, CREAM
from slide import W, H, clip, scrap, frag, letters, spray_patch, halftone_patch

ASSETS    = '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/assets/'
MOTU_FULL = ASSETS + 'MOTU_LOGO_FULL.png'
SHIV_LOGO = 'SHIVANSH ELECTRONICS LOGO FOR VIDEO.png'
STROKE      = '-webkit-text-stroke:4px #F0E8D8;paint-order:stroke fill;'
DARKSTROKE  = '-webkit-text-stroke:4px #0C0C0E;paint-order:stroke fill;'

# ------------------------------------------------------------------ photos
def photo_fit(seed, src, x, y, maxw, maxh, rot=0, z=12, amp=10, anchor='tl', extra=''):
    """Torn-edged photograph, WHOLE — the scrap is sized to the image's own
    aspect, so nothing is cropped and nothing is letterboxed. Colour untouched."""
    iw, ih = A.dims(src)
    k = min(maxw / iw, maxh / ih)
    w, h = round(iw * k), round(ih * k)
    if 'r' in anchor: x = x + maxw - w
    if 'c' in anchor: x = x + (maxw - w) / 2
    if 'b' in anchor: y = y + maxh - h
    return (f'<div style="position:absolute;left:{x:.0f}px;top:{y:.0f}px;width:{w}px;'
            f'height:{h}px;transform:rotate({rot}deg);z-index:{z};{clip(seed,w,h,amp)}{extra}">'
            f'<img src="{A.img(src)}" style="width:100%;height:100%;display:block"></div>')

def cutout(src, x, y, w, rot, z=18, shadow='0 18px 30px rgba(0,0,0,.7)'):
    """Alpha cut-out (front/rear panel) at its own aspect — full colour, uncropped."""
    return (f'<div style="position:absolute;left:{x}px;top:{y}px;width:{w}px;z-index:{z};'
            f'transform:rotate({rot}deg);filter:drop-shadow({shadow})">'
            f'<img src="{A.img(src, trim=True)}" style="width:100%;display:block"></div>')

# ------------------------------------------------------------------ words
SERIF = [
    dict(font='Yeseva',   sc=1.00, rot=-4, dy=4),
    dict(font='Yeseva',   sc=1.17, rot=3,  dy=8),
    dict(font='Playfair', sc=1.00, rot=-6, dy=-2, style='italic', w=900),
    dict(font='Marker',   sc=0.74, rot=11, dy=-16, ml=12),
    dict(font='Playfair', sc=0.70, rot=3,  dy=4,  ml=8, style='italic', w=900),
    dict(font='Marker',   sc=0.78, rot=-7, dy=0),
    dict(font='Anton',    sc=1.15, rot=2,  dy=6,  ml=8, sx=.94),
    dict(font='Yeseva',   sc=0.92, rot=-5, dy=2),
    dict(font='Playfair', sc=0.86, rot=6,  dy=-4, style='italic', w=900),
]

SLAB = [
    dict(font='Anton',        sc=1.00, rot=-3, dy=4),
    dict(font='Anton',        sc=1.00, rot=3,  dy=2),
    dict(font='ArchivoBlack', sc=0.80, rot=4,  dy=6),
    dict(font='Pixel',        sc=0.46, rot=3,  dy=-14, ml=6, mr=8),
    dict(font='Anton',        sc=0.72, rot=-6, dy=-4,  ml=6, mr=6),
    dict(font='Anton',        sc=1.05, rot=2,  dy=6),
    dict(font='ArchivoBlack', sc=0.84, rot=-4, dy=4),
    dict(font='Anton',        sc=1.08, rot=5,  dy=8),
]

def word(text, size, cycle, colour, seed, knob_at=None, knob_img=None,
         knob_sc=0.72, extra='', jitter=True):
    """Per-letter scale/case/family chaos, generated rather than hand-set.

    `knob_at` swaps one glyph for the product's own MONITOR knob — the
    reference poster's letter-substitution move, using the real photograph."""
    rng = random.Random(seed)
    off = rng.randrange(len(cycle))
    out = []
    for i, ch in enumerate(text):
        if knob_at is not None and i == knob_at and knob_img:
            out.append(dict(img=knob_img, size=round(size * knob_sc),
                            rot=rng.uniform(7, 13), dy=-round(size * 0.09),
                            ml=4, mr=5))
            continue
        st = dict(cycle[(i + off) % len(cycle)])
        sc = st.pop('sc')
        r  = st.pop('rot'); dy = st.pop('dy')
        if jitter:
            r  += rng.uniform(-1.6, 1.6)
            dy += rng.uniform(-3, 3)
        spec = dict(t=ch, size=round(size * sc), c=colour,
                    rot=round(r, 2), dy=round(dy), **st)
        if extra: spec['extra'] = extra
        out.append(spec)
    return out

def headline(specs, x, baseline, box, maxw, z=20, rot=0, gap=6, shadow=None):
    """A word row that auto-scales down if it overruns its measure."""
    html = letters(specs, x, baseline, box, z=z, rot=rot, gap=gap, shadow=shadow)
    return html.replace('white-space:nowrap;', f'white-space:nowrap;', 1).replace(
        '<div style="position:absolute;left:', f'<div data-fitw="{maxw}" '
        'style="position:absolute;left:', 1)

FIT = """<script>
/* The approved M2/M4 slides were rendered with the auto-fit measured against
   FALLBACK metrics (the webfonts had not finished loading when the inline
   script ran), and the webfonts applied afterwards. Reproducing that ordering
   deterministically is what makes a re-render bit-identical to the delivered
   artwork -- measuring after the fonts land yields a ~1% different headline
   scale on the five slides whose headlines sit near their measure. */
(function(){
  var st = document.getElementById('webfonts');
  function fit(){
    document.querySelectorAll('[data-fitw]').forEach(function(el){
      var max = parseFloat(el.dataset.fitw), w = el.scrollWidth;
      if (w > max) { var k = max / w;
        el.style.transform = 'scale(' + k.toFixed(4) + ') ' + el.style.transform; }
    });
    if (st) st.media = 'all';
    window.__fitted = true;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fit);
  else fit();
})();
</script>"""

# ------------------------------------------------------------------ brand layer
def brand_layer(seed=900, y=826, flip=False):
    """The four permitted items only, collaged as torn scraps.

    (1) MOTU logo  (2) Shivansh Electronics logo  (3) website + globe
    (4) WhatsApp mark + the three numbers, grouped as one unit."""
    o = []
    L, Rr = (470, 16) if flip else (24, 542)
    o.append(scrap(seed + 1, L, y + 22, 300, 106, CREAM, rot=-2.0, z=30, amp=6, pad=10,
                   inner=f'<img src="{A.img(SHIV_LOGO)}" style="width:100%;height:100%;'
                         f'object-fit:contain;display:block">'))
    o.append(scrap(seed + 2, L + 308, y + 30, 200, 90, CREAM, rot=2.6, z=31, amp=5, pad=10,
                   inner=f'<img src="{A.img(MOTU_FULL, absolute=True)}" style="width:100%;'
                         f'height:100%;object-fit:contain;display:block">'))
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
    o.append(scrap(seed + 3, Rr, y + 10, 440, 152, CREAM, rot=-1.4, z=32, amp=6, pad=14,
                   inner=inner))
    return ''.join(o)

# ------------------------------------------------------------------ page
def page(body):
    """Hold the @font-face block back until the auto-fit has measured, so the
    render reproduces the approved slides exactly (see the note on FIT)."""
    html = S.page(body + FIT)
    j = html.index('@font-face'); k = html.index('*{margin:0')
    fonts = html[j:k]
    html = html[:j] + html[k:]
    return html.replace('</head>', f'<style id="webfonts" media="none">{fonts}</style></head>')

def render_slide(tag, body, out_png):
    import render
    html = f'/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/outc/{tag}.html'
    open(html, 'w').write(page(body))
    S._clips.clear()
    render.render(html, out_png, 1000, 2)
    return out_png
