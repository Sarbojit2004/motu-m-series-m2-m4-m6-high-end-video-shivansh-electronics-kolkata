"""Report text fragments that the collage has buried — measured in the browser."""
import sys, pathlib, glob
from playwright.sync_api import sync_playwright
CHROME='/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
JS = """() => {
  const out = [];
  document.querySelectorAll('[data-frag]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) { out.push([el.dataset.frag, 0, Math.round(r.x), Math.round(r.y)]); return; }
    let vis = 0, tot = 0;
    for (let i = 1; i <= 7; i++) for (let j = 1; j <= 4; j++) {
      const x = r.x + r.width * i / 8, y = r.y + r.height * j / 5;
      if (x < 0 || y < 0 || x > 1000 || y > 1000) continue;
      tot++;
      let hit = document.elementFromPoint(x, y);
      while (hit && hit !== el) hit = hit.parentElement;
      if (hit === el) vis++;
    }
    out.push([el.dataset.frag, tot ? vis / tot : 0, Math.round(r.x), Math.round(r.y)]);
  });
  return out;
}"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=CHROME)
    pg = b.new_page(viewport={'width':1000,'height':1000})
    for f in sorted(glob.glob(sys.argv[1])):
        pg.goto(pathlib.Path(f).absolute().as_uri(), wait_until='networkidle')
        pg.wait_for_timeout(400)
        rows = pg.evaluate(JS)
        bad = [r for r in rows if r[1] < 0.42]
        if bad:
            print(f'--- {pathlib.Path(f).stem}')
            for t, v, x, y in bad:
                print(f'    {v:5.0%} visible  "{t[:38]}" @({x},{y})')
    b.close()
