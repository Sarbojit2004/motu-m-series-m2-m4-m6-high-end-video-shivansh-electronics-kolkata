// ─────────────────────────────────────────────────────────────────────────────
// THEME — the MOTU AVB explainer's visual system, retuned for a 90-second
// full-bleed vertical reel.
//
// WHAT IS CARRIED OVER UNCHANGED, by instruction: the type pairing (a brush
// script carrying one key word, a black geometric sans carrying the rest), the
// three-tier caption lockup, the light/dark environment alternation, the
// blueprint grid, the particle drift, and the per-product accent discipline.
//
// WHAT CHANGES, and why:
//
//   1. FULL BLEED. The AVB reel composed inside a band with cream or black
//      around it. Here the imagery fills all 2160 x 3840 and runs off every
//      edge. Nothing is letterboxed and no ground shows through.
//
//   2. TYPOGRAPHY AT 64% OPACITY (36% transparent). Because the picture now
//      reaches the edges, type sits ON the product rather than beside it.
//      Holding it at 0.64 lets the image read through the letterforms — the
//      quieter parts of a frame stay visible underneath — while the words stay
//      dominant enough to read on a phone. Legibility is bought back with a
//      hard drop shadow rather than with a scrim, because a scrim would hide
//      exactly the content this is meant to reveal.
//
//   3. ONE UNIVERSAL SAFE BOX. Instagram Reels, YouTube Shorts and TikTok each
//      overlay a different amount of chrome. Rather than target one, the text
//      box is the intersection of all three, so the same master is safe
//      everywhere without a per-platform re-render.
//
//   4. NO BRANDING UNTIL THE OUTRO. No logo, no website, no number appears at
//      any point in the body of the reel.
// ─────────────────────────────────────────────────────────────────────────────

export const VIDEO = {
  width: 2160,
  height: 3840,
  fps: 30,
  durationInFrames: 2700, // 90.000 s
} as const;

export const sec = (s: number) => Math.round(s * VIDEO.fps);

// ── The universal safe box ───────────────────────────────────────────────────
// Measured as the intersection of the three platforms' overlays on a 9:16 frame:
//
//   top     the status bar plus the platform's own header
//   bottom  the caption block, the audio/CTA strip and the comment bar — by far
//           the largest intrusion, and the reason text never sits low
//   right   the vertical action rail (like / comment / share / remix), which
//           only Shorts and Reels have but which costs the most width
//
// Imagery ignores this entirely and runs to all four edges. Only things that
// MUST be read live inside it.
export const SAFE = {
  left: 132,
  right: 268, // wider: the action rail lives here
  top: 300,
  bottom: 720,
  get w() {
    return VIDEO.width - this.left - this.right;
  },
  get h() {
    return VIDEO.height - this.top - this.bottom;
  },
} as const;

/** How opaque the caption lockup is over the picture. 0.64 = 36% transparent. */
export const TYPE_OPACITY = 0.64;

// ── Grounds ──────────────────────────────────────────────────────────────────
// Only ever seen at the very edges of a bleed, behind a transition, or on the
// outro — but still defined, because a frame must never flash white.
export const GROUND = {
  light: "#F2EFE9",
  lightLift: "#FAF8F4",
  lightSink: "#E6E2D9",
  lightLine: "rgba(24,22,20,0.13)",
  lightDot: "rgba(24,22,20,0.26)",

  dark: "#0A0A0C",
  darkLift: "#141418",
  darkSink: "#050506",
  darkLine: "rgba(255,255,255,0.10)",
  darkDot: "rgba(255,255,255,0.22)",
} as const;

export const INK = {
  onLight: "#16140F",
  onLightSoft: "#4A4740",
  onLightDim: "#A8A399",
  onDark: "#FBFAF7",
  onDarkSoft: "#B9B6AE",
  onDarkDim: "#5E5C57",
} as const;

// ── Per-product accent ───────────────────────────────────────────────────────
// Three products, three hues, each held for its whole segment. The M-Series
// share one chassis language and one finish, so — exactly as with the AVB
// interfaces — colour is what tells a viewer which unit is on screen.
//
// Deliberately a different triad from the AVB reel's: these two films will sit
// next to each other on the same channel and should not look like re-edits of
// one another.
export type ProductKey = "pm2" | "pm4" | "pm6" | "shared";

export const ACCENT: Record<
  ProductKey,
  { key: string; glow: string; wash: string; name: string; short: string }
> = {
  // M2 — the portable one. Amber: warm, bus-powered, the studio in a bag.
  pm2: { key: "#C2681A", glow: "#FFA63D", wash: "rgba(194,104,26,0.03)", name: "MOTU M2", short: "M2" },
  // M4 — the one that adds line inputs and the Mix knob. Cyan: signal, blend.
  pm4: { key: "#0E7C9B", glow: "#42C8F0", wash: "rgba(14,124,155,0.03)", name: "MOTU M4", short: "M4" },
  // M6 — four preamps and a control room. Rose: the loudest of the three.
  pm6: { key: "#A82A61", glow: "#FF6BA6", wash: "rgba(168,42,97,0.03)", name: "MOTU M6", short: "M6" },
  // The hook, the engine section and the close belong to no single product.
  shared: { key: "#1E1B16", glow: "#FFF6E9", wash: "rgba(30,27,22,0.02)", name: "MOTU M-Series", short: "M-SERIES" },
};

// ── Type ─────────────────────────────────────────────────────────────────────
// Same two roles as the AVB reel, same files, same swap point.
export const FONT = {
  script: "'ReelScript', 'Brush Script MT', cursive",
  display: "'ReelDisplay', 'Archivo Black', 'Helvetica Neue', Arial, sans-serif",
} as const;

// Sized up from the AVB reel: type competing with a full-bleed photograph has
// to be bigger than type sitting on an empty ground to hold the same weight.
export const TYPE = {
  before: { size: 92, track: 5.6 },
  script: { size: 348, track: -2 },
  after: { size: 128, track: 2.2 },
  chapter: { size: 46, track: 6.0 },
  micro: { size: 30, track: 3.0 },
} as const;

// ── Contact — outro only ─────────────────────────────────────────────────────
export const CONTACT = {
  brand: "SHIVANSH ELECTRONICS",
  city: "KOLKATA",
  site: "www.shivanshelectronics.in",
  whatsapp: ["+91 98316 62458", "+91 89818 07755", "+91 91477 00677"],
  role: "Authorised Distributor of MOTU (Mark of the Unicorn, USA)",
  region: "for East & North East India",
} as const;
