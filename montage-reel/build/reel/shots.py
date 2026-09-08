"""Per-shot choreography: gimbal camera, depth parallax, componentised build-ins."""
import math, random, numpy as np
from PIL import Image
import motion as MO
from motion import Slide, DEPTH, SIZE, ease, eout, ein, sample, place_sprite

# camera moves, rotated per shot so no two neighbours share one
MOVES = ['push', 'pull', 'pushL', 'pushR', 'driftUp', 'pushTight']

def cam(move, u, seed):
    """-> (zoom, cx, cy, rack) for progress u in 0..1."""
    r = random.Random(seed)
    ax, ay = r.uniform(0.40, 0.60), r.uniform(0.40, 0.60)
    if move == 'push':      z0, z1, c0, c1 = 1.05, 1.21, (0.50, 0.50), (ax, ay)
    elif move == 'pull':    z0, z1, c0, c1 = 1.26, 1.04, (ax, ay), (0.50, 0.50)
    elif move == 'pushL':   z0, z1, c0, c1 = 1.08, 1.24, (0.62, ay), (0.40, ay)
    elif move == 'pushR':   z0, z1, c0, c1 = 1.08, 1.24, (0.38, ay), (0.60, ay)
    elif move == 'driftUp': z0, z1, c0, c1 = 1.14, 1.19, (ax, 0.62), (ax, 0.40)
    else:                   z0, z1, c0, c1 = 1.18, 1.34, (ax, ay), (ax*0.9+0.05, ay*0.9+0.05)
    e = ease(u)
    z  = z0 + (z1 - z0) * e
    cx = c0[0] + (c1[0] - c0[0]) * e
    cy = c0[1] + (c1[1] - c0[1]) * e
    rack = max(0.0, 0.62 * (1 - eout(min(1.0, u / 0.42), 2.2)))   # focus lands early
    return z, cx, cy, rack

def handheld(t, seed):
    """Never perfectly locked off — a slow two-frequency drift on every plane."""
    r = random.Random(seed * 7 + 11)
    p1, p2 = r.uniform(0, 6.28), r.uniform(0, 6.28)
    dz = 0.0032 * math.sin(t * 0.83 + p1) + 0.0018 * math.sin(t * 1.71 + p2)
    dx = 5.5 * math.sin(t * 0.61 + p2) + 2.4 * math.sin(t * 1.43 + p1)
    dy = 4.2 * math.sin(t * 0.74 + p1) + 2.0 * math.sin(t * 1.19 + p2)
    return dz, dx, dy

def render_shot(sid, u, dur, seed, treatment, size=None):
    size = size or SIZE
    """One frame of one slide. u = 0..1 progress through the shot."""
    S = Slide.get(sid)
    move = MOVES[seed % len(MOVES)]
    z, cx, cy, rack = cam(move, u, seed)
    dz, hx, hy = handheld(u * dur, seed)
    z += dz
    t = u * dur

    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 255))
    canvas.alpha_composite(sample(S.planes['bg'], z, cx, cy, DEPTH['bg'], size,
                                  S.blur['bg'], rack * 1.0))
    canvas.alpha_composite(sample(S.planes['mid'], z, cx, cy, DEPTH['mid'], size,
                                  S.blur['mid'], rack * 0.55))
    # call-outs that sit behind the hero cut-out in the original stacking
    draw_sprites(canvas, S, [i for i in S.stick if S.sprites[i]['z'] < 17],
                 z, cx, cy, t, treatment, seed, size, hx, hy)
    canvas.alpha_composite(sample(S.planes['hero'], z, cx, cy, DEPTH['hero'], size))

    # headline rows: wipe-reveal across the alternating-case letterforms
    for k, i in enumerate(S.head):
        d0 = 0.10 + k * 0.17 if treatment == 'breakdown' else 0.02 + k * 0.07
        span = 0.52 if treatment == 'breakdown' else 0.30
        w = max(0.0, min(1.0, (t - d0) / span))
        if w <= 0: continue
        sc = 1.0 + 0.035 * (1 - eout(w, 2.4))
        place_sprite(canvas, S.sprites[i], z, cx, cy, DEPTH['sprite'],
                     scale=sc, alpha=1.0, dx=hx, dy=hy,
                     wipe=(eout(w, 1.8) if w < 1 else None), size=size)

    draw_sprites(canvas, S, [i for i in S.stick if S.sprites[i]['z'] >= 17],
                 z, cx, cy, t, treatment, seed, size, hx, hy)

    # the four permitted brand items: settle in, then a slow pulse — never static,
    # never illegible, and never doubled by an added overlay
    bz = 1.0 + (z - 1.0) * DEPTH['brand']
    ba = min(1.0, max(0.0, (t - 0.12) / 0.34))
    bpulse = 1.0 + 0.006 * math.sin(t * 1.9 + seed)
    bp = sample(S.planes['brand'], z * bpulse, cx, cy, DEPTH['brand'], size)
    if ba < 0.999:
        arr = np.asarray(bp.getchannel('A'), dtype=np.float32) * eout(ba, 2.0)
        bp.putalpha(Image.fromarray(arr.astype(np.uint8)))
    canvas.alpha_composite(bp)
    return canvas

def draw_sprites(canvas, S, idxs, z, cx, cy, t, treatment, seed, size, hx, hy):
    """Sticker call-outs stamped on one at a time, each with its own timing."""
    r = random.Random(seed * 13 + 5)
    for n, i in enumerate(idxs):
        base = 0.26 if treatment == 'breakdown' else 0.06
        step = 0.075 if treatment == 'breakdown' else 0.035
        d0 = base + n * step
        w = (t - d0) / 0.26
        if w <= 0: continue
        w = min(1.0, w)
        e = eout(w, 3.0)
        sc = 0.70 + 0.36 * e - 0.06 * math.sin(min(1.0, w) * math.pi)  # punch + settle
        place_sprite(canvas, S.sprites[i], z, cx, cy, DEPTH['sprite'],
                     scale=sc, alpha=min(1.0, w * 2.2), dx=hx, dy=hy, size=size)
