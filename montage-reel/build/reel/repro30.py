"""Confirm every re-render matches the delivered, approved PNG."""
import sys, numpy as np
sys.path.insert(0,'/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build')
from PIL import Image
from playwright.sync_api import sync_playwright
import cbuild, mcol, slide as S, cspec_m2 as M2, cspec_m4 as M4
from extract_all import m6_bodies
FIN='/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/outc_final/'
M6D='/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/out/'
m6 = m6_bodies()
jobs = ([(f'M2_{n:02d}', lambda n=n: cbuild.build(M2.SLIDES[n-1],M2.P), mcol.page,
          f'{FIN}M2_{n:02d}_motu-m2-collage.png') for n in range(1,11)] +
        [(f'M4_{n:02d}', lambda n=n: cbuild.build(M4.SLIDES[n-1],M4.P), mcol.page,
          f'{FIN}M4_{n:02d}_motu-m4-collage.png') for n in range(1,11)] +
        [(f'M6_{n:02d}', lambda n=n: m6[n], S.page,
          f'{M6D}{n:02d}_motu-m6-slide.png') for n in range(1,11)])
ok=[]; diff=[]
with sync_playwright() as p:
    br=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
        args=['--force-color-profile=srgb','--font-render-hinting=none','--disable-lcd-text'])
    pg=br.new_page(viewport={'width':1000,'height':1000},device_scale_factor=2)
    for sid, mk, pf, ref in jobs:
        open('/tmp/r.html','w').write(pf(mk()))
        pg.goto('file:///tmp/r.html',wait_until='networkidle'); pg.wait_for_timeout(800)
        try: pg.wait_for_function('window.__fitted === undefined || window.__fitted === true',timeout=8000)
        except Exception: pass
        pg.wait_for_timeout(450)
        pg.screenshot(path='/tmp/r.png',clip={'x':0,'y':0,'width':1000,'height':1000})
        a=np.asarray(Image.open('/tmp/r.png').convert('RGB'),int)
        c=np.asarray(Image.open(ref).convert('RGB'),int)
        d=np.abs(a-c); ex=100*(d.max(2)==0).mean()
        (ok if ex>99.999 else diff).append((sid,ex,d.mean()))
    br.close()
print(f'bit-identical to the delivered artwork: {len(ok)}/30')
for sid,ex,mn in diff: print(f'  differs: {sid}  exact {ex:.4f}%  mean {mn:.4f}')
