import { interpolate, Easing } from "remotion";

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
  linear: Easing.linear,
};

/** 0→1 ramp starting at `start`, lasting `len` frames, clamped both ends. */
export const ramp = (
  frame: number,
  start: number,
  len: number,
  easing = EASE.out
): number =>
  interpolate(frame, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Map with both ends clamped. */
export const mapClamp = (
  frame: number,
  input: readonly [number, number],
  output: readonly [number, number],
  easing = EASE.inOut
): number =>
  interpolate(frame, input as unknown as number[], output as unknown as number[], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Fade in at the head of a beat and out at its tail. */
export const inOut = (
  frame: number,
  duration: number,
  inLen = 14,
  outLen = 12
): number => Math.min(ramp(frame, 0, inLen), 1 - ramp(frame, duration - outLen, outLen, EASE.inOut));

/**
 * Gimbal micro-movement (Section 3). A very small continuous scale creep paired
 * with sub-pixel positional drift on X and Y at incommensurate periods, so the
 * motion never visibly repeats. Simulates an operator holding a stabilised
 * gimbal — it makes static photography feel physically alive without reading
 * as an effect.
 */
export function gimbal(frame: number, seed = 0, amount = 1) {
  const t = frame / 30;
  return {
    x: (Math.sin(t * 0.31 + seed * 1.7) * 2.6 + Math.sin(t * 0.13 + seed) * 1.4) * amount,
    y: (Math.cos(t * 0.24 + seed * 2.3) * 2.1 + Math.cos(t * 0.09 + seed * 0.6) * 1.1) * amount,
    scale: 1 + (Math.sin(t * 0.07 + seed * 0.9) * 0.0035 + 0.0035) * amount,
    rot: Math.sin(t * 0.11 + seed * 1.3) * 0.09 * amount,
  };
}

/** Deterministic 0..1 PRNG for decorative placement. */
export function rand(seed: number): () => number {
  let s = (seed * 2654435761) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Count a number up, with easing, for the Stage 10 animated spec counters. */
export const countUp = (
  frame: number,
  start: number,
  len: number,
  to: number,
  from = 0
): number => from + (to - from) * ramp(frame, start, len, EASE.out);

/** Format an integer with Indian-English thousands grouping. */
export const group = (n: number): string => Math.round(n).toLocaleString("en-IN");
