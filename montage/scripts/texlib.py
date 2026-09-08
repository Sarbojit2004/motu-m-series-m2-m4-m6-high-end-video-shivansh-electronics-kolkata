"""Procedural texture primitives for the MOTU M-Series montage reel.

Everything the reel's paper world is made of is generated here: fractal value
noise, the crumpled-paper shading model, torn edges and the screenprint
halftone. No external texture assets are used, so the whole look is
regenerable from source.
"""
import numpy as np

def _grid_noise(h, w, cells, rng):
    """One octave of value noise: a random lattice, smoothly interpolated."""
    gh, gw = max(2, int(cells)), max(2, int(cells * w / h))
    g = rng.random((gh + 1, gw + 1)).astype(np.float32)
    ys = np.linspace(0, gh, h, endpoint=False, dtype=np.float32)
    xs = np.linspace(0, gw, w, endpoint=False, dtype=np.float32)
    y0 = np.floor(ys).astype(np.int32); x0 = np.floor(xs).astype(np.int32)
    fy = (ys - y0)[:, None]; fx = (xs - x0)[None, :]
    # smoothstep keeps the lattice from showing as a grid
    fy = fy * fy * (3 - 2 * fy); fx = fx * fx * (3 - 2 * fx)
    a = g[y0][:, x0]; b = g[y0][:, x0 + 1]
    c = g[y0 + 1][:, x0]; d = g[y0 + 1][:, x0 + 1]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


def fbm(h, w, octaves=6, cells=3, gain=0.5, lacunarity=2.0, seed=0):
    """Fractal Brownian motion, normalised to 0..1."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, c, tot = 1.0, float(cells), 0.0
    for _ in range(octaves):
        out += amp * _grid_noise(h, w, c, rng)
        tot += amp; amp *= gain; c *= lacunarity
    out /= tot
    return (out - out.min()) / (np.ptp(out) + 1e-9)


def shade(height, light=(-0.55, -0.62, 0.56), strength=1.0):
    """Lambert-shade a height field. Returns a multiplier around 1.0."""
    gy, gx = np.gradient(height.astype(np.float32))
    n = np.stack([-gx * strength, -gy * strength, np.ones_like(gx)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    l = np.array(light, np.float32); l /= np.linalg.norm(l)
    return np.clip((n @ l), 0, 1)


def crumpled_paper(h, w, seed=0, base=(233, 224, 211), creases=3,
                   contrast=1.0):
    """A sheet of warm paper: broad soft undulation, a few real folds, fibre."""
    rng = np.random.default_rng(seed)
    ref = min(h, w)
    # broad, gentle undulation - the sheet is laid flat, not balled up
    big = fbm(h, w, octaves=4, cells=2, gain=0.52, seed=seed)
    fine = fbm(h, w, octaves=3, cells=9, gain=0.45, seed=seed + 101)
    height = big * 1.0 + fine * 0.10

    # folds: a soft valley with a bright ridge alongside, the way creased
    # paper actually catches light
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    for i in range(creases):
        ang = rng.uniform(0, np.pi)
        cx, cy = rng.uniform(0.15, 0.85) * w, rng.uniform(0.15, 0.85) * h
        sd = (xx - cx) * np.sin(ang) - (yy - cy) * np.cos(ang)
        wob = fbm(h, w, octaves=3, cells=3, seed=seed + 200 + i) - 0.5
        sd = sd + wob * ref * 0.10
        wdt = ref * rng.uniform(0.018, 0.038)
        # odd function => valley on one side, ridge on the other
        height += (sd / wdt) * np.exp(-(sd / wdt) ** 2) * rng.uniform(0.045, 0.085)

    lam = shade(height, strength=ref * 0.020)
    lam = (lam - lam.mean()) / (lam.std() + 1e-6)
    lam = np.clip(1.0 + np.tanh(lam * 0.55) * 0.115 * contrast, 0.80, 1.15)

    # paper fibre: high-frequency, very low amplitude
    fib = rng.normal(0, 1, (h, w)).astype(np.float32)
    fib = (fib + np.roll(fib, 1, 1) + np.roll(fib, 1, 0)) / 3.0
    lam *= 1.0 + fib * 0.014

    rgb = np.array(base, np.float32)[None, None, :] * lam[..., None]
    return np.clip(rgb, 0, 255).astype(np.uint8)


def light_streaks(h, w, count=6, angle_deg=61, duty=0.46, depth=0.46,
                  softness=0.30, seed=3):
    """Venetian-blind shadow bands across the sheet. 0..1 multiplier map.

    Periodic rather than random, so the bands read as one light source
    through one blind - which is what the reference does.
    """
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = np.deg2rad(angle_deg)
    u = xx * np.cos(a) + yy * np.sin(a)
    u = (u - u.min()) / (np.ptp(u) + 1e-9)
    # wobble the band spacing slightly so it is not mechanical
    u = u + (fbm(h, w, octaves=3, cells=3, seed=seed + 11) - 0.5) * 0.035

    duty = duty * (1.0 + 0.22 * np.sin(u * 5.1 + 1.3))
    ph = (u * count) % 1.0
    # a shadow band occupying `duty` of each period, with soft shoulders:
    # flat-dark in the middle, ramped at both edges
    e = np.maximum(1e-3, softness * duty * 0.5)
    rise = np.clip(ph / e, 0, 1)
    fall = np.clip((duty - ph) / e, 0, 1)
    band = np.clip(np.minimum(rise, fall), 0, 1)
    band = band * band * (3 - 2 * band)          # smoothstep the shoulders
    m = 1.0 - band * depth

    # one wide soft falloff so a corner reads as directly lit
    m *= 1.0 - 0.20 * u
    m *= 1.0 + (fbm(h, w, octaves=3, cells=5, seed=seed + 7) - 0.5) * 0.06
    return np.clip(m, 0.28, 1.14).astype(np.float32)


def torn_edge_mask(h, w, sides=(1, 1, 1, 1), amp=0.030, seed=0, feather=1.4):
    """Alpha mask with ripped paper edges on the chosen sides.

    sides = (top, right, bottom, left); 0 leaves that edge clean-cut.
    """
    m = np.ones((h, w), np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ref = min(h, w)
    for k, on in enumerate(sides):
        if not on:
            continue
        n = fbm(h, w, octaves=5, cells=3, gain=0.55, seed=seed * 17 + k * 991)
        # sample the noise along the edge so the tear varies down its length
        prof = n[:, 0] if k in (1, 3) else n[0, :]
        prof = (prof - prof.mean())
        prof = prof / (np.abs(prof).max() + 1e-9)
        d = prof * amp * ref
        if k == 0:   edge = yy - (d[None, :] + amp * ref * 0.55)
        elif k == 1: edge = (w - 1 - xx) - (d[:, None] + amp * ref * 0.55)
        elif k == 2: edge = (h - 1 - yy) - (d[None, :] + amp * ref * 0.55)
        else:        edge = xx - (d[:, None] + amp * ref * 0.55)
        m = np.minimum(m, np.clip(edge / feather, 0, 1))
    # fibrous fray right at the cut
    fray = fbm(h, w, octaves=4, cells=40, seed=seed + 55)
    band = (m > 0.02) & (m < 0.75)
    m[band] = np.clip(m[band] * (0.55 + 0.9 * fray[band]), 0, 1)
    return m


def halftone(lum, period=7.0, angle_deg=22.0, seed=0):
    """Rotated dot screen. Returns the 0..1 threshold field for `lum`."""
    h, w = lum.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = np.deg2rad(angle_deg)
    u = (xx * np.cos(a) - yy * np.sin(a)) * (2 * np.pi / period)
    v = (xx * np.sin(a) + yy * np.cos(a)) * (2 * np.pi / period)
    d = (np.cos(u) * np.cos(v) + 1.0) * 0.5      # 0..1, peaks at dot centres
    return d


# --------------------------------------------------------------------------
# Screenprint conversion
# --------------------------------------------------------------------------

def _srgb_lum(img):
    a = img.astype(np.float32) / 255.0
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def _unsharp(a, radius=9, amount=0.55):
    """Cheap separable box blur used as an unsharp mask on luminance."""
    k = np.ones(radius, np.float32) / radius
    b = np.apply_along_axis(lambda r: np.convolve(r, k, 'same'), 1, a)
    b = np.apply_along_axis(lambda c: np.convolve(c, k, 'same'), 0, b)
    return np.clip(a + (a - b) * amount, 0, 1)


def screenprint(img, levels=4, period=8.0, angle=22.0, gamma=1.0,
                black=0.10, white=0.92, local=0.55, seed=0):
    """Posterise + dot-screen an RGB photo into a screenprint tone field.

    Returns a float 0..1 map with `levels` discrete steps, dithered through a
    rotated halftone dot so tone transitions read as printed dots rather than
    hard bands.
    """
    t = _srgb_lum(img)
    if local > 0:
        t = _unsharp(t, radius=max(3, int(min(img.shape[:2]) * 0.012) | 1),
                     amount=local)
    # levels stretch, then gamma
    t = np.clip((t - black) / max(1e-3, (white - black)), 0, 1) ** gamma
    d = halftone(t, period=period, angle_deg=angle, seed=seed)
    scaled = t * (levels - 1)
    lo = np.floor(scaled)
    frac = scaled - lo
    idx = np.clip(lo + (frac > d), 0, levels - 1)
    return (idx / (levels - 1)).astype(np.float32)


def tone_map(field, ramp):
    """Map a 0..1 tone field through a list of RGB stops (dark -> light)."""
    ramp = np.array(ramp, np.float32)
    n = len(ramp) - 1
    x = np.clip(field, 0, 1) * n
    i = np.clip(np.floor(x).astype(np.int32), 0, n - 1)
    f = (x - i)[..., None]
    return np.clip(ramp[i] * (1 - f) + ramp[i + 1] * f, 0, 255).astype(np.uint8)
