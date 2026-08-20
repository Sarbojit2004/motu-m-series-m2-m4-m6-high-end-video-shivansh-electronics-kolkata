import React from "react";
import { Audio, Sequence } from "remotion";
import { MUSIC, SFX, VO, type SfxKey } from "./assets";
import { BEATS, BEAT_STARTS, CHAPTER_SPANS, MUSIC_PLAN, TOTAL_FRAMES, frames } from "./schedule";
import { VIDEO } from "./theme";

/**
 * TWO-LAYER AUDIO (Section 9). Architecture pulled from the approved AVB
 * long-form build's `longform/src/Audio.tsx`.
 *
 * Layer 1 — music bed, assembled from the supplied stems per MUSIC_PLAN.
 * Layer 2 — the transition/foley layer. Unlike every prior build in this
 *           workflow, this layer is mostly REUSED rather than synthesized:
 *           five of the nine sounds are the real, finished files from the AVB
 *           repository. Only four are new, and only where the AVB set genuinely
 *           did not cover the M-Series' own compact-desktop hardware.
 *
 * Both layers are driven by the SAME schedule that drives the picture, and are
 * also exported as standalone compositions (MusicBedOnly / SfxTimelineOnly).
 * That is what guarantees the two deliverable WAVs drop straight onto the
 * timeline already in sync — they are not re-timed by hand, they are the same
 * arithmetic.
 */

const XFADE = 60; // 2 s crossfade at chapter seams

/** Measured stem lengths (seconds) — see scripts/validate-audio.mjs output. */
const STEM_SECONDS: Record<string, number> = {
  mindscape: 185.76,
  diablo: 170.54,
  blackblue: 159.53,
};

const trackOf = (slug: string) => slug.split("-")[0];

/**
 * Tiles one stem across `span` frames, relaying from a musical point 20 s in
 * rather than from the top when a chapter outlasts the stem.
 */
function tiles(slug: string, span: number, from: number) {
  const stemFrames = Math.floor(STEM_SECONDS[trackOf(slug)] * VIDEO.fps) - 2;
  const startOffset = Math.round(from * VIDEO.fps);
  const first = Math.min(span, stemFrames - startOffset);
  const out = [{ at: 0, len: first, trim: startOffset }];
  let filled = first;
  let guard = 0;
  while (filled < span && guard++ < 8) {
    const relayTrim = Math.round(20 * VIDEO.fps);
    const len = Math.min(span - filled + XFADE, stemFrames - relayTrim);
    out.push({ at: filled - XFADE, len: len + XFADE, trim: relayTrim });
    filled += len;
  }
  return out;
}

/**
 * Bed level — the single global trim that reserves headroom for narration.
 *
 * MEASURED, not inherited. The AVB long-form used 0.55, but that value does not
 * transfer: this build stacks FOUR stems at once in Ch4/Ch5/Ch7 (the M2 -> M4
 * -> M6 progression the brief's Dynamic Progression section asks for), where
 * the AVB chapters mostly stacked two or three. A first render at 0.55 measured
 * -14.2 dBFS RMS with peaks at -0.1 dBFS across Ch5 — loud enough to bury a
 * voice, and effectively no headroom left at all.
 *
 * 0.32 puts the loudest chapters near -19 dBFS RMS / -5 dBFS peak and the
 * quietest near -26 dBFS, which is a documentary bed a voice tracked around
 * -16 dBFS sits cleanly above without further ducking. The per-chapter stem
 * gains below were rebalanced at the same time so the build is still audible as
 * a build rather than as a level jump.
 *
 * Applied to the DEFAULT, so the standalone MusicBedOnly deliverable and the
 * bed embedded in the MP4 are the same mix at the same level — which is the
 * whole point of shipping the WAV.
 */
const BED_TRIM = 0.32;

export const MusicBed: React.FC<{ gain?: number }> = ({ gain = BED_TRIM }) => (
  <>
    {CHAPTER_SPANS.map((c) => {
      const plan = MUSIC_PLAN.find((p) => p.ch === c.ch);
      if (!plan) return null;
      const span = c.end - c.start;
      return (
        <Sequence key={c.ch} from={c.start} durationInFrames={span} name={`music-ch${c.ch}-${plan.track}`}>
          {plan.stems.map((s) =>
            tiles(s.slug, span, s.from ?? 0).map((t, i) => (
              <Sequence
                key={`${s.slug}-${i}`}
                from={t.at}
                durationInFrames={Math.min(t.len, span - t.at)}
                name={`${s.slug}${i ? `-relay${i}` : ""}`}
              >
                <Audio
                  src={MUSIC(s.slug)}
                  trimBefore={t.trim}
                  volume={(f) => {
                    const local = t.at + f;
                    const inC = Math.min(1, local / XFADE);
                    const outC = Math.min(1, (span - local) / XFADE);
                    const seam = i > 0 ? Math.min(1, f / XFADE) : 1;
                    const tail = i === 0 && t.len < span ? Math.min(1, (t.len - f) / XFADE) : 1;
                    return s.gain * gain * Math.max(0, Math.min(inC, outC, seam, tail));
                  }}
                />
              </Sequence>
            ))
          )}
        </Sequence>
      );
    })}
  </>
);

/**
 * SFX PLACEMENT (Section 9, Layer 2).
 *
 * Note the `encoder-click` runs: a knob TURN is built by placing the reused
 * single-detent file five to seven times at decreasing spacing, rather than
 * synthesizing a new "turn" sound. Reusing a proven file by placement is
 * preferable to regenerating an equivalent, which is exactly what Section 9
 * asks for.
 */
type Accent = { at: number; sfx: SfxKey; gain: number };

const ACCENTS: Accent[] = (() => {
  const out: Accent[] = [];
  const push = (at: number, sfx: SfxKey, gain: number) => out.push({ at, sfx, gain });

  /** Reused single detent, sequenced into a turn. */
  const knobTurn = (at: number, steps = 6, gain = 0.13) => {
    let t = at;
    for (let i = 0; i < steps; i++) {
      push(Math.round(t), "encoder-click", gain - i * 0.008);
      t += 8 - i * 0.6; // accelerating detents, as a hand speeds up
    }
  };

  BEATS.forEach((b, i) => {
    const start = BEAT_STARTS[i];
    const len = frames(b.sec);

    // transition hit, landing just before the cut
    push(Math.max(0, start - 5), b.sfx, 0.26);

    switch (b.kind) {
      case "counters":
        (b.counters ?? []).forEach((_, k) => push(start + Math.round(len * 0.3) + k * 11, "counter-tick", 0.16));
        break;
      case "specGrid":
        (b.specs ?? []).forEach((_, k) => push(start + Math.round(len * 0.32) + k * 9, "counter-tick", 0.15));
        break;
      case "capacity":
        for (let k = 0; k < 6; k++) push(start + 24 + k * 7, "counter-tick", 0.12);
        push(start + Math.round(len * 0.72), "avb-ping", 0.15);
        break;
      case "montage":
        b.images.forEach((_, k) => push(start + 14 + k * 6, "rj45-snap", 0.11));
        break;
      case "ecosystemMontage":
        b.images.forEach((_, k) => push(start + 8 + k * (b.soloHold ?? 48), "usbc-seat", 0.15));
        push(start + (b.soloHold ?? 48) * b.images.length + 6, "avb-ping", 0.16);
        break;
      case "portSweep":
        for (let k = 0; k < 5; k++) push(start + 18 + k * Math.round(len * 0.12), "encoder-click", 0.1);
        push(start + Math.round(len * 0.74), "xlr-lock", 0.16);
        break;
      case "macroReveal":
        push(start + Math.round(len * 0.35), "panel-air", 0.17);
        // The M4's Mix-knob beat is the one that earns a full turn.
        if (b.id === "c4-macro") knobTurn(start + Math.round(len * 0.5));
        break;
      case "macroPair":
        push(start + 20, "talkback-click", 0.18);
        push(start + Math.round(len * 0.55), "avb-ping", 0.14);
        break;
      case "coldOpen":
      case "editorial":
        push(start + Math.round(len * 0.4), "panel-air", 0.14);
        break;
      case "lcd":
        for (let k = 0; k < 4; k++) push(start + 22 + k * 10, "counter-tick", 0.1);
        break;
      case "loopback":
        push(start + 26, "data-stream", 0.17);
        push(start + Math.round(len * 0.55), "avb-ping", 0.15);
        break;
      case "cv":
        push(start + 24, "data-stream", 0.16);
        break;
      case "software":
        push(start + 20, "usbc-seat", 0.15);
        break;
      case "heroSplit":
        if (b.id === "c4-mix") knobTurn(start + 26, 7, 0.14);
        else push(start + Math.round(len * 0.4), "talkback-click", 0.13);
        break;
      case "titleCard":
        (b.pills ?? []).forEach((_, k) => push(start + 18 + k * 8, "counter-tick", 0.12));
        break;
      case "price":
        push(start + 30, "avb-ping", 0.18);
        push(start + 44, "avb-ping", 0.15);
        push(start + 58, "avb-ping", 0.13);
        break;
      case "outro":
      case "contact":
      case "brandBeat":
        push(start + 24, "avb-ping", 0.15);
        break;
      default:
        break;
    }
  });
  return out.filter((a) => a.at >= 0 && a.at < TOTAL_FRAMES);
})();

export const SFX_COUNT = ACCENTS.length;

export const SfxTimeline: React.FC<{ gain?: number }> = ({ gain = 1 }) => (
  <>
    {ACCENTS.map((a, i) => (
      <Sequence key={i} from={a.at} durationInFrames={130} name={`sfx-${a.sfx}-${a.at}`}>
        <Audio src={SFX(a.sfx)} volume={a.gain * gain} />
      </Sequence>
    ))}
  </>
);

/**
 * PLACEHOLDER NARRATION SLOT (Section 8).
 *
 * Drop the recorded narration at `public/vo/voiceover-longform.mp3` and flip
 * this to `true`. It is a compile-time constant rather than a runtime existence
 * check on purpose: Remotion renders frames across parallel workers, so a
 * fetch-and-setState probe would decide differently in different workers and
 * produce a master with the narration on some frames and not others.
 */
export const HAS_VOICEOVER = false;

export const Voiceover: React.FC = () => (HAS_VOICEOVER ? <Audio src={VO()} volume={1} /> : null);

/** Everything, as embedded in the delivered MP4. */
export const FullAudio: React.FC = () => (
  <>
    <MusicBed />
    <SfxTimeline />
    <Voiceover />
  </>
);
