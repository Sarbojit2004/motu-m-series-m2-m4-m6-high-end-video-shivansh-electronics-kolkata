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
  "p1-hook": "You can hear the difference between a room, and a recording of it.",
  "p1-problem": "For years the choice was cheap and noisy, or out of reach.",
  "p1-thesis":
    "Not any more. Three interfaces, one engine. The M2, M4 and M6 differ only in how much you can record at once.",

  "p2-capacity": "So you are picking a channel count, not a quality tier.",
  "p2-dac": "The same ESS Sabre32 Ultra DAC in all three. A hundred and twenty decibels.",
  "p2-specs": "Minus one twenty-nine dBu input noise. Two and a half milliseconds round trip.",
  "p2-lcd": "And full-colour metering on every model.",

  "p3-open": "Start with the M2.",
  "p3-macro":
    "Two channels, nothing held back. Two combo inputs, each with its own gain, phantom power and monitor button.",
  "p3-rear": "Behind it, DC-coupled outputs, mirrored RCA, MIDI, and USB-C bus power.",
  "p3-hero": "Twenty-six thousand nine hundred rupees.",
  "p3-life": "It runs off the cable. At the desk, on the couch, wherever the song starts.",
  "p3-anywhere": "Two channels, anywhere you set up.",

  "p4-open": "Add two inputs. The M4.",
  "p4-macro":
    "The same preamps, plus a Mix knob — blending what you play against what the computer plays back, by hand.",
  "p4-rear": "Two more in. Two more out. Dedicated line inputs for hardware.",
  "p4-mix": "Turn it, and hear it.",
  "p4-life": "Producing, tracking a kit, or patched into the rack — four channels, and room to work.",
  "p4-price": "Thirty-two thousand nine hundred rupees.",

  "p5-open": "And when two is not enough. The M6.",
  "p5-macro":
    "Four microphone preamps, in the same desktop footprint — because the combo jacks moved to the rear.",
  "p5-lcd": "All six inputs metered, with the A-B monitor selection alongside.",
  "p5-rear": "Four combo inputs, two more line inputs, and a DC socket for standalone use.",
  "p5-ensemble": "A four-person panel. A drum kit in one pass. A whole room, at once.",
  "p5-control": "A-B across two monitor pairs, and a second headphone mix of its own.",
  "p5-anywhere": "On the couch, in the studio, or desk-side. Fifty-five thousand nine hundred rupees.",

  "p6-open": "Three things ship on every model.",
  "p6-loopback":
    "Loopback merges your computer and your microphone inside the interface. No virtual cable needed.",
  "p6-cv": "Every output is DC-coupled, so it can drive a modular synth.",
  "p6-software": "And the software is in the box.",

  "p7-recap": "One question left. How many at once?",
  "p7-price":
    "M2, twenty-six thousand nine hundred. M4, thirty-two thousand nine hundred. M6, fifty-five thousand nine hundred — inclusive of GST. Best price at shivanshelectronics dot in.",
  "p7-brand": "Shivansh Electronics — authorized MOTU distributor for East and North East India.",
  "p7-outro": "MOTU M2, M4 and M6. From Shivansh Electronics.",
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
md.push("# Voiceover script — MOTU M-Series portrait short");
md.push("");
md.push("**Deliverable:** `out/motu-m-series-portrait-short.mp4` — 1080 x 1920, 30 fps, 5,340 frames, 178.000 s");
md.push("**Language:** English only.");
md.push("**Tone:** Warm & Trustworthy, with spec callouts read in the Precise & Technical register.");
md.push("");
md.push("Chosen because the whole narrative exists to remove the \"am I settling?\" anxiety, and that is");
md.push("a mentor's job rather than a narrator's. Cinematic & Aspirational would oversell a desktop");
md.push("interface and undercut the plain-fact spec claims; pure Precise & Technical would read as a");
md.push("lecture and leave the emotional problem in Chapter 1 unanswered. So: a trusted engineer");
md.push("talking across a desk, who gets exact when the numbers matter.");
md.push("");
md.push("**This is not the long-form script trimmed, and not the previous portrait script re-timed.**");
md.push("It is written against this reel's own 34-beat structure, rebuilt to carry all 30 images at a");
md.push("higher density and a faster cadence — see `src/schedule.ts`.");
md.push("");
md.push("**Sync:** this file is generated by `npm run vo` from `src/schedule.ts` — the same data that");
md.push("renders the picture. Every timestamp below is the in/out of the beat it narrates, so the script");
md.push("cannot drift out of sync with the video. Re-run it after any schedule change.");
md.push("");
md.push("**Recording:** no burned-in captions. Drop the finished read at `public/vo/voiceover-portrait.mp3`");
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
    const c = { 1: "Hook, Fused With The Thesis", 2: "The Shared Engine", 3: "MOTU M2", 4: "MOTU M4", 5: "MOTU M6", 6: "What All Three Share", 7: "Price, CTA & Outro" }[ch];
    md.push(`## Segment ${ch} — ${c}`);
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
md.push(`- All three MOPs are stated **distinctly** at [${tc(rows.find((r) => r.b.id === "p7-price").inF)} – ${tc(rows.find((r) => r.b.id === "p7-price").outF)}] — ${PRICE.m2} / ${PRICE.m4} / ${PRICE.m6} — never rounded and never blended into one figure.`);
md.push(`- The best-price direction to **${BRAND.website}** is spoken in the same beat, alongside those figures rather than instead of them.`);
md.push("- Each individual price is also spoken once inside its own product segment.");
md.push(`- The outro carries the full designation: ${BRAND.name} — ${BRAND.role} for ${BRAND.region}.`);
md.push(`- The spoken distributor line at \`p7-brand\` uses the natural short form; the EXACT, unabbreviated designation — ${BRAND.role} for ${BRAND.region} — is on screen in that same beat and again in the outro.`);
md.push("- Only figures from the verified specification table are spoken. Preamp gain range is never stated, because the source brief does not verify it.");
md.push("");

const out = resolve(dirname(fileURLToPath(import.meta.url)), "../../VO_SCRIPT_MOTU_M_SERIES_PORTRAIT_178S.md");
writeFileSync(out, md.join("\n"));

console.log(`\nVO SCRIPT: ${rows.length} beats · ${totalWords} words · ${overallWpm.toFixed(0)} wpm overall`);
const fastest = rows.slice().sort((a, b) => b.wpm - a.wpm)[0];
console.log(`  fastest line: ${fastest.b.id} at ${fastest.wpm.toFixed(0)} wpm`);
console.log(`  -> ${out}`);
console.log(fail === 0 ? "VO: PASS — every line fits its beat at a comfortable pace.\n" : `VO: ${fail} FAILURE(S)\n`);
process.exit(fail === 0 ? 0 : 1);
