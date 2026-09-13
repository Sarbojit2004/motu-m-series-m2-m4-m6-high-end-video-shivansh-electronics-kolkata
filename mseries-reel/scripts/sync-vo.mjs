#!/usr/bin/env node
// Measures the client's recorded narration against the scripted timeline and
// reports the drift, per segment.
//
// Narration governs this reel's timing rather than the other way round. Until
// the take exists, the edit is anchored to the script's derived timestamps at
// 165 wpm. Once the take exists, THIS is the tool that tells you where the real
// read differs from that, so the edit can be nudged to the voice instead of the
// voice being asked to hit the edit.
//
// Run:  node --experimental-strip-types scripts/sync-vo.mjs
//       node --experimental-strip-types scripts/sync-vo.mjs --json
//
// It does NOT edit anything. It prints what it found and what to change.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { buildTimeline, WPM } from "../src/script.ts";

const VO = "public/audio/vo.wav";

/** Resolve an ffmpeg binary: $FFMPEG, then PATH, then the pip-installed one. */
const resolveFfmpeg = () => {
  const tries = [process.env.FFMPEG, "ffmpeg"].filter(Boolean);
  for (const t of tries) {
    try {
      execFileSync(t, ["-version"], { stdio: "ignore" });
      return t;
    } catch {}
  }
  try {
    return execFileSync("python3", ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"], {
      encoding: "utf8",
    }).trim();
  } catch {}
  console.error("No ffmpeg found. Set FFMPEG=/path/to/ffmpeg or put it on PATH.");
  process.exit(1);
};
const FFMPEG = resolveFfmpeg();
const asJson = process.argv.includes("--json");

if (!existsSync(VO)) {
  console.error(`No recording at ${VO}. Drop the take there and run this again.`);
  process.exit(1);
}

// ── Measure the file ─────────────────────────────────────────────────────────
const probe = () => {
  let s = "";
  try {
    execFileSync(FFMPEG, ["-hide_banner", "-i", VO], { stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    s = (e.stderr || "").toString();
  }
  const m = s.match(/Duration: (\d+):(\d+):([\d.]+)/);
  if (!m) throw new Error("could not read the recording's duration");
  return +m[1] * 3600 + +m[2] * 60 + parseFloat(m[3]);
};

/**
 * Finds where speech actually starts and stops, by RMS.
 *
 * A take almost always has a second of room tone at each end. Comparing raw
 * file length against the script would charge that silence to the read, so the
 * active span is measured instead.
 */
const activeSpan = () => {
  const raw = execFileSync(
    FFMPEG,
    ["-v", "error", "-i", VO, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
    { maxBuffer: 1 << 28 },
  );
  const pcm = new Int16Array(raw.buffer, raw.byteOffset, raw.length / 2);
  const win = 800; // 0.1 s
  const levels = [];
  for (let i = 0; i + win < pcm.length; i += win) {
    let sum = 0;
    for (let k = 0; k < win; k++) sum += pcm[i + k] * pcm[i + k];
    levels.push(Math.sqrt(sum / win));
  }
  const peak = Math.max(...levels);
  const gate = peak * 0.04; // -28 dB relative to the loudest window
  let a = levels.findIndex((l) => l > gate);
  let b = levels.length - 1 - [...levels].reverse().findIndex((l) => l > gate);
  if (a < 0) return { start: 0, end: pcm.length / 8000, silent: true };
  return { start: (a * win) / 8000, end: (b * win) / 8000, silent: false };
};

const total = probe();
const span = activeSpan();
const spoken = span.end - span.start;

const { segments, total: scripted } = buildTimeline();
const words = segments.reduce((a, s) => a + s.words, 0);

// The scripted timeline runs from the first word to the last, so the take's
// active span is what it should be compared against.
const scriptedSpan = segments[segments.length - 1].end - segments[0].start;
const ratio = spoken / scriptedSpan;

const rows = segments.map((s) => {
  const scriptedDur = s.end - s.start;
  // Where this segment would land if the read is uniformly faster or slower.
  const actualStart = span.start + (s.start - segments[0].start) * ratio;
  return {
    id: s.id,
    words: s.words,
    scriptedStart: s.start,
    scriptedDur,
    projectedStart: actualStart,
    projectedDur: scriptedDur * ratio,
    driftStart: actualStart - s.start,
    wpm: s.words / (scriptedDur / 60),
    actualWpm: s.words / ((scriptedDur * ratio) / 60),
  };
});

if (asJson) {
  console.log(JSON.stringify({ total, span, spoken, scripted, scriptedSpan, ratio, words, rows }, null, 2));
  process.exit(0);
}

const f = (n, d = 2) => n.toFixed(d).padStart(7);

console.log(`\nRECORDING   ${VO}`);
console.log(`  file length      ${f(total)} s`);
console.log(`  speech starts at ${f(span.start)} s`);
console.log(`  speech ends at   ${f(span.end)} s`);
console.log(`  spoken span      ${f(spoken)} s${span.silent ? "   (SILENT — this is still the placeholder)" : ""}`);
console.log(`\nSCRIPT      ${words} words, written at ${WPM} wpm`);
console.log(`  scripted span    ${f(scriptedSpan)} s`);
console.log(`  measured rate    ${f(words / (spoken / 60), 1)} wpm`);
console.log(`  ratio            ${f(ratio, 4)}  (${ratio > 1 ? "read is SLOWER" : "read is FASTER"} than scripted)`);

if (span.silent) {
  console.log(`\nNothing to sync yet — that file is the silent placeholder.\n`);
  process.exit(0);
}

console.log(`\nPER SEGMENT`);
console.log(`  segment    words   scripted        projected      drift    rate`);
for (const r of rows) {
  const sign = r.driftStart >= 0 ? "+" : "";
  console.log(
    `  ${r.id.padEnd(9)} ${String(r.words).padStart(5)}   ` +
      `${f(r.scriptedStart)}s ${f(r.scriptedDur)}s  ` +
      `${f(r.projectedStart)}s ${f(r.projectedDur)}s  ` +
      `${sign}${r.driftStart.toFixed(2).padStart(6)}s  ${r.actualWpm.toFixed(0).padStart(4)} wpm`,
  );
}

const drift = Math.abs(spoken - scriptedSpan);
console.log(`\nTOTAL DRIFT  ${drift.toFixed(2)} s over ${scriptedSpan.toFixed(1)} s`);

if (drift < 1.5) {
  console.log(`\nInside 1.5 s. Nothing needs changing — drop the take in and render.\n`);
} else if (ratio > 1) {
  console.log(
    `\nThe read is ${drift.toFixed(1)} s longer than the edit.\n` +
      `  Either: trim ${Math.round((drift / 60) * (words / (spoken / 60)))} words from the script and re-record, or\n` +
      `  raise VIDEO.durationInFrames in src/theme.ts to ${Math.ceil((span.end + 1) * 30)} and\n` +
      `  set a matching runtime in scripts/gen_audio.py (TOTAL_FRAMES), then re-run the audio.\n`,
  );
} else {
  console.log(
    `\nThe read is ${drift.toFixed(1)} s shorter than the edit.\n` +
      `  The reel will hold on its closing plate for the difference, which is fine\n` +
      `  down to about 5 s. Beyond that, lower VIDEO.durationInFrames in src/theme.ts\n` +
      `  to ${Math.ceil((span.end + 1) * 30)} and re-run the audio so the beds match.\n`,
  );
}
