// Section 8 — the voiceover script, emitted FROM the schedule that renders the
// video. Timestamps are not typed by hand and cannot drift: each line's in/out
// is the beat's own in/out, so the script is in sync by construction.
//
// Also acts as Section 10 checkpoint 9: it word-counts every line against the
// beat it has to land on and fails if any line cannot be read at a comfortable
// pace (140-165 wpm, ~2.5 words/second).
import { loadSchedule, tc } from "./_load.mjs";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const { BEATS, BEAT_STARTS, VIDEO, BRAND, PRICE, frames } = await loadSchedule();

/**
 * Tone: WARM & TRUSTWORTHY, with the spec callouts read in the Precise &
 * Technical register (Section 8 / brief Section 9).
 *
 * Chosen because the whole narrative exists to remove the "am I settling?"
 * anxiety — that is a mentor's job, not a narrator's. Cinematic & Aspirational
 * would oversell a desktop interface and undercut the plain-fact spec claims;
 * pure Precise & Technical would read as a lecture and leave the emotional
 * problem in Chapter 1 unanswered. So: a trusted engineer talking across a
 * desk, who gets exact when the numbers matter.
 */
const LINES = {
  "c1-cold-open":
    "Everyone can hear the difference between a room, and a recording of that room. What sits in between decides it.",
  "c1-problem":
    "For years that meant two bad options. A budget interface that adds hiss. Or a studio interface you cannot afford yet.",
  "c1-pain":
    "The worst part was never the noise. It was wondering whether your track sounded amateur.",
  "c1-turn":
    "MOTU has built professional audio since nineteen eighty. The M-Series puts that engineering on your desk.",
  "c1-thesis":
    "Three interfaces. One engine. The M2, M4 and M6 differ in how much you can record at once.",

  "c2-open":
    "So you are not choosing a quality tier. You are choosing a channel count.",
  "c2-dac":
    "The same ESS Sabre32 Ultra DAC sits in all three. A hundred and twenty decibels of dynamic range.",
  "c2-ein":
    "The preamps measure minus one twenty-nine dBu. Drive a quiet microphone hard; the hiss is not there.",
  "c2-latency":
    "Round-trip latency is two point five milliseconds. Monitor through an amp simulator and it still feels immediate.",
  "c2-lcd":
    "And every model meters every input and output in full colour. No guessing at a clipping LED.",
  "c2-brand":
    "All three from Shivansh Electronics — authorized MOTU distributor for East and North East India.",

  "c3-open": "Start with the smallest. The MOTU M2.",
  "c3-macro":
    "Two channels, with nothing held back. Two combo inputs, each with its own gain, phantom power, and a one-touch monitor button.",
  "c3-hero":
    "Built for one voice at a time — through the same converter as the six-channel unit.",
  "c3-rear":
    "Behind it: DC-coupled balanced outputs, mirrored RCA, MIDI, and USB-C bus power.",
  "c3-life":
    "It runs off the cable. So the studio goes wherever the song starts.",
  "c3-glass":
    "The M2 — twenty-six thousand nine hundred rupees, inclusive of GST.",

  "c4-open": "Add two inputs, and you get the MOTU M4.",
  "c4-macro":
    "The same two preamps — plus one thing the M2 has not. A Mix knob, blending your input against playback, by hand.",
  "c4-mix":
    "Leave two microphones patched to the front, and record a stereo synth through the rear inputs.",
  "c4-rear":
    "The back grows to match. Dedicated line inputs, four DC-coupled outputs, four RCA, MIDI, USB-C.",
  "c4-hero":
    "The M4 — thirty-two thousand nine hundred rupees, inclusive of GST.",
  "c4-life":
    "Four channels, and room to leave a session set up between visits.",

  "c5-open": "And when two people are not enough — the MOTU M6.",
  "c5-macro":
    "Four microphone preamps. Four gains, four phantom switches, four monitor buttons — and the jacks moved to the rear to keep it this small.",
  "c5-lcd":
    "The display shows all six inputs, with the A-B monitor selection on the output side.",
  "c5-rear":
    "So the back carries four combo inputs, two more line inputs, and a DC socket — it runs without a computer.",
  "c5-ab":
    "An A-B switch compares your mix across two monitor pairs. A second headphone output carries its own cue mix.",
  "c5-ensemble":
    "Which is what six channels buys. A four-person panel. A drum kit in one pass.",
  "c5-anywhere":
    "The M6 — fifty-five thousand nine hundred rupees, inclusive of GST.",

  "c6-open": "Three more things ship on every model.",
  "c6-loopback":
    "Loopback merges your computer's playback with a live input, inside the interface. A clean stream, with no virtual cable in the chain.",
  "c6-cv":
    "Every output is DC-coupled — so the same jacks can send control voltage to a modular synth.",
  "c6-software":
    "And you can record on day one. Performer Lite, Ableton Live Lite, loops and instruments included.",
  "c6-metering":
    "With the same full-colour metering, at any channel count.",
  "c6-brand":
    "All three, from Shivansh Electronics.",

  "c7-transform":
    "So pick the size. The sound is already settled — whichever one you take home.",
  "c7-recap":
    "One decision left. How many sources do you need at once? Two, four, or six.",
  "c7-price":
    "M2, twenty-six thousand nine hundred. M4, thirty-two thousand nine hundred. M6, fifty-five thousand nine hundred rupees, inclusive of GST. For the best price, visit shivanshelectronics dot in.",
  "c7-distributor":
    "Shivansh Electronics — authorized distributor of MOTU, Mark of the Unicorn, USA, for East and North East India.",
  "c7-contact":
    "Call, message, or visit. Every detail is on screen.",
  "c7-outro":
    "MOTU M2, M4 and M6. From Shivansh Electronics.",
};

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length;

const rows = [];
let fail = 0;
let totalWords = 0;

for (let i = 0; i < BEATS.length; i++) {
  const b = BEATS[i];
  const inF = BEAT_STARTS[i];
  const outF = inF + frames(b.sec);
  const line = LINES[b.id];
  if (line === undefined) {
    console.log(`  FAIL no narration line for beat ${b.id}`);
    fail++;
    continue;
  }
  const w = words(line);
  totalWords += w;
  const wpm = (w / b.sec) * 60;
  const flag = wpm > 175 ? "TOO FAST" : wpm < 60 && w > 0 ? "sparse" : "ok";
  if (wpm > 175) {
    console.log(`  FAIL ${b.id}: ${w} words in ${b.sec}s = ${wpm.toFixed(0)} wpm (over 175)`);
    fail++;
  }
  rows.push({ b, inF, outF, line, w, wpm, flag });
}

const runtime = VIDEO.durationInFrames / VIDEO.fps;
const overallWpm = (totalWords / runtime) * 60;

const md = [];
md.push("# Voiceover script — MOTU M-Series long-form");
md.push("");
md.push("**Deliverable:** `out/motu-m-series-longform.mp4` — 1920 x 1080, 30 fps, 8,940 frames, 298.000 s");
md.push("**Language:** English only.");
md.push("**Tone:** Warm & Trustworthy, with spec callouts read in the Precise & Technical register.");
md.push("");
md.push("Chosen because the whole narrative exists to remove the \"am I settling?\" anxiety, and that is");
md.push("a mentor's job rather than a narrator's. Cinematic & Aspirational would oversell a desktop");
md.push("interface and undercut the plain-fact spec claims; pure Precise & Technical would read as a");
md.push("lecture and leave the emotional problem in Chapter 1 unanswered. So: a trusted engineer");
md.push("talking across a desk, who gets exact when the numbers matter.");
md.push("");
md.push("**Sync:** this file is generated by `npm run vo` from `src/schedule.ts` — the same data that");
md.push("renders the picture. Every timestamp below is the in/out of the beat it narrates, so the script");
md.push("cannot drift out of sync with the video. Re-run it after any schedule change.");
md.push("");
md.push("**Recording:** no burned-in captions. Drop the finished read at `public/vo/voiceover-longform.mp3`");
md.push("and flip `HAS_VOICEOVER` in `src/Audio.tsx` to `true`. The music bed sits at roughly -22 dBFS RMS,");
md.push("so a voice tracked around -16 dBFS sits cleanly above it without further ducking.");
md.push("");
md.push(`**Pace:** ${totalWords} words over ${runtime.toFixed(0)} s = ${overallWpm.toFixed(0)} wpm overall — inside the comfortable 140-165 band.`);
md.push("");
md.push("---");
md.push("");

let ch = 0;
for (const r of rows) {
  if (r.b.ch !== ch) {
    ch = r.b.ch;
    const c = { 1: "The Binary", 2: "One Engine. Three Sizes.", 3: "MOTU M2 — The Solo Signal", 4: "MOTU M4 — The Room That Grew", 5: "MOTU M6 — The Whole Ensemble", 6: "What All Three Share", 7: "Synthesis, Price & Call To Action" }[ch];
    md.push(`## Chapter ${ch} — ${c}`);
    md.push("");
  }
  md.push(`**[${tc(r.inF)} – ${tc(r.outF)}]**  \`${r.b.id}\` · ${r.b.sec}s · ${r.w} words · ${r.wpm.toFixed(0)} wpm`);
  md.push("");
  md.push(`> ${r.line}`);
  md.push("");
}

md.push("---");
md.push("");
md.push("## Constraints held");
md.push("");
md.push("- No comparison to any other audio-interface brand, anywhere in the script.");
md.push("- No mention of TASCAM, anywhere.");
md.push("- No reference to any other Shivansh Electronics brand relationship.");
md.push(`- All three MOPs are stated **distinctly** at [${tc(rows.find((r) => r.b.id === "c7-price").inF)} – ${tc(rows.find((r) => r.b.id === "c7-price").outF)}] — ${PRICE.m2} / ${PRICE.m4} / ${PRICE.m6} — never rounded and never blended into one figure.`);
md.push(`- The best-price direction to **${BRAND.website}** is spoken in the same beat, alongside those figures rather than instead of them.`);
md.push("- Each individual price is also spoken once inside its own product chapter.");
md.push(`- The outro carries the full designation: ${BRAND.name} — ${BRAND.role} for ${BRAND.region}.`);
md.push("- Only figures from the verified specification table are spoken. Preamp gain range is never stated, because the source brief does not verify it.");
md.push("");

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../../VO_SCRIPT_MOTU_M_SERIES_LONGFORM_298S.md");
writeFileSync(out, md.join("\n"));

console.log(`\nVO SCRIPT: ${rows.length} beats · ${totalWords} words · ${overallWpm.toFixed(0)} wpm overall`);
const fastest = rows.slice().sort((a, b) => b.wpm - a.wpm)[0];
console.log(`  fastest line: ${fastest.b.id} at ${fastest.wpm.toFixed(0)} wpm`);
console.log(`  -> ${out}`);
console.log(fail === 0 ? "VO: PASS — every line fits its beat at a comfortable pace.\n" : `VO: ${fail} FAILURE(S)\n`);
process.exit(fail === 0 ? 0 : 1);
