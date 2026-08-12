import {Easing, interpolate, spring} from 'remotion';
import {FPS} from './theme';

// Creative brief Section 7, verbatim: "All virtual camera movements and asset
// animations must utilise buttery, eased interpolation (cubic-bezier easing).
// Linear movements feel cheap and robotic."
//
// Nothing in this project interpolates linearly. `ramp` defaults to a premium
// ease-out and every helper below routes through it.

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_SOFT = Easing.bezier(0.33, 1, 0.68, 1);
/** Long, weighted camera moves — the slide-pan and macro push-in. */
export const EASE_CAMERA = Easing.bezier(0.42, 0, 0.24, 1);

/** Clamped interpolate with a premium default ease. */
export const ramp = (
  f: number,
  range: [number, number],
  out: [number, number],
  easing = EASE_OUT,
): number =>
  interpolate(f, range, out, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

/** Fade-in / hold / fade-out envelope. */
export const envelope = (f: number, dur: number, inF = 10, outF = 10): number =>
  Math.min(ramp(f, [0, inF], [0, 1]), ramp(f, [dur - outF, dur], [1, 0], EASE_IN_OUT));

/**
 * Scene entry ramp. Scenes render OVERLAP frames longer than their slot so the
 * incoming scene cross-dissolves over the outgoing one rather than dipping to
 * the ground colour at every cut.
 */
export const sceneIn = (f: number, n = 10): number => ramp(f, [0, n], [0, 1], EASE_IN_OUT);

export const pop = (f: number, delay = 0, damping = 14): number =>
  spring({frame: f - delay, fps: FPS, config: {damping, mass: 0.55, stiffness: 120}});

export const popSoft = (f: number, delay = 0): number =>
  spring({frame: f - delay, fps: FPS, config: {damping: 200, mass: 0.9, stiffness: 90}});

/**
 * Camera move applied to a whole PLATE (frame + image together), expressed as
 * a transform string.
 *
 * This is the no-crop replacement for a conventional Ken Burns. A Ken Burns
 * scales the image INSIDE a fixed frame, so the frame necessarily crops the
 * edges away. Here the entire plate scales and drifts, so the photograph stays
 * complete at every frame — the whole subject is always visible — while the
 * shot still reads as a slow, eased push-in.
 *
 * `z` stays close to 1 because the plate is already sized to the safe rect;
 * a large scale would push it into the side margins.
 */
export const plateMove = (
  f: number,
  dur: number,
  z: [number, number] = [1.0, 1.035],
  x: [number, number] = [0, 0],
  y: [number, number] = [0, 0],
  easing = EASE_CAMERA,
): string => {
  const t = dur <= 0 ? 0 : ramp(f, [0, dur], [0, 1], easing);
  const s = z[0] + (z[1] - z[0]) * t;
  const tx = x[0] + (x[1] - x[0]) * t;
  const ty = y[0] + (y[1] - y[0]) * t;
  return `translate3d(${tx}px, ${ty}px, 0) scale(${s})`;
};

/** Index -> delay, for staggered reveals. */
export const stag = (i: number, per = 4, base = 0): number => base + i * per;

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rnd = (seed: number): number => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Beat index + local frame for a slot that steps through `count` items over
 * `dur` frames. Used sparingly here — only where a scene genuinely presents a
 * sequence (e.g. three tracking scenarios), never as a coverage mechanism.
 */
export const beat = (
  f: number,
  dur: number,
  count: number,
): {i: number; local: number; per: number; t: number} => {
  const per = dur / Math.max(1, count);
  const i = Math.min(count - 1, Math.max(0, Math.floor(f / per)));
  return {i, local: f - i * per, per, t: (f - i * per) / per};
};

/**
 * Pseudo-audio meter level for the animated LCD.
 *
 * The brief asks that the on-screen meters "animate dynamically, bouncing as
 * if reacting to an invisible, rhythmic audio track". The music bed is 120 BPM
 * (60 frames per bar, 15 per beat), so the envelope is locked to that grid: a
 * sharp attack on each beat with a slower release, plus a per-channel offset
 * and a little deterministic noise so the bars do not move in lockstep.
 */
export const meterLevel = (f: number, ch: number, base = 0.55): number => {
  const beatLen = FPS / 2; // 15 frames at 120 BPM
  const phase = (f + ch * 3.1) % beatLen;
  const hit = Math.exp(-phase / (beatLen * 0.34));
  const swell = 0.5 + 0.5 * Math.sin((f / FPS) * 0.9 + ch * 1.7);
  const jitter = rnd(Math.floor(f / 3) * 7 + ch * 13) * 0.12;
  // Scaled so the bars live mostly in the green, peak into yellow, and only
  // rarely touch red — i.e. correct gain staging, which is the whole point the
  // metering scene is making. A meter pinned at red would undercut it, and one
  // that never leaves green would look static.
  const v = base * (0.36 + swell * 0.34) + hit * 0.36 + jitter;
  return Math.max(0.05, Math.min(1, v));
};
