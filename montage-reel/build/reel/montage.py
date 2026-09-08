"""Cold open and close: fast-cut fragments pulled from across all three products."""
import random, math
from PIL import Image
import editmap as E
from motion import Slide, DEPTH, SIZE, ease, eout, sample, place_sprite
import shots

ALL = [f'{p}_{n:02d}' for p in ('M2','M4','M6') for n in range(1, 11)]

def _plan(seed, halves, span):
    """Fragment list: (sid, n_halves) summing to `span` half-beats."""
    r = random.Random(seed)
    pool = ALL[:]; r.shuffle(pool)
    out, tot, i = [], 0, 0
    for n in halves:
        if tot + n > span: n = span - tot
        if n <= 0: break
        out.append((pool[i % len(pool)], n)); tot += n; i += 1
    if tot < span: out.append((pool[i % len(pool)], span - tot))
    return out

# cold open accelerates into the first full slide; the close decelerates and lands
COLD  = _plan(11, [2,2,2,2,1,1,1,1,1,1,1,1], 16)
CLOSE = _plan(29, [1,1,1,1,1,1,2,2,2,4], 16)
CLOSE[-1] = ('M6_10', CLOSE[-1][1])   # sign-off slide, held

def _frag_cam(seed, u):
    r = random.Random(seed)
    z0 = r.uniform(1.9, 3.1); z1 = z0 * r.uniform(1.06, 1.16)
    cx = r.uniform(0.22, 0.78); cy = r.uniform(0.22, 0.78)
    d  = r.uniform(-0.05, 0.05)
    e = eout(u, 1.6)
    return z0 + (z1-z0)*e, cx + d*e, cy - d*0.6*e

def fragment(sid, u, seed, size=None, wide=False):
    size = size or SIZE
    """A tight crop on one slide — a knob detail here, a headline fragment there."""
    S = Slide.get(sid)
    z, cx, cy = (1.34 - 0.30*eout(u, 2.2), 0.5, 0.5) if wide else _frag_cam(seed, u)
    c = Image.new('RGBA', (size, size), (12, 12, 14, 255))
    c.alpha_composite(sample(S.planes['bg'],  z, cx, cy, DEPTH['bg'],  size))
    c.alpha_composite(sample(S.planes['mid'], z, cx, cy, DEPTH['mid'], size))
    for i in [i for i in S.stick if S.sprites[i]['z'] < 17]:
        place_sprite(c, S.sprites[i], z, cx, cy, DEPTH['sprite'], size=size)
    c.alpha_composite(sample(S.planes['hero'], z, cx, cy, DEPTH['hero'], size))
    for i in S.head + [i for i in S.stick if S.sprites[i]['z'] >= 17]:
        place_sprite(c, S.sprites[i], z, cx, cy, DEPTH['sprite'], size=size)
    # the brand block travels with the artwork here too, so the closing beat
    # lands with Shivansh / MOTU / website / WhatsApp legible
    c.alpha_composite(sample(S.planes['brand'], z, cx, cy, DEPTH['brand'], size))
    return c

def sequence(which):
    """-> [(t0, t1, sid, seed, flash_in)] in absolute output seconds."""
    base = 0.0 if which == 'cold' else E.MOVE['close'][0]
    plan = COLD if which == 'cold' else CLOSE
    out, t = [], base
    for k, (sid, n) in enumerate(plan):
        out.append((t, t + n*E.HALF, sid, 1000 + k*7 + (0 if which=='cold' else 500),
                    which == 'cold' and k % 4 == 3 or which == 'close' and k % 5 == 4))
        t += n*E.HALF
    return out

def frame(t, which, size=None):
    size = size or SIZE
    seq = sequence(which)
    for (a, b, sid, seed, fl) in seq:
        if a <= t < b or (t >= seq[-1][1] and (a, b) == (seq[-1][0], seq[-1][1])):
            u = min(1.0, max(0.0, (t - a) / max(1e-6, b - a)))
            img = fragment(sid, u, seed, size, wide=(which=='close' and (a,b)==(seq[-1][0],seq[-1][1])))
            # colour flashes drawn from the collage's own palette, at act edges
            if fl and (t - a) < 0.066:
                from transitions import PALETTE
                return Image.new('RGBA', (size, size), PALETTE[seed % 3] + (255,))
            return img
    return fragment(seq[-1][2], 1.0, seq[-1][3], size, wide=(which=='close'))
