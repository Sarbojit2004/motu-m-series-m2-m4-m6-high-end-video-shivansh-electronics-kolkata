// Design tokens — MOTU M-Series (M2 / M4 / M6) 178 s PORTRAIT short.
//
// PROVENANCE (Section 0.2 Role A / Section 7). The palette, type system and
// technique implementations are pulled UNCHANGED from the approved MOTU AVB
// Series ecosystem build, exactly as the landscape deliverable pulls them.
//
// The CANVAS values come from a different part of that reference, per Section
// 2.2: the caption-safe zone is taken from the AVB COMPRESSED REEL
// (`compressed-reel/src/theme.ts`), which itself took them unchanged from the
// approved three-part reel build (`reels/src/theme.ts`). That is the closest
// single-standalone-reel precedent available, which is what this deliverable
// is. Nothing here is re-derived or guessed.
//
// Values that necessarily differ from the AVB source, and why:
//   VIDEO.durationInSeconds  88 -> 178             (this deliverable's runtime)
//   BRAND / PRICE / SPEC / PRODUCT_*                (different products)
//
// This is NOT the 298 s landscape video re-cropped. It has its own beat
// structure, its own image selection, its own music deployment and its own
// pacing — see src/schedule.ts.

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 178,
  get durationInFrames() {
    return Math.round(this.fps * this.durationInSeconds); // 5340
  },
} as const;

export const COLORS = {
  // Light ground — every scene, whole runtime, no exceptions.
  //
  // Held in a NEAR-WHITE range (0xEF..0xFD) because the two supplied logos are
  // used exactly as given: opaque, with their own white background intact,
  // placed directly on the video with no box, card or plate. A page within ~4%
  // of white makes that ground imperceptible, so the logos read as sitting on
  // the video rather than on artwork.
  paper: "#F6F8FA",
  paperLift: "#FDFEFE",
  paperEdge: "#EFF2F6",
  paperWell: "#E7EBF1",

  // Type
  ink: "#0E1116", // 17.9:1 on paper
  inkSoft: "#20272F", // 12.6:1
  slate: "#48525F", // 7.6:1 — muted subheadline
  slateDim: "#6B7684", // 4.6:1 — micro-labels only, never body

  // Accents
  motuBlue: "#0B5FD0", // 6.2:1
  motuBlueSoft: "#3E86E8", // decorative strokes only
  signal: "#00845F", // 4.8:1 — the LCD meter green
  signalBright: "#00A67E", // glow/decorative
  amber: "#B4610A", // 4.9:1 — animated spec counters
  alert: "#B32218", // 6.1:1 — the "problem" chapter only

  // Structure
  line: "rgba(14,17,22,0.12)",
  lineStrong: "rgba(14,17,22,0.24)",
  shadow: "rgba(14,17,22,0.10)",
} as const;

export const RADII = { card: 26, plate: 18, chip: 999, sm: 12 } as const;

/**
 * CAPTION-SAFE ZONE (Section 2.2).
 *
 * Text, logos and callouts stay clear of the top 180px and the bottom 220px,
 * where platform UI (caption overlay, action rail, handle, progress bar) sits.
 * Background and ambient imagery MAY extend into those bands.
 *
 * 180 / 220 / 64 are the exact values proven across the AVB portrait reels,
 * used unchanged. Section 2.2 requires them to be pulled rather than
 * re-derived, and they are.
 */
export const SAFE = {
  top: 180,
  bottom: 220,
  marginX: 64,
  get contentTop() {
    return this.top;
  },
  get contentBottom() {
    return VIDEO.height - this.bottom; // 1700
  },
  get contentH() {
    return VIDEO.height - this.top - this.bottom; // 1520
  },
  get contentW() {
    return VIDEO.width - this.marginX * 2; // 952
  },
} as const;

/** Alias so shared components can talk about margins without knowing the canvas. */
export const SPACE = {
  width: VIDEO.width,
  height: VIDEO.height,
  marginX: SAFE.marginX,
  marginY: SAFE.top,
  get contentW() {
    return SAFE.contentW;
  },
  get contentH() {
    return SAFE.contentH;
  },
} as const;

export const TIMING = { transition: 14, in: 12, hold: 8, out: 10 } as const;

/**
 * Confirmed distributor relationship + contact set (Section 1 Fact 3).
 * Re-verified for this project against the client's own M-Series brief, which
 * states the identical wording; unchanged from the AVB build.
 */
export const BRAND = {
  name: "Shivansh Electronics",
  role: "Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces",
  region: "East and North East India",
  website: "www.shivanshelectronics.in",
  instagram: "instagram.com/@shivanshelectronics.in",
  facebook: "facebook.com/@shivanshelectronics.in",
  linkedin: "linkedin.com/@shivanshelectronics-in",
  youtube: "youtube.com/@shivanshelectronics-in",
  whatsapp: ["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"],
  address:
    "3, Rama Nath Das Road, Dhakuria, Tanu Pukur, Garfa, Kolkata, West Bengal 700031",
} as const;

/**
 * Fixed MOPs (Section 1 Fact 1) — three DISTINCT figures. Never rounded, never
 * blended into one range, never prefixed with "starting from".
 *
 * `bestPrice` is Fact 2: it is stated ALONGSIDE the three figures, never
 * instead of them.
 */
export const PRICE = {
  m2: "Rs. 26,900",
  m4: "Rs. 32,900",
  m6: "Rs. 55,900",
  note: "per unit · MOP, inclusive of GST",
  noteShort: "per unit · MOP, incl. GST",
  bestPrice: "Visit www.shivanshelectronics.in to check the best price",
} as const;

/**
 * VERIFIED specifications only.
 *
 * Source: the client's "MOTU M-Series Video Brief" Verified Technical
 * Specification Master Table (cross-referenced against MOTU documentation),
 * independently corroborated against MOTU's own M6 press material, Sound on
 * Sound and MusicTech coverage.
 *
 * ONE DEVIATION, deliberate: the brief places the M6's four combo inputs on the
 * FRONT panel. The supplied product photography (`MOTU M6 (2).png`, the rear
 * panel) shows all four MIC/LINE/GUITAR combo jacks on the REAR, and the
 * independent reviews agree. The accurate placement is used.
 *
 * Figures the brief does not verify (preamp gain range, for one) are absent
 * here on purpose and never reach the screen.
 */
export const SPEC = {
  shared: {
    dac: "ESS Sabre32 Ultra",
    dynamic: "120 dB",
    dynamicNote: "dynamic range, main outputs",
    ein: "-129 dBu",
    einNote: "measured EIN, mic inputs",
    rtl: "2.5 ms",
    rtlNote: "round-trip @ 96 kHz, 32-sample buffer",
    rates: "24-bit / up to 192 kHz",
    lcd: "160 x 120 px full-colour LCD",
    loopback: "Driver loopback channels",
    monitoring: "One-touch hardware monitoring",
    midi: "5-pin MIDI in / out",
    software: "Performer Lite · Ableton Live Lite · 6 GB loops · 100+ instruments",
    host: "USB-C, class-compliant on Mac / iOS",
  },
  m2: {
    io: "2 in / 2 out",
    combo: "2 x XLR/TRS combo (front)",
    line: "—",
    trsOut: "2 x 1/4in TRS, DC-coupled",
    rca: "2 x RCA, mirrored",
    phones: "1 x 1/4in, independent volume",
    mix: "Digital monitor toggle",
    ab: "—",
    power: "USB-C bus powered",
    size: "7.5 x 4.25 x 1.75 in",
    weight: "1.35 lbs (0.61 kg)",
  },
  m4: {
    io: "4 in / 4 out",
    combo: "2 x XLR/TRS combo (front)",
    line: "2 x 1/4in balanced line in",
    trsOut: "4 x 1/4in TRS, DC-coupled",
    rca: "4 x RCA, mirrored",
    phones: "1 x 1/4in, independent volume",
    mix: "Physical Input Monitor Mix knob",
    ab: "—",
    power: "USB-C bus powered",
    size: "8.25 x 4.25 x 1.75 in",
    weight: "1.55 lbs (0.7 kg)",
  },
  m6: {
    io: "6 in / 4 out",
    combo: "4 x XLR/TRS combo (rear)",
    line: "2 x 1/4in balanced line in (5/6)",
    trsOut: "4 x 1/4in TRS, DC-coupled",
    rca: "None",
    phones: "2 x 1/4in, second with 3-4 routing",
    mix: "Physical Input Monitor Mix knob",
    ab: "A/B monitor switch (front panel)",
    power: "USB-C bus OR included 15 V DC adapter",
    size: "9.21 x 4.75 x 1.8 in",
    weight: "2.15 lbs (0.975 kg)",
  },
} as const;

export type ProductKey = "m2" | "m4" | "m6";

export const PRODUCT_NAME: Record<ProductKey, string> = {
  m2: "MOTU M2",
  m4: "MOTU M4",
  m6: "MOTU M6",
};

/**
 * Roles are stated as CAPACITY, never as quality tier (Section 1). The engine
 * is identical across all three; only the channel count changes.
 */
export const PRODUCT_ROLE: Record<ProductKey, string> = {
  m2: "Two Channels",
  m4: "Four Channels",
  m6: "Six Channels",
};

export const PRODUCT_PRICE: Record<ProductKey, string> = {
  m2: PRICE.m2,
  m4: PRICE.m4,
  m6: PRICE.m6,
};

/** Utility — hex + alpha to rgba(). */
export function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
