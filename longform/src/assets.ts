import { staticFile } from "remotion";

/**
 * CURATED ASSET SELECTION (Section 0.1).
 *
 * 32 image files ship in this repository. Two of them are BYTE-IDENTICAL
 * duplicates of others — confirmed by md5 AND by visual inspection, not by
 * filename similarity:
 *
 *   MOTU M4 (8).jpg  ==  MOTU M6 (11).jpg   -> not a product shot at all; it is
 *     the Performer Lite / Ableton Live Lite / MOTU instrument bundle montage.
 *     Reclassified as a SHARED software-UI asset (`shSoftware`), used once.
 *   MOTU M2 (10).jpg ==  MOTU M4 (3).jpg    -> a wide podcast-room shot in which
 *     the interface is too small to attribute to either model. Reclassified as
 *     SHARED lifestyle (`shRoom`).
 *
 * That leaves 30 unique images. 27 are selected below. The three deliberately
 * left out, with reasons:
 *
 *   MOTU M2 (5).jpg  — unit too small in frame; `m2Glass` tells the same story
 *                      better and at higher resolution.
 *   MOTU M4 (1).jpg  — wide studio desk with the unit tiny; fully superseded by
 *                      `m4Desk`, which is the same idea with the LCD legible.
 *   MOTU M6 (6).jpg  — redundant with `m6Bright`, which is better lit and shows
 *                      more of the unit.
 *
 * Selection is NOT equal across products: M6 carries 10 and M2 carries 7,
 * because M6's photography is genuinely the strongest in the set (3000px-class,
 * best-lit) and it carries the most narrative weight. Neither product is padded
 * to match the other.
 *
 * NO VIDEO CLIPS exist in this repository — verified by scanning the whole
 * working tree for .mp4/.mov. Every asset here is a still.
 *
 * `bg` drives the Plate framing rule (see components/Media.tsx) and is measured
 * from actual border pixels, alpha-aware: an alpha-keyed PNG always counts as
 * `light` because it composites straight onto the light page.
 */
export type Product = "m2" | "m4" | "m6" | "shared";
export type Bg = "light" | "mixed" | "dark";

export type AssetMeta = {
  key: string;
  file: string;
  product: Product;
  kind: string;
  w: number;
  h: number;
  bg: Bg;
  alpha: boolean;
  ext: string;
};

export const ASSETS: AssetMeta[] = [
  { key: "m2Front", file: "MOTU M2 (2).png", product: "m2", kind: "panel-front", w: 1212, h: 301, bg: "light", alpha: true, ext: "png" },
  { key: "m2Rear", file: "MOTU M2 (9).png", product: "m2", kind: "panel-rear", w: 2013, h: 500, bg: "light", alpha: true, ext: "png" },
  { key: "m2Hero", file: "MOTU M2 (8).jpg", product: "m2", kind: "hero", w: 1879, h: 948, bg: "light", alpha: false, ext: "jpg" },
  { key: "m2Desk", file: "MOTU M2 (1).jpg", product: "m2", kind: "lifestyle", w: 2880, h: 1396, bg: "mixed", alpha: false, ext: "jpg" },
  { key: "m2Couch", file: "MOTU M2 (4).jpg", product: "m2", kind: "lifestyle", w: 1442, h: 873, bg: "mixed", alpha: false, ext: "jpg" },
  { key: "m2Glass", file: "MOTU M2 (3).jpg", product: "m2", kind: "lifestyle", w: 1442, h: 873, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m2Dark", file: "MOTU M2 (6).jpg", product: "m2", kind: "ambient", w: 2880, h: 1516, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m4Front", file: "MOTU M4 (1).png", product: "m4", kind: "panel-front", w: 1212, h: 301, bg: "light", alpha: true, ext: "png" },
  { key: "m4Rear", file: "MOTU M4 (2).png", product: "m4", kind: "panel-rear", w: 1212, h: 301, bg: "light", alpha: true, ext: "png" },
  { key: "m4Hero", file: "MOTU M4 (4).jpg", product: "m4", kind: "hero", w: 2102, h: 1061, bg: "light", alpha: false, ext: "jpg" },
  { key: "m4Synth", file: "MOTU M4 (6).jpg", product: "m4", kind: "lifestyle", w: 1000, h: 873, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m4Desk", file: "MOTU M4 (7).jpg", product: "m4", kind: "lifestyle", w: 2880, h: 1516, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m4Drums", file: "MOTU M4 (5).jpg", product: "m4", kind: "lifestyle", w: 2880, h: 1396, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m4Cable", file: "MOTU M4 (2).jpg", product: "m4", kind: "detail", w: 1442, h: 873, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Front", file: "MOTU M6 (1).png", product: "m6", kind: "hero-front", w: 2442, h: 749, bg: "light", alpha: true, ext: "png" },
  { key: "m6Rear", file: "MOTU M6 (2).png", product: "m6", kind: "panel-rear", w: 3530, h: 800, bg: "light", alpha: true, ext: "png" },
  { key: "m6Macro", file: "MOTU M6 (1).jpg", product: "m6", kind: "macro-lcd", w: 911, h: 591, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Dark", file: "MOTU M6 (10).jpg", product: "m6", kind: "hero", w: 3000, h: 2085, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Panel", file: "MOTU M6 (5).jpg", product: "m6", kind: "lifestyle", w: 3000, h: 2223, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Drums", file: "MOTU M6 (4).jpg", product: "m6", kind: "lifestyle", w: 2830, h: 2737, bg: "light", alpha: false, ext: "jpg" },
  { key: "m6Low", file: "MOTU M6 (3).jpg", product: "m6", kind: "lifestyle", w: 3000, h: 2000, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Couch", file: "MOTU M6 (9).jpg", product: "m6", kind: "lifestyle", w: 2830, h: 2737, bg: "mixed", alpha: false, ext: "jpg" },
  { key: "m6Bright", file: "MOTU M6 (8).jpg", product: "m6", kind: "lifestyle", w: 3000, h: 2101, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Studio", file: "MOTU M6 (2).jpg", product: "m6", kind: "lifestyle", w: 2777, h: 1947, bg: "dark", alpha: false, ext: "jpg" },
  { key: "shSoftware", file: "MOTU M4 (8).jpg", product: "shared", kind: "software-ui", w: 2880, h: 834, bg: "light", alpha: false, ext: "jpg" },
  { key: "shRoom", file: "MOTU M2 (10).jpg", product: "shared", kind: "lifestyle", w: 1442, h: 873, bg: "dark", alpha: false, ext: "jpg" },
  { key: "shLive", file: "MOTU M6 (7).jpg", product: "shared", kind: "emotional", w: 3000, h: 1740, bg: "dark", alpha: false, ext: "jpg" },
];

/** Semantic handles, so scenes never reference a bare integer. */
export const A = {
  m2Front: 0,
  m2Rear: 1,
  m2Hero: 2,
  m2Desk: 3,
  m2Couch: 4,
  m2Glass: 5,
  m2Dark: 6,
  m4Front: 7,
  m4Rear: 8,
  m4Hero: 9,
  m4Synth: 10,
  m4Desk: 11,
  m4Drums: 12,
  m4Cable: 13,
  m6Front: 14,
  m6Rear: 15,
  m6Macro: 16,
  m6Dark: 17,
  m6Panel: 18,
  m6Drums: 19,
  m6Low: 20,
  m6Couch: 21,
  m6Bright: 22,
  m6Studio: 23,
  shSoftware: 24,
  shRoom: 25,
  shLive: 26,
} as const;

export type AssetKey = keyof typeof A;

export const meta = (idx: number): AssetMeta => {
  const a = ASSETS[idx];
  if (!a) throw new Error(`No asset at index ${idx}`);
  return a;
};

/** Images are copied to a flat, index-named directory by copy-assets.mjs. */
export const img = (idx: number): string =>
  staticFile(`img/${String(idx).padStart(2, "0")}-${meta(idx).key}.${meta(idx).ext}`);

export const LOGO = {
  motu: () => staticFile("logo/motu.png"),
  shivansh: () => staticFile("logo/shivansh.png"),
};

/**
 * SFX (Section 9).
 *
 * `reuse/` holds the five sound files pulled DIRECTLY from the MOTU AVB
 * ecosystem repository's committed `public/audio/sfx/` — real, already-produced
 * audio, not a style reference. `new/` holds the four sounds synthesized for
 * this project because the AVB set genuinely does not cover them.
 */
export const REUSED_SFX = [
  "encoder-click",
  "talkback-click",
  "avb-ping",
  "data-stream",
  "rj45-snap",
] as const;

export const NEW_SFX = ["xlr-lock", "usbc-seat", "counter-tick", "panel-air"] as const;

export type SfxKey = (typeof REUSED_SFX)[number] | (typeof NEW_SFX)[number];

export const SFX = (k: SfxKey): string =>
  staticFile(
    `audio/sfx/${(REUSED_SFX as readonly string[]).includes(k) ? "reuse" : "new"}/${k}.wav`
  );

/** Music stems, copied from the AVB repository's `sound-effects/` directory. */
export const MUSIC = (slug: string): string => staticFile(`audio/music/${slug}.mp3`);

/** Placeholder narration slot (Section 8). */
export const VO = (): string => staticFile("vo/voiceover-longform.mp3");
