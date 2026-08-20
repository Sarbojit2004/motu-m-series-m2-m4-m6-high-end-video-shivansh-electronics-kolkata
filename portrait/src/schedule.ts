import { A } from "./assets";
import { SPEC, PRODUCT_NAME, PRODUCT_ROLE, VIDEO } from "./theme";
import type { Beat, MusicPlan } from "./beat";
import { frames, starts, totalFrames } from "./beat";

/**
 * MOTU M-SERIES — 178 s PORTRAIT REEL, FULL 30-IMAGE BUILD
 * 5,340 frames at 30 fps, 1080 x 1920. Seven segments, 34 beats, 5.24 s average.
 *
 * WHAT CHANGED, AND WHY THE PACING HAD TO CHANGE WITH IT.
 *
 * This regeneration carries ALL 30 unique images (see assets.ts for the exact
 * target and its arithmetic) against the previous build's 17 — a 76% increase
 * in image count with no increase in runtime. Simply cutting faster would make
 * the reel feel rushed and cluttered. So the cutting SYSTEM changed instead:
 *
 *   - MULTI-IMAGE BEATS carry the density. Four rapid triptychs, two rapid
 *     pairs and one stacked duo place 16 of the 30 images inside 7 beats,
 *     each image still complete and uncropped, each unified by one point.
 *     Without these, 30 images would need 30 separate beats averaging 3.9 s,
 *     which is below the floor for making a point at all.
 *   - MACRO-TO-FULL-REVEAL IS RATIONED to exactly three: m2Front, m4Front,
 *     m6Front. They are the only three images shot at matching angle and scale,
 *     and the entire "one engine, three sizes" thesis rests on them. Giving the
 *     full 35/65 treatment to more would either push images out or compress the
 *     reveal below the point where it registers as a reveal.
 *   - ENTRANCE STYLE VARIES per beat across six styles. At 34 beats a single
 *     repeated entrance becomes the noticeable pattern of the piece.
 *
 * TREATMENT SPLIT ACROSS THE 30 (see assets.ts `fit`):
 *   plate   6  the panel plates, on MacroReveal / PortSweep
 *   fill   19  wide images, scaled COMPLETE to frame width with a deliberate
 *              fill behind them — never cropped, never dropped
 *   native  5  near-square, fit the frame unaided
 *
 * SEGMENT TIMING:
 *   S1  Hook, fused with the thesis   20 s   0:00-0:20   5 images
 *   S2  The shared engine             20 s   0:20-0:40   graphics
 *   S3  MOTU M2                       30 s   0:40-1:10   8 images
 *   S4  MOTU M4                       30 s   1:10-1:40   8 images
 *   S5  MOTU M6                       40 s   1:40-2:20  11 images
 *   S6  What all three share          16 s   2:20-2:36   1 image
 *   S7  Price, CTA & outro            22 s   2:36-2:58
 *                                  = 178 s              30 images
 */

const B = (b: Beat): Beat => b;

export const CHAPTERS: { ch: number; name: string; sec: number }[] = [
  { ch: 1, name: "Hook, Fused With The Thesis", sec: 20 },
  { ch: 2, name: "The Shared Engine", sec: 20 },
  { ch: 3, name: "MOTU M2", sec: 30 },
  { ch: 4, name: "MOTU M4", sec: 30 },
  { ch: 5, name: "MOTU M6", sec: 40 },
  { ch: 6, name: "What All Three Share", sec: 16 },
  { ch: 7, name: "Price, CTA & Outro", sec: 22 },
];

export const BEATS: Beat[] = [
  // ═════════════════════ 0:00-0:20  S1 — HOOK FUSED WITH THESIS (20 s, 3 beats)
  B({
    id: "p1-hook", ch: 1, sec: 6, kind: "coldOpen",
    images: [A.shLive],
    eyebrow: "MOTU M-Series",
    heading: "You can hear\nthe difference.",
    serif: true,
    enter: "dissolve", brand: "cornerLogo", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p1-problem", ch: 1, sec: 5, kind: "fitFill",
    images: [A.shRoom],
    eyebrow: "The old trade-off",
    heading: "Cheap and noisy.\nOr out of reach.",
    serif: true, alert: true,
    enter: "wipeUp", brand: "none", sfx: "panel-air",
  }),
  B({
    id: "p1-thesis", ch: 1, sec: 9, kind: "ecosystemMontage",
    images: [A.m2Front, A.m4Front, A.m6Front],
    labels: ["MOTU M2 — 2 in / 2 out", "MOTU M4 — 4 in / 4 out", "MOTU M6 — 6 in / 4 out"],
    soloHold: 62, cols: 1,
    eyebrow: "Not any more",
    heading: "One engine.\nThree sizes.",
    enter: "scaleIn", brand: "cornerLogo", motu: true, sfx: "usbc-seat",
  }),

  // ══════════════════════════ 0:20-0:40  S2 — THE SHARED ENGINE (20 s, 4 beats)
  B({
    id: "p2-capacity", ch: 2, sec: 5, kind: "capacity",
    images: [],
    eyebrow: "The whole idea",
    heading: "Channels.\nNot quality.",
    enter: "slide", brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p2-dac", ch: 2, sec: 6, kind: "counters",
    images: [],
    eyebrow: "The converter",
    heading: "ESS Sabre32 Ultra.",
    counters: [{ to: 120, suffix: " dB", label: "Dynamic range · all three models" }],
    enter: "rise", brand: "cornerLogo", sfx: "avb-ping",
  }),
  B({
    id: "p2-specs", ch: 2, sec: 5, kind: "specGrid",
    images: [],
    eyebrow: "Identical on every model",
    heading: "The numbers\ndo not change.",
    specs: [
      { label: "Measured EIN", value: SPEC.shared.ein },
      { label: "Round-trip latency", value: SPEC.shared.rtl },
      { label: "Sample rate", value: SPEC.shared.rates },
    ],
    enter: "wipeUp", brand: "lowerThird", sfx: "counter-tick",
  }),
  B({
    id: "p2-lcd", ch: 2, sec: 4, kind: "lcd",
    images: [],
    eyebrow: "And the same display",
    heading: "Gain staging\nyou can see.",
    enter: "sweep", brand: "cornerLogo", sfx: "talkback-click",
  }),

  // ═══════════════════════════════ 0:40-1:10  S3 — MOTU M2 (30 s, 6 beats)
  B({
    id: "p3-open", ch: 3, sec: 4, kind: "titleCard",
    images: [], product: "m2",
    heading: PRODUCT_NAME.m2,
    sub: PRODUCT_ROLE.m2,
    pills: [SPEC.m2.io, SPEC.m2.power],
    enter: "cut", brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    // HERO 1 of 3 — full Macro-to-Full-Reveal.
    id: "p3-macro", ch: 3, sec: 8, kind: "macroReveal",
    images: [A.m2Front], focal: [0.52, 0.5], macroScale: 3.2,
    eyebrow: "The front panel",
    heading: "Two channels.\nNothing held back.",
    sub: "Two combo inputs, each with its own gain, 48V and one-touch monitoring.",
    enter: "scaleIn", brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "p3-rear", ch: 3, sec: 5, kind: "portSweep",
    images: [A.m2Rear],
    eyebrow: "The rear panel",
    heading: "Everything you need.",
    sub: "DC-coupled outs, mirrored RCA, MIDI, USB-C bus power.",
    enter: "slide", brand: "lowerThird", sfx: "encoder-click",
  }),
  B({
    id: "p3-hero", ch: 3, sec: 3, kind: "fitFill",
    images: [A.m2Hero],
    eyebrow: "Market Operating Price",
    heading: "Rs. 26,900",
    enter: "dissolve", brand: "cornerLogo", sfx: "counter-tick",
  }),
  B({
    // RAPID TRIPTYCH — three complete images, ~2 s each, cross-dissolved.
    id: "p3-life", ch: 3, sec: 6, kind: "rapidSeq",
    images: [A.m2Desk, A.m2Couch, A.m2Glass],
    labels: ["At the desk", "On the couch", "Wherever it starts"],
    eyebrow: "In the room",
    heading: "It runs off the cable.",
    enter: "wipeUp", brand: "cornerLogo", sfx: "rj45-snap",
  }),
  B({
    id: "p3-anywhere", ch: 3, sec: 4, kind: "rapidSeq",
    images: [A.m2Alt, A.m2Dark],
    labels: ["Set up in minutes", "Working late"],
    eyebrow: "Two channels, anywhere",
    heading: "The solo signal.",
    enter: "sweep", brand: "lowerThird", sfx: "talkback-click",
  }),

  // ═══════════════════════════════ 1:10-1:40  S4 — MOTU M4 (30 s, 6 beats)
  B({
    id: "p4-open", ch: 4, sec: 4, kind: "titleCard",
    images: [], product: "m4",
    heading: PRODUCT_NAME.m4,
    sub: PRODUCT_ROLE.m4,
    pills: [SPEC.m4.io, "Monitor Mix knob"],
    enter: "cut", brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    // HERO 2 of 3.
    id: "p4-macro", ch: 4, sec: 8, kind: "macroReveal",
    images: [A.m4Front], focal: [0.5, 0.52], macroScale: 3.1,
    eyebrow: "The front panel",
    heading: "The same preamps.\nPlus a knob.",
    sub: "An Input Monitor Mix control, blending live input against playback by hand.",
    enter: "scaleIn", brand: "cornerLogo", sfx: "encoder-click",
  }),
  B({
    id: "p4-rear", ch: 4, sec: 5, kind: "portSweep",
    images: [A.m4Rear],
    eyebrow: "The rear panel",
    heading: "Two more in.\nTwo more out.",
    enter: "slide", brand: "lowerThird", sfx: "xlr-lock",
  }),
  B({
    id: "p4-mix", ch: 4, sec: 3, kind: "fitFill",
    images: [A.m4Synth],
    eyebrow: "Tactile engagement",
    heading: "Turn it and hear it.",
    enter: "dissolve", brand: "cornerLogo", sfx: "encoder-click",
  }),
  B({
    id: "p4-life", ch: 4, sec: 6, kind: "rapidSeq",
    images: [A.m4Desk, A.m4Drums, A.m4Cable],
    labels: ["Producing", "Tracking a kit", "Patched in"],
    eyebrow: "Four channels",
    heading: "Room to work.",
    enter: "wipeUp", brand: "cornerLogo", sfx: "rj45-snap",
  }),
  B({
    id: "p4-price", ch: 4, sec: 4, kind: "rapidSeq",
    images: [A.m4Hero, A.m4Alt],
    labels: ["MOTU M4", "In the studio"],
    eyebrow: "Market Operating Price",
    heading: "Rs. 32,900",
    enter: "sweep", brand: "lowerThird", sfx: "counter-tick",
  }),

  // ═══════════════════════════════ 1:40-2:20  S5 — MOTU M6 (40 s, 7 beats)
  B({
    id: "p5-open", ch: 5, sec: 4, kind: "titleCard",
    images: [], product: "m6",
    heading: PRODUCT_NAME.m6,
    sub: PRODUCT_ROLE.m6,
    pills: [SPEC.m6.io, "A/B monitor switch"],
    enter: "cut", brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    // HERO 3 of 3.
    id: "p5-macro", ch: 5, sec: 8, kind: "macroReveal",
    images: [A.m6Front], focal: [0.22, 0.55], macroScale: 3.3,
    eyebrow: "The front panel",
    heading: "Four preamps.\nSame footprint.",
    sub: "Four gains, four 48V switches — and two headphone outputs.",
    enter: "scaleIn", brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "p5-lcd", ch: 5, sec: 5, kind: "macroPair",
    images: [A.m6Macro, A.m6Front],
    eyebrow: "The display, up close",
    heading: "Six inputs, metered.",
    enter: "dissolve", brand: "lowerThird", sfx: "talkback-click",
  }),
  B({
    id: "p5-rear", ch: 5, sec: 5, kind: "portSweep",
    images: [A.m6Rear],
    eyebrow: "The rear panel",
    heading: "Where the four\npreamps live.",
    enter: "slide", brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "p5-ensemble", ch: 5, sec: 6, kind: "rapidSeq",
    images: [A.m6Panel, A.m6Drums, A.m6Studio],
    labels: ["A four-person panel", "A kit, in one pass", "The whole setup"],
    eyebrow: "What six channels buys",
    heading: "Everyone at once.",
    enter: "wipeUp", brand: "lowerThird", sfx: "rj45-snap",
  }),
  B({
    // STACK DUO — two complete landscape frames, one above the other.
    id: "p5-control", ch: 5, sec: 5, kind: "stackDuo",
    images: [A.m6Dark, A.m6Low],
    labels: ["A/B across two pairs", "Two headphone mixes"],
    eyebrow: "Control-room features",
    heading: "Reference it properly.",
    enter: "sweep", brand: "cornerLogo", sfx: "talkback-click",
  }),
  B({
    id: "p5-anywhere", ch: 5, sec: 7, kind: "rapidSeq",
    images: [A.m6Couch, A.m6Bright, A.m6Alt],
    labels: ["On the couch", "In the studio", "Desk-side"],
    eyebrow: "Market Operating Price",
    heading: "Rs. 55,900",
    enter: "rise", brand: "lowerThird", sfx: "counter-tick",
  }),

  // ══════════════════════ 2:20-2:36  S6 — WHAT ALL THREE SHARE (16 s, 4 beats)
  B({
    id: "p6-open", ch: 6, sec: 3, kind: "titleCard",
    images: [],
    heading: "On every model.",
    pills: ["Loopback", "DC-coupled outs", "Software"],
    enter: "cut", brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "p6-loopback", ch: 6, sec: 6, kind: "loopback",
    images: [],
    eyebrow: "Loopback",
    heading: "Computer and mic,\nin one stream.",
    enter: "wipeUp", brand: "cornerLogo", sfx: "data-stream",
  }),
  B({
    id: "p6-cv", ch: 6, sec: 4, kind: "cv",
    images: [],
    eyebrow: "DC-coupled outputs",
    heading: "Control voltage,\nfrom the DAW.",
    enter: "slide", brand: "lowerThird", sfx: "data-stream",
  }),
  B({
    id: "p6-software", ch: 6, sec: 3, kind: "fitFill",
    images: [A.shSoftware],
    eyebrow: "In the box",
    heading: "Record on day one.",
    enter: "dissolve", brand: "cornerLogo", sfx: "usbc-seat",
  }),

  // ═══════════════════════ 2:36-2:58  S7 — PRICE, CTA & OUTRO (22 s, 4 beats)
  B({
    id: "p7-recap", ch: 7, sec: 3, kind: "capacity",
    images: [],
    eyebrow: "One decision left",
    heading: "How many at once?",
    enter: "scaleIn", brand: "lowerThird", sfx: "counter-tick",
  }),
  B({ id: "p7-price", ch: 7, sec: 10, kind: "price", images: [], enter: "rise", brand: "price", sfx: "avb-ping" }),
  B({ id: "p7-brand", ch: 7, sec: 5, kind: "brandBeat", images: [], enter: "dissolve", brand: "brandBeat", sfx: "avb-ping" }),
  B({ id: "p7-outro", ch: 7, sec: 4, kind: "outro", images: [], enter: "sweep", brand: "outro", motu: true, sfx: "avb-ping" }),
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
 * MUSIC PLAN — a single unified DIABLO deployment, unchanged in principle from
 * the previous portrait build and still deliberately different from the
 * landscape video's chapter-hopping. Offsets are re-cut to the new segment
 * boundaries so each segment still enters on a musical point.
 *
 *   S1-S2  instruments + bass          the claim, stated plainly
 *   S3     + drums                     the first product arrives
 *   S4     + melody                    2 -> 4 channels
 *   S5     all four, melody up         fullest spectrum, for six channels
 *   S6     drums pulled back           a breath before the CTA
 *   S7     all four, full              the close
 */
export const MUSIC_PLAN: MusicPlan[] = [
  { ch: 1, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 1.0 },
    { slug: "diablo-bass", gain: 0.5, from: 6 },
  ] },
  { ch: 2, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 1.0, from: 20 },
    { slug: "diablo-bass", gain: 0.6, from: 20 },
  ] },
  { ch: 3, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.95, from: 40 },
    { slug: "diablo-bass", gain: 0.66, from: 40 },
    { slug: "diablo-drums", gain: 0.52, from: 40 },
  ] },
  { ch: 4, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.92, from: 70 },
    { slug: "diablo-bass", gain: 0.7, from: 70 },
    { slug: "diablo-drums", gain: 0.6, from: 70 },
    { slug: "diablo-melody", gain: 0.66, from: 70 },
  ] },
  { ch: 5, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.95, from: 100 },
    { slug: "diablo-bass", gain: 0.72, from: 100 },
    { slug: "diablo-drums", gain: 0.68, from: 100 },
    { slug: "diablo-melody", gain: 0.9, from: 100 },
  ] },
  { ch: 6, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 1.05, from: 140 },
    { slug: "diablo-bass", gain: 0.6, from: 140 },
    { slug: "diablo-melody", gain: 0.6, from: 140 },
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
