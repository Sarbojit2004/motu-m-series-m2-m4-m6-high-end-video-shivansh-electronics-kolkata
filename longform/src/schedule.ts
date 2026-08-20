import { A } from "./assets";
import { SPEC, PRODUCT_NAME, PRODUCT_ROLE, VIDEO } from "./theme";
import type { Beat, MusicPlan } from "./beat";
import { frames, starts, totalFrames } from "./beat";

/**
 * MOTU M-SERIES — 298 s LANDSCAPE LONG-FORM
 * 8,940 frames at 30 fps. Seven chapters, 42 beats, average 7.1 s.
 *
 * THE GOVERNING DECISION (Section 1).
 *
 * The M2, M4 and M6 share a VERIFIED-identical audio engine: the same ESS
 * Sabre32 Ultra DAC, the same 120 dB dynamic range, the same -129 dBu EIN
 * preamps, the same 2.5 ms round-trip latency, the same 24-bit/192 kHz, the
 * same 160x120 full-colour LCD, the same loopback. They differ ONLY in
 * simultaneous channel count and in physical workflow controls.
 *
 * So this is a HORIZONTAL CONTINUUM OF CAPACITY, not a vertical ladder of
 * quality — and the structure is built to make that unmistakable:
 *
 *   - Ch2 establishes the shared engine BEFORE any single product gets a
 *     segment, so the fidelity claim is made once and never has to be
 *     re-proved. Ch3-Ch5 are then free to talk purely about workflow.
 *   - Product order is M2 -> M4 -> M6 (ascending I/O). Introducing the
 *     flagship engine on the SMALLEST unit first is what prevents the
 *     "the M2 must be the compromised one" misreading.
 *   - Ecosystem Montage carries every cross-product beat. It is earned here by
 *     the verified shared-engine fact, not borrowed from the AVB build.
 *
 * CHAPTER TIMING (Section 4.1's shape, with the per-product split set by
 * genuine narrative weight and asset strength rather than forced equality):
 *
 *   Ch1  The Binary                   40 s   0:00-0:40
 *   Ch2  One Engine. Three Sizes.     42 s   0:40-1:22
 *   Ch3  M2 - The Solo Signal         42 s   1:22-2:04
 *   Ch4  M4 - The Room That Grew      44 s   2:04-2:48
 *   Ch5  M6 - The Whole Ensemble      50 s   2:48-3:38
 *   Ch6  What All Three Share         40 s   3:38-4:18
 *   Ch7  Synthesis, Price & CTA       40 s   4:18-4:58
 *
 * Within Ch7 the price beat runs 12 s rather than 10. It is the tightest copy
 * in the deliverable — three distinct MOPs AND the best-price direction have to
 * land in one beat — and the voiceover word-budget check (scripts/vo-script.mjs)
 * failed it at 10 s. The two seconds come from `c7-transform` and `c7-recap`,
 * which were comfortably under budget, and one more from `c7-contact`, whose
 * detail is read on screen rather than narrated.
 *                                  = 298 s
 *
 * M6 takes 50 s against M2's 42 s because its photography is genuinely the
 * strongest in the set (ten selected images against seven, at 3000px-class
 * resolution) and it carries three features the others do not. M2 is NOT
 * padded up to match, and M6 is not trimmed down to be fair.
 *
 * IMAGE TREATMENT (Section 3): three images earn a full Macro-to-Full-Reveal
 * (m2Front, m4Front, m6Front — the three faces the whole thesis rests on).
 * Port Density Sweep appears just THREE times in 298 s, only on the rear-panel
 * plates that genuinely have connector density; the M-Series is a compact line
 * and that compactness is presented as a virtue, not disguised. Everything else
 * is a montage solo pass or a drift, both of which are full-size and uncropped.
 * No image anywhere is cropped to fit the pace.
 */

const B = (b: Beat): Beat => b;

export const CHAPTERS: { ch: number; name: string; sec: number }[] = [
  { ch: 1, name: "The Binary", sec: 40 },
  { ch: 2, name: "One Engine. Three Sizes.", sec: 42 },
  { ch: 3, name: "MOTU M2 — The Solo Signal", sec: 42 },
  { ch: 4, name: "MOTU M4 — The Room That Grew", sec: 44 },
  { ch: 5, name: "MOTU M6 — The Whole Ensemble", sec: 50 },
  { ch: 6, name: "What All Three Share", sec: 40 },
  { ch: 7, name: "Synthesis, Price & Call To Action", sec: 40 },
];

export const BEATS: Beat[] = [
  // ══════════════════════════════════ 0:00-0:40  CH1 — THE BINARY (40 s)
  B({
    id: "c1-cold-open", ch: 1, sec: 9, kind: "coldOpen",
    images: [A.shLive],
    eyebrow: "MOTU M-Series",
    heading: "Everyone can hear\nthe difference.",
    sub: "Between a room, and a recording of a room.",
    serif: true,
    brand: "cornerLogo", motu: true, sfx: "panel-air",
  }),
  B({
    id: "c1-problem", ch: 1, sec: 8, kind: "editorial",
    images: [A.m2Dark],
    eyebrow: "The problem",
    heading: "Two bad options.",
    sub: "A budget interface that adds hiss to everything you record.\nOr a studio interface priced far beyond a first serious setup.",
    serif: true, alert: true,
    brand: "none", sfx: "panel-air",
  }),
  B({
    id: "c1-pain", ch: 1, sec: 7, kind: "heroSplit",
    images: [A.shRoom],
    eyebrow: "The cost of settling",
    heading: "Not knowing\nis the worst part.",
    sub: "Audible noise on the vocal. Muddy conversion on the acoustic. Latency that pulls the timing apart — and a constant, quiet doubt that the track sounds amateur because of the gear.",
    brand: "cornerLogo", sfx: "talkback-click",
  }),
  B({
    id: "c1-turn", ch: 1, sec: 8, kind: "counters",
    images: [],
    eyebrow: "There is a third option",
    heading: "Put the flagship engine\nin every size.",
    sub: "MOTU has built professional audio hardware since 1980. The M-Series is that engineering, in a desktop chassis.",
    counters: [
      { to: 120, suffix: " dB", label: "Dynamic range, main outputs" },
      { to: -129, suffix: " dBu", label: "Measured EIN, mic inputs" },
      { to: 2.5, suffix: " ms", label: "Round-trip latency", decimals: 1 },
    ],
    brand: "lowerThird", detail: "Authorized MOTU Distributor", sfx: "avb-ping",
  }),
  B({
    id: "c1-thesis", ch: 1, sec: 8, kind: "ecosystemMontage",
    images: [A.m2Front, A.m4Front, A.m6Front],
    labels: ["MOTU M2 — 2 in / 2 out", "MOTU M4 — 4 in / 4 out", "MOTU M6 — 6 in / 4 out"],
    soloHold: 52, cols: 1,
    eyebrow: "The M-Series",
    heading: "One engine. Three sizes.",
    brand: "cornerLogo", motu: true, sfx: "usbc-seat",
  }),

  // ═══════════════════════ 0:40-1:22  CH2 — ONE ENGINE. THREE SIZES. (42 s)
  B({
    id: "c2-open", ch: 2, sec: 7, kind: "capacity",
    images: [],
    eyebrow: "Chapter one",
    heading: "You are choosing\nchannels. Not quality.",
    sub: "Every bar below the line is identical on all three units. Only the channel count changes.",
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "c2-dac", ch: 2, sec: 8, kind: "counters",
    images: [],
    eyebrow: "The converter",
    heading: "ESS Sabre32 Ultra.",
    sub: "The same premium DAC on the M2, the M4 and the M6 — 120 dB of dynamic range on the main outputs, and the headroom that comes with it.",
    counters: [{ to: 120, suffix: " dB", label: "Dynamic range · all three models" }],
    brand: "cornerLogo", sfx: "avb-ping",
  }),
  B({
    id: "c2-ein", ch: 2, sec: 7, kind: "specGrid",
    images: [],
    eyebrow: "The preamps",
    heading: "-129 dBu EIN.",
    sub: "Ultra-clean gain, so a quiet dynamic microphone can be driven hard without the hiss that gives budget hardware away.",
    specs: [
      { label: "Measured EIN", value: SPEC.shared.ein },
      { label: "Sample rate", value: SPEC.shared.rates },
      { label: "Metering", value: SPEC.shared.lcd },
    ],
    brand: "lowerThird", sfx: "counter-tick",
  }),
  B({
    id: "c2-latency", ch: 2, sec: 7, kind: "counters",
    images: [],
    eyebrow: "The drivers",
    heading: "2.5 ms, round trip.",
    sub: "At 96 kHz with a 32-sample buffer. Monitor a take through an amp simulator or a reverb and it still feels immediate.",
    counters: [{ to: 2.5, suffix: " ms", label: SPEC.shared.rtlNote, decimals: 1 }],
    brand: "cornerLogo", sfx: "counter-tick",
  }),
  B({
    id: "c2-lcd", ch: 2, sec: 7, kind: "lcd",
    images: [],
    eyebrow: "The display",
    heading: "Gain staging\nyou can see.",
    sub: "A 160 x 120 full-colour LCD on every model, metering every input and output — instead of one ambiguous clip LED.",
    brand: "lowerThird", sfx: "talkback-click",
  }),
  B({ id: "c2-brand", ch: 2, sec: 6, kind: "brandBeat", images: [], brand: "brandBeat", sfx: "avb-ping" }),

  // ═══════════════════════════ 1:22-2:04  CH3 — MOTU M2 (42 s)
  B({
    id: "c3-open", ch: 3, sec: 6, kind: "titleCard",
    images: [], product: "m2",
    eyebrow: "Chapter two",
    heading: PRODUCT_NAME.m2,
    sub: PRODUCT_ROLE.m2,
    pills: [SPEC.m2.io, SPEC.m2.combo, SPEC.m2.power],
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "c3-macro", ch: 3, sec: 10, kind: "macroReveal",
    images: [A.m2Front], focal: [0.52, 0.5], macroScale: 3.2,
    eyebrow: "The front panel",
    heading: "Two channels.\nNothing held back.",
    sub: "Two XLR/TRS combo inputs with their own preamp gain, 48V and one-touch monitoring.",
    brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "c3-hero", ch: 3, sec: 7, kind: "heroSplit",
    images: [A.m2Hero],
    eyebrow: "Built for one voice",
    heading: "The solo signal.",
    sub: "A singer-songwriter, a voiceover artist, a solo podcaster — one or two sources at a time, captured through the same converter as the six-channel unit.",
    specs: [
      { label: "I/O", value: SPEC.m2.io },
      { label: "Outputs", value: SPEC.m2.trsOut },
      { label: "Weight", value: SPEC.m2.weight },
    ],
    brand: "lowerThird", sfx: "usbc-seat",
  }),
  B({
    id: "c3-rear", ch: 3, sec: 7, kind: "portSweep",
    images: [A.m2Rear],
    eyebrow: "The rear panel",
    heading: "Everything you need.\nNothing you don't.",
    sub: "Balanced DC-coupled TRS outs, mirrored RCA, 5-pin MIDI in and out, and USB-C bus power.",
    brand: "cornerLogo", sfx: "encoder-click",
  }),
  B({
    id: "c3-life", ch: 3, sec: 7, kind: "montage",
    images: [A.m2Desk, A.m2Couch], cols: 2,
    labels: ["At the desk", "Wherever the song starts"],
    eyebrow: "In the room",
    heading: "Small enough to travel with.",
    brand: "lowerThird", sfx: "talkback-click",
  }),
  B({
    id: "c3-glass", ch: 3, sec: 5, kind: "heroSplit",
    images: [A.m2Glass],
    eyebrow: "Market Operating Price",
    heading: "Rs. 26,900",
    sub: "per unit · MOP, inclusive of GST",
    brand: "cornerLogo", sfx: "counter-tick",
  }),

  // ═══════════════════════════ 2:04-2:48  CH4 — MOTU M4 (44 s)
  B({
    id: "c4-open", ch: 4, sec: 6, kind: "titleCard",
    images: [], product: "m4",
    eyebrow: "Chapter three",
    heading: PRODUCT_NAME.m4,
    sub: PRODUCT_ROLE.m4,
    pills: [SPEC.m4.io, SPEC.m4.line, SPEC.m4.mix],
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "c4-macro", ch: 4, sec: 10, kind: "macroReveal",
    images: [A.m4Front], focal: [0.5, 0.52], macroScale: 3.1,
    eyebrow: "The front panel",
    heading: "The same two preamps.\nPlus a knob.",
    sub: "An Input Monitor Mix control, blending the live input against computer playback by hand — no routing software in the way.",
    brand: "cornerLogo", sfx: "encoder-click",
  }),
  B({
    id: "c4-mix", ch: 4, sec: 7, kind: "heroSplit",
    images: [A.m4Synth],
    eyebrow: "Tactile engagement",
    heading: "Turn it and hear it.",
    sub: "Leave two microphones permanently patched to the front, and record a stereo hardware synth through the rear line inputs at the same time. No repatching between takes.",
    brand: "lowerThird", sfx: "encoder-click",
  }),
  B({
    id: "c4-rear", ch: 4, sec: 8, kind: "portSweep",
    images: [A.m4Rear],
    eyebrow: "The rear panel",
    heading: "Two more inputs.\nTwo more outputs.",
    sub: "Dedicated balanced line inputs for hardware, four DC-coupled TRS outputs, four mirrored RCA, MIDI, and USB-C bus power.",
    brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "c4-hero", ch: 4, sec: 6, kind: "heroSplit",
    images: [A.m4Hero],
    eyebrow: "Market Operating Price",
    heading: "Rs. 32,900",
    sub: "per unit · MOP, inclusive of GST",
    specs: [
      { label: "I/O", value: SPEC.m4.io },
      { label: "Line inputs", value: SPEC.m4.line },
      { label: "Monitor mix", value: "Physical knob" },
    ],
    brand: "lowerThird", sfx: "usbc-seat",
  }),
  B({
    id: "c4-life", ch: 4, sec: 7, kind: "montage",
    images: [A.m4Desk, A.m4Drums, A.m4Cable], cols: 3,
    labels: ["Producing", "Tracking", "Patched in"],
    eyebrow: "In the room",
    heading: "Four channels, and room to work.",
    brand: "cornerLogo", sfx: "talkback-click",
  }),

  // ═══════════════════════════ 2:48-3:38  CH5 — MOTU M6 (50 s)
  B({
    id: "c5-open", ch: 5, sec: 6, kind: "titleCard",
    images: [], product: "m6",
    eyebrow: "Chapter four",
    heading: PRODUCT_NAME.m6,
    sub: PRODUCT_ROLE.m6,
    pills: [SPEC.m6.io, SPEC.m6.combo, SPEC.m6.ab],
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "c5-macro", ch: 5, sec: 10, kind: "macroReveal",
    images: [A.m6Front], focal: [0.22, 0.55], macroScale: 3.3,
    eyebrow: "The front panel",
    heading: "Four preamps.\nSame desktop footprint.",
    sub: "Four gain controls, four 48V switches, four monitor buttons — and the combo jacks moved to the rear to keep the box this size.",
    brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "c5-lcd", ch: 5, sec: 7, kind: "macroPair",
    images: [A.m6Macro, A.m6Front],
    eyebrow: "The display, up close",
    heading: "Six inputs, metered.",
    sub: "1-2, 3-4 and 5-6 on the input side, with the A/B monitor selection shown on the output side.",
    brand: "lowerThird", sfx: "talkback-click",
  }),
  B({
    id: "c5-rear", ch: 5, sec: 8, kind: "portSweep",
    images: [A.m6Rear],
    eyebrow: "The rear panel",
    heading: "Where the four\npreamps live.",
    sub: "Four MIC/LINE/GUITAR combo jacks, two more balanced line inputs, four DC-coupled outputs, MIDI, USB-C — and a 15V DC input for standalone operation.",
    brand: "cornerLogo", sfx: "xlr-lock",
  }),
  B({
    id: "c5-ab", ch: 5, sec: 7, kind: "heroSplit",
    images: [A.m6Dark],
    eyebrow: "Control-room features",
    heading: "A/B your mix.\nTwice the headphones.",
    sub: "A front-panel A/B switch to compare across two sets of monitors, and a second headphone output with independent 3-4 routing for a separate cue mix.",
    specs: [
      { label: "Monitoring", value: "A/B monitor switch" },
      { label: "Headphones", value: SPEC.m6.phones },
      { label: "Power", value: SPEC.m6.power },
    ],
    brand: "lowerThird", sfx: "talkback-click",
  }),
  B({
    id: "c5-ensemble", ch: 5, sec: 7, kind: "montage",
    images: [A.m6Panel, A.m6Drums, A.m6Studio], cols: 3,
    labels: ["A four-person panel", "A kit, in one pass", "The whole setup"],
    eyebrow: "What six channels buys",
    heading: "Everyone at once.",
    brand: "cornerLogo", sfx: "encoder-click",
  }),
  B({
    id: "c5-anywhere", ch: 5, sec: 5, kind: "montage",
    images: [A.m6Couch, A.m6Bright, A.m6Low], cols: 3,
    labels: ["On the couch", "In the studio", "After dark"],
    eyebrow: "Market Operating Price",
    heading: "Rs. 55,900",
    brand: "lowerThird", sfx: "counter-tick",
  }),

  // ══════════════════════ 3:38-4:18  CH6 — WHAT ALL THREE SHARE (40 s)
  B({
    id: "c6-open", ch: 6, sec: 6, kind: "titleCard",
    images: [],
    eyebrow: "Chapter five",
    heading: "What all three share.",
    sub: "Beyond the converter and the preamps, three capabilities ship on every model.",
    pills: ["Loopback", "DC-coupled outputs", "Software bundle"],
    brand: "none", motu: true, sfx: "panel-air",
  }),
  B({
    id: "c6-loopback", ch: 6, sec: 9, kind: "loopback",
    images: [],
    eyebrow: "Loopback",
    heading: "Your computer\nand your microphone.",
    sub: "Driver loopback channels merge computer playback with a live input inside the interface — a clean livestream or podcast feed without a third-party virtual cable.",
    brand: "cornerLogo", sfx: "data-stream",
  }),
  B({
    id: "c6-cv", ch: 6, sec: 8, kind: "cv",
    images: [],
    eyebrow: "DC-coupled outputs",
    heading: "Control voltage,\nstraight from the DAW.",
    sub: "Every TRS output is DC-coupled, so the same jacks that feed your monitors can drive a modular synthesizer directly.",
    brand: "lowerThird", sfx: "data-stream",
  }),
  B({
    id: "c6-software", ch: 6, sec: 7, kind: "software",
    images: [A.shSoftware],
    eyebrow: "In the box",
    heading: "Ready to record\non day one.",
    sub: "Performer Lite and Ableton Live Lite, six gigabytes of loops, and over a hundred virtual instruments — with every model.",
    brand: "cornerLogo", sfx: "usbc-seat",
  }),
  B({
    id: "c6-metering", ch: 6, sec: 5, kind: "lcd",
    images: [],
    eyebrow: "And the same display",
    heading: "On every model.",
    sub: "Full-colour metering for every input and output, at any channel count.",
    brand: "lowerThird", sfx: "talkback-click",
  }),
  B({ id: "c6-brand", ch: 6, sec: 5, kind: "brandBeat", images: [], brand: "brandBeat", sfx: "avb-ping" }),

  // ═══════════════ 4:18-4:58  CH7 — SYNTHESIS, PRICE & CALL TO ACTION (40 s)
  B({
    id: "c7-transform", ch: 7, sec: 7, kind: "ecosystemMontage",
    images: [A.m2Hero, A.m4Hero, A.m6Front],
    labels: ["MOTU M2", "MOTU M4", "MOTU M6"],
    soloHold: 48, cols: 1,
    eyebrow: "The whole line",
    heading: "Pick the size.\nThe sound is settled.",
    brand: "cornerLogo", motu: true, sfx: "panel-air",
  }),
  B({
    id: "c7-recap", ch: 7, sec: 6, kind: "capacity",
    images: [],
    eyebrow: "One decision left",
    heading: "How many sources,\nat the same time?",
    sub: "Two, four or six. That is the entire question — the engine below the line does not change.",
    brand: "lowerThird", sfx: "counter-tick",
  }),
  B({ id: "c7-price", ch: 7, sec: 12, kind: "price", images: [], brand: "price", sfx: "avb-ping" }),
  B({ id: "c7-distributor", ch: 7, sec: 7, kind: "brandBeat", images: [], brand: "brandBeat", sfx: "avb-ping" }),
  B({ id: "c7-contact", ch: 7, sec: 4, kind: "contact", images: [], brand: "contact", sfx: "usbc-seat" }),
  B({ id: "c7-outro", ch: 7, sec: 4, kind: "outro", images: [], brand: "outro", motu: true, sfx: "avb-ping" }),
];

export const BEAT_STARTS: number[] = starts(BEATS);
export const TOTAL_FRAMES: number = totalFrames(BEATS);

/** Chapter spans in frames, derived from the beats themselves. */
export const CHAPTER_SPANS = CHAPTERS.map((c) => {
  const idxs = BEATS.map((b, i) => (b.ch === c.ch ? i : -1)).filter((i) => i >= 0);
  const start = BEAT_STARTS[idxs[0]];
  const last = idxs[idxs.length - 1];
  return { ch: c.ch, name: c.name, start, end: BEAT_STARTS[last] + frames(BEATS[last].sec) };
});

/**
 * MUSIC PLAN (Section 9, Layer 1).
 *
 * Chosen from MEASURED analysis of all 22 files in the AVB repository's
 * sound-effects/ directory, not assumption. Durations and mean levels are in
 * scripts/validate-audio.mjs output.
 *
 * The brief's music direction asks the arrangement to BUILD as the narrative
 * moves M2 -> M4 -> M6. That needs a complete four-stem set, which only DIABLO
 * (170.5 s) and ETERNITY (142.7 s) have. ETERNITY is heavily compressed
 * (-6.3 dB mean) and would crowd narration; DIABLO is far better spread
 * (bass -11.7 / drums -10.0 / instruments -16.9 / melody -19.5 dB), leaving
 * real headroom to add one layer at a time. So DIABLO is the spine.
 *
 *   Ch1  MINDSCAPE   — drumless and ambient (-15.8 dB), the right bed under a
 *                      problem statement. No percussion until there is an answer.
 *   Ch2  DIABLO      — instruments + bass enter as the engine is established.
 *   Ch3  DIABLO      — + drums, as the first product arrives.
 *   Ch4  DIABLO      — + melody, mirroring 2 -> 4 channels.
 *   Ch5  DIABLO      — all four stems, melody up: the fullest spectrum for the
 *                      six-channel unit, exactly as the brief's Dynamic
 *                      Progression section asks.
 *   Ch6  BLACK & BLUE— a deliberate colour change for the shared-craft chapter,
 *                      so Ch7 can return to DIABLO and read as a climax.
 *   Ch7  DIABLO      — full mix.
 *
 * The per-chapter gains below were rebalanced after a measured first render:
 * Ch1 and Ch6 are lifted, Ch2 slightly, so that the global BED_TRIM (see
 * src/Audio.tsx) can come down far enough to leave real voice headroom without
 * making the quiet chapters inaudible. Levels are verified end-to-end by
 * scripts/audio-profile.mjs.
 */
export const MUSIC_PLAN: MusicPlan[] = [
  { ch: 1, track: "mindscape", stems: [
    { slug: "mindscape-instruments", gain: 1.15 },
    { slug: "mindscape-melody", gain: 0.95 },
  ] },
  { ch: 2, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 1.05 },
    { slug: "diablo-bass", gain: 0.6, from: 12 },
  ] },
  { ch: 3, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.9, from: 30 },
    { slug: "diablo-bass", gain: 0.62, from: 30 },
    { slug: "diablo-drums", gain: 0.5, from: 30 },
  ] },
  { ch: 4, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.88, from: 60 },
    { slug: "diablo-bass", gain: 0.66, from: 60 },
    { slug: "diablo-drums", gain: 0.58, from: 60 },
    { slug: "diablo-melody", gain: 0.62, from: 60 },
  ] },
  { ch: 5, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.92, from: 96 },
    { slug: "diablo-bass", gain: 0.7, from: 96 },
    { slug: "diablo-drums", gain: 0.66, from: 96 },
    { slug: "diablo-melody", gain: 0.86, from: 96 },
  ] },
  { ch: 6, track: "blackblue", stems: [
    { slug: "blackblue-instruments", gain: 1.3 },
    { slug: "blackblue-bass", gain: 0.68, from: 8 },
    { slug: "blackblue-drums", gain: 0.57, from: 20 },
  ] },
  { ch: 7, track: "diablo", stems: [
    { slug: "diablo-instruments", gain: 0.95, from: 8 },
    { slug: "diablo-bass", gain: 0.72, from: 8 },
    { slug: "diablo-drums", gain: 0.7, from: 8 },
    { slug: "diablo-melody", gain: 0.8, from: 8 },
  ] },
];

if (TOTAL_FRAMES !== VIDEO.durationInFrames) {
  throw new Error(
    `Schedule is ${TOTAL_FRAMES} frames but VIDEO.durationInFrames is ${VIDEO.durationInFrames}`
  );
}

export { frames };
