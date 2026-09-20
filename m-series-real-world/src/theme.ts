// ─────────────────────────────────────────────────────────────────────────────
// THEME — the design system shared by both MOTU M-Series films.
//
// TWO FORMATS, ONE CODEBASE. A 2160 x 3840 vertical reel and a 3840 x 2160
// landscape explainer render from the same components. Anything that could
// differ between them is expressed per format and resolved at render time from
// the composition's own dimensions, so neither film can drift from the other.
//
// CARRIED OVER from the AVB series and the UltraLite-mk5 / 828 films, by
// instruction:
//
//   * the type pairing — a heavy brush script carrying ONE key word, a black
//     geometric sans carrying the rest
//   * the three-tier caption lockup, split at that key word
//   * TYPE_OPACITY: the whole typographic layer at 64% (36% transparent),
//     applied once by the film's overlay layer so nothing can drift out of step
//   * legibility bought back with a hard, tight shadow rather than a scrim,
//     because a scrim would hide exactly the picture the transparency reveals
//   * full-bleed imagery — nothing letterboxed, no ground showing through
//   * gimbal camera language only
//   * NO IMAGE IS EVER CROPPED TO A DIAGONAL, SLICED, OR SHOWN IN PART
//
// WHAT CHANGES FOR THIS PRODUCT:
//
//   1. THE ACCENT PALETTE COMES OFF THE HARDWARE. Every hue below was sampled
//      from the M-Series panel renders in this repository — the colour LCD's
//      own green and amber meter bars, the cyan MON buttons, the red 48V
//      legends, the blue power LED, the near-black chassis. Nothing is
//      invented, which is why the graphics sit ON the product rather than
//      beside it.
//
//      Colour here means "which idea", not "which model" — because the whole
//      argument of these films is that the converters and preamps are the same
//      in all three, and colour-coding the models would contradict that.
//
//   2. THE OUTRO IS THE ONLY BRANDED FRAME, and it carries a territory:
//      exclusive distributor for East and North-East India. Six seconds on the
//      reel, ten on the explainer. Nothing branded appears before it.
//
//   3. NO PRICING. Not a figure, not a currency, not a comparison, anywhere.
// ─────────────────────────────────────────────────────────────────────────────

export type FormatId = "reel" | "video";

export type Format = {
  id: FormatId;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  portrait: boolean;
  /** Where things that MUST be read are allowed to live. */
  safe: { left: number; right: number; top: number; bottom: number; w: number; h: number };
  /** Type sizes, set per format rather than scaled from one another. */
  type: {
    before: { size: number; track: number };
    script: { size: number; track: number };
    after: { size: number; track: number };
    chapter: { size: number; track: number };
    micro: { size: number; track: number };
    body: { size: number; track: number };
  };
  /** Where the photographic plate is centred, as a fraction of frame height. */
  plateY: number;
  /** How far past the frame width the plate hangs, for lateral camera room. */
  overhang: number;
  /** The branded end screen, in seconds. The ONLY branded frames in the film. */
  outroSeconds: number;
};

const box = (left: number, right: number, top: number, bottom: number, W: number, H: number) => ({
  left, right, top, bottom, w: W - left - right, h: H - top - bottom,
});

// ── The vertical reel ────────────────────────────────────────────────────────
// The safe box is the INTERSECTION of the three vertical platforms' overlays
// (Reels, Shorts, TikTok) rather than any one of them, so one master is safe
// everywhere without a per-platform re-render:
//   top     status bar + platform header
//   bottom  caption block, audio/CTA strip and comment bar — the largest
//           intrusion, and the reason text never sits low
//   right   the vertical action rail, which costs the most width
const REEL: Format = {
  id: "reel",
  width: 2160,
  height: 3840,
  fps: 30,
  durationInFrames: 2696, // 89.867 s — DERIVED: scripts/timeline.json, + a 6 s end screen
  portrait: true,
  safe: box(132, 268, 300, 720, 2160, 3840),
  type: {
    before: { size: 92, track: 5.6 },
    script: { size: 348, track: -2 },
    after: { size: 128, track: 2.2 },
    chapter: { size: 46, track: 6.0 },
    micro: { size: 30, track: 3.0 },
    body: { size: 52, track: 1.4 },
  },
  plateY: 0.46,
  overhang: 1.14,
  outroSeconds: 6,
};

// ── The landscape explainer ──────────────────────────────────────────────────
// A 16:9 frame has no action rail and no caption block; the only reliable
// intrusion is the player's own control strip along the bottom. But the frame
// is also only 2160 px tall, so the caption lockup has roughly a third of the
// vertical room it has in the reel — which is why the type is set smaller here
// rather than scaled down from the reel's numbers by a single multiplier.
const VIDEO_16_9: Format = {
  id: "video",
  width: 3840,
  height: 2160,
  fps: 30,
  durationInFrames: 8950, // 298.333 s — DERIVED: scripts/timeline.json, + a 10 s end screen
  portrait: false,
  safe: box(220, 220, 150, 210, 3840, 2160),
  type: {
    before: { size: 60, track: 4.8 },
    script: { size: 212, track: -2 },
    after: { size: 86, track: 2.0 },
    chapter: { size: 38, track: 5.2 },
    micro: { size: 26, track: 2.6 },
    body: { size: 40, track: 1.2 },
  },
  plateY: 0.5,
  overhang: 1.10,
  outroSeconds: 10,
};

export const FORMATS: Record<FormatId, Format> = { reel: REEL, video: VIDEO_16_9 };

/** Resolve the format from a composition's own dimensions. */
export const formatFor = (width: number, height: number): Format =>
  height >= width ? REEL : VIDEO_16_9;

export const secAt = (fps: number) => (s: number) => Math.round(s * fps);

/** How opaque the caption lockup is over the picture. 0.64 = 36% transparent. */
export const TYPE_OPACITY = 0.64;

// ── Grounds ──────────────────────────────────────────────────────────────────
// Only ever seen at the very edge of a bleed, behind a transition, or on the
// end screen — but still defined, because a frame must never flash white.
export const GROUND = {
  light: "#F0EEEA",
  lightLift: "#FAF9F7",
  lightSink: "#E2DFD9",
  lightLine: "rgba(20,22,26,0.13)",

  dark: "#08090B",
  darkLift: "#131518",
  darkSink: "#030304",
  darkLine: "rgba(255,255,255,0.10)",
} as const;

export const INK = {
  onLight: "#141820",
  onLightSoft: "#474C55",
  onLightDim: "#A2A6AD",
  onDark: "#F7F9FB",
  onDarkSoft: "#B4B9C0",
  onDarkDim: "#5B6068",
} as const;

// ── Accent: one hue per idea, every one sampled off the panel ────────────────
// Sources, all from the M-Series renders in this repository:
//   signal   the LCD's own green meter bars
//   gain     the red 48V legends under each input
//   monitor  the cyan MON buttons
//   latency  the LCD's amber, where a bar is running hot
//   room     the blue power LED and the glow it throws on a dark desk
//   shared   the chassis itself, near-black, with a cool white lift
export type AccentKey =
  | "shared"    // hook, the range, and the close — the chassis
  | "signal"    // the converters and what they resolve — green meters
  | "gain"      // the preamps and their noise floor — red 48V
  | "monitor"   // monitoring and the mix knob — cyan MON
  | "latency"   // round-trip and playability — amber
  | "room";     // the deployments themselves — blue LED

export const ACCENT: Record<AccentKey, { key: string; glow: string; label: string }> = {
  shared:  { key: "#16181C", glow: "#EAF0F6", label: "M-SERIES" },
  signal:  { key: "#1F7A3D", glow: "#49E070", label: "THE SIGNAL" },
  gain:    { key: "#A32C24", glow: "#FF6E58", label: "THE GAIN" },
  monitor: { key: "#12708E", glow: "#46D2F5", label: "MONITORING" },
  latency: { key: "#9A6A0F", glow: "#FFC23D", label: "LATENCY" },
  room:    { key: "#1D4E85", glow: "#66B4FF", label: "THE ROOM" },
};

// ── Type ─────────────────────────────────────────────────────────────────────
export const FONT = {
  script: "'ReelScript', 'Brush Script MT', cursive",
  display: "'ReelDisplay', 'Archivo Black', 'Helvetica Neue', Arial, sans-serif",
} as const;

// ── Contact — the end screen, and nowhere else ───────────────────────────────
export const CONTACT = {
  brand: "SHIVANSH ELECTRONICS",
  city: "KOLKATA",
  site: "www.shivanshelectronics.in",
  whatsapp: ["+91 98316 62458", "+91 89818 07755", "+91 91477 00677"],
  // The designation, verbatim and with its territory.
  role: "Exclusive Distributor of MOTU (Mark of the Unicorn, USA)",
  role2: "for East and North-East India",
} as const;

// ── The three interfaces ─────────────────────────────────────────────────────
// Counts read off the front- and rear-panel renders in this repository, not
// from memory. The M6 detail that is most often got wrong: its four combo
// mic/line/guitar inputs are on the REAR panel — its front carries only the
// four gain knobs, the meter, the monitor knob and TWO headphone outs.
export const MODELS = [
  { name: "M2", short: "M2", inputs: 2, outputs: 2, mic: 2, phones: 1, micOnRear: false },
  { name: "M4", short: "M4", inputs: 4, outputs: 4, mic: 2, phones: 1, micOnRear: false },
  { name: "M6", short: "M6", inputs: 6, outputs: 4, mic: 4, phones: 2, micOnRear: true },
] as const;

// ── The numbers the films are allowed to state ───────────────────────────────
// Every one of these was checked against dealer and trade documentation before
// it was written into a caption. Anything not in this table does not get said.
export const SPEC = {
  dac: "ESS Sabre32 Ultra",
  dynamicRange: 120,        // dB, on the outputs, identical across all three
  ein: -129,                // dBu, measured on the mic inputs
  roundTrip: 2.5,           // ms, 24-bit / 96 kHz, 32-sample buffer
  sampleRateMin: 44.1,      // kHz
  sampleRateMax: 192,       // kHz
  bundleGb: 6,              // GB of loops, sounds and one-shots
} as const;
