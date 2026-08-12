#!/usr/bin/env python3
"""Synthesises the long-form video's audio: ambient bed, music bed, VO slot.

Extends the reel series' palette rather than inventing a second sonic identity
(long-form Section 7a asks for continuity with the companion reels). The DSP
primitives and every one of the 20 transition cues are imported unchanged from
scripts/gen_audio.py — this script adds only what the 298 s format needs:

  · ambient-longform.mp3     298.000 s continuous texture, under every frame
  · music-bed-longform.mp3   298.000 s arrangement with a full six-chapter arc
  · voiceover-longform.mp3   298.000 s silent placeholder
  · three extra cues sized for long-form structure (chapter-mark, brand-in,
    spec-reveal) — the reels had no chapter breaks or branding beats to score

TEMPO GRID. Same 120 BPM / A minor as the reels, so the two formats are audibly
one score. 298 s is exactly 149 bars, and the six chapter boundaries all fall on
bar lines:

    ch1 open + heritage     bars   0- 20   (   0- 40 s)
    ch2 the shared engine   bars  20- 46   (  40- 92 s)
    ch3 MOTU M2             bars  46- 74   (  92-148 s)
    ch4 MOTU M4             bars  74-104   ( 148-208 s)
    ch5 MOTU M6             bars 104-136   ( 208-272 s)
    ch6 CTA close           bars 136-149   ( 272-298 s)

The arrangement builds in layering, stereo width and confidence from chapter to
chapter — brief Section 10's dynamic progression, which this format has the room
to develop genuinely rather than compress the way the reels must.

    python3 scripts/gen_audio_longform.py
    python3 scripts/audit_audio.py
"""
import math
import os
import sys

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import gen_audio as G  # noqa: E402  — DSP core + the shared cue palette

SR = G.SR
ROOT = G.ROOT
SFX_DIR = G.SFX_DIR
VO_DIR = G.VO_DIR

LF_SECONDS = 298.0
BAR = G.BAR                       # 2.000 s
BEAT = G.BEAT                     # 0.500 s
NBARS = int(round(LF_SECONDS / BAR))   # 149
SPB = int(round(BAR * SR))
NTOT = int(LF_SECONDS * SR)

# chapter boundaries, in bars
CH = {"open": 0, "engine": 20, "m2": 46, "m4": 74, "m6": 104, "cta": 136, "end": NBARS}


# ---------------------------------------------------------------------------
# EXTRA CUES — long-form only
# ---------------------------------------------------------------------------
def build_extra_cues():
    names = []

    # -- chapter mark: the weighted move between product chapters ------------
    # Heavier and longer than the reels' slide-pan, because a chapter change is
    # a bigger structural event than a scene cut.
    n = int(2.6 * G.SR)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.15
    air = G.sweep_bpf(G.noise(n), 300, 3600, q=0.8) * env
    low = G.sine(np.linspace(88, 44, n), n) * G.expd(n, 0.55) * 0.85
    bell = np.zeros(n)
    for fr, g in ((220.0, 0.6), (329.63, 0.4), (440.0, 0.26)):
        bell += G.sine(fr, n) * G.expd(n, 0.7) * g
    x = air * 0.5 + low + G.comb_verb(bell, wet=0.45) * 0.7
    names.append(G.sfx("chapter-mark", G.comb_verb(G.hpf(x, 40), wet=0.22), 0.90, width=0.40))

    # -- brand-in: soft warm arrival for a Shivansh / MOTU branding beat -----
    n = int(1.7 * G.SR)
    env = np.sin(np.linspace(0, np.pi * 0.9, n)) ** 1.5
    x = np.zeros(n)
    for i, (fr, g) in enumerate(((261.63, 0.9), (392.0, 0.6), (523.25, 0.4))):
        d = int(i * 0.06 * G.SR)
        seg = n - d
        x[d:] += (G.sine(fr, seg) + G.sine(fr * 2.001, seg) * 0.26) * G.expd(seg, 0.55) * g
    x += G.bpf(G.noise(n), 4200, 1.0) * env * 0.10
    names.append(G.sfx("brand-in", G.comb_verb(G.hpf(x, 150), wet=0.38), 0.66, width=0.34))

    # -- spec-reveal: a spec figure latching in, richer than the reels' latch -
    n = int(0.9 * G.SR)
    x = G.bpf(G.noise(n), 2100, 3.4) * G.expd(n, 0.010)
    x += G.sine(880, n) * G.expd(n, 0.045) * 0.45
    x += G.sine(1320, n) * G.expd(n, 0.028) * 0.28
    x += G.sine(np.linspace(180, 110, n), n) * G.expd(n, 0.070) * 0.5
    names.append(G.sfx("spec-reveal", G.comb_verb(x, wet=0.30), 0.70, width=0.18))

    return names


# ---------------------------------------------------------------------------
# AMBIENT BED — 298 s continuous
# ---------------------------------------------------------------------------
def build_ambient_lf():
    n = NTOT
    tt = G.t(n)

    air = G.lpf(G.hpf(G.noise(n), 220), 2600) * 0.10
    air *= 0.72 + 0.28 * np.sin(2 * np.pi * 0.017 * tt + 0.6)

    drone = np.zeros(n)
    for fr, g, det in ((55.0, 1.0, 0.0), (82.41, 0.5, 0.14), (110.0, 0.38, -0.10)):
        drone += G.saw(np.full(n, fr * (1 + det * 0.0009)), n, partials=8, det=det) * g
    drone = G.moving_lpf(drone, 185, 460, q=0.8) * 0.10
    drone *= 0.66 + 0.34 * np.sin(2 * np.pi * 0.0091 * tt)

    # sparse shimmer roughly every 6 s across the whole runtime
    shim = np.zeros(n)
    for i in range(56):
        at = int((2.2 + i * 5.3) * SR)
        if at >= n:
            break
        seg = min(int(3.0 * SR), n - at)
        fr = (1318.51, 1760.0, 2093.0, 1567.98)[i % 4]
        shim[at:at + seg] += (G.sine(fr, seg) + G.sine(fr * 2.001, seg) * 0.25) * G.expd(seg, 0.75) * 0.055

    x = G.hpf(air + drone + G.comb_verb(shim, wet=0.5), 34)
    ramp = int(1.5 * SR)
    x[:ramp] *= np.linspace(0, 1, ramp)
    x[-ramp:] *= np.linspace(1, 0.55, ramp)

    st = G.stereo(x, width=0.52, pre=0.017)
    m = np.abs(st).max()
    if m > 0:
        st = st / m * 0.52
    G.wr("ambient-longform", st)
    return "ambient-longform"


# ---------------------------------------------------------------------------
# MUSIC BED — 298 s, six-chapter arc
# ---------------------------------------------------------------------------
def _energy_lf():
    """Per-bar gain per layer across 149 bars, keyed to the chapter map."""
    b = np.arange(NBARS)
    z = np.zeros(NBARS)

    def seg(lo, hi, v):
        out = z.copy()
        out[lo:hi] = v
        return out

    def ramp(lo, hi, v0, v1):
        out = z.copy()
        if hi > lo:
            out[lo:hi] = np.linspace(v0, v1, hi - lo)
        return out

    pad = np.clip(ramp(0, 6, 0.5, 1.0) + seg(6, NBARS, 1.0), 0, 1.15)

    # drums: absent for the opening statement, in from bar 6, fullest in ch5
    drums = (seg(6, 10, 0.55) + seg(10, CH["engine"], 0.85)
             + seg(CH["engine"], CH["m2"], 0.95)
             + seg(CH["m2"], CH["m4"], 0.92)
             + seg(CH["m4"], CH["m6"], 1.0)
             + seg(CH["m6"], CH["cta"], 1.08)
             + seg(CH["cta"], NBARS, 0.80))
    # pull back into each chapter change so the transition has somewhere to go
    for edge in (CH["engine"], CH["m2"], CH["m4"], CH["m6"], CH["cta"]):
        drums[max(0, edge - 1):edge] *= 0.45

    bass = (seg(8, CH["engine"], 0.8) + seg(CH["engine"], CH["m2"], 0.95)
            + seg(CH["m2"], CH["m4"], 0.92) + seg(CH["m4"], CH["m6"], 1.0)
            + seg(CH["m6"], CH["cta"], 1.05) + seg(CH["cta"], NBARS, 0.75))

    pluck = (seg(12, CH["engine"], 0.6) + seg(CH["engine"], CH["m2"], 0.85)
             + seg(CH["m2"], CH["m4"], 1.0) + seg(CH["m4"], CH["m6"], 1.0)
             + seg(CH["m6"], CH["cta"], 1.0) + seg(CH["cta"], NBARS, 0.7))

    # the arp is the clearest "scale-up" signal: absent early, brightest in ch5
    arp = (seg(CH["engine"] + 6, CH["m2"], 0.55) + seg(CH["m2"], CH["m4"], 0.75)
           + seg(CH["m4"], CH["m6"], 0.95) + seg(CH["m6"], CH["cta"], 1.15)
           + seg(CH["cta"], NBARS, 0.5))

    # counter-melody enters with the M4 chapter and stays
    counter = seg(CH["m4"], CH["m6"], 0.7) + seg(CH["m6"], CH["cta"], 1.0)

    return {"pad": pad, "drums": drums, "bass": bass,
            "pluck": pluck, "arp": arp, "counter": counter}


def build_bed_lf():
    n = NTOT
    E = _energy_lf()
    pad = np.zeros(n); drums = np.zeros(n); bass = np.zeros(n)
    pluck = np.zeros(n); arp = np.zeros(n)

    for bar in range(NBARS):
        b0 = bar * SPB
        ch = G.PROG[bar % 4]
        root = G.BASS_ROOT[bar % 4]
        gp, gd, gb, gl, ga, gc = (E[k][bar] for k in
                                  ("pad", "drums", "bass", "pluck", "arp", "counter"))
        # stereo width and filter opening both track the chapter arc
        openness = 1100 + 950 * min(1.0, gp) + 420 * min(1.0, ga)

        if gp > 0.01:
            G._place(pad, b0, G._pad(ch, BAR * 1.02, 300, openness, g=min(1.0, gp)))

        if gd > 0.01:
            for i in range(4):
                at = b0 + int(i * BEAT * SR)
                G._place(drums, at, G._kick() * min(1.0, gd))
                if i in (1, 3):
                    G._place(drums, at, G._snap() * min(1.0, gd))
                G._place(drums, at, G._hat(fc=8600) * gd * 0.9)
                off = at + int(BEAT * 0.52 * SR)
                G._place(drums, off, G._hat(fc=7600, open_=(i == 3 and bar % 4 == 3)) * gd)
            if bar % 8 == 7:
                G._place(drums, b0 + int(3.5 * BEAT * SR), G._rim() * gd)
            if gd > 1.0:  # ch5/ch6 extra percussion — the widest drum mix
                G._place(drums, b0 + int(2.5 * BEAT * SR), G._rim() * 0.6)

        if gb > 0.01:
            G._place(bass, b0, G._bass(root, BEAT * 1.45) * gb)
            G._place(bass, b0 + int(BEAT * 1.5 * SR), G._bass(root, BEAT * 0.45) * gb * 0.8)
            G._place(bass, b0 + int(BEAT * 2.0 * SR), G._bass(root, BEAT * 0.9) * gb * 0.9)
            G._place(bass, b0 + int(BEAT * 3.0 * SR), G._bass(root * 1.5, BEAT * 0.5) * gb * 0.7)
            G._place(bass, b0 + int(BEAT * 3.5 * SR),
                     G._bass(root, BEAT * 0.5, glide=root * 0.75) * gb * 0.7)

        if gl > 0.01:
            mel = [ch[2], ch[1], ch[2] * 1.5, ch[0]][bar % 4]
            G._place(pluck, b0 + int(BEAT * 0.5 * SR), G._pluck(mel, 0.46, g=gl))
            G._place(pluck, b0 + int(BEAT * 2.5 * SR), G._pluck(ch[1], 0.38, g=gl * 0.75))
        if gc > 0.01:
            G._place(pluck, b0 + int(BEAT * 3.25 * SR), G._pluck(ch[2] * 1.5, 0.30, g=gc * 0.55))
            G._place(pluck, b0 + int(BEAT * 1.75 * SR), G._pluck(ch[0] * 2, 0.26, g=gc * 0.38))

        if ga > 0.01:
            pat = [ch[0], ch[1], ch[2], ch[1] * 2, ch[2], ch[1], ch[0] * 2, ch[1]]
            for i in range(8):
                at = b0 + int(i * BEAT * 0.5 * SR)
                G._place(arp, at, G._arp_note(pat[i % 8] * 2, 0.19,
                                              g=min(1.15, ga) * (1.0 if i % 2 == 0 else 0.62)))

    # CTA resolve across the final chapter
    cta_at = CH["cta"] * SPB
    res = np.zeros(n)
    for i, (fr, g) in enumerate(((220.0, 0.8), (329.63, 0.6), (440.0, 0.45), (659.25, 0.3))):
        d = cta_at + int(i * 0.10 * SR)
        if d >= n:
            continue
        seg_n = n - d
        res[d:] += (G.sine(fr, seg_n) + G.sine(fr * 2.001, seg_n) * 0.28) * G.expd(seg_n, 2.6) * g
    res = G.comb_verb(G.hpf(res, 130), wet=0.42) * 0.10

    mix = pad * 1.0 + drums * 0.52 + bass * 0.60 + pluck * 0.46 + arp * 0.34 + res
    mix = np.tanh(G.hpf(mix, 30) * 1.25) * 0.80

    ramp = int(1.2 * SR)
    mix[:ramp] *= np.linspace(0, 1, ramp)
    mix[-int(0.8 * SR):] *= np.linspace(1, 0, int(0.8 * SR))

    # width opens across the runtime, narrow at the open and widest by ch5
    st = G.stereo(mix, width=0.44, pre=0.013)
    m = np.abs(st).max()
    if m > 0:
        st = st / m * 0.84
    G.wr("music-bed-longform", st)
    return "music-bed-longform"


def main() -> int:
    print("=" * 66)
    print("MOTU M-Series — LONG-FORM audio  (extends the reel palette)")
    print(f"  120 BPM · {NBARS} bars · {LF_SECONDS:.3f} s · A minor")
    print("=" * 66)

    print("\n[1/4] extra long-form cues")
    for c in build_extra_cues():
        G.encode(c, SFX_DIR)
        print(f"      {c}.mp3")

    print("\n[2/4] constant ambient bed (298 s)")
    G.encode(build_ambient_lf(), SFX_DIR, exact_seconds=LF_SECONDS)
    print("      ambient-longform.mp3")

    print("\n[3/4] music bed (298 s, six-chapter arc)")
    G.encode(build_bed_lf(), SFX_DIR, exact_seconds=LF_SECONDS)
    print("      music-bed-longform.mp3")

    print("\n[4/4] silent voiceover placeholder")
    G.wr("voiceover-longform", np.zeros((NTOT, 2)))
    G.encode("voiceover-longform", VO_DIR, exact_seconds=LF_SECONDS)
    print("      vo/voiceover-longform.mp3")

    print("\nOK — long-form audio written")
    return 0


if __name__ == "__main__":
    sys.exit(main())
