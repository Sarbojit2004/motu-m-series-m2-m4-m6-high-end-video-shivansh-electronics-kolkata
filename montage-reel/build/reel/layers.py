"""Decompose each approved collage slide into depth planes + per-element sprites.

The collage build is bit-for-bit deterministic (verified), so re-running it and
screenshotting sub-sets of its own DOM reuses the approved artwork exactly — it
does not regenerate a different-looking design. Nothing about the compositions
is altered here; they are only taken apart along their existing z-order.
"""
import sys, os, re, json, pathlib
sys.path.insert(0, '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build')
from playwright.sync_api import sync_playwright

BUILD = '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build'
OUT   = '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/reel/layers'
CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
DSF   = 3                      # 1000 css px -> 3000 px, headroom for camera push-ins

# ---- depth bands (strict z-order, nothing is reordered) ---------------------
BANDS = [('bg',   -99,  9),    # torn colour zones, wedges, spray, halftone, drips
         ('mid',   10, 16),    # secondary photography, scribbles
         ('hero',  17, 19),    # hero product cut-outs
         ('brand', 30, 99)]    # the four permitted brand items
SPRITE_LO, SPRITE_HI = 20, 29  # headlines, lens prop, sticker call-outs, badge

def split_top(body):
    out, i, n = [], 0, len(body)
    while i < n:
        if body[i] != '<': i += 1; continue
        m = re.match(r'<([a-zA-Z][\w-]*)', body[i:])
        if not m: i += 1; continue
        tag = m.group(1); depth = 0; j = i
        while j < n:
            if body[j] == '<':
                if body[j:j+2] == '</':
                    e = body.index('>', j)
                    if body[j+2:e].strip() == tag: depth -= 1
                    j = e + 1
                    if depth == 0: break
                    continue
                mm = re.match(r'<([a-zA-Z][\w-]*)([^>]*)>', body[j:])
                if mm:
                    e = j + mm.end()
                    sc = mm.group(2).rstrip().endswith('/') or mm.group(1) in ('img','br','meta','input')
                    if mm.group(1) == tag and not sc: depth += 1
                    elif mm.group(1) == tag and sc and depth == 0:
                        j = e; break
                    j = e; continue
            j += 1
        out.append(body[i:j]); i = j
    return out

def zof(el):
    m = re.search(r'z-index:(-?\d+)', el)
    return int(m.group(1)) if m else 0

def tag_elements(body):
    """Wrap every top-level element in an addressable marker div."""
    els = split_top(body)
    parts, meta = [], []
    for i, el in enumerate(els):
        z = zof(el)
        band = next((b for b, lo, hi in BANDS if lo <= z <= hi), None)
        role = band if band else ('sprite' if SPRITE_LO <= z <= SPRITE_HI else 'mid')
        parts.append(f'<div data-el="{i}" data-role="{role}" data-z="{z}" '
                     f'style="display:contents">{el}</div>')
        meta.append(dict(i=i, z=z, role=role))
    return ''.join(parts), meta

PAGE_CSS = """
<style id="isolate">
 html,body,.stage{background:transparent !important}
 [data-el][data-off]{visibility:hidden !important}
</style>"""

def page_for(body_tagged, page_fn):
    html = page_fn(body_tagged)
    html = html.replace('<div class="grain"></div><div class="grain2"></div><div class="vig"></div>', '')
    return html.replace('</head>', PAGE_CSS + '</head>')

def extract(slide_id, body, page_fn, pg):
    S_ = __import__('slide')
    tagged, meta = tag_elements(body)
    html = page_for(tagged, page_fn)
    d = pathlib.Path(OUT) / slide_id; d.mkdir(parents=True, exist_ok=True)
    (d / 'page.html').write_text(html)
    pg.goto((d / 'page.html').absolute().as_uri(), wait_until='load')
    pg.evaluate("document.fonts ? document.fonts.ready : Promise.resolve()")
    pg.wait_for_function('window.__fitted === undefined || window.__fitted === true', timeout=8000)
    pg.wait_for_timeout(260)

    def show_only(pred):
        pg.evaluate("""(keep) => {
            document.querySelectorAll('[data-el]').forEach(e => {
              if (keep.includes(+e.dataset.el)) e.removeAttribute('data-off');
              else e.setAttribute('data-off','1');
            });
        }""", [m['i'] for m in meta if pred(m)])

    rec = dict(id=slide_id, dsf=DSF, planes={}, sprites=[])
    for band, lo, hi in BANDS:
        show_only(lambda m, b=band: m['role'] == b)
        p = d / f'{band}.png'
        pg.screenshot(path=str(p), clip={'x':0,'y':0,'width':1000,'height':1000},
                      omit_background=True)
        rec['planes'][band] = p.name

    sprites = [m for m in meta if m['role'] == 'sprite']
    for m in sprites:
        show_only(lambda x, i=m['i']: x['i'] == i)
        loc = pg.locator(f'[data-el="{m["i"]}"] > *').first
        try:
            box = loc.bounding_box()
        except Exception:
            box = None
        if not box or box['width'] < 1 or box['height'] < 1: continue
        # bounding_box() excludes drop-shadow / text-shadow spread and glyph
        # overflow from the tight line-height, so pad before clipping.
        PAD = 40.0
        x0 = max(0.0, box['x'] - PAD); y0 = max(0.0, box['y'] - PAD)
        x1 = min(1000.0, box['x'] + box['width'] + PAD)
        y1 = min(1000.0, box['y'] + box['height'] + PAD)
        if x1 - x0 < 1 or y1 - y0 < 1: continue
        fn = f'spr{m["i"]:03d}.png'
        pg.screenshot(path=str(d / fn), omit_background=True,
                      clip={'x':x0,'y':y0,'width':x1-x0,'height':y1-y0})
        rec['sprites'].append(dict(f=fn, z=m['z'], i=m['i'],
                                   x=x0, y=y0, w=x1-x0, h=y1-y0))
    show_only(lambda m: True)
    (d / 'layers.json').write_text(json.dumps(rec, indent=1))
    return rec
