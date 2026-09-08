"""Six transition types, rotated so consecutive cuts never repeat.
'tear' leans on the source material's own torn-paper identity — the signature move."""
import sys, math, random, numpy as np
sys.path.insert(0,'/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build')
from PIL import Image, ImageFilter
import lib
from motion import SIZE, ease, eout, ein

PALETTE = [(222, 26, 18), (242, 222, 49), (12, 12, 14), (240, 232, 216)]
FRAMES = dict(cut=0, flash=3, whip=6, push=8, punch=6, tear=9)

def _smear(im, dx, shift, steps=9):
    """Directional motion blur + slide, on an edge-replicated buffer so the
    frame can never expose empty picture during the whip."""
    a = np.asarray(im.convert('RGB'), np.float32)
    h, w, _ = a.shape
    pad = int(abs(dx)/2) + int(abs(shift)) + 2
    p = np.pad(a, ((0,0), (pad,pad), (0,0)), mode='edge')
    acc = np.zeros_like(a)
    for i in range(steps):
        f = (i/(steps-1) - 0.5) * dx + shift
        o = pad + int(round(f))
        acc += p[:, o:o+w, :]
    return Image.fromarray(np.clip(acc/steps, 0, 255).astype(np.uint8), 'RGB').convert('RGBA')

def _zoom(im, k, size=None):
    size = size or im.width
    if abs(k-1) < 1e-4: return im
    if k > 1:
        w = size / k; o = (size - w) / 2
        return im.resize((size, size), Image.BILINEAR, box=(o, o, o+w, o+w))
    n = max(2, int(round(size * k)))
    small = im.resize((n, n), Image.BILINEAR)
    out = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    out.paste(small, ((size-n)//2, (size-n)//2))
    return out

def _fade(im, a):
    if a >= 0.999: return im
    arr = np.asarray(im.getchannel('A'), np.float32) * max(0.0, a)
    out = im.copy(); out.putalpha(Image.fromarray(arr.astype(np.uint8))); return out

_tearcache = {}
def tear_mask(seed, u, size):
    """An animated torn-paper edge sweeping across frame — built with the same
    fBm torn-edge generator that cut the collage's own paper."""
    key = (seed, size)
    if key not in _tearcache:
        pts = lib.torn_edge(seed, n=size, amp=size*0.085, octaves=5, fray=0.7)
        _tearcache[key] = np.array([o for _, o in pts], np.float32)
    off = _tearcache[key]
    x = np.arange(size, dtype=np.float32)[None, :]
    edge = (u * (size * 1.16) - size * 0.08) + off[:, None]
    m = np.clip((edge - x) / (size * 0.012), 0, 1)
    return m

def apply(kind, a, b, u, seed, size=None):
    size = size or a.width
    """a = outgoing frame, b = incoming frame, u = 0..1 through the transition."""
    if kind == 'cut':
        return b
    if kind == 'flash':
        col = PALETTE[seed % 2]   # red or yellow only
        if u < 0.62:
            return Image.new('RGBA', (size, size), col + (255,))
        return b
    if kind == 'whip':
        sgn = 1 if seed % 2 else -1
        first = u < 0.5
        v = (u/0.5) if first else (1 - (u-0.5)/0.5)
        src = _zoom(a if first else b, 1.20, size)
        sh  = sgn * size * 0.10 * v * (1 if first else -1)
        return _smear(src, sgn * size * 0.13 * v, sh)
    if kind == 'push':
        # gimbal pushes all the way into the outgoing frame; the incoming frame
        # is already there at matching scale, waiting
        base = Image.new('RGBA', (size, size), (12, 12, 14, 255))
        base.alpha_composite(_zoom(b, 1.0 + 0.42 * (1 - eout(u, 2.2))))
        base.alpha_composite(_fade(_zoom(a, 1.0 + 1.25 * ein(u, 1.7)), 1 - ease(u)**1.4))
        return base
    if kind == 'punch':
        base = Image.new('RGBA', (size, size), (12, 12, 14, 255))
        base.alpha_composite(_zoom(b, 0.74 + 0.26 * eout(u, 2.6)))
        base.alpha_composite(_fade(_zoom(a, 1.0 + 0.34 * ein(u, 1.4)), 1 - ease(u)**1.2))
        return base
    if kind == 'tear':
        m = tear_mask(seed * 17 + 3, ease(u), size)
        arr_a = np.asarray(a.convert('RGBA'), np.float32)
        arr_b = np.asarray(b.convert('RGBA'), np.float32)
        mm = m[:, :, None]
        out = arr_a * (1 - mm) + arr_b * mm
        # a bright torn lip travelling with the edge, as if paper is lifting
        lip = np.clip(1 - np.abs(m - 0.5) * 4.2, 0, 1)[:, :, None]
        out = out * (1 - lip * 0.78) + np.array(PALETTE[3] + (255,), np.float32) * (lip * 0.78)
        return Image.fromarray(out.astype(np.uint8), 'RGBA')
    return b
