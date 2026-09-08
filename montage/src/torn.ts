import { mulberry } from "./rand";

/**
 * A ripped-paper outline as a CSS `clip-path: path()` string.
 *
 * `sides` selects which edges get torn - a strip of tape is torn along its
 * length but cut at the ends, a scrap of paper is torn all round.
 */
export const tornPath = (
  w: number,
  h: number,
  seed: number,
  amp = 0.016,
  sides: [boolean, boolean, boolean, boolean] = [true, true, true, true],
  steps = 22
) => {
  const r = mulberry(seed);
  const a = Math.min(w, h) * amp;
  const pts: string[] = [];
  const jitter = (on: boolean) => (on ? (r() - 0.5) * 2 * a : 0);

  // top: left -> right
  for (let i = 0; i <= steps; i++) {
    pts.push(`${((i / steps) * w).toFixed(1)},${jitter(sides[0]).toFixed(1)}`);
  }
  // right: top -> bottom
  for (let i = 1; i <= steps; i++) {
    pts.push(`${(w + jitter(sides[1])).toFixed(1)},${((i / steps) * h).toFixed(1)}`);
  }
  // bottom: right -> left
  for (let i = 1; i <= steps; i++) {
    pts.push(`${(w - (i / steps) * w).toFixed(1)},${(h + jitter(sides[2])).toFixed(1)}`);
  }
  // left: bottom -> top
  for (let i = 1; i < steps; i++) {
    pts.push(`${jitter(sides[3]).toFixed(1)},${(h - (i / steps) * h).toFixed(1)}`);
  }
  return `path("M ${pts.join(" L ")} Z")`;
};
