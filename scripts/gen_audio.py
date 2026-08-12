#!/usr/bin/env python3
"""Synthesises every audio asset for the two MOTU M-Series reels.

Nothing here calls an external service. The constant ambient bed, both music
beds and the whole SFX palette are generated from scratch with numpy/scipy
(biquad filters, envelopes, comb-filter reverb, stereo widening), then encoded
to MP3 with ffmpeg. Run this BEFORE any scene code references a cue name:

    python3 scripts/gen_audio.py
    python3 scripts/audit_audio.py

SONIC IDENTITY — creative brief Section 10.
The brief asks for warm analog-style synthesizers, crisp tight modern drum
programming and a subtle driving bassline: "accessible-but-premium", "modern
sophisticated electronic", explicitly NOT orchestral and NOT aggressive rock.
It should sound like a track a skilled user might actually produce on the
bundled Ableton Live Lite.

Both parts share one key, one tempo and one instrument set so the series reads
as a single score — which is also the sonic expression of the "same engine"
thesis. Only the energy contour and the layering differ: Part 2 opens already
at beat level, runs wider in stereo and adds a brighter arpeggio and a
counter-melody, mirroring the hardware's scale-up from 2 to 6 channels.

TEMPO GRID. 120 BPM in 4/4 puts a bar at exactly 2.000 s = 60 frames at
30 fps, so 88 s is exactly 44 bars and every scene boundary in theme.ts can be
reasoned about musically. Key is A minor.

THREE LAYERS, per prompt Section 8a:
  1. ambient-reel.mp3   — one continuous 88 s texture, under every frame
  2. music-bed-partN.mp3 — the arrangement above it
  3. ~20 transition cues — deliberate and weighted, not rapid-cut hits
"""
import math
import os
import shutil
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import lfilter

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRATCH = os.environ.get(
    "MOTU_WAV_DIR",
    "/tmp/claude-0/-home-user/1ebd8a10-3c8a-5fca-8208-110fbd88c7a6/scratchpad/motu_wav",
)
os.makedirs(SCRATCH, exist_ok=True)

SFX_DIR = os.path.join(ROOT, "public", "audio", "sfx")
VO_DIR = os.path.join(ROOT, "public", "vo")
os.makedirs(SFX_DIR, exist_ok=True)
os.makedirs(VO_DIR, exist_ok=True)

# 88.000 s exactly — the frame contract for both reels (2640 frames @ 30 fps).
REEL_SECONDS = 88.0
BPM = 120.0
BEAT = 60.0 / BPM          # 0.500 s
BAR = BEAT * 4             # 2.000 s
BARS = int(round(REEL_SECONDS / BAR))  # 44

rng = np.random.default_rng(6294)  # M6 / M2 / M4 -> deterministic seed


def find_bin(name: str) -> str:
    env = os.environ.get(name.upper() + "_BIN")
    if env and os.path.exists(env):
        return env
    which = shutil.which(name)
    if which:
        return which
    pkg = "@ffmpeg-installer" if name == "ffmpeg" else "@ffprobe-installer"
    p = os.path.join(ROOT, "node_modules", pkg, "linux-x64", name)
    if os.path.exists(p):
        return p
    raise SystemExit(f"{name} not found; set {name.upper()}_BIN")


FFMPEG = find_bin("ffmpeg")


# ---------------------------------------------------------------------------
# DSP helpers
# ---------------------------------------------------------------------------
def t(n):
    return np.arange(n) / SR


def noise(n):
    return rng.standard_normal(n)


def _bq(fc, q, kind):
    fc = float(np.clip(fc, 20.0, SR / 2 * 0.97))
    w = 2 * math.pi * fc / SR
    al = math.sin(w) / (2 * q)
    c = math.cos(w)
    a0 = 1 + al
    if kind == "lp":
        b = [(1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0]
    elif kind == "hp":
        b = [(1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0]
    else:
        b = [al / a0, 0.0, -al / a0]
    return b, [1.0, -2 * c / a0, (1 - al) / a0]


def lpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "lp")
    return lfilter(b, a, x)


def hpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "hp")
    return lfilter(b, a, x)


def bpf(x, fc, q=2.0):
    b, a = _bq(fc, q, "bp")
    return lfilter(b, a, x)


def expd(n, tau):
    return np.exp(-t(n) / tau)


def sine(f, n, phase=0.0):
    if np.isscalar(f):
        f = np.full(n, float(f))
    return np.sin(2 * np.pi * np.cumsum(f / SR) + phase)


def saw(f, n, partials=12, det=0.0):
    """Band-limited-ish saw. `det` smears partial phase for analog drift."""
    if np.isscalar(f):
        f = np.full(n, float(f))
    ph = np.cumsum(f / SR)
    o = np.zeros(n)
    for k in range(1, partials + 1):
        o += np.sin(2 * np.pi * k * (ph + det * k * 0.0009)) / k
    return o * 0.5


def square(f, n, partials=9):
    if np.isscalar(f):
        f = np.full(n, float(f))
    ph = np.cumsum(f / SR)
    o = np.zeros(n)
    for k in range(1, partials * 2, 2):
        o += np.sin(2 * np.pi * k * ph) / k
    return o * 0.62


def tri(f, n):
    if np.isscalar(f):
        f = np.full(n, float(f))
    ph = np.cumsum(f / SR)
    o = np.zeros(n)
    for k in range(1, 9, 2):
        o += ((-1) ** ((k - 1) // 2)) * np.sin(2 * np.pi * k * ph) / (k * k)
    return o * 0.8


def sweep_bpf(x, f0, f1, q=1.1, block=512):
    """Time-varying bandpass, evaluated blockwise. Used for whooshes/risers."""
    n = len(x)
    f = np.linspace(f0, f1, n)
    y = np.zeros(n)
    for i in range(0, n, block):
        s = slice(i, min(i + block, n))
        y[s] = bpf(x[s], float(f[i]), q)
    return y


def moving_lpf(x, f0, f1, q=0.9, block=1024):
    """Slowly opening/closing lowpass — the analog filter-sweep character."""
    n = len(x)
    f = np.linspace(f0, f1, n)
    y = np.zeros(n)
    for i in range(0, n, block):
        s = slice(i, min(i + block, n))
        y[s] = lpf(x[s], float(f[i]), q)
    return y


def comb_verb(x, taps=((0.0297, 0.42), (0.0371, 0.36), (0.0411, 0.31), (0.0537, 0.26)), wet=0.34):
    y = np.zeros_like(x)
    for d, g in taps:
        di = int(d * SR)
        if di >= len(x):
            continue
        buf = np.zeros_like(x)
        buf[di:] = x[:-di]
        y += lfilter([g], [1.0, -g * 0.62], buf)
    y = lpf(y, 5200)
    return x * (1 - wet) + y * (wet / max(1, len(taps)) * 2.2)


def stereo(x, width=0.22, pre=0.010):
    d = int(pre * SR)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x.copy()
    return np.stack(
        [x * (1 - width * 0.5) + r * width * 0.5, r * (1 - width * 0.5) + x * width * 0.5], 1
    )


def fade(x, inS=0.004, outS=0.02):
    n = len(x)
    a = min(int(inS * SR), n)
    b = min(int(outS * SR), n)
    if a:
        x[:a] *= np.linspace(0, 1, a)
    if b:
        x[-b:] *= np.linspace(1, 0, b)
    return x


def wr(name, x):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = np.clip(x, -1, 1)
    d = (x * 32767).astype("<i2")
    p = os.path.join(SCRATCH, name + ".wav")
    with wave.open(p, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(d.tobytes())
    return p


def sfx(name, x, norm=0.86, width=0.22):
    x = np.asarray(x, dtype=float)
    if x.ndim == 1:
        x = fade(x.copy())
        m = np.abs(x).max()
        if m > 0:
            x = x / m * norm
        x = stereo(x, width)
    else:
        m = np.abs(x).max()
        if m > 0:
            x = x / m * norm
    wr(name, x)
    return name


# ---------------------------------------------------------------------------
# SFX PALETTE
#
# Every cue is designed for this project's DELIBERATE pace (prompt Section 8a):
# the reels cut roughly every 6-7 s rather than Sonicview's rapid montage, so a
# transition gets a weighted, resolving sound with a real tail instead of a
# clipped rapid-cut tick.
# ---------------------------------------------------------------------------
def build_sfx():
    names = []

    # -- the shared-DAC chip stamp -------------------------------------------
    # Crystalline metallic strike + inharmonic ring + sub seat. This is the
    # signature cue of the series: it fires whenever the ESS Sabre32 motif
    # stamps onto a chassis, so it must feel precise and engineered.
    n = int(1.9 * SR)
    x = np.zeros(n)
    for fr, g, tau in ((2340.0, 1.0, 0.055), (3510.0, 0.55, 0.040), (4680.0, 0.32, 0.028)):
        x += sine(fr, n) * expd(n, tau) * g
    ring = np.zeros(n)
    for fr, g in ((1170.0, 0.5), (1755.0, 0.30), (2632.0, 0.18)):
        ring += sine(fr, n) * expd(n, 0.42) * g
    x = x * 0.9 + ring
    x += bpf(noise(n), 5200, 1.6) * expd(n, 0.012) * 0.5
    x += sine(np.linspace(96, 58, n), n) * expd(n, 0.16) * 0.75
    names.append(sfx("chip-stamp", comb_verb(x, wet=0.30), 0.90, width=0.24))

    # -- LCD meter bloom -----------------------------------------------------
    # Meters coming alive: a rising cluster of warm bells. A-minor triad plus
    # the ninth, so it sits inside the score's key.
    n = int(2.3 * SR)
    x = np.zeros(n)
    for i, (fr, g) in enumerate(((440.0, 1.0), (523.25, 0.7), (659.25, 0.55), (880.0, 0.4), (987.77, 0.24))):
        d = int(i * 0.052 * SR)
        seg = n - d
        v = (sine(fr, seg) + sine(fr * 2.001, seg) * 0.32) * expd(seg, 0.50 - i * 0.05) * g
        x[d:] += v
    x = hpf(x, 180)
    names.append(sfx("meter-bloom", comb_verb(x, wet=0.36), 0.74, width=0.32))

    # -- mix-knob detents ----------------------------------------------------
    # The M4/M6 Input Monitor Mix pot. Seven small mechanical detents with a
    # faint metallic body — the tactile-engagement beat's sound.
    n = int(0.86 * SR)
    x = np.zeros(n)
    for i in range(7):
        d = int((0.028 + i * 0.088) * SR)
        if d >= n:
            break
        seg = n - d
        c = bpf(noise(seg), 2300 + i * 130, 5.5) * expd(seg, 0.006)
        c += sine(1450 + i * 90, seg) * expd(seg, 0.004) * 0.4
        x[d:] += c * (1.0 - i * 0.07)
    x += bpf(noise(n), 620, 3.0) * expd(n, 0.020) * 0.28
    names.append(sfx("knob-detent", x, 0.72, width=0.14))

    # -- 48V phantom-power button -------------------------------------------
    n = int(0.22 * SR)
    x = bpf(noise(n), 2900, 4.5) * expd(n, 0.0075)
    x += sine(1750, n) * expd(n, 0.005) * 0.45
    x += sine(128, n) * expd(n, 0.028) * 0.55          # body
    tick = np.zeros(n)
    o = int(0.030 * SR)
    tick[o:] = bpf(noise(n - o), 6200, 6.0) * expd(n - o, 0.0035) * 0.5   # electrical
    names.append(sfx("phantom-click", x + tick, 0.70, width=0.10))

    # -- XLR/TRS jack seating ------------------------------------------------
    n = int(0.44 * SR)
    x = bpf(noise(n), 1400, 1.2) * np.concatenate(
        [np.linspace(0.1, 1.0, int(n * 0.5)), np.linspace(1.0, 0.2, n - int(n * 0.5))]
    ) * 0.5
    seat = np.zeros(n)
    s0 = int(n * 0.58)
    seat[s0:] = bpf(noise(n - s0), 760, 3.4) * expd(n - s0, 0.013) * 1.5
    seat[s0:] += sine(142, n - s0) * expd(n - s0, 0.032) * 0.9
    names.append(sfx("jack-seat", x + seat, 0.80, width=0.16))

    # -- lateral I/O expansion slide-pan ------------------------------------
    # The brief's "I/O Expansion Slide": the camera travels further to take in
    # more connectivity, so this is LONG and weighted with a doppler centre.
    n = int(1.35 * SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.25
    air = sweep_bpf(noise(n), 420, 4200, q=0.85) * env
    body = sweep_bpf(noise(n), 180, 900, q=1.4) * env * 0.7
    dop = sine(np.concatenate([np.linspace(150, 210, n // 2), np.linspace(210, 130, n - n // 2)]), n)
    x = air * 0.62 + body + dop * env * 0.28
    names.append(sfx("slide-pan", comb_verb(hpf(x, 120), wet=0.22), 0.78, width=0.42))

    # -- CV / modular voltage line ------------------------------------------
    # DC-coupled TRS out driving Eurorack: a bipolar, slightly buzzy voltage
    # stepping up through a scale, deliberately more "electrical" than musical.
    n = int(1.25 * SR)
    steps = [110.0, 146.83, 164.81, 220.0, 246.94]
    x = np.zeros(n)
    per = n // len(steps)
    for i, fr in enumerate(steps):
        a, b = i * per, min((i + 1) * per, n)
        seg = b - a
        v = square(fr, seg, partials=7) * 0.5 + saw(fr * 2, seg, partials=6) * 0.2
        x[a:b] += v * np.concatenate(
            [np.linspace(0, 1, int(seg * 0.08)), np.ones(seg - int(seg * 0.08))]
        ) * expd(seg, 0.13)
    x = moving_lpf(x, 900, 3200) + bpf(noise(n), 3000, 2.0) * expd(n, 0.02) * 0.15
    names.append(sfx("voltage-line", x, 0.70, width=0.20))

    # -- slow macro push-in -------------------------------------------------
    n = int(2.0 * SR)
    env = np.sin(np.linspace(0, np.pi * 0.88, n)) ** 1.6
    x = saw(np.full(n, 110.0), n, partials=14, det=0.55) * 0.5
    x += saw(np.full(n, 164.81), n, partials=12, det=-0.45) * 0.32
    x = moving_lpf(x, 240, 2600)
    x += bpf(noise(n), 3800, 0.8) * env * 0.14
    names.append(sfx("push-in", comb_verb(x * env, wet=0.32), 0.68, width=0.30))

    # -- soft scene-opening air --------------------------------------------
    n = int(1.1 * SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.4
    x = sweep_bpf(noise(n), 900, 3000, q=0.7) * env * 0.6
    x += sine(220.0, n) * env * expd(n, 0.5) * 0.18
    names.append(sfx("air-open", x, 0.52, width=0.36))

    # -- deep impact (hero reveal) ------------------------------------------
    n = int(1.7 * SR)
    f = np.concatenate([np.linspace(118, 41, int(0.17 * SR)), np.full(n - int(0.17 * SR), 41)])
    x = sine(f, n) * expd(n, 0.36)
    x += sine(f * 2, n) * expd(n, 0.12) * 0.32
    x += lpf(noise(n), 860) * expd(n, 0.05) * 0.45
    names.append(sfx("impact-deep", comb_verb(x, wet=0.20), 0.92, width=0.16))

    # -- soft impact (beat accent) ------------------------------------------
    n = int(0.62 * SR)
    x = sine(np.linspace(235, 110, n), n) * expd(n, 0.115)
    x += bpf(noise(n), 1900, 2.0) * expd(n, 0.018) * 0.4
    names.append(sfx("impact-soft", x, 0.70))

    # -- sub bloom -----------------------------------------------------------
    n = int(1.8 * SR)
    x = sine(np.exp(np.linspace(math.log(132), math.log(36), n)), n) * expd(n, 0.44)
    x += sine(55.0, n) * expd(n, 0.6) * 0.4
    names.append(sfx("sub-bloom", x, 0.90, width=0.06))

    # -- warm analog riser ---------------------------------------------------
    n = int(1.9 * SR)
    env = np.linspace(0, 1, n) ** 1.9
    f = np.exp(np.linspace(math.log(165), math.log(1760), n))
    x = saw(f, n, partials=10, det=0.4) * 0.45
    x += bpf(noise(n), 2800, 0.8) * 0.3
    trem = 0.74 + 0.26 * np.sin(2 * np.pi * np.cumsum(np.linspace(4, 22, n)) / SR)
    names.append(sfx("riser-warm", hpf(x * env * trem, 150), 0.70, width=0.38))

    # -- reverse swell (pre-cut lift) ---------------------------------------
    n = int(0.95 * SR)
    env = np.linspace(0, 1, n) ** 2.5
    x = sweep_bpf(noise(n), 700, 4600, q=1.2) * env
    x += saw(np.linspace(220, 440, n), n, partials=8, det=0.3) * env * 0.25
    names.append(sfx("reverse-swell", x, 0.64, width=0.36))

    # -- latency clock ticks (the 2.5 ms motif) -----------------------------
    for nm, fc, dur, q in (("tick", 3100, 0.052, 5.2), ("tick-hi", 6200, 0.038, 6.6)):
        n = int(dur * SR)
        x = bpf(noise(n), fc, q) * expd(n, dur * 0.22)
        x += sine(fc * 1.5, n) * expd(n, dur * 0.10) * 0.34
        names.append(sfx(nm, x, 0.60, width=0.10))

    # -- I/O bar step (2 -> 4 -> 6) -----------------------------------------
    n = int(0.34 * SR)
    x = sine(np.linspace(520, 760, n), n) * expd(n, 0.055)
    x += sine(1040, n) * expd(n, 0.022) * 0.35
    x += bpf(noise(n), 2200, 3.0) * expd(n, 0.008) * 0.3
    names.append(sfx("count-tick", x, 0.62, width=0.16))

    # -- spec-callout latch --------------------------------------------------
    n = int(0.26 * SR)
    x = bpf(noise(n), 1900, 3.6) * expd(n, 0.009)
    x += sine(660, n) * expd(n, 0.030) * 0.45
    x += sine(330, n) * expd(n, 0.045) * 0.3
    names.append(sfx("latch", x, 0.62, width=0.12))

    # -- warm shimmer (CTA lift) --------------------------------------------
    n = int(2.4 * SR)
    x = np.zeros(n)
    for k, g in ((1318.51, 1.0), (1760.0, 0.68), (2637.02, 0.46), (3520.0, 0.28)):
        x += sine(k, n) * g
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * 5.2 * t(n))
    env = np.sin(np.linspace(0, np.pi * 0.95, n)) ** 1.3
    names.append(sfx("shimmer-warm", comb_verb(x * env * trem * 0.3, wet=0.44), 0.58, width=0.42))

    # -- final chime (close of series) --------------------------------------
    n = int(3.0 * SR)
    x = np.zeros(n)
    # A minor add9 spread — resolves the score
    for i, (fr, g) in enumerate(((220.0, 0.9), (329.63, 0.75), (440.0, 0.6), (659.25, 0.45), (987.77, 0.3))):
        d = int(i * 0.075 * SR)
        seg = n - d
        v = (sine(fr, seg) + sine(fr * 2.002, seg) * 0.3 + sine(fr * 3, seg) * 0.12) * expd(seg, 0.85) * g
        x[d:] += v
    x += sine(110.0, n) * expd(n, 0.5) * 0.35
    names.append(sfx("chime-final", comb_verb(hpf(x, 120), wet=0.40), 0.80, width=0.34))

    return names


# ---------------------------------------------------------------------------
# CONSTANT AMBIENT BED
#
# Prompt Section 8a requires a continuous, subtle texture under the ENTIRE
# runtime of both reels — not silence between transition cues. This is that
# layer: quiet studio air, a slow evolving low drone in the score's key, and
# sparse distant shimmer. It is deliberately low-level but genuinely present.
# ---------------------------------------------------------------------------
def build_ambient():
    n = int(REEL_SECONDS * SR)
    tt = t(n)

    # room air — filtered noise with a very slow spectral drift
    air = noise(n)
    air = lpf(hpf(air, 220), 2600) * 0.10
    air *= 0.72 + 0.28 * np.sin(2 * np.pi * 0.021 * tt + 0.6)

    # low drone: A1 + E2 + A2, detuned, slowly breathing filter
    drone = np.zeros(n)
    for fr, g, det in ((55.0, 1.0, 0.0), (82.41, 0.5, 0.14), (110.0, 0.38, -0.10)):
        drone += saw(np.full(n, fr * (1 + det * 0.0009)), n, partials=8, det=det) * g
    drone = moving_lpf(drone, 190, 430, q=0.8) * 0.10
    drone *= 0.68 + 0.32 * np.sin(2 * np.pi * 0.0135 * tt)

    # sparse high shimmer — one soft bell every ~5.5 s, alternating pitch
    shim = np.zeros(n)
    for i in range(16):
        at = int((1.8 + i * 5.4) * SR)
        if at >= n:
            break
        seg = min(int(3.0 * SR), n - at)
        fr = (1318.51, 1760.0, 2093.0, 1567.98)[i % 4]
        v = (sine(fr, seg) + sine(fr * 2.001, seg) * 0.25) * expd(seg, 0.75) * 0.055
        shim[at:at + seg] += v

    x = air + drone + comb_verb(shim, wet=0.5)
    x = hpf(x, 34)

    # gentle top/tail so a loop or a hard cut never clicks
    ramp = int(1.2 * SR)
    x[:ramp] *= np.linspace(0, 1, ramp)
    x[-ramp:] *= np.linspace(1, 0.55, ramp)

    st = stereo(x, width=0.5, pre=0.017)
    m = np.abs(st).max()
    if m > 0:
        st = st / m * 0.52
    wr("ambient-reel", st)
    return "ambient-reel"


# ---------------------------------------------------------------------------
# MUSIC BEDS
#
# 44 bars at 120 BPM, A minor. Same instrumentation for both parts; Part 2
# starts already at beat level, runs wider and adds a brighter arp plus a
# counter-melody. Brief Section 10's "dynamic progression".
# ---------------------------------------------------------------------------
NBARS = BARS
SPB = int(round(BAR * SR))          # samples per bar
NTOT = int(REEL_SECONDS * SR)

# A natural minor scale degrees, in Hz (A2..)
A_MIN = [110.00, 123.47, 130.81, 146.83, 164.81, 174.61, 196.00,
         220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00]


def _place(dst, at, seg):
    """Additively place `seg` at sample offset `at`, clipped to `dst`."""
    if at >= len(dst) or at + len(seg) <= 0:
        return
    a = max(0, at)
    b = min(len(dst), at + len(seg))
    dst[a:b] += seg[a - at:b - at]


def _kick(dur=0.30, f0=132.0, f1=44.0):
    n = int(dur * SR)
    f = np.exp(np.linspace(math.log(f0), math.log(f1), n))
    x = sine(f, n) * expd(n, 0.070)
    x += lpf(noise(n), 700) * expd(n, 0.010) * 0.35
    return x * 0.95


def _snap(dur=0.19):
    """Tight modern clap/snap — three micro-bursts."""
    n = int(dur * SR)
    x = np.zeros(n)
    for i, g in enumerate((1.0, 0.6, 0.42)):
        d = int(i * 0.0085 * SR)
        seg = n - d
        x[d:] += bpf(noise(seg), 1850, 1.7) * expd(seg, 0.026) * g
    x += bpf(noise(n), 3600, 2.4) * expd(n, 0.010) * 0.3
    return x * 0.62


def _hat(dur=0.07, fc=8200, open_=False):
    n = int(dur * (2.6 if open_ else 1.0) * SR)
    x = bpf(noise(n), fc, 1.5) * expd(n, 0.012 if not open_ else 0.075)
    return x * (0.30 if not open_ else 0.24)


def _rim(dur=0.10):
    n = int(dur * SR)
    x = bpf(noise(n), 2600, 4.0) * expd(n, 0.008)
    x += sine(1200, n) * expd(n, 0.006) * 0.3
    return x * 0.34


def _bass(fr, dur, glide=None):
    n = int(dur * SR)
    f = np.full(n, fr) if glide is None else np.linspace(glide, fr, n)
    x = saw(f, n, partials=9, det=0.18) * 0.55 + sine(f, n) * 0.6
    x = lpf(x, fr * 5.0 + 220, q=1.1)
    env = np.concatenate([
        np.linspace(0, 1, int(n * 0.03)),
        np.ones(int(n * 0.55)),
        np.linspace(1, 0, n - int(n * 0.03) - int(n * 0.55)),
    ])
    return x * env * 0.5


def _pad(fr_list, dur, cut0=320, cut1=1500, g=1.0):
    n = int(dur * SR)
    x = np.zeros(n)
    for i, fr in enumerate(fr_list):
        x += saw(np.full(n, fr), n, partials=13, det=0.5 - i * 0.22) * (0.9 - i * 0.16)
        x += saw(np.full(n, fr * 1.003), n, partials=11, det=-0.3) * (0.5 - i * 0.10)
    x = moving_lpf(x, cut0, cut1, q=0.85)
    env = np.concatenate([
        np.linspace(0, 1, int(n * 0.18)),
        np.ones(int(n * 0.60)),
        np.linspace(1, 0, n - int(n * 0.18) - int(n * 0.60)),
    ])
    return comb_verb(x * env, wet=0.30) * 0.11 * g


def _pluck(fr, dur=0.42, g=1.0):
    n = int(dur * SR)
    x = tri(fr, n) * 0.7 + saw(np.full(n, fr), n, partials=7, det=0.2) * 0.3
    x = lpf(x, fr * 6 + 900)
    return comb_verb(x * expd(n, 0.115), wet=0.34) * 0.30 * g


def _arp_note(fr, dur=0.20, g=1.0):
    n = int(dur * SR)
    x = square(fr, n, partials=6) * 0.4 + tri(fr * 2, n) * 0.2
    x = hpf(lpf(x, fr * 5 + 1400), 300)
    return comb_verb(x * expd(n, 0.055), wet=0.40) * 0.22 * g


def _energy(part: int):
    """Per-bar gain envelopes for each layer. 44 bars.

    Part 1 opens sparse (pad only) so the hook can breathe, builds through the
    engine explanation, peaks across the M2 deep-dive, pulls back for the
    continuation line and resolves warm under the CTA.

    Part 2 opens ALREADY at beat level — the engine case is made, the series is
    mid-stride — and runs consistently fuller with the arp present from early
    on, per the brief's scale-up progression.
    """
    b = np.arange(NBARS)
    z = np.zeros(NBARS)

    def ramp_(lo, hi, v0, v1):
        out = z.copy()
        out[:lo] = v0
        if hi > lo:
            out[lo:hi] = np.linspace(v0, v1, hi - lo)
        out[hi:] = v1
        return out

    if part == 1:
        pad = np.clip(ramp_(0, 4, 0.55, 1.0), 0, 1)
        drums = np.where(b < 4, 0.0, np.where(b < 6, 0.5, 1.0))
        drums = np.where(b >= 36, np.where(b < 39, 0.45, 0.8), drums)
        bass = np.where(b < 5, 0.0, np.where(b < 7, 0.55, 1.0))
        bass = np.where(b >= 36, np.where(b < 39, 0.3, 0.75), bass)
        pluck = np.where(b < 12, 0.0, 1.0)
        pluck = np.where(b >= 36, 0.55, pluck)
        arp = np.where(b < 20, 0.0, np.where(b < 36, 1.0, 0.35))
        cta = np.where(b >= 40, 1.0, 0.0)
    else:
        pad = np.clip(ramp_(0, 2, 0.85, 1.0), 0, 1)
        drums = np.where(b < 1, 0.6, 1.0)
        drums = np.where(b >= 38, np.where(b < 40, 0.5, 0.85), drums)
        bass = np.where(b < 1, 0.6, 1.0)
        bass = np.where(b >= 38, np.where(b < 40, 0.35, 0.8), bass)
        pluck = np.where(b < 4, 0.4, 1.0)
        pluck = np.where(b >= 38, 0.6, pluck)
        arp = np.where(b < 3, 0.35, np.where(b < 38, 1.0, 0.45))
        cta = np.where(b >= 40, 1.0, 0.0)

    return {"pad": pad, "drums": drums, "bass": bass, "pluck": pluck, "arp": arp, "cta": cta}


# i-VI-III-VII in A minor: Am - F - C - G. Warm, modern, not melancholy.
PROG = [
    [220.00, 261.63, 329.63],   # Am
    [174.61, 220.00, 261.63],   # F
    [261.63, 329.63, 392.00],   # C
    [196.00, 246.94, 293.66],   # G
]
BASS_ROOT = [110.00, 87.31, 130.81, 98.00]


def build_bed(part: int):
    n = NTOT
    E = _energy(part)
    wide = 0.34 if part == 1 else 0.46      # Part 2 runs wider in stereo

    pad = np.zeros(n)
    drums = np.zeros(n)
    bass = np.zeros(n)
    pluck = np.zeros(n)
    arp = np.zeros(n)

    for bar in range(NBARS):
        b0 = bar * SPB
        ch = PROG[bar % 4]
        root = BASS_ROOT[bar % 4]
        gp, gd, gb, gl, ga = (E[k][bar] for k in ("pad", "drums", "bass", "pluck", "arp"))
        last4 = bar >= NBARS - 4

        # -- pad: one sustained chord per bar, filter opens with energy -------
        if gp > 0.01:
            cut1 = 1200 + 900 * gp + (500 if last4 else 0)
            _place(pad, b0, _pad(ch, BAR * 1.02, 300, cut1, g=gp))

        # -- drums: four-on-floor kick, snap on 2 & 4, swung 8th hats --------
        if gd > 0.01:
            for beat_i in range(4):
                at = b0 + int(beat_i * BEAT * SR)
                _place(drums, at, _kick() * gd)
                if beat_i in (1, 3):
                    _place(drums, at, _snap() * gd)
                # eighth-note hats with a touch of swing on the offbeat
                _place(drums, at, _hat(fc=8600) * gd * 0.9)
                off = at + int(BEAT * 0.52 * SR)
                _place(drums, off, _hat(fc=7600, open_=(beat_i == 3 and bar % 4 == 3)) * gd)
            if bar % 8 == 7:
                _place(drums, b0 + int(3.5 * BEAT * SR), _rim() * gd)
            if bar % 4 == 3 and gd > 0.7:
                _place(drums, b0 + int(3.75 * BEAT * SR), _rim() * gd * 0.8)

        # -- bass: driving but subtle — root on 1, octave push on 3&, 4 ------
        if gb > 0.01:
            _place(bass, b0, _bass(root, BEAT * 1.45) * gb)
            _place(bass, b0 + int(BEAT * 1.5 * SR), _bass(root, BEAT * 0.45) * gb * 0.8)
            _place(bass, b0 + int(BEAT * 2.0 * SR), _bass(root, BEAT * 0.9) * gb * 0.9)
            _place(bass, b0 + int(BEAT * 3.0 * SR), _bass(root * 1.5, BEAT * 0.5) * gb * 0.7)
            _place(bass, b0 + int(BEAT * 3.5 * SR),
                   _bass(root, BEAT * 0.5, glide=root * 0.75) * gb * 0.7)

        # -- pluck: sparse melodic figure, two notes a bar -------------------
        if gl > 0.01:
            mel = [ch[2], ch[1], ch[2] * 1.5, ch[0]][bar % 4]
            _place(pluck, b0 + int(BEAT * 0.5 * SR), _pluck(mel, 0.46, g=gl))
            _place(pluck, b0 + int(BEAT * 2.5 * SR), _pluck(ch[1], 0.38, g=gl * 0.75))
            if part == 2 and gl > 0.7:
                # counter-melody — Part 2 only
                _place(pluck, b0 + int(BEAT * 3.25 * SR), _pluck(ch[2] * 1.5, 0.30, g=gl * 0.5))

        # -- arp: bright sixteenth arpeggio ---------------------------------
        if ga > 0.01:
            pattern = [ch[0], ch[1], ch[2], ch[1] * 2, ch[2], ch[1], ch[0] * 2, ch[1]]
            for i in range(8):
                at = b0 + int(i * BEAT * 0.5 * SR)
                _place(arp, at, _arp_note(pattern[i % 8] * 2, 0.19, g=ga * (1.0 if i % 2 == 0 else 0.62)))

    # -- CTA bars: warm resolve --------------------------------------------
    cta_at = int((NBARS - 4) * SPB)
    tail = n - cta_at
    res = np.zeros(n)
    for i, (fr, g) in enumerate(((220.0, 0.8), (329.63, 0.6), (440.0, 0.45), (659.25, 0.3))):
        d = cta_at + int(i * 0.09 * SR)
        seg = n - d
        if seg <= 0:
            continue
        res[d:] += (sine(fr, seg) + sine(fr * 2.001, seg) * 0.28) * expd(seg, 1.6) * g
    res = comb_verb(hpf(res, 130), wet=0.42) * 0.10

    mix = pad * 1.0 + drums * 0.52 + bass * 0.60 + pluck * 0.46 + arp * 0.34 + res
    mix = hpf(mix, 30)
    # soft-knee limiting so the bed sits predictably under a voiceover
    mix = np.tanh(mix * 1.25) * 0.80

    ramp = int(0.9 * SR)
    mix[:ramp] *= np.linspace(0, 1, ramp)
    mix[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))

    st = stereo(mix, width=wide, pre=0.013)
    m = np.abs(st).max()
    if m > 0:
        st = st / m * 0.84
    name = f"music-bed-part{part}"
    wr(name, st)
    return name


def build_vo_placeholder(part: int):
    """Silent 88.000 s slot the recorded voiceover will drop into."""
    n = NTOT
    name = f"voiceover-reel-part{part}"
    wr(name, np.zeros((n, 2)))
    return name


# ---------------------------------------------------------------------------
# ENCODE
# ---------------------------------------------------------------------------
def encode(name, out_dir, exact_seconds=None):
    src = os.path.join(SCRATCH, name + ".wav")
    dst = os.path.join(out_dir, name + ".mp3")
    cmd = [FFMPEG, "-v", "error", "-y", "-i", src]
    if exact_seconds is not None:
        # Pad then hard-cut so the encoder's own padding cannot shorten or
        # lengthen a bed that the frame contract depends on.
        cmd += ["-af", "apad", "-t", f"{exact_seconds:.6f}"]
    cmd += ["-c:a", "libmp3lame", "-b:a", "192k", "-ar", "48000", "-ac", "2", dst]
    subprocess.run(cmd, check=True)
    return dst


def main() -> int:
    print("=" * 66)
    print("MOTU M-Series — audio synthesis  (numpy/scipy, no external service)")
    print(f"  {BPM:.0f} BPM · {BARS} bars · {REEL_SECONDS:.3f} s · A minor")
    print("=" * 66)

    print("\n[1/4] SFX palette")
    cues = build_sfx()
    for c in cues:
        encode(c, SFX_DIR)
    print(f"      {len(cues)} cues: {', '.join(cues)}")

    print("\n[2/4] constant ambient bed (88 s, under every frame)")
    amb = build_ambient()
    encode(amb, SFX_DIR, exact_seconds=REEL_SECONDS)
    print(f"      {amb}.mp3")

    print("\n[3/4] music beds")
    for part in (1, 2):
        nm = build_bed(part)
        encode(nm, SFX_DIR, exact_seconds=REEL_SECONDS)
        print(f"      {nm}.mp3")

    print("\n[4/4] silent voiceover placeholders")
    for part in (1, 2):
        nm = build_vo_placeholder(part)
        encode(nm, VO_DIR, exact_seconds=REEL_SECONDS)
        print(f"      vo/{nm}.mp3")

    total = len(cues) + 1 + 2 + 2
    print(f"\nOK — {total} audio files written")
    print("Next: python3 scripts/audit_audio.py")
    return 0


if __name__ == "__main__":
    sys.exit(main())
