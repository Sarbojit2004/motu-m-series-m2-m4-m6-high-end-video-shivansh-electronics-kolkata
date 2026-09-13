#!/usr/bin/env python3
"""Synthesises every audio asset for the 90-second MOTU M-Series reel.

NOTHING HERE IS SAMPLED, SOURCED OR FETCHED. Every waveform is generated from
scratch with the same class of DSP the TASCAM Recording Series repository uses
for its own audio — biquad filters, explicit envelopes, comb-filter reverb,
stereo widening. The primitives below are carried over from the MOTU AVB
explainer in the sister repository because they are general-purpose signal
processing. NOTHING ELSE IS.

WHY THE SOUND DESIGN IS DELIBERATELY DIFFERENT FROM THE AVB FILM.

Both reels are for the same distributor and will sit next to each other on the
same channel. If they shared a cue palette they would read as two edits of one
film. So this one is built from different material end to end, and the split is
not cosmetic — it follows what each film is ABOUT:

                    AVB explainer                M-Series reel
  subject           a network                    three desktop boxes
  tempo             84 BPM, unhurried            96 BPM, forward
  harmony           A minor, saw pads            D major, sine pad + felt pluck
  pulse             a filtered 62 Hz tick        an off-beat brushed shaker
  cue vocabulary    links, clocks, streams       air, snaps, chimes, counting
  cue names         port-link, net-lock,         air-pass, slide-air, gate-snap,
                    stream-open, spec-latch,     impact-soft, riser-short,
                    data-sweep, seg-swell,       chime-lift, tick-glass,
                    sub-drop, caption-in         count-blip, outro-bloom

The AVB palette is the vocabulary of a network coming up. This one is the
vocabulary of an EDIT: whips, snaps, risers and a counter. That is the right
choice here because the M-Series reel's cues are married to its transitions —
every cue name maps to exactly one transition kind in
src/components/Transitions.tsx, so the picture and the sound are chosen
together rather than laid over one another.

Two families are produced:

  1. music-bed.wav   90.000 s, continuous, six energy zones matching the six
                     segments of script.ts. The brief asks for a bed that plays
                     right through the reel, so it never drops out and never
                     loops — it is one 90-second piece of writing.
  2. sfx/*.wav       9 transition and accent cues.

THE MIX IS BUILT FOR A SPOKEN VOICE.

  * SPEECH POCKET. The bed is carved with a broad -7 dB dip centred on 1.6 kHz
    (see `speech_pocket`). Narration intelligibility lives in roughly
    300 Hz - 4 kHz; the bed is shaped to leave that band open rather than
    relying on ducking to rescue it later.
  * EVERY CUE IS SHORT AND OUT OF THE WAY. Transition sounds are either bright
    (> 2.5 kHz) or sub (< 120 Hz), never mid-heavy, so they never mask a
    consonant, and nothing rings long enough to sit under a following word.
  * LOUDNESS IS MEASURED, NOT INFERRED. The bed and the reference transition
    cue are mastered to -23 LUFS (EBU R128) as instructed; see the mastering
    section for why a peak figure is not a substitute.

Run:  python3 scripts/gen_audio.py
"""
import math
import os
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import lfilter

SR = 48000
FPS = 30
TOTAL_FRAMES = 2700
DUR = TOTAL_FRAMES / FPS  # 90.000 s exactly

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
OUT = os.path.join(PROJ, "public", "audio")
SFX_OUT = os.path.join(OUT, "sfx")
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
rng = np.random.default_rng(0x2465)  # M2 / M4 / M6


# ─────────────────────────────────────────────────────────── primitives ──
def t(n):
    """Time axis for a SAMPLE COUNT."""
    return np.arange(n) / SR


def tsec(dur):
    """Time axis for a DURATION IN SECONDS.

    Kept separate from t() on purpose: passing seconds to a sample-count axis
    silently yields a one-element array that then broadcasts against the real
    buffer, which produces a flat envelope instead of an error.
    """
    return np.arange(int(dur * SR)) / SR


def expd(n, tau):
    return np.exp(-t(n) / tau)


def noise(n):
    return rng.standard_normal(n)


def _bq(fc, q, kind, gain_db=0.0):
    """Biquad coefficients — lowpass, highpass, or peaking."""
    fc = float(np.clip(fc, 20.0, SR / 2 * 0.97))
    w = 2 * math.pi * fc / SR
    al = math.sin(w) / (2 * q)
    c = math.cos(w)
    if kind == "peak":
        A = 10 ** (gain_db / 40)
        a0 = 1 + al / A
        b = [(1 + al * A) / a0, (-2 * c) / a0, (1 - al * A) / a0]
        a = [1.0, (-2 * c) / a0, (1 - al / A) / a0]
        return b, a
    a0 = 1 + al
    if kind == "lp":
        b = [(1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0]
    else:
        b = [(1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0]
    return b, [1.0, -2 * c / a0, (1 - al) / a0]


def lpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "lp")
    return lfilter(b, a, x)


def hpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "hp")
    return lfilter(b, a, x)


def peak(x, fc, gain_db, q=0.9):
    b, a = _bq(fc, q, "peak", gain_db)
    return lfilter(b, a, x)


def lpf_tv(x, fc_curve, q=0.707, blk=2048):
    """Low-pass whose cutoff moves over time.

    The music bed's brightness opens and closes per segment, which means the
    filter cutoff is a signal, not a number. Processed in blocks with the
    filter state carried across the boundary (`zi`), so the cutoff can sweep
    without the discontinuity a naive per-block filter would click on.
    """
    x = np.asarray(x, dtype=np.float64)
    fc_curve = np.asarray(fc_curve, dtype=np.float64)
    out = np.zeros_like(x)
    zi = np.zeros(2)
    for i in range(0, len(x), blk):
        j = min(i + blk, len(x))
        b, a = _bq(float(fc_curve[i]), q, "lp")
        out[i:j], zi = lfilter(b, a, x[i:j], zi=zi)
    return out


def saw(f, n, det=0.0, parts=14):
    ph = np.cumsum(np.full(n, f / SR))
    o = np.zeros(n)
    for k in range(1, parts):
        o += np.sin(2 * np.pi * k * (ph + det * k * 0.001)) / k
    return o * 0.5


def sine(f, n):
    return np.sin(2 * np.pi * np.cumsum(np.full(n, f / SR)))


def stereo(x, width=0.25, pre=0.012):
    """Haas-style widening — a short pre-delay cross-fed between the channels."""
    d = int(pre * SR)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x.copy()
    return np.stack(
        [x * (1 - width * 0.5) + r * width * 0.5, r * (1 - width * 0.5) + x * width * 0.5], 1
    )


def verb(x, taps=((0.029, 0.33), (0.043, 0.25), (0.067, 0.18), (0.097, 0.12)), mix=0.26):
    """Comb-filter reverb — enough tail to place a sound in a room."""
    y = np.zeros_like(x)
    for dt, g in taps:
        d = int(dt * SR)
        if d < len(x):
            y[d:] += x[:-d] * g
    return x * (1 - mix) + y * mix


def declick(x, ms=4.0):
    k = max(2, int(ms / 1000 * SR))
    if len(x) < 2 * k:
        return x
    w = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, k))
    x[:k] *= w
    x[-k:] *= w[::-1]
    return x


def speech_pocket(x):
    """Carve room for the narration.

    A broad dip through the band a voice occupies, so the bed can sit at a
    usable level without competing with words. This is done at synthesis time
    rather than left to a mixing pass, because the bed is generated here and
    there is no later stage that would otherwise EQ it.
    """
    x = peak(x, 1600, -7.0, q=0.55)
    x = peak(x, 500, -3.2, q=0.8)
    return x


def write_wav(path, x, peak_db=-1.0):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    m = np.abs(x).max()
    if m > 0:
        x = x * (10 ** (peak_db / 20)) / m
    os.makedirs(os.path.dirname(path), exist_ok=True)
    d = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(d.tobytes())
    return x



# ═══════════════════════════════════════════════════════════ MUSIC BED ══
# 90.000 s, continuous, never looping. Six zones taken straight from the
# derived narration timestamps in script.ts, so the bed carries the film's own
# shape rather than a musical grid the words then have to fit.
#
# WHY D MAJOR AND 96 BPM. The AVB explainer is a three-minute technical
# argument and sits in A minor at 84. This is a ninety-second reel that opens on
# a question and has to hold a thumb; it moves. A major key also matters for the
# script's central claim: nothing here is a warning or a problem, it is three
# good answers to one question, and a minor bed would quietly contradict that.
N = int(round(DUR * SR))
BPM = 96.0
BEAT = 60 / BPM
BAR = BEAT * 4

# D major family, voiced low and open. Sine-based, not saw-based — the AVB bed
# is detuned saws and this must not share its timbre.
PROG = [
    [ 73.42,  110.00, 146.83],  # D
    [ 98.00,  146.83, 196.00],  # G
    [ 55.00,   82.41, 110.00],  # A (low, opens the phrase up)
    [ 61.74,   92.50, 123.47],  # Bm
]

# (start, end, energy, brightness, pluck, shaker) per segment, from script.ts.
#
# The shape is the script's shape: the hook is held back so the question lands
# in near-silence, the engine section builds as the numbers arrive, each product
# is a little brighter than the last, and the close resolves rather than peaks.
SEG = [
    ( 0.00,  8.76, 0.52, 0.80, False, False),  # hook    — sparse, a question
    ( 9.16, 26.69, 0.70, 1.00, True,  False),  # engine  — building, systemic
    (27.09, 42.24, 0.66, 1.08, True,  True),   # M2      — light, portable
    (42.64, 57.05, 0.74, 1.02, True,  True),   # M4      — warmer, wider
    (57.45, 74.62, 0.86, 1.20, True,  True),   # M6      — fullest of the three
    (75.02, 90.00, 0.72, 1.10, True,  False),  # close   — resolve, then out
]


def zone(ts, idx, smooth=1.2):
    """Sample a zone parameter, smoothed so zones cross-fade instead of step."""
    out = np.zeros_like(ts)
    for (a, b, e, br, pl, sh) in SEG:
        out[(ts >= a) & (ts < b)] = float((e, br, pl, sh)[idx])
    out[ts >= SEG[-1][1]] = float(SEG[-1][idx + 2])
    k = int(smooth * SR)
    if k > 1:
        out = np.convolve(out, np.ones(k) / k, mode="same")
    return out


def felt(f, n, tau=0.42):
    """A felt-mallet pluck: a fundamental, one slightly sharp partial, and a
    soft noise attack. Short and round — the opposite of the AVB bed's
    sustained saw, and the reason the two films do not sound related."""
    x = tsec(n / SR)
    body = (
        np.sin(2 * np.pi * f * x) * 0.60
        + np.sin(2 * np.pi * f * 2.004 * x) * 0.22
        + np.sin(2 * np.pi * f * 3.01 * x) * 0.08
    )
    att = lpf(noise(n), 2600) * 0.30 * np.exp(-48 * x)
    return (body * np.exp(-x / tau) + att) * np.minimum(x / 0.004, 1.0)


def build_music():
    ts = np.arange(N) / SR
    energy = zone(ts, 0)
    bright = zone(ts, 1)
    pluck_on = zone(ts, 2)
    shake_on = zone(ts, 3)

    mus = np.zeros(N)
    bar_len = int(BAR * SR)

    # ── pad: stacked sines, slowly detuned against each other ────────────
    for i in range(0, N, bar_len):
        n = min(bar_len, N - i)
        ch = PROG[(i // bar_len) % len(PROG)]
        seg = np.zeros(n)
        for j, f in enumerate(ch):
            seg += sine(f, n) * (0.26 - j * 0.05)
            seg += sine(f * 1.003, n) * (0.13 - j * 0.03)   # a breathing beat
            seg += sine(f * 2, n) * 0.035
        a = np.minimum(np.linspace(0, 1, n) * 4.0, 1.0)
        seg *= a * np.minimum(np.linspace(1, 0, n) * 4.0 + 0.62, 1.0)
        mus[i:i + n] += seg

    # ── sub weight, well below the voice ─────────────────────────────────
    sub = np.zeros(N)
    for i in range(0, N, bar_len):
        n = min(bar_len, N - i)
        f = PROG[(i // bar_len) % len(PROG)][0] / 2
        sub[i:i + n] += sine(f, n) * 0.5 * np.minimum(np.linspace(0, 1, n) * 4, 1.0)
    mus += lpf(sub, 105) * 0.55

    # ── pluck figure: four notes to the bar, sitting above the pad ───────
    # Rooted on the bar's own chord, so it re-voices as the harmony moves
    # instead of running a fixed arpeggio over everything.
    step = int(BEAT * SR)
    pat = [0, 2, 1, 2]
    pl = np.zeros(N)
    for k, i in enumerate(range(0, N, step)):
        n = min(int(0.9 * SR), N - i)
        if n <= 0:
            break
        ch = PROG[(i // bar_len) % len(PROG)]
        f = ch[pat[k % len(pat)]] * 2
        pl[i:i + n] += felt(f, n) * (0.30 if k % 4 == 0 else 0.20)
    mus += hpf(pl, 180) * pluck_on * 0.62

    # ── shaker: brushed noise on the off-beat, very quiet ────────────────
    half = int(BEAT / 2 * SR)
    sh = np.zeros(N)
    for k, i in enumerate(range(0, N, half)):
        if k % 2 == 0:
            continue
        n = min(int(0.10 * SR), N - i)
        if n <= 0:
            break
        sh[i:i + n] += hpf(noise(n), 6500) * expd(n, 0.022) * 0.5
    mus += sh * shake_on * 0.22

    # ── air: a high shimmer that tracks brightness ───────────────────────
    mus += hpf(noise(N), 6200) * 0.04 * bright * 0.5

    # ── shape ────────────────────────────────────────────────────────────
    mus *= energy
    mus = lpf_tv(mus, 1500 + 3000 * np.clip(bright, 0, 2))  # brightness -> opening
    mus = speech_pocket(mus)                                # carve the voice band
    mus = hpf(mus, 36)                                      # clear the rumble

    st = stereo(mus, width=0.36, pre=0.014)
    st = np.stack([verb(st[:, 0], mix=0.18), verb(st[:, 1], mix=0.18)], 1)

    # In cleanly; out under the end screen rather than at the last sample, so
    # the outro has a moment of its own before the file ends.
    env = np.ones(N)
    fi, fo = int(1.1 * SR), int(4.0 * SR)
    env[:fi] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fi))
    env[-fo:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, fo))
    st *= env[:, None]
    return st


# ═════════════════════════════════════════════════════════════════ SFX ══
# Nine cues, and every one of them is married to a transition kind in
# src/components/Transitions.tsx — TRANS_CUE there is the other half of this
# table. A whip pan is always an air slide; a diagonal wipe is always a snap.
# The picture and the sound were chosen at the same time, which is the whole
# reason a cut in this reel reads as an edit rather than as a dissolve.


def band_pass_sweep(n, f_lo, f_hi, curve=1.0, blk=512):
    """Noise pushed through a moving band — the raw material for every air
    cue here. Kept as one helper so the whole air family shares a timbre."""
    s = noise(n)
    out = np.zeros(n)
    p = np.linspace(0, 1, n) ** curve
    for i in range(0, n, blk):
        j = min(i + blk, n)
        fc = f_lo + (f_hi - f_lo) * p[i]
        out[i:j] = hpf(lpf(s[i:j], min(fc * 2.2, 19000)), fc)
    return out


def air_pass():
    """The quietest move in the set — a soft cross-fade's worth of air.

    Under a plain dissolve, where a louder cue would announce an edit that is
    deliberately meant not to be noticed.
    """
    d = 0.36
    n = int(d * SR)
    s = band_pass_sweep(n, 900, 4200, 1.25)
    return s * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.3 * 0.55


def slide_air():
    """A whip pan. Air travelling laterally, with a short pitched tail so it
    has a direction rather than just a shape."""
    d = 0.52
    n = int(d * SR)
    x = tsec(d)
    s = band_pass_sweep(n, 600, 7200, 0.85) * 0.7
    # A descending sine under it gives the pass somewhere to land.
    f = np.linspace(1500, 520, n)
    s += np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.20 * np.exp(-5.0 * x)
    env = np.sin(np.pi * np.linspace(0, 1, n)) ** 0.9
    return hpf(s * env, 500)


def gate_snap():
    """A diagonal wipe. A hard-edged noise burst cut off by a gate — the sound
    of an edge arriving, with no tail at all."""
    d = 0.14
    n = int(d * SR)
    x = tsec(d)
    s = hpf(noise(n), 2600) * 0.9
    # The gate: full for 18 ms, then straight down.
    g = np.where(x < 0.018, 1.0, np.exp(-90 * (x - 0.018)))
    s = s * g
    s += (sine(2100, n) * 0.25 + sine(3150, n) * 0.14) * expd(n, 0.012)
    return hpf(s, 1400)


def impact_soft():
    """A push-in or a pull-back landing. Round and low, never a boom — this is
    a product reel, not a trailer."""
    d = 0.42
    n = int(d * SR)
    x = tsec(d)
    f = np.linspace(96, 54, n)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-6.5 * x)
    click = hpf(noise(n), 3800) * 0.10 * np.exp(-70 * x)
    return lpf(body, 220) * 0.9 + click


def riser_short():
    """The half-second lift into a segment, and under a vertical slide.

    This is the cue the -23 LUFS reference is measured on: it is the most
    frequent transition sound in the reel and the one a viewer's sense of
    'how loud are the effects' is actually formed by.
    """
    d = 0.58
    n = int(d * SR)
    x = tsec(d)
    s = band_pass_sweep(n, 700, 6400, 1.5) * 0.6
    f = np.linspace(300, 1250, n)
    s += np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.22
    s *= (x / d) ** 1.7                      # rises the whole way
    s *= np.minimum((d - x) / 0.06, 1.0)     # and stops dead at the cut
    return hpf(s, 400)


def chime_lift():
    """The light-hit transition. A fifth struck together, with inharmonic
    partials so it reads as a struck object rather than a synth interval."""
    d = 0.85
    n = int(d * SR)
    x = tsec(d)
    s = np.zeros(n)
    for f, a, tau in ((1174.7, 0.34, 0.30), (1760.0, 0.26, 0.24),
                      (2637.0, 0.14, 0.16), (3543.0, 0.08, 0.10),
                      (5274.0, 0.05, 0.07)):
        s += a * np.sin(2 * np.pi * f * x) * np.exp(-x / tau)
    s += hpf(noise(n), 7000) * 0.05 * np.exp(-40 * x)
    return verb(hpf(s, 800), mix=0.26)


def tick_glass():
    """The near-subliminal mark where a thought lands. 60 ms, no tail."""
    d = 0.06
    n = int(d * SR)
    s = (sine(4500, n) * 0.40 + sine(6750, n) * 0.20 + sine(9000, n) * 0.08)
    return hpf(s * expd(n, 0.011), 3000)


def count_blip():
    """One input slot lighting up. Locked frame-for-frame to the ladder
    graphic, so the count is heard as well as seen."""
    d = 0.05
    n = int(d * SR)
    s = sine(5200, n) * 0.45 + sine(7800, n) * 0.16
    return hpf(s * expd(n, 0.009), 3500)


def outro_bloom():
    """The end screen arriving. A D major triad blooming open, the only cue in
    the set allowed a long tail — nothing is spoken over it."""
    d = 2.4
    n = int(d * SR)
    x = tsec(d)
    s = np.zeros(n)
    for f, a in ((293.66, 0.30), (440.00, 0.24), (587.33, 0.18),
                 (880.00, 0.10), (1174.66, 0.06)):
        s += a * np.sin(2 * np.pi * f * x)
    s += hpf(noise(n), 5200) * 0.035
    env = np.minimum(x / 0.35, 1.0) * np.exp(-1.05 * np.maximum(x - 0.35, 0))
    return verb(hpf(s * env, 120), mix=0.34)


SOUNDS = {
    "air-pass": air_pass,
    "slide-air": slide_air,
    "gate-snap": gate_snap,
    "impact-soft": impact_soft,
    "riser-short": riser_short,
    "chime-lift": chime_lift,
    "tick-glass": tick_glass,
    "count-blip": count_blip,
    "outro-bloom": outro_bloom,
}

# Per-cue offset from the -23 LUFS reference.
#
# All nine cues are mastered to the same perceived loudness first, then offset
# by these. Two cues doing different jobs at the same measured loudness would
# still be wrong: a counting blip is punctuation under a spoken line, a riser is
# a chapter boundary. 0.0 means exactly -23 LUFS.
RELATIVE = {
    "riser-short": 0.0,     # the reference cue — the reel's commonest transition
    "chime-lift": -1.5,
    "outro-bloom": -2.0,    # long, and alone in the mix, so it needs no more
    "slide-air": -3.0,
    "impact-soft": -3.5,
    "gate-snap": -4.0,
    "air-pass": -6.0,       # under a dissolve, meant not to be noticed
    "tick-glass": -11.0,    # near-subliminal punctuation
    "count-blip": -13.0,    # nine to fifteen of these in a row; keep them small
}



# ════════════════════════════════════════════════ LOUDNESS MASTERING ══
# The brief asks for the bed and the transition cues at -23 LUFS (EBU R128).
#
# WHY THIS EXISTS. The previous film's first cut mastered the bed to a PEAK
# figure (-15.5 dBFS) and then scaled it again in the render. A slow pad has a
# very low crest factor, so peak-normalising it left the bed at -29.4 LUFS, and
# the extra 0.42 gain in the timeline took it to about -37 LUFS — present in the
# file, inaudible in the room. Perceived loudness has to be measured, not
# inferred from a peak. That is the single most important thing this file does.
#
# Pure gain, not loudnorm's dynamic mode: these are synthesised cues with
# deliberate transients, and R128's dynamic normaliser would compress them.
# Measure, compute one gain, apply it, then guard the peak.


def measure_lufs(path):
    """Integrated loudness of a file, via ffmpeg's EBU R128 meter.

    Short cues are padded to four seconds first: R128's integrated measurement
    needs a few seconds of programme, and its -70 LUFS absolute gate discards
    the added silence rather than averaging it in.
    """
    r = subprocess.run(
        [FFMPEG, "-hide_banner", "-i", path,
         "-af", "apad=whole_dur=4,ebur128=framelog=quiet", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    for line in reversed(r.stderr.splitlines()):
        if "I:" in line and "LUFS" in line:
            try:
                return float(line.split("I:")[1].split("LUFS")[0].strip())
            except ValueError:
                continue
    return None


def master_lufs(path, target=-23.0, ceiling_db=-1.0):
    """Scale a file to `target` LUFS with a single gain, then guard the peak."""
    cur = measure_lufs(path)
    if cur is None:
        print(f"    ! could not measure {os.path.basename(path)}")
        return None
    gain = target - cur

    with wave.open(path, "rb") as w:
        n, ch, sr = w.getnframes(), w.getnchannels(), w.getframerate()
        x = np.frombuffer(w.readframes(n), dtype="<i2").astype(np.float64) / 32768.0
    x = x.reshape(-1, ch) * (10 ** (gain / 20))

    # A pure gain can push a transient past full scale; pull the whole file
    # down if it does, rather than clipping it.
    peak = np.abs(x).max()
    ceil = 10 ** (ceiling_db / 20)
    trimmed = 0.0
    if peak > ceil:
        trimmed = 20 * np.log10(ceil / peak)
        x *= ceil / peak

    with wave.open(path, "wb") as w:
        w.setnchannels(ch)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())

    final = measure_lufs(path)
    note = f"  (peak-limited {trimmed:+.1f} dB)" if trimmed else ""
    print(f"    {os.path.basename(path):20s} {cur:7.1f} -> {final:7.1f} LUFS{note}")
    return final


def to_mp3(wav, bitrate="192k"):
    """Emit the committed copy.

    A 180 s stereo bed at 48 kHz/16-bit is 34.5 MB of WAV; three of them is
    100 MB of repository for audio that will sit at -15 dBFS under a voice.
    The beds ship as MP3 and the WAVs stay local (gitignored), which costs
    nothing audible under narration and keeps the repository sane.
    """
    mp3 = wav[:-4] + ".mp3"
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", wav, "-b:a", bitrate, mp3], check=True)
    return mp3


if __name__ == "__main__":
    os.makedirs(SFX_OUT, exist_ok=True)

    print(f"music bed   {DUR:.3f}s, continuous ...", flush=True)
    m = build_music()
    write_wav(os.path.join(OUT, "music-bed.wav"), m, peak_db=-15.5)

    # The bed carries the loudness the brief specifies. It is measured, not
    # peak-normalised: see the mastering section above for why that distinction
    # is what made the previous film's bed inaudible.
    print("\nmastering to EBU R128 ...", flush=True)
    master_lufs(os.path.join(OUT, "music-bed.wav"), target=-23.0)

    print(f"\n{len(SOUNDS)} sfx cues ...", flush=True)
    for name, fn in SOUNDS.items():
        s = declick(np.asarray(fn(), dtype=np.float64))
        st = stereo(s, width=0.30, pre=0.006) if s.ndim == 1 else s
        dst = os.path.join(SFX_OUT, f"{name}.wav")
        write_wav(dst, st, peak_db=-3.0)
        master_lufs(dst, target=-23.0 + RELATIVE[name])

    # The bed also ships as MP3 — that is what the render and the repository
    # actually use. A 90 s stereo bed at 48 kHz/16-bit is 17 MB of WAV for
    # audio that will sit well under a voice; the WAV stays local (gitignored).
    print()
    mp3 = to_mp3(os.path.join(OUT, "music-bed.wav"))
    print(f"  music-bed.mp3  {os.path.getsize(mp3) / 1e6:5.1f} MB")

    # A silent VO placeholder at exactly the film's runtime, so the client can
    # drop their recording straight in with no code change.
    #
    # Written at 8 kHz mono-in-stereo rather than 48 kHz: it is silence, and its
    # only two jobs are to exist at that path so the render does not 404, and to
    # be exactly 90.000 s so scripts/sync-vo.mjs reports sensibly against it.
    vo = os.path.join(OUT, "vo.wav")
    pcm = np.zeros((int(DUR * 8000), 2), dtype="<i2")
    with wave.open(vo, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(8000)
        w.writeframes(pcm.tobytes())
    print(f"\n  vo.wav placeholder — {DUR:.3f}s of silence, "
          f"{os.path.getsize(vo) / 1e6:.1f} MB. Replace with the recorded take.")
    print("done.")
