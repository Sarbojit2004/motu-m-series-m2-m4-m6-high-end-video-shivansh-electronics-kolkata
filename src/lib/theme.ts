// Design tokens for the two MOTU M-Series reels.
//
// LIGHT BACKGROUND, FULL-FRAME SAFE-ZONE LAYOUT.
//
// The canvas is 1080x1920 and content is composed across the WHOLE frame —
// there is no reserved dead central square. An Instagram-style safe zone
// governs where critical content may live:
//
//     0    .. 250   ambient only (no text, no key detail)
//     250  .. 1580  PRIMARY SAFE AREA — headline, hero, spec callouts, CTA
//     1580 .. 1920  ambient only
//     72px side margins on both edges
//
// The 1080x1330 inner box (y 250..1580, inset 72px) is the region that must
// survive cropping on any device, so real content biases slightly upward
// inside it.
//
// PALETTE. Creative brief Section 6 asks for a light, architectural
// environment — soft platinum grey / warm studio white — because the M-Series
// chassis is extruded black metal and its full-colour LCD is the visual
// centrepiece. So the ground is a cool, near-white platinum and the darkest
// thing in frame is always the hardware itself.
//
// The brief also states a cinematography rule: the LCD's vibrant green/yellow
// metering should be "the primary source of saturated colour in the frame".
// The interface palette therefore stays deliberately restrained — one deep
// blue accent, everything else ink — and the saturated LCD greens appear only
// inside meter graphics, never as type.
//
// ONE ACCENT ACROSS BOTH PARTS. The Sonicview series this system is ported
// from gave each part its own hue. That is wrong here: "same engine, more
// channels" is the whole thesis, so a hue shift between parts would imply the
// products differ in kind. Both reels run the identical accent.
//
// Every text colour was verified numerically against `paper` (WCAG AA floor
// 4.5:1); ratios are noted per token.

export const FPS = 30;
export const CANVAS = {w: 1080, h: 1920} as const;

/** 88.000 s at 30 fps. Both parts are exactly this long. */
export const TOTAL_FRAMES = 2640;

/** Instagram / social safe-zone geometry. */
export const ZONE = {
  topAmbientEnd: 250,
  bottomAmbientStart: 1580,
  margin: 72,
} as const;

/** The primary safe content rect. Nothing critical may leave it. */
export const SAFE = {
  x: ZONE.margin,
  y: ZONE.topAmbientEnd,
  w: CANVAS.w - ZONE.margin * 2, // 936
  h: ZONE.bottomAmbientStart - ZONE.topAmbientEnd, // 1330
} as const;

export const C = {
  // -- light ground ------------------------------------------------------
  paper: '#F2F4F7', // base canvas — cool platinum, not pure white
  paperHi: '#FAFBFC', // raised plate / card
  paperDeep: '#E1E6EC', // recessed, ambient zones
  paperEdge: '#CDD5DE', // ambient zone falloff
  line: '#C4CDD8', // hairline rules
  lineSoft: '#DDE3EA',

  // -- ink (all verified on `paper`) -------------------------------------
  ink: '#0A1017', // 17.34:1  headlines
  inkSoft: '#2C3A4A', // 10.52:1  body
  inkDim: '#546375', //  5.58:1  micro callouts

  // -- accent ------------------------------------------------------------
  // Derived from the MOTU wordmark blue sampled off the supplied logo asset
  // (#6090F0). That raw value is only 2.83:1 on `paper` and unusable as text,
  // so it is darkened to keep the brand relationship while clearing AAA.
  motu: '#17408F', //  8.80:1  primary accent
  motuMid: '#1E4FB0', //  6.81:1  secondary / fills
  motuSoft: '#E3EAF7', //         tint plate
  motuOnDark: '#8FB6FA', //  9.31:1 on ink — accent on the dark plate

  // -- LCD metering (GRAPHICS ONLY — never type) -------------------------
  // Sampled from the M6 control-surface macro in the supplied assets.
  lcdGreen: '#56EE00',
  lcdYellow: '#ADF100',
  lcdAmber: '#F2B24A',
  lcdRed: '#E4342A',
  lcdBody: '#0B140D', // the LCD's own near-black glass
  // Text-safe equivalents, for the rare label that must read as "meter".
  lcdGreenInk: '#2E7A0A', //  4.88:1
  lcdAmberInk: '#8A5A05', //  5.38:1

  good: '#0B6B37', //  6.01:1
  alert: '#A81E14', //  6.66:1
  screen: '#0E1620', // dark plate for software screenshots / dark cards
} as const;

/**
 * Type system ported structurally from the completed TASCAM Sonicview project
 * (github.com/Sarbojit2004/tascam-sonicview-mixers-high-end-video,
 * src/lib/fonts.ts + src/components/Type.tsx): Barlow Condensed 600/700/800
 * for display, Inter variable for UI/body, JetBrains Mono variable for
 * technical figures. The woff2 files themselves are copied from that project
 * and vendored under public/fonts.
 *
 * Per the prompt's Section 8b, only the STRUCTURE is inherited — the colour
 * and contrast values above were re-derived against this project's own light
 * ground and the M-Series' black-chassis / colour-LCD photography.
 */
/**
 * Font stacks.
 *
 * "NotoINR" sits in every stack immediately after the primary face. It carries
 * the Indian Rupee sign, which none of the three Latin faces include, so the ₹
 * in each MOP callout resolves from a vendored file rather than from whatever
 * the render host happens to have installed. Per-glyph fallback means the
 * primary face still sets every other character.
 *
 * `deva` and `beng` are used only by the thumbnail compositions — the reels
 * themselves are English-only. Both Noto script subsets contain their script
 * and nothing else, so Inter trails them to supply digits, Latin and
 * punctuation.
 */
export const F = {
  display: '"BarlowCondensed", "NotoINR", "Arial Narrow", sans-serif',
  ui: '"Inter", "NotoINR", system-ui, sans-serif',
  mono: '"JetBrainsMono", "NotoINR", ui-monospace, monospace',
  deva: '"NotoSansDevanagari", "NotoINR", "Inter", sans-serif',
  beng: '"NotoSansBengali", "NotoINR", "Inter", sans-serif',
} as const;

export type Part = 1 | 2;

/** One accent for the whole series — see the note at the top of this file. */
export const accent = (_p: Part): string => C.motu;
export const accentSoft = (_p: Part): string => C.motuSoft;
export const accentOnDark = (_p: Part): string => C.motuOnDark;

// ---------------------------------------------------------------------------
// SCENE TABLES — the single source of truth for timing. Each part sums to 2640.
//
// PACING. This project has 30 distinct assets across two 88 s reels, where the
// Sonicview series had 131 across three. That is more than three times the
// breathing room, so the default here is genuine hero treatment: one asset per
// beat, several seconds of real screen time, no montage system. Scenes average
// ~203 frames (6.8 s) and most carry a single hero image.
// ---------------------------------------------------------------------------
export type Scene = {id: string; dur: number; label: string};

export const PART1: Scene[] = [
  {id: 'P1S01', dur: 205, label: 'Hook — same engine, three sizes'},
  {id: 'P1S02', dur: 185, label: 'MOTU heritage — Cambridge, 1980'},
  {id: 'P1S03', dur: 225, label: 'The shared engine — ESS Sabre32 Ultra DAC'},
  {id: 'P1S04', dur: 195, label: '120 dB dynamic range'},
  {id: 'P1S05', dur: 195, label: '−129 dBu EIN preamps'},
  {id: 'P1S06', dur: 240, label: 'LCD metering reveal'},
  {id: 'P1S07', dur: 190, label: '2.5 ms round-trip latency'},
  {id: 'P1S08', dur: 215, label: 'MOTU M2 — the unit'},
  {id: 'P1S09', dur: 210, label: 'M2 rear I/O + DC-coupled CV'},
  {id: 'P1S10', dur: 205, label: 'Loopback signal path'},
  {id: 'P1S11', dur: 175, label: 'M2 in the world + MOP'},
  {id: 'P1S12', dur: 110, label: 'Continuation → Part 2'},
  {id: 'P1S13', dur: 290, label: 'CTA & Shivansh outro'},
];

export const PART2: Scene[] = [
  {id: 'P2S01', dur: 170, label: 'Open — the engine is settled'},
  {id: 'P2S02', dur: 225, label: 'MOTU M4 — 4-in / 4-out'},
  {id: 'P2S03', dur: 205, label: 'The Input Monitor Mix knob'},
  {id: 'P2S04', dur: 200, label: 'M4 in the world'},
  {id: 'P2S05', dur: 150, label: 'I/O expansion — 2 → 4 → 6'},
  {id: 'P2S06', dur: 215, label: 'MOTU M6 — four mic preamps'},
  {id: 'P2S07', dur: 205, label: 'M6 control surface'},
  {id: 'P2S08', dur: 245, label: 'Multi-source tracking'},
  {id: 'P2S09', dur: 215, label: 'A/B monitoring + dual headphones'},
  {id: 'P2S10', dur: 165, label: 'Standalone DC power'},
  {id: 'P2S11', dur: 160, label: 'Included software'},
  {id: 'P2S12', dur: 175, label: 'The range — three sizes, three MOPs'},
  {id: 'P2S13', dur: 310, label: 'Full CTA close of the series'},
];

export const SCENES: Record<Part, Scene[]> = {1: PART1, 2: PART2};

export const sceneStart = (part: Part, id: string): number => {
  let f = 0;
  for (const s of SCENES[part]) {
    if (s.id === id) return f;
    f += s.dur;
  }
  return f;
};

export const partDuration = (part: Part): number =>
  SCENES[part].reduce((a, s) => a + s.dur, 0);
