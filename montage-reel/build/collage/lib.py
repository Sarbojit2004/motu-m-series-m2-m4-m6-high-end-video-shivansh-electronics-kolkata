"""Procedural collage primitives: torn paper edges, grain, spray, halftone."""
import math, random, base64, io
from PIL import Image, ImageDraw, ImageFilter

# ---------------------------------------------------------------- palette
BLACK  = '#0C0C0E'
RED    = '#DE1A12'
YELLOW = '#F2DE31'
CREAM  = '#F0E8D8'

# ---------------------------------------------------------------- torn edges
def _fbm(rng, n, octaves=4, base=1.0):
    """Layered value noise -> organic 1-D displacement, length n."""
    out = [0.0]*n
    amp, freq = base, 1.5
    for _ in range(octaves):
        k = max(2, int(freq))
        ctrl = [rng.uniform(-1, 1) for _ in range(k+1)]
        for i in range(n):
            t = i/(n-1)*k
            a = int(t); b = min(a+1, k); f = t-a
            f = f*f*(3-2*f)                      # smoothstep
            out[i] += (ctrl[a]*(1-f)+ctrl[b]*f)*amp
        amp *= 0.48; freq *= 2.3
    return out

def torn_edge(seed, n=260, amp=26, octaves=5, fray=0.55):
    """Return list of (t, offset) along a normalised edge. Irregular, never periodic."""
    rng = random.Random(seed)
    base = _fbm(rng, n, octaves=octaves)
    pts = []
    for i in range(n):
        t = i/(n-1)
        o = base[i]*amp
        # sparse hard nicks + fibre spikes, so it reads as torn not wavy
        if rng.random() < 0.06:
            o += rng.uniform(-1, 1)*amp*fray*2.1
        if rng.random() < 0.16:
            o += rng.uniform(-1, 1)*amp*fray*0.75
        # taper the very ends so zones meet the frame cleanly
        e = min(t, 1-t)
        if e < 0.02: o *= e/0.02
        pts.append((t, o))
    return pts

def band_path(seed, y_frac, W, H, amp=26, above=True, n=260):
    """Closed path: a torn horizontal boundary at y_frac, filled up (above) or down."""
    pts = torn_edge(seed, n=n, amp=amp)
    y0 = y_frac*H
    d = [f'M 0 {y0+pts[0][1]:.2f}']
    for t, o in pts[1:]:
        d.append(f'L {t*W:.2f} {y0+o:.2f}')
    d.append(f'L {W} {0 if above else H} L 0 {0 if above else H} Z')
    return ' '.join(d)

def zone_path(seed_top, seed_bot, y_top, y_bot, W, H, amp_t=26, amp_b=26):
    """Closed path with torn top AND bottom edges."""
    top = torn_edge(seed_top, amp=amp_t)
    bot = torn_edge(seed_bot, amp=amp_b)
    d = [f'M 0 {y_top*H+top[0][1]:.2f}']
    for t, o in top[1:]:
        d.append(f'L {t*W:.2f} {y_top*H+o:.2f}')
    d.append(f'L {W} {y_bot*H+bot[-1][1]:.2f}')
    for t, o in reversed(bot[:-1]):
        d.append(f'L {t*W:.2f} {y_bot*H+o:.2f}')
    d.append('Z')
    return ' '.join(d)

def scrap_path(seed, w, h, amp=9, n=90):
    """Closed torn-on-all-sides rectangle path (for photo/logo scraps)."""
    rng = random.Random(seed)
    def side(s, n):
        return torn_edge(s, n=n, amp=amp, octaves=4)
    d = []
    top = side(seed*7+1, n); rig = side(seed*7+2, int(n*h/max(w,1))+8)
    bot = side(seed*7+3, n); lef = side(seed*7+4, int(n*h/max(w,1))+8)
    d.append(f'M 0 {top[0][1]:.2f}')
    for t,o in top[1:]:  d.append(f'L {t*w:.2f} {o:.2f}')
    for t,o in rig:      d.append(f'L {w+o:.2f} {t*h:.2f}')
    for t,o in reversed(bot): d.append(f'L {t*w:.2f} {h+o:.2f}')
    for t,o in reversed(lef): d.append(f'L {o:.2f} {t*h:.2f}')
    d.append('Z')
    return ' '.join(d)

# ---------------------------------------------------------------- textures
def _b64(im):
    b = io.BytesIO(); im.save(b, 'PNG')
    return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()

def grain(size=420, seed=7, strength=42):
    rng = random.Random(seed)
    im = Image.new('L', (size, size))
    im.putdata([rng.randint(0, 255) for _ in range(size*size)])
    im = im.filter(ImageFilter.GaussianBlur(0.4))
    out = Image.new('RGBA', (size, size))
    px = im.load(); op = out.load()
    for y in range(size):
        for x in range(size):
            v = px[x, y]
            op[x, y] = (v, v, v, strength)
    return _b64(out)

def spray(w=900, h=900, seed=3, n=5200, cx=0.5, cy=0.5, spread=0.42,
          colour=(0, 0, 0), rmin=0.6, rmax=3.4):
    """Aerosol dot scatter with gaussian density falloff + outlier flecks."""
    rng = random.Random(seed)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for _ in range(n):
        a = rng.uniform(0, math.tau)
        rad = abs(rng.gauss(0, spread))
        if rng.random() < 0.05: rad *= rng.uniform(1.4, 2.6)   # stray flecks
        if rad > 0.85: continue
        x = (cx+math.cos(a)*rad)*w; y = (cy+math.sin(a)*rad*0.86)*h
        r = rng.uniform(rmin, rmax)*(1.25-rad)
        if r <= 0: continue
        al = int(max(0, min(255, 235*(1-rad*0.95)*rng.uniform(0.35, 1.0))))
        d.ellipse([x-r, y-r, x+r, y+r], fill=colour+(al,))
    return _b64(im)

def halftone(w=600, h=600, seed=5, step=13, colour=(0, 0, 0), fade='x'):
    """Degrading dot grid — dots shrink across the axis, with jitter + dropouts."""
    rng = random.Random(seed)
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for gy in range(0, h, step):
        for gx in range(0, w, step):
            t = (gx/w) if fade == 'x' else (gy/h)
            r = (step*0.46)*(1-t)**1.35
            if r < 0.35 or rng.random() < 0.10+t*0.55: continue
            jx = rng.uniform(-1.1, 1.1); jy = rng.uniform(-1.1, 1.1)
            d.ellipse([gx+jx-r, gy+jy-r, gx+jx+r, gy+jy+r], fill=colour+(255,))
    return _b64(im)

def drips(w=520, h=340, seed=11, n=16, colour='#0C0C0E'):
    """Rough paint drips hanging off a torn bottom edge, as an SVG fragment."""
    rng = random.Random(seed)
    out = []
    for _ in range(n):
        x = rng.uniform(0.03, 0.97)*w
        ln = rng.uniform(0.10, 0.72)*h
        wd = rng.uniform(2.2, 9.0)
        bulge = rng.uniform(1.15, 2.0)
        out.append(
            f'<path d="M {x-wd/2:.1f} 0 '
            f'C {x-wd*bulge/2:.1f} {ln*0.62:.1f} {x-wd*bulge/2:.1f} {ln*0.80:.1f} {x:.1f} {ln:.1f} '
            f'C {x+wd*bulge/2:.1f} {ln*0.80:.1f} {x+wd*bulge/2:.1f} {ln*0.62:.1f} {x+wd/2:.1f} 0 Z" '
            f'fill="{colour}"/>')
        if rng.random() < 0.4:                       # detached droplet
            dy = ln+rng.uniform(5, 26); dr = wd*rng.uniform(0.28, 0.52)
            out.append(f'<circle cx="{x:.1f}" cy="{dy:.1f}" r="{dr:.1f}" fill="{colour}"/>')
    return ''.join(out)
