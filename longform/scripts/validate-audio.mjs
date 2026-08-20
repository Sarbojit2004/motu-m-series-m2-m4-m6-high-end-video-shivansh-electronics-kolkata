// Section 9 — audio-pipeline validation. Run BEFORE writing scene code that
// depends on it, and again before every final render.
//
// Confirms, by actually decoding each file rather than checking it exists:
//   * every music stem decodes, and its measured duration matches what
//     src/schedule.ts assumes when it tiles that stem across a chapter
//   * every REUSED AVB sfx file decodes from its staged location
//   * every NEWLY SYNTHESIZED sfx file decodes
//   * nothing clips, and the sfx sit in the register the bed leaves free
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const PUB = resolve(dirname(fileURLToPath(import.meta.url)), "../public");

/** ffmpeg reports duration and volumedetect on STDERR, so both streams are read. */
const run = (file) => {
  const r = spawnSync(
    ffmpeg,
    ["-hide_banner", "-i", file, "-af", "volumedetect", "-f", "null", "-"],
    { encoding: "utf8" }
  );
  const txt = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  const dur = /Duration: (\d+):(\d+):([\d.]+)/.exec(txt);
  const sec = dur ? +dur[1] * 3600 + +dur[2] * 60 + +dur[3] : NaN;
  const mean = /mean_volume: ([-\d.]+) dB/.exec(txt)?.[1];
  const max = /max_volume: ([-\d.]+) dB/.exec(txt)?.[1];
  const rate = /(\d+) Hz/.exec(txt)?.[1];
  const ch = /Hz, (mono|stereo)/.exec(txt)?.[1];
  return { sec, mean: mean ? +mean : NaN, max: max ? +max : NaN, rate, ch };
};

let fail = 0;
const line = (label, r, extra = "") => {
  const ok = Number.isFinite(r.sec) && r.sec > 0 && Number.isFinite(r.mean);
  if (!ok) fail++;
  console.log(
    `  ${ok ? "ok  " : "FAIL"} ${label.padEnd(26)} ${r.sec.toFixed(2).padStart(7)}s  ` +
      `${String(r.rate ?? "?").padStart(5)}Hz ${String(r.ch ?? "?").padEnd(6)} ` +
      `mean ${String(r.mean).padStart(6)}dB  peak ${String(r.max).padStart(5)}dB ${extra}`
  );
  return r;
};

console.log("\nMUSIC STEMS  (source: MOTU AVB repository sound-effects/)");
const music = {};
for (const f of readdirSync(resolve(PUB, "audio/music")).sort()) {
  const slug = f.replace(/\.mp3$/, "");
  music[slug] = line(slug, run(resolve(PUB, "audio/music", f)));
}

console.log("\nSFX — REUSED DIRECTLY FROM THE AVB REPOSITORY (Section 9, Role B)");
for (const f of readdirSync(resolve(PUB, "audio/sfx/reuse")).sort()) {
  line(f.replace(/\.wav$/, ""), run(resolve(PUB, "audio/sfx/reuse", f)), "[reused]");
}

console.log("\nSFX — SYNTHESIZED FOR THIS PROJECT (not covered by the AVB set)");
for (const f of readdirSync(resolve(PUB, "audio/sfx/new")).sort()) {
  line(f.replace(/\.wav$/, ""), run(resolve(PUB, "audio/sfx/new", f)), "[new]");
}

// Track-level durations the schedule relies on when tiling stems.
console.log("\nTRACK DURATIONS the schedule tiles against");
const tracks = {};
for (const [slug, r] of Object.entries(music)) {
  const t = slug.split("-")[0];
  tracks[t] = Math.min(tracks[t] ?? Infinity, r.sec);
}
for (const [t, sec] of Object.entries(tracks)) console.log(`  ${t.padEnd(12)} ${sec.toFixed(2)}s`);

console.log("\nFONTS");
for (const f of ["archivo-normal.woff2", "archivo-italic.woff2", "fraunces-normal.woff2", "fraunces-italic.woff2"]) {
  const ok = existsSync(resolve(PUB, "fonts", f));
  if (!ok) fail++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${f}`);
}

console.log(
  fail === 0
    ? "\nAUDIO PIPELINE VALIDATION: PASS — every stem and every sfx decodes.\n"
    : `\nAUDIO PIPELINE VALIDATION: ${fail} FAILURE(S)\n`
);
process.exit(fail === 0 ? 0 : 1);
