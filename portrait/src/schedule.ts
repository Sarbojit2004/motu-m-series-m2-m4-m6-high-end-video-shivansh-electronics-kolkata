import { A } from "./assets";
import { SPEC, PRODUCT_NAME, PRODUCT_ROLE, VIDEO } from "./theme";
import type { Beat, MusicPlan } from "./beat";
import { frames, starts, totalFrames } from "./beat";

/**
 * MOTU M-SERIES — 178 s PORTRAIT SHORT
 * 5,340 frames at 30 fps, 1080 x 1920. Seven segments, 30 beats, average 5.9 s.
 *
 * THIS IS NOT THE LANDSCAPE VIDEO RESIZED.
 *
 * The 298 s landscape cut runs 42 beats at 7.1 s average across seven chapters.
 * Scaling that by 0.597 would give 4.2 s beats — under the floor for
 * establishing AND resolving a point — and would produce a rushed miniature of
 * something that already exists. So this build COLLAPSES rather than shrinks,
 * following the principle the AVB workflow's own shorter-runtime deliverable
 * established:
 *
 *   - The hook and the thesis FUSE. There is no separate problem chapter that
 *     resolves later; the reel states the problem and its answer in one breath
 *     and reaches the claim by 0:13.
 *   - The shared-engine segment drops from six beats to four, and loses the
 *     standalone latency beat — the figure rides in a spec grid instead.
 *     A spec chip needs dwell time, and at this runtime only one grid earns it.
 *   - Every per-product segment loses its lifestyle montage except the M6's.
 *     The product panels carry the story; the room shots that survive are the
 *     near-square ones that actually read at 1080 wide.
 *   - Chapter 6's four-beat "what all three share" becomes four SHORT beats,
 *     and the contact panel is cut entirely — its detail is on the outro card.
 *
 * PACING (Section 5): 30 beats, average 5.9 s against the landscape's 7.1 s,
 * first cut at 7 s, longest beat 9 s. A noticeably faster, more hook-driven
 * cadence, as the portrait canvas demands.
 *
 * SEGMENT TIMING:
 *   S1  Hook, fused with the thesis   22 s   0:00-0:22
 *   S2  The shared engine             24 s   0:22-0:46
 *   S3  MOTU M2                       26 s   0:46-1:12
 *   S4  MOTU M4                       28 s   1:12-1:40
 *   S5  MOTU M6                       34 s   1:40-2:14
 *   S6  What all three share          20 s   2:14-2:34
 *   S7  Price, CTA & outro            24 s   2:34-2:58
 *                                  = 178 s
 *
 * IMAGE TREATMENT (Section 3): three Macro-to-Full-Reveals (the three front
 * panels), three Port Density Sweeps (the three rear plates — proportionally
 * more than the landscape build, because at this runtime the rear panel is the
 * fastest honest way to show "more channels"). Everything else is a montage
 * solo pass or a drift. Nothing is cropped to fit the pace: where the canvas
 * fought an image, the image was cut from the selection instead (see assets.ts).
 */

const B = (b: Beat): Beat => b;

export const CHAPTERS: { ch: number; name: string; sec: number }[] = [
  { ch: 1, name: "Hook, Fused With The Thesis", sec: 22 },
  { ch: 2, name: "The Shared Engine", sec: 24 },
  { ch: 3, name: "MOTU M2", sec: 26 },
  { ch: 4, name: "MOTU M4", sec: 28 },
  { ch: 5, name: "MOTU M6", sec: 34 },
  { ch: 6, name: "What All Three Share", sec: 20 },
  { ch: 7, name: "Price, CTA & Outro", sec: 24 },
];

export const BEATS: Beat[] = [
  // ═══════════════════ 0:00-0:22  S1 — HOOK FUSED WITH THESIS (22 s, 3 beats)
  B({
    id: "p1-hook", ch: 1, sec: 7, kind: "coldOpen",
    images: [A.shLive],
    eyebrow: "MOTU M-Series",
    heading: "You can hear\nthe difference.",
    sub: "Between a room, and a recording of it.",
    serif: true,
    brand: "cornerLogo", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p1-problem", ch: 1, sec: 6, kind: "editorial",
    images: [A.shRoom],
    eyebrow: "The old trade-off",
    heading: "Cheap and noisy.\nOr out of reach.",
    serif: true, alert: true,
    brand: "none", sfx: "panel-air",
  }),
  B({
    id: "p1-thesis", ch: 1, sec: 9, kind: "ecosystemMontage",
    images: [A.m2Front, A.m4Front, A.m6Front],
    labels: ["MOTU M2 — 2 in / 2 out", "MOTU M4 — 4 in / 4 out", "MOTU M6 — 6 in / 4 out"],
    soloHold: 62, cols: 1,
    eyebrow: "Not any more",
    heading: "One engine.\nThree sizes.",
    brand: "cornerLogo", motu: true, sfx: "usbc-seat",
  }),

  // ══════════════════════════ 0:22-0:46  S2 — THE SHARED ENGINE (24 s, 4 beats)
  B({
    id: "p2-capacity", ch: 2, sec: 6, kind: "capacity",
    images: [],
    eyebrow: "The whole idea",
    heading: "Channels.\nNot quality.",
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p2-dac", ch: 2, sec: 7, kind: "counters",
    images: [],
    eyebrow: "The converter",
    heading: "ESS Sabre32 Ultra.",
    sub: "The same premium DAC in all three.",
    counters: [{ to: 120, suffix: " dB", label: "Dynamic range · all three models" }],
    brand: "cornerLogo", sfx: "avb-ping",
  }),
  B({
    id: "p2-specs", ch: 2, sec: 6, kind: "specGrid",
    images: [],
    eyebrow: "Identical on every model",
    heading: "The numbers\ndo not change.",
    specs: [
      { label: "Measured EIN", value: SPEC.shared.ein },
      { label: "Round-trip latency", value: SPEC.shared.rtl },
      { label: "Sample rate", value: SPEC.shared.rates },
    ],
    brand: "lowerThird", sfx: "counter-tick",
  }),
  B({
    id: "p2-lcd", ch: 2, sec: 5, kind: "lcd",
    images: [],
    eyebrow: "And the same display",
    heading: "Gain staging\nyou can see.",
    brand: "cornerLogo", sfx: "talkback-click",
  }),

  // ═══════════════════════════════ 0:46-1:12  S3 — MOTU M2 (26 s, 4 beats)
  B({
    id: "p3-open", ch: 3, sec: 4, kind: "titleCard",
    images: [], product: "m2",
    heading: PRODUCT_NAME.m2,
    sub: PRODUCT_ROLE.m2,
    pills: [SPEC.m2.io, SPEC.m2.power],
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p3-macro", ch: 3, sec: 9, kind: "macroReveal",
    images: [A.m2Front], focal: [0.52, 0.5], macroScale: 3.2,
    eyebrow: "The front panel",
    heading: "Two channels.\nNothing held back.",
    sub: "Two combo inputs, each with its own gain, 48V and one-touch monitoring.",
    brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "p3-rear", ch: 3, sec: 6, kind: "portSweep",
    images: [A.m2Rear],
    eyebrow: "The rear panel",
    heading: "Everything you need.",
    sub: "DC-coupled balanced outs, mirrored RCA, MIDI, USB-C bus power.",
    brand: "lowerThird", sfx: "encoder-click",
  }),
  B({
    id: "p3-life", ch: 3, sec: 7, kind: "montage",
    images: [A.m2Hero, A.m2Desk], cols: 1,
    labels: ["MOTU M2", "It runs off the cable"],
    eyebrow: "Market Operating Price",
    heading: "Rs. 26,900",
    brand: "cornerLogo", sfx: "counter-tick",
  }),

  // ═══════════════════════════════ 1:12-1:40  S4 — MOTU M4 (28 s, 5 beats)
  B({
    id: "p4-open", ch: 4, sec: 4, kind: "titleCard",
    images: [], product: "m4",
    heading: PRODUCT_NAME.m4,
    sub: PRODUCT_ROLE.m4,
    pills: [SPEC.m4.io, "Monitor Mix knob"],
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p4-macro", ch: 4, sec: 8, kind: "macroReveal",
    images: [A.m4Front], focal: [0.5, 0.52], macroScale: 3.1,
    eyebrow: "The front panel",
    heading: "The same preamps.\nPlus a knob.",
    sub: "An Input Monitor Mix control, blending live input against playback by hand.",
    brand: "cornerLogo", sfx: "encoder-click",
  }),
  B({
    id: "p4-mix", ch: 4, sec: 6, kind: "heroSplit",
    images: [A.m4Synth],
    eyebrow: "Tactile engagement",
    heading: "Turn it and hear it.",
    sub: "Two microphones stay patched to the front while a stereo synth records through the rear line inputs.",
    brand: "lowerThird", sfx: "encoder-click",
  }),
  B({
    id: "p4-rear", ch: 4, sec: 5, kind: "portSweep",
    images: [A.m4Rear],
    eyebrow: "The rear panel",
    heading: "Two more in.\nTwo more out.",
    brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "p4-hero", ch: 4, sec: 5, kind: "heroSplit",
    images: [A.m4Hero],
    eyebrow: "Market Operating Price",
    heading: "Rs. 32,900",
    sub: "per unit · MOP, inclusive of GST",
    brand: "lowerThird", sfx: "usbc-seat",
  }),

  // ═══════════════════════════════ 1:40-2:14  S5 — MOTU M6 (34 s, 6 beats)
  B({
    id: "p5-open", ch: 5, sec: 4, kind: "titleCard",
    images: [], product: "m6",
    heading: PRODUCT_NAME.m6,
    sub: PRODUCT_ROLE.m6,
    pills: [SPEC.m6.io, "A/B monitor switch"],
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p5-macro", ch: 5, sec: 9, kind: "macroReveal",
    images: [A.m6Front], focal: [0.22, 0.55], macroScale: 3.3,
    eyebrow: "The front panel",
    heading: "Four preamps.\nSame footprint.",
    sub: "Four gains, four 48V switches, four monitor buttons — and two headphone outputs.",
    brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "p5-lcd", ch: 5, sec: 6, kind: "macroPair",
    images: [A.m6Macro, A.m6Front],
    eyebrow: "The display, up close",
    heading: "Six inputs, metered.",
    brand: "lowerThird", sfx: "talkback-click",
  }),
  B({
    id: "p5-rear", ch: 5, sec: 6, kind: "portSweep",
    images: [A.m6Rear],
    eyebrow: "The rear panel",
    heading: "Where the four\npreamps live.",
    sub: "Plus two more line inputs and a 15V DC socket for standalone operation.",
    brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "p5-ensemble", ch: 5, sec: 5, kind: "montage",
    images: [A.m6Panel, A.m6Drums], cols: 1,
    labels: ["A four-person panel", "A kit, in one pass"],
    eyebrow: "What six channels buys",
    heading: "Everyone at once.",
    brand: "lowerThird", sfx: "encoder-click",
  }),
  B({
    id: "p5-price", ch: 5, sec: 4, kind: "heroSplit",
    images: [A.m6Couch],
    eyebrow: "Market Operating Price",
    heading: "Rs. 55,900",
    brand: "cornerLogo", sfx: "counter-tick",
  }),

  // ══════════════════════ 2:14-2:34  S6 — WHAT ALL THREE SHARE (20 s, 4 beats)
  B({
    id: "p6-open", ch: 6, sec: 4, kind: "titleCard",
    images: [],
    heading: "On every model.",
    pills: ["Loopback", "DC-coupled outs", "Software bundle"],
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p6-loopback", ch: 6, sec: 7, kind: "loopback",
    images: [],
    eyebrow: "Loopback",
    heading: "Computer and mic,\nin one stream.",
    sub: "Merged inside the interface — no third-party virtual cable.",
    brand: "cornerLogo", sfx: "data-stream",
  }),
  B({
    id: "p6-cv", ch: 6, sec: 5, kind: "cv",
    images: [],
    eyebrow: "DC-coupled outputs",
    heading: "Control voltage,\nfrom the DAW.",
    brand: "lowerThird", sfx: "data-stream",
  }),
  B({
    id: "p6-software", ch: 6, sec: 4, kind: "software",
    images: [A.shSoftware],
    eyebrow: "In the box",
    heading: "Record on day one.",
    brand: "cornerLogo", sfx: "usbc-seat",
  }),

  // ═══════════════════════ 2:34-2:58  S7 — PRICE, CTA & OUTRO (24 s, 4 beats)
  B({
    id: "p7-recap", ch: 7, sec: 4, kind: "capacity",
    images: [],
    eyebrow: "One decision left",
    heading: "How many at once?",
    brand: "lowerThird", sfx: "counter-tick",
  }),
  B({ id: "p7-price", ch: 7, sec: 10, kind: "price", images: [], brand: "price", sfx: "avb-ping" }),
  B({ id: "p7-brand", ch: 7, sec: 6, kind: "brandBeat", images: [], brand: "brandBeat", sfx: "avb-ping" }),
  B({ id: "p7-outro", ch: 7, sec: 4, kind: "outro", images: [], brand: "outro", motu: true, sfx: "avb-ping" }),
];

export const BEAT_STARTS: number[] = starts(BEATS);
export const TOTAL_FRAMES: number = totalFrames(BEATS);

export const CHAPTER_SPANS = CHAPTERS.map((c) => {
  const idxs = BEATS.map((b, i) => (b.ch === c.ch ? i : -1)).filter((i) => i >= 0);
  const start = BEAT_STARTS[idxs[0]];
  const last = idxs[idxs.length - 1];
  return { ch: c.ch, name: c.name, start, end: BEAT_STARTS[last] + frames(BEATS[last].sec) };
});

/**
 * MUSIC PLAN (Section 9, Layer 1) — a SINGLE UNIFIED DIABLO DEPLOYMENT.
 *
 * This is deliberately a different deployment from the landscape build, not a
 * copy of it. The landscape video hops tracks per chapter (Mindscape for the
 * problem, DIABLO for the spine, Black & Blue for the shared-craft chapter)
 * because at 298 s it can afford the colour changes and needs them to keep a
 * five-minute runtime from flattening.
 *
 * At 178 s that would read as restlessness. DIABLO measures 170.5 s, so one
 * pass plus a single short seam relay covers the whole reel — giving the short
 * a continuous musical identity of its own. The stems still enter progressively
 * across the segments, so the M2 -> M4 -> M6 build the brief asks for is intact:
 *
 *   S1-S2  instruments + bass          the claim, stated plainly
 *   S3     + drums                     the first product arrives
 *   S4     + melody                    2 -> 4 channels
 *   S5     all four, melody up         the fullest spectrum, for six channels
 *   S6     drums pulled back           a breath before the CTA
 *   S7     all four, full              the close
 */
export const MUSIC_PLAN: MusicPlan[] = [
  { ch: 1, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 1.0 },
    { slug: "diablo-bass", gain: 0.5, from: 6 },
  ] },
  { ch: 2, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 1.0, from: 22 },
    { slug: "diablo-bass", gain: 0.6, from: 22 },
  ] },
  { ch: 3, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.95, from: 46 },
    { slug: "diablo-bass", gain: 0.66, from: 46 },
    { slug: "diablo-drums", gain: 0.52, from: 46 },
  ] },
  { ch: 4, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.92, from: 72 },
    { slug: "diablo-bass", gain: 0.7, from: 72 },
    { slug: "diablo-drums", gain: 0.6, from: 72 },
    { slug: "diablo-melody", gain: 0.66, from: 72 },
  ] },
  { ch: 5, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.95, from: 100 },
    { slug: "diablo-bass", gain: 0.72, from: 100 },
    { slug: "diablo-drums", gain: 0.68, from: 100 },
    { slug: "diablo-melody", gain: 0.9, from: 100 },
  ] },
  { ch: 6, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 1.05, from: 134 },
    { slug: "diablo-bass", gain: 0.6, from: 134 },
    { slug: "diablo-melody", gain: 0.6, from: 134 },
  ] },
  { ch: 7, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 1.0, from: 6 },
    { slug: "diablo-bass", gain: 0.74, from: 6 },
    { slug: "diablo-drums", gain: 0.7, from: 6 },
    { slug: "diablo-melody", gain: 0.86, from: 6 },
  ] },
];

if (TOTAL_FRAMES !== VIDEO.durationInFrames) {
  throw new Error(
    `Schedule is ${TOTAL_FRAMES} frames but VIDEO.durationInFrames is ${VIDEO.durationInFrames}`
  );
}

export { frames };
