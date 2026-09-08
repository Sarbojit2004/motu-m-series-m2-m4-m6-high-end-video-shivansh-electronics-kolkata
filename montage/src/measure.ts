import { DISPLAY_ADV, TAG_ADV } from "./metrics";

/**
 * Headline sizing happens at build time, so widths come from the real font
 * metrics (see scripts/gen_metrics.mjs) rather than an estimate. `TRACK` is
 * the letter-spacing applied in Type.tsx, in em, and has to be counted too.
 */
const TRACK = -0.012;

export const estUnits = (text: string, adv = DISPLAY_ADV) =>
  text.split("").reduce((a, c) => a + (adv[c] ?? 0.5) + TRACK, 0);

export const estWidth = (text: string, size: number, adv = DISPLAY_ADV) =>
  estUnits(text, adv) * size;

/** Largest size at which `text` is at most `maxW` wide, capped at `maxSize`. */
export const fit = (text: string, maxW: number, maxSize: number) =>
  Math.min(maxSize, maxW / Math.max(0.35, estUnits(text)));

export const tagWidth = (text: string, size: number) =>
  estUnits(text, TAG_ADV) * size;
