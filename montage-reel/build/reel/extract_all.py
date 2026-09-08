"""Build all 30 approved collage bodies and decompose each into planes + sprites."""
import sys, json, time, pathlib
sys.path.insert(0, '/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build')
sys.path.insert(0, '.')
import layers
from playwright.sync_api import sync_playwright
import slide as S, mcol, cbuild
import cspec_m2 as CM2, cspec_m4 as CM4

def m6_bodies():
    """The M6 collage set: slide01 builds at import, 02-10 are functions."""
    import slide01, s02, s0306, s0710
    out = {1: ''.join(slide01.b), 2: s02.build(),
           3: s0306.s03(), 4: s0306.s04(), 5: s0306.s05(), 6: s0306.s06(),
           7: s0710.s07(), 8: s0710.s08(), 9: s0710.s09(), 10: s0710.s10()}
    return out

def all_slides():
    jobs = []
    for n in range(1, 11):
        jobs.append((f'M2_{n:02d}', lambda n=n: cbuild.build(CM2.SLIDES[n-1], CM2.P), mcol.page))
    for n in range(1, 11):
        jobs.append((f'M4_{n:02d}', lambda n=n: cbuild.build(CM4.SLIDES[n-1], CM4.P), mcol.page))
    m6 = m6_bodies()
    for n in range(1, 11):
        jobs.append((f'M6_{n:02d}', lambda n=n: m6[n], S.page))
    return jobs

if __name__ == '__main__':
    only = sys.argv[1:] or None
    jobs = all_slides()
    if only: jobs = [j for j in jobs if j[0] in only]
    t0 = time.time(); index = {}
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=layers.CHROME,
                              args=['--force-color-profile=srgb','--font-render-hinting=none',
                                    '--disable-lcd-text'])
        pg = b.new_page(viewport={'width':1000,'height':1000}, device_scale_factor=layers.DSF)
        for sid, mk, pf in jobs:
            # NB: never clear slide._clips here. The M6 bodies register their
            # torn-edge clipPaths when they are built (slide01 does so at import),
            # and clearing afterwards silently strips every torn edge.
            body = mk()
            rec = layers.extract(sid, body, pf, pg)
            index[sid] = rec
            print(f'  {sid}: 4 planes + {len(rec["sprites"]):2d} sprites   '
                  f'({time.time()-t0:.0f}s)', flush=True)
        b.close()
    idx = pathlib.Path(layers.OUT) / 'index.json'
    old = json.loads(idx.read_text()) if idx.exists() else {}
    old.update(index); idx.write_text(json.dumps(old, indent=1))
    print(f'done in {time.time()-t0:.0f}s -> {len(old)} slides indexed')
