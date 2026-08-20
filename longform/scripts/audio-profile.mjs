// Section 9 — the audio-only validation pass, run before every final render.
//
// Measures the rendered deliverables window by window and fails if the bed is
// ever silent, ever clips, or ever gets loud enough to bury narration.
//
//   usage: node scripts/audio-profile.mjs <file.wav> [windowSeconds]
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import ffmpeg from "ffmpeg-static";

const file = process.argv[2];
const win = Number(process.argv[3] ?? 10);
if (!file || !existsSync(file)) {
  console.error(`usage: node scripts/audio-profile.mjs <file.wav> [windowSeconds]`);
  process.exit(2);
}

const info = spawnSync(ffmpeg, ["-hide_banner", "-i", file], { encoding: "utf8" });
const txt = `${info.stdout ?? ""}${info.stderr ?? ""}`;
const d = /Duration: (\d+):(\d+):([\d.]+)/.exec(txt);
const dur = d ? +d[1] * 3600 + +d[2] * 60 + +d[3] : 0;
const fmt = /Audio: ([^\n]+)/.exec(txt)?.[1] ?? "?";

// A music bed has to leave room for a voice; a sfx-only timeline is sparse by
// nature, so it is checked only for "not silent" and "not clipping".
const isSfx = /sfx/i.test(file);
const LIMITS = { peakMax: -3.0, rmsMax: -17.0, rmsMin: isSfx ? -60 : -32 };

console.log(`\n${file}`);
console.log(`  ${dur.toFixed(2)}s · ${fmt}`);
console.log(`\n   window        mean dB    peak dB`);

let fail = 0;
let loudest = -99;
let quietest = 0;
let peak = -99;

for (let t = 0; t < Math.floor(dur); t += win) {
  const r = spawnSync(
    ffmpeg,
    ["-hide_banner", "-ss", String(t), "-t", String(win), "-i", file, "-af", "volumedetect", "-f", "null", "-"],
    { encoding: "utf8" }
  );
  const o = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  const mean = parseFloat(/mean_volume: ([-\d.]+)/.exec(o)?.[1] ?? "NaN");
  const mx = parseFloat(/max_volume: ([-\d.]+)/.exec(o)?.[1] ?? "NaN");
  const flags = [];
  if (!Number.isFinite(mean) || mean < LIMITS.rmsMin) flags.push("SILENT");
  if (mx > LIMITS.peakMax) flags.push("TOO HOT");
  if (!isSfx && mean > LIMITS.rmsMax) flags.push("BURIES VO");
  if (flags.length) fail++;
  loudest = Math.max(loudest, mean);
  quietest = Math.min(quietest, Number.isFinite(mean) ? mean : 0);
  peak = Math.max(peak, mx);
  console.log(
    `  ${String(t).padStart(4)}-${String(Math.min(t + win, Math.floor(dur))).padStart(4)}s  ` +
      `${mean.toFixed(1).padStart(8)}  ${mx.toFixed(1).padStart(9)}   ${flags.join(" ")}`
  );
}

console.log(`\n  loudest window ${loudest.toFixed(1)} dB · quietest ${quietest.toFixed(1)} dB · true peak ${peak.toFixed(1)} dB`);
console.log(`  build range: ${(loudest - quietest).toFixed(1)} dB`);
console.log(
  fail === 0
    ? `\nAUDIO PROFILE: PASS — continuous, no clipping, headroom for narration.\n`
    : `\nAUDIO PROFILE: ${fail} window(s) out of range.\n`
);
process.exit(fail === 0 ? 0 : 1);
