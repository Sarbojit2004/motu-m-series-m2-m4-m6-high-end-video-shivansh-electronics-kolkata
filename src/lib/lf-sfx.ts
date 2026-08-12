import {staticFile} from 'remotion';
import {CUE, CueName} from './sfx';

/**
 * Long-form audio wiring.
 *
 * The transition-cue palette is the reel series' palette, imported unchanged —
 * Section 7a asks for continuity with the companion reels rather than a second
 * sonic identity. Three cues exist only here, because the reels had no chapter
 * breaks and no branding beats to score:
 *
 *   chapter-mark  the weighted move between product chapters
 *   brand-in      a soft warm arrival for a Shivansh / MOTU branding beat
 *   spec-reveal   a spec figure latching in, richer than the reels' `latch`
 *
 * scripts/audit_audio.py cross-references this file as well as sfx.ts against
 * public/audio/sfx and fails if any name here has no file on disk.
 */
export const LF_CUE = {
  ...CUE,
  'chapter-mark': 'audio/sfx/chapter-mark.mp3',
  'brand-in': 'audio/sfx/brand-in.mp3',
  'spec-reveal': 'audio/sfx/spec-reveal.mp3',
} as const;

export type LFCueName = CueName | 'chapter-mark' | 'brand-in' | 'spec-reveal';

/**
 * MASTER MIX TRIM — same reasoning as the reels' MIX.
 *
 * The layers sum and each synthesised file peaks near 0.9, so an unscaled
 * ambient + bed + cue landing on one frame clips. These numbers buy headroom
 * while keeping the per-cue balance the scenes were written against. SFX stay
 * deliberately prominent: Section 7a asks for genuinely audible, present
 * effects with final balancing done in post.
 *
 * The bed sits slightly lower than the reels' because a 298 s runtime carries
 * far more spoken narration, and the VO has to sit on top of it comfortably.
 */
export const LF_MIX = {
  ambient: 0.44,
  bed: 0.32,
  cue: 0.76,
} as const;

export const lfCue = (n: LFCueName): string => staticFile(LF_CUE[n]);

/** The constant ambient texture — one 298 s file under every frame. */
export const lfAmbient = (): string => staticFile('audio/sfx/ambient-longform.mp3');

export const lfBed = (): string => staticFile('audio/sfx/music-bed-longform.mp3');

export const lfVo = (): string => staticFile('vo/voiceover-longform.mp3');
