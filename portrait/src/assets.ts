import { staticFile } from "remotion";

/**
 * PORTRAIT TARGET SET — ALL 30 UNIQUE IMAGES.
 *
 * This is a fixed, named target, not a curation judgment. It is:
 *
 *   the 27 images the 298 s landscape video actually used, read from that
 *   build's own committed ASSET_COVERAGE.md rather than re-derived,
 *   PLUS the 3 images both prior builds had excluded, now included by direct
 *   instruction which overrides the exclusion reasoning that was given:
 *
 *     m2Alt = MOTU M2 (5).jpg   (was: "unit too small, m2Glass tells it better")
 *     m4Alt = MOTU M4 (1).jpg   (was: "superseded by m4Desk")
 *     m6Alt = MOTU M6 (6).jpg   (was: "redundant with m6Bright")
 *
 * Each of the three is verified DISTINCT (md5 + dimensions) from the image that
 * superseded it, and appears ALONGSIDE it, never instead of it:
 *   m2Alt 1000x873  vs  m2Glass  1442x873
 *   m4Alt 1442x873  vs  m4Desk   2880x1516
 *   m6Alt 2821x1529 vs  m6Bright 3000x2101
 *
 * 27 + 3 = 30, with zero overlap between the two sets. The repository holds 32
 * raw files; the 2 not present here are `MOTU M4 (3).jpg` and
 * `MOTU M6 (11).jpg`, re-confirmed byte-identical to `shRoom` and `shSoftware`
 * respectively. They are collapsed, not dropped — counting them separately
 * would inflate the target to 32 and undo a correct earlier audit.
 *
 * `fit` drives the portrait treatment (see components/Media.tsx):
 *
 *   plate  (6)  Panel plates, AR 3.26-4.41. Their own MacroReveal / PortSweep
 *               treatment, which was built for exactly this shape.
 *   fill  (19)  AR >= 1.40. Scaled COMPLETE to the frame width, with the
 *               remaining height filled deliberately. Never cropped.
 *   native (5)  AR <= 1.35. Near-square; fits the portrait frame unaided.
 *
 * On the threshold: the instruction named 10 wide images and described them as
 * "roughly 1.7-2.9". Measured, three of those ten are 1.43-1.44 (m6Studio,
 * m6Bright, m6Dark) — the list of ten is right, the stated band is not. The
 * threshold is therefore set at 1.40, which covers all ten named files AND
 * nine more that need identical help (m2Desk, m2Hero, m4Hero, m4Alt, m6Alt,
 * m6Macro, shLive, shRoom, shSoftware).
 */
export type Product = "m2" | "m4" | "m6" | "shared";
export type Bg = "light" | "mixed" | "dark";
export type Fit = "plate" | "fill" | "native";

export type AssetMeta = {
  key: string;
  file: string;
  product: Product;
  kind: string;
  w: number;
  h: number;
  ar: number;
  bg: Bg;
  fit: Fit;
  alpha: boolean;
  ext: string;
};

export const ASSETS: AssetMeta[] = [
  { key: "m2Alt", file: "MOTU M2 (5).jpg", product: "m2", kind: "lifestyle", w: 1000, h: 873, ar: 1.145, bg: "dark", fit: "native", alpha: false, ext: "jpg" },
  { key: "m2Couch", file: "MOTU M2 (4).jpg", product: "m2", kind: "lifestyle", w: 1442, h: 873, ar: 1.652, bg: "mixed", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m2Dark", file: "MOTU M2 (6).jpg", product: "m2", kind: "ambient", w: 2880, h: 1516, ar: 1.9, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m2Desk", file: "MOTU M2 (1).jpg", product: "m2", kind: "lifestyle", w: 2880, h: 1396, ar: 2.063, bg: "mixed", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m2Front", file: "MOTU M2 (2).png", product: "m2", kind: "panel-front", w: 1212, h: 301, ar: 4.027, bg: "light", fit: "plate", alpha: true, ext: "png" },
  { key: "m2Glass", file: "MOTU M2 (3).jpg", product: "m2", kind: "lifestyle", w: 1442, h: 873, ar: 1.652, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m2Hero", file: "MOTU M2 (8).jpg", product: "m2", kind: "hero", w: 1879, h: 948, ar: 1.982, bg: "light", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m2Rear", file: "MOTU M2 (9).png", product: "m2", kind: "panel-rear", w: 2013, h: 500, ar: 4.026, bg: "light", fit: "plate", alpha: true, ext: "png" },
  { key: "m4Alt", file: "MOTU M4 (1).jpg", product: "m4", kind: "lifestyle", w: 1442, h: 873, ar: 1.652, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m4Cable", file: "MOTU M4 (2).jpg", product: "m4", kind: "detail", w: 1442, h: 873, ar: 1.652, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m4Desk", file: "MOTU M4 (7).jpg", product: "m4", kind: "lifestyle", w: 2880, h: 1516, ar: 1.9, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m4Drums", file: "MOTU M4 (5).jpg", product: "m4", kind: "lifestyle", w: 2880, h: 1396, ar: 2.063, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m4Front", file: "MOTU M4 (1).png", product: "m4", kind: "panel-front", w: 1212, h: 301, ar: 4.027, bg: "light", fit: "plate", alpha: true, ext: "png" },
  { key: "m4Hero", file: "MOTU M4 (4).jpg", product: "m4", kind: "hero", w: 2102, h: 1061, ar: 1.981, bg: "light", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m4Rear", file: "MOTU M4 (2).png", product: "m4", kind: "panel-rear", w: 1212, h: 301, ar: 4.027, bg: "light", fit: "plate", alpha: true, ext: "png" },
  { key: "m4Synth", file: "MOTU M4 (6).jpg", product: "m4", kind: "lifestyle", w: 1000, h: 873, ar: 1.145, bg: "dark", fit: "native", alpha: false, ext: "jpg" },
  { key: "m6Alt", file: "MOTU M6 (6).jpg", product: "m6", kind: "lifestyle", w: 2821, h: 1529, ar: 1.845, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m6Bright", file: "MOTU M6 (8).jpg", product: "m6", kind: "lifestyle", w: 3000, h: 2101, ar: 1.428, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m6Couch", file: "MOTU M6 (9).jpg", product: "m6", kind: "lifestyle", w: 2830, h: 2737, ar: 1.034, bg: "mixed", fit: "native", alpha: false, ext: "jpg" },
  { key: "m6Dark", file: "MOTU M6 (10).jpg", product: "m6", kind: "hero", w: 3000, h: 2085, ar: 1.439, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m6Drums", file: "MOTU M6 (4).jpg", product: "m6", kind: "lifestyle", w: 2830, h: 2737, ar: 1.034, bg: "light", fit: "native", alpha: false, ext: "jpg" },
  { key: "m6Front", file: "MOTU M6 (1).png", product: "m6", kind: "hero-front", w: 2442, h: 749, ar: 3.26, bg: "light", fit: "plate", alpha: true, ext: "png" },
  { key: "m6Low", file: "MOTU M6 (3).jpg", product: "m6", kind: "lifestyle", w: 3000, h: 2000, ar: 1.5, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m6Macro", file: "MOTU M6 (1).jpg", product: "m6", kind: "macro-lcd", w: 911, h: 591, ar: 1.541, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "m6Panel", file: "MOTU M6 (5).jpg", product: "m6", kind: "lifestyle", w: 3000, h: 2223, ar: 1.35, bg: "dark", fit: "native", alpha: false, ext: "jpg" },
  { key: "m6Rear", file: "MOTU M6 (2).png", product: "m6", kind: "panel-rear", w: 3530, h: 800, ar: 4.412, bg: "light", fit: "plate", alpha: true, ext: "png" },
  { key: "m6Studio", file: "MOTU M6 (2).jpg", product: "m6", kind: "lifestyle", w: 2777, h: 1947, ar: 1.426, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "shLive", file: "MOTU M6 (7).jpg", product: "shared", kind: "emotional", w: 3000, h: 1740, ar: 1.724, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "shRoom", file: "MOTU M2 (10).jpg", product: "shared", kind: "lifestyle", w: 1442, h: 873, ar: 1.652, bg: "dark", fit: "fill", alpha: false, ext: "jpg" },
  { key: "shSoftware", file: "MOTU M4 (8).jpg", product: "shared", kind: "software-ui", w: 2880, h: 834, ar: 3.453, bg: "light", fit: "fill", alpha: false, ext: "jpg" },
];

export const A = {
  m2Alt: 0,
  m2Couch: 1,
  m2Dark: 2,
  m2Desk: 3,
  m2Front: 4,
  m2Glass: 5,
  m2Hero: 6,
  m2Rear: 7,
  m4Alt: 8,
  m4Cable: 9,
  m4Desk: 10,
  m4Drums: 11,
  m4Front: 12,
  m4Hero: 13,
  m4Rear: 14,
  m4Synth: 15,
  m6Alt: 16,
  m6Bright: 17,
  m6Couch: 18,
  m6Dark: 19,
  m6Drums: 20,
  m6Front: 21,
  m6Low: 22,
  m6Macro: 23,
  m6Panel: 24,
  m6Rear: 25,
  m6Studio: 26,
  shLive: 27,
  shRoom: 28,
  shSoftware: 29,
} as const;

export type AssetKey = keyof typeof A;

export const meta = (idx: number): AssetMeta => {
  const a = ASSETS[idx];
  if (!a) throw new Error(`No asset at index ${idx}`);
  return a;
};

export const img = (idx: number): string =>
  staticFile(`img/${String(idx).padStart(2, "0")}-${meta(idx).key}.${meta(idx).ext}`);

export const LOGO = {
  motu: () => staticFile("logo/motu.png"),
  shivansh: () => staticFile("logo/shivansh.png"),
};

/** SFX (Section 9) — same reuse-first split as both prior builds. */
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

export const MUSIC = (slug: string): string => staticFile(`audio/music/${slug}.mp3`);

/** Placeholder narration slot (Section 8). */
export const VO = (): string => staticFile("vo/voiceover-portrait.mp3");
