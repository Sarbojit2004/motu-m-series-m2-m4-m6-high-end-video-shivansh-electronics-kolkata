// ─────────────────────────────────────────────────────────────────────────────
// THE ASSET LIBRARY
//
// Shapes are not written here — width, height, aspect and the bounding box of
// the real content are all measured off the files by scripts/prep_assets.py and
// imported from assets.generated.ts, so a shot cannot claim a shape a picture
// does not have. This file adds what a measurement cannot know: what each
// picture is OF, and where on the panel renders each control actually lives.
// ─────────────────────────────────────────────────────────────────────────────

export type AssetKind = "panel" | "hero" | "photo" | "logo";

export type Asset = {
  slug: string;
  file: string;
  kind: AssetKind;
  /** 2, 4 or 6 — or 0 for a logo. */
  model: number;
  w: number;
  h: number;
  /** Aspect ratio of the CONTENT, not of the canvas. */
  ar: number;
  /** Opaque content as [x0, y0, x1, y1] of the canvas, 0..1. */
  bbox: [number, number, number, number] | number[];
  transparent: boolean;
};

export type Clip = { slug: string; file: string; w: number; h: number; ar: number; dur: number };

import { ASSETS, CLIPS, REGION_LUM } from "./assets.generated.ts";
export { ASSETS, CLIPS, REGION_LUM };

/**
 * How far to pull a detail push down (or up) so every one lands on the same tone.
 *
 * These panels are near-black hardware; the measured regions run from 0.126 on
 * the M2's headphone corner to 0.315 on the M4's lit meter. At one fixed
 * brightness the dark end goes muddy and the lit meter blooms, and 64%-opacity
 * white type has to hold against both. This normalises each region to a common
 * ground, clamped so nothing is pushed so far that its own legending stops
 * being readable.
 */
export const dimFor = (region: string): number => {
  const lum = REGION_LUM[region];
  if (!lum) return 1.0;
  return Math.min(1.25, Math.max(0.62, 0.235 / lum));
};

const BY_SLUG = new Map(ASSETS.map((a) => [a.slug, a]));
const CLIP_BY_SLUG = new Map(CLIPS.map((c) => [c.slug, c]));

export const img = (slug: string): Asset => {
  const a = BY_SLUG.get(slug);
  if (!a) throw new Error(`asset "${slug}" is not in the library`);
  return a;
};

export const imgs = (...slugs: string[]): Asset[] => slugs.map(img);

/**
 * A clip, IF it is present.
 *
 * The ten deployment clips arrive through the repository rather than through
 * the build session, so both films have to be renderable without them. Every
 * shot that wants a clip carries a still fallback, and this returning null is
 * how it chooses. Nothing is ever a black hole waiting for an asset.
 */
export const clip = (slug: string): Clip | null => CLIP_BY_SLUG.get(slug) ?? null;

export const hasClips = (): boolean => CLIPS.length > 0;

// ── Detail regions ───────────────────────────────────────────────────────────
//
// Normalised rectangles on the panel renders, read off the files themselves.
// These are what let a shot push into the control the narration is naming — the
// four gain knobs while the voice says "four preamps", the MON button while it
// says "straight to the outputs" — instead of showing a whole box and hoping
// the viewer finds it.
//
// Every one is a crop of a render at least 1212 px on its short side, and the
// M6's front is 2442 px, so even the tightest push lands above the frame's own
// resolution. Nothing is stretched and nothing is sliced.
export type Region = { x: number; y: number; w: number; h: number };

const r = (x: number, y: number, w: number, h: number): Region => ({ x, y, w, h });

/** Region name -> [asset slug, rect]. Names match REGION_LUM in the generated file. */
export const REGIONS: Record<string, { slug: string; rect: Region }> = {
  "m2.inputs":   { slug: "m2-front", rect: r(0.020, 0.10, 0.360, 0.82) },
  "m2.meter":    { slug: "m2-front", rect: r(0.395, 0.12, 0.170, 0.72) },
  "m2.monitor":  { slug: "m2-front", rect: r(0.560, 0.05, 0.230, 0.90) },
  "m2.phones":   { slug: "m2-front", rect: r(0.780, 0.10, 0.200, 0.82) },
  "m2.usbc":     { slug: "m2-rear",  rect: r(0.330, 0.30, 0.240, 0.46) },
  "m2.midi":     { slug: "m2-rear",  rect: r(0.180, 0.22, 0.220, 0.62) },
  "m4.inputs":   { slug: "m4-front", rect: r(0.020, 0.10, 0.330, 0.82) },
  "m4.mix":      { slug: "m4-front", rect: r(0.355, 0.10, 0.145, 0.80) },
  "m4.meter":    { slug: "m4-front", rect: r(0.495, 0.12, 0.215, 0.72) },
  "m4.monitor":  { slug: "m4-front", rect: r(0.700, 0.05, 0.190, 0.90) },
  "m4.rearline": { slug: "m4-rear",  rect: r(0.780, 0.15, 0.200, 0.75) },
  "m6.gains":    { slug: "m6-front", rect: r(0.045, 0.32, 0.360, 0.62) },
  "m6.mix":      { slug: "m6-front", rect: r(0.400, 0.32, 0.130, 0.62) },
  "m6.meter":    { slug: "m6-front", rect: r(0.520, 0.36, 0.180, 0.52) },
  "m6.monitor":  { slug: "m6-front", rect: r(0.690, 0.30, 0.180, 0.66) },
  "m6.phones":   { slug: "m6-front", rect: r(0.830, 0.32, 0.150, 0.62) },
  "m6.rearmic":  { slug: "m6-rear",  rect: r(0.520, 0.12, 0.460, 0.80) },
  "m6.power":    { slug: "m6-rear",  rect: r(0.030, 0.12, 0.220, 0.80) },
};

// ── Named groups ─────────────────────────────────────────────────────────────

/** The three front panels, small to large — the lineup the range argument needs. */
export const FRONTS = ["m2-front", "m4-front", "m6-front"] as const;
export const REARS = ["m2-rear", "m4-rear", "m6-rear"] as const;

/** Isolated studio shots on white. */
export const HEROES = ["m2-08", "m4-04"] as const;

/** The unit in a room, by model — manufacturer photography. */
export const IN_SITU: Record<number, string[]> = {
  2: ["m2-01", "m2-10", "m2-04", "m2-06", "m2-05", "m2-03"],
  4: ["m4-05", "m4-07", "m4-01", "m4-03", "m4-02", "m4-06"],
  6: ["m6-03", "m6-05", "m6-08", "m6-02", "m6-07", "m6-10", "m6-06", "m6-04", "m6-09"],
};

/** Everything in a room, largest and most legible first — the general pool. */
export const ROOMS = [
  "m6-03", "m6-05", "m6-08", "m4-05", "m2-06", "m6-02",
  "m6-07", "m4-07", "m2-01", "m6-10", "m4-01", "m6-06",
  "m2-10", "m6-04", "m4-03", "m2-04", "m6-09", "m4-02",
] as const;

/** Rooms with people visibly in them. */
export const PEOPLE = ["m2-05", "m4-06", "m6-07", "m6-04"] as const;
