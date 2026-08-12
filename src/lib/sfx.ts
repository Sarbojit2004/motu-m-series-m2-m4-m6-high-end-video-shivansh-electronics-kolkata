import {staticFile} from 'remotion';

/**
 * Every cue is synthesised from scratch by scripts/gen_audio.py (numpy/scipy —
 * biquad filters, envelopes, comb reverb, stereo widening). No external audio
 * service is involved anywhere in this project; in particular none of the
 * ElevenLabs-based tooling in claude-code-video-toolkit is used.
 *
 * scripts/audit_audio.py cross-references this table against
 * public/audio/sfx and FAILS if a name here has no file on disk, so a render
 * can never silently drop a transition.
 *
 * The cues are voiced for this project's DELIBERATE pace. Transitions land
 * roughly every 6-7 seconds rather than in a rapid montage, so each one is a
 * weighted, resolving sound with a real tail — not a clipped rapid-cut tick
 * played more slowly.
 */
export const CUE = {
  // -- signature: the shared-DAC motif stamping onto a chassis -------------
  'chip-stamp': 'audio/sfx/chip-stamp.mp3',
  // -- the LCD coming alive ------------------------------------------------
  'meter-bloom': 'audio/sfx/meter-bloom.mp3',
  // -- tactile hardware ---------------------------------------------------
  'knob-detent': 'audio/sfx/knob-detent.mp3',
  'phantom-click': 'audio/sfx/phantom-click.mp3',
  'jack-seat': 'audio/sfx/jack-seat.mp3',
  // -- camera moves -------------------------------------------------------
  'slide-pan': 'audio/sfx/slide-pan.mp3',
  'push-in': 'audio/sfx/push-in.mp3',
  'air-open': 'audio/sfx/air-open.mp3',
  // -- weight -------------------------------------------------------------
  'impact-deep': 'audio/sfx/impact-deep.mp3',
  'impact-soft': 'audio/sfx/impact-soft.mp3',
  'sub-bloom': 'audio/sfx/sub-bloom.mp3',
  // -- lift ---------------------------------------------------------------
  'riser-warm': 'audio/sfx/riser-warm.mp3',
  'reverse-swell': 'audio/sfx/reverse-swell.mp3',
  // -- data / technical ---------------------------------------------------
  'voltage-line': 'audio/sfx/voltage-line.mp3',
  'count-tick': 'audio/sfx/count-tick.mp3',
  latch: 'audio/sfx/latch.mp3',
  tick: 'audio/sfx/tick.mp3',
  'tick-hi': 'audio/sfx/tick-hi.mp3',
  // -- resolve ------------------------------------------------------------
  'shimmer-warm': 'audio/sfx/shimmer-warm.mp3',
  'chime-final': 'audio/sfx/chime-final.mp3',
} as const;

export type CueName = keyof typeof CUE;

/**
 * MASTER MIX TRIM.
 *
 * The three layers sum, and each synthesised file is normalised to roughly
 * 0.86-0.92 peak, so an unscaled ambient + bed + loud transition cue landing on
 * the same frame drove the rendered master to 1.26 — digital clipping, measured
 * on a range test.
 *
 * These three numbers set the headroom while preserving the per-cue relative
 * balance designed in the scenes: adjust `cue` to move every transition hit
 * together rather than editing a hundred call sites. Values were chosen against
 * a measured worst-case stack and re-verified after the change.
 *
 * SFX deliberately stay prominent — the brief asks for genuinely audible,
 * present effects with final balancing done in post — so the trim buys
 * headroom, not quietness: the cues still sit clearly above the bed.
 */
export const MIX = {
  /** Constant ambient texture, under every frame. */
  ambient: 0.46,
  /** Music arrangement. */
  bed: 0.36,
  /** Global trim applied to every per-scene transition cue. */
  cue: 0.78,
} as const;

export const cue = (n: CueName): string => staticFile(CUE[n]);

/**
 * The constant ambient texture. One 88 s file, played once under the ENTIRE
 * runtime of both reels — prompt Section 8a requires a continuous low-level
 * presence rather than silence between transition cues.
 */
export const ambient = (): string => staticFile('audio/sfx/ambient-reel.mp3');

export const bed = (part: 1 | 2): string =>
  staticFile(`audio/sfx/music-bed-part${part}.mp3`);

export const vo = (part: 1 | 2): string =>
  staticFile(`vo/voiceover-reel-part${part}.mp3`);
