import { staticFile } from "remotion";

/**
 * PORTRAIT'S OWN CURATED SELECTION (Section 0.1).
 *
 * 17 images, chosen FOR THIS CANVAS — not inherited from the landscape cut.
 * The landscape deliverable selects 27; the ten it keeps and this one drops are
 * all wide landscape room shots:
 *
 *   m2Couch, m2Glass, m2Dark, m4Desk, m4Drums, m4Cable,
 *   m6Dark, m6Low, m6Bright, m6Studio
 *
 * At 1080 px wide a 2.0-to-2.9 aspect room shot either letterboxes to a sliver
 * with the product unreadable, or has to be cropped — and cropping is not
 * available under Section 3. So they are cut from the selection instead, which
 * is the response Section 3 asks for when runtime or canvas pressure collides
 * with the full-and-legible rule.
 *
 * What is kept skews to the near-square lifestyle frames (m6Couch and m6Drums
 * at 1.03, m4Synth at 1.15, m6Panel at 1.35) and to the panel plates, which
 * stack cleanly in a vertical column.
 *
 * The same two byte-identical duplicates are reclassified here as in the
 * landscape build: `shSoftware` (the software-bundle montage, which is not a
 * product shot) and `shRoom` (a wide podcast room where the unit cannot be
 * attributed to a model).
 *
 * NO VIDEO CLIPS exist in this repository — every asset is a still.
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
  { key: "m4Front", file: "MOTU M4 (1).png", product: "m4", kind: "panel-front", w: 1212, h: 301, bg: "light", alpha: true, ext: "png" },
  { key: "m4Rear", file: "MOTU M4 (2).png", product: "m4", kind: "panel-rear", w: 1212, h: 301, bg: "light", alpha: true, ext: "png" },
  { key: "m4Hero", file: "MOTU M4 (4).jpg", product: "m4", kind: "hero", w: 2102, h: 1061, bg: "light", alpha: false, ext: "jpg" },
  { key: "m4Synth", file: "MOTU M4 (6).jpg", product: "m4", kind: "lifestyle", w: 1000, h: 873, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Front", file: "MOTU M6 (1).png", product: "m6", kind: "hero-front", w: 2442, h: 749, bg: "light", alpha: true, ext: "png" },
  { key: "m6Rear", file: "MOTU M6 (2).png", product: "m6", kind: "panel-rear", w: 3530, h: 800, bg: "light", alpha: true, ext: "png" },
  { key: "m6Macro", file: "MOTU M6 (1).jpg", product: "m6", kind: "macro-lcd", w: 911, h: 591, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Panel", file: "MOTU M6 (5).jpg", product: "m6", kind: "lifestyle", w: 3000, h: 2223, bg: "dark", alpha: false, ext: "jpg" },
  { key: "m6Couch", file: "MOTU M6 (9).jpg", product: "m6", kind: "lifestyle", w: 2830, h: 2737, bg: "mixed", alpha: false, ext: "jpg" },
  { key: "m6Drums", file: "MOTU M6 (4).jpg", product: "m6", kind: "lifestyle", w: 2830, h: 2737, bg: "light", alpha: false, ext: "jpg" },
  { key: "shLive", file: "MOTU M6 (7).jpg", product: "shared", kind: "emotional", w: 3000, h: 1740, bg: "dark", alpha: false, ext: "jpg" },
  { key: "shSoftware", file: "MOTU M4 (8).jpg", product: "shared", kind: "software-ui", w: 2880, h: 834, bg: "light", alpha: false, ext: "jpg" },
  { key: "shRoom", file: "MOTU M2 (10).jpg", product: "shared", kind: "lifestyle", w: 1442, h: 873, bg: "dark", alpha: false, ext: "jpg" },
];

export const A = {
  m2Front: 0,
  m2Rear: 1,
  m2Hero: 2,
  m2Desk: 3,
  m4Front: 4,
  m4Rear: 5,
  m4Hero: 6,
  m4Synth: 7,
  m6Front: 8,
  m6Rear: 9,
  m6Macro: 10,
  m6Panel: 11,
  m6Couch: 12,
  m6Drums: 13,
  shLive: 14,
  shSoftware: 15,
  shRoom: 16,
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

/** SFX (Section 9) — same reuse/synthesis split as the landscape build. */
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
