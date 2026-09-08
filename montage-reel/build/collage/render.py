"""Headless Chromium renderer with explicit viewport + DPR."""
import sys, pathlib
from playwright.sync_api import sync_playwright

CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

def render(html_path, out_path, css_px=1000, dpr=2):
    url = pathlib.Path(html_path).absolute().as_uri()
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME, args=['--force-color-profile=srgb',
                                                            '--font-render-hinting=none',
                                                            '--disable-lcd-text'])
        pg = b.new_page(viewport={'width': css_px, 'height': css_px},
                        device_scale_factor=dpr)
        pg.goto(url, wait_until='networkidle')
        pg.wait_for_timeout(700)
        pg.evaluate("document.fonts ? document.fonts.ready : Promise.resolve()")
        try:
            pg.wait_for_function('window.__fitted === undefined || window.__fitted === true',
                                 timeout=8000)
        except Exception:
            pass
        pg.wait_for_timeout(450)
        pg.screenshot(path=out_path, clip={'x':0,'y':0,'width':css_px,'height':css_px})
        b.close()
    return out_path

if __name__ == '__main__':
    render(sys.argv[1], sys.argv[2],
           int(sys.argv[3]) if len(sys.argv) > 3 else 1000,
           int(sys.argv[4]) if len(sys.argv) > 4 else 2)
