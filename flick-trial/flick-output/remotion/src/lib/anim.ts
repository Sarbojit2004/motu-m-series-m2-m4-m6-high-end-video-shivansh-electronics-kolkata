import { Easing, interpolate } from "remotion";

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.33, 1, 0.68, 1),
  linear: Easing.linear,
};

export const ramp = (f: number, start: number, len: number, easing = EASE.out) =>
  interpolate(f, [start, start + len], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing,
  });

export const mapClamp = (
  f: number, input: readonly [number, number], output: readonly [number, number], easing = EASE.inOut
) => interpolate(f, input as unknown as number[], output as unknown as number[], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp", easing,
});

/** Scene-level fade so concatenated scenes join without a hard flash. */
export const inOut = (f: number, dur: number, i = 10, o = 9) =>
  Math.min(ramp(f, 0, i), 1 - ramp(f, dur - o, o, EASE.inOut));

/**
 * Gimbal Micro-Movement — sub-pixel drift plus a very shallow scale creep at
 * incommensurate periods, so the motion never visibly repeats. Makes a still
 * photograph feel physically alive without reading as an effect.
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

export const countUp = (f: number, start: number, len: number, to: number, from = 0) =>
  from + (to - from) * ramp(f, start, len, EASE.out);
