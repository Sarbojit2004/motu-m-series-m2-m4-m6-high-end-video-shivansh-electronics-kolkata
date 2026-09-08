"""Prove the decomposition is lossless: recomposite the planes+sprites and diff
against a flat render of the very same page."""
import sys, json, pathlib, numpy as np
sys.path.insert(0, '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build')
sys.path.insert(0, '.')
from PIL import Image
import layers
from playwright.sync_api import sync_playwright

OUT = pathlib.Path(layers.OUT)

def composite(sid, size=None):
    d = OUT / sid; rec = json.loads((d / 'layers.json').read_text())
    dsf = rec['dsf']; N = 1000 * dsf
    canvas = Image.new('RGBA', (N, N), (0, 0, 0, 0))
    canvas.alpha_composite(Image.open(d / rec['planes']['bg']).convert('RGBA'))
    canvas.alpha_composite(Image.open(d / rec['planes']['mid']).convert('RGBA'))
    canvas.alpha_composite(Image.open(d / rec['planes']['hero']).convert('RGBA'))
    for s in sorted(rec['sprites'], key=lambda s: (s['z'], s['i'])):
        im = Image.open(d / s['f']).convert('RGBA')
        canvas.alpha_composite(im, (int(round(s['x']*dsf)), int(round(s['y']*dsf))))
    canvas.alpha_composite(Image.open(d / rec['planes']['brand']).convert('RGBA'))
    if size: canvas = canvas.resize((size, size), Image.LANCZOS)
    return canvas

def flat_reference(sid, pg):
    d = OUT / sid
    pg.goto((d / 'page.html').absolute().as_uri(), wait_until='load')
    pg.evaluate("document.fonts ? document.fonts.ready : Promise.resolve()")
    pg.wait_for_function('window.__fitted === undefined || window.__fitted === true', timeout=8000)
    pg.wait_for_timeout(260)
    pg.screenshot(path=str(d / '_flat.png'), clip={'x':0,'y':0,'width':1000,'height':1000})
    return Image.open(d / '_flat.png').convert('RGB')

if __name__ == '__main__':
    sids = sys.argv[1:]
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=layers.CHROME,
                              args=['--force-color-profile=srgb','--font-render-hinting=none',
                                    '--disable-lcd-text'])
        pg = b.new_page(viewport={'width':1000,'height':1000}, device_scale_factor=layers.DSF)
        for sid in sids:
            ref = flat_reference(sid, pg)
            comp = composite(sid).convert('RGB')
            a = np.asarray(comp, dtype=np.int16); c = np.asarray(ref, dtype=np.int16)
            diff = np.abs(a - c).max(2)
            exact = (diff == 0).mean() * 100
            near  = (diff <= 2).mean() * 100
            print(f'{sid}:  exact {exact:7.4f}%   within±2 {near:7.4f}%   '
                  f'max delta {diff.max():3d}   mean {diff.mean():.4f}')
        b.close()
