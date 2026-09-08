#!/usr/bin/env node
/**
 * Probe the delivered render against the brief's hard requirements.
 *
 *   node scripts/verify.mjs [file.mp4]
 */
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FFPROBE = process.env.FFPROBE_BIN ?? "ffprobe";
const file = process.argv[2] ?? join(PROJ, "out", "motu-mseries-montage-4k.mp4");

if (!existsSync(file)) {
  console.error(`not found: ${file}\nrun: npm run render`);
  process.exit(1);
}

const probe = JSON.parse(
  execFileSync(FFPROBE, [
    "-v", "error", "-print_format", "json",
    "-show_format", "-show_streams", file,
  ]).toString()
);
const v = probe.streams.find((s) => s.codec_type === "video");
const a = probe.streams.find((s) => s.codec_type === "audio");
const dur = Number(probe.format.duration);
const fps = v ? eval(v.r_frame_rate) : 0;   // "30/1"

const checks = [
  ["video stream present", Boolean(v), v?.codec_name],
  ["width 2160", v?.width === 2160, v?.width],
  ["height 3840", v?.height === 3840, v?.height],
  ["9:16 portrait", v && v.width / v.height === 9 / 16, v && (v.width / v.height).toFixed(4)],
  ["30 fps", Math.abs(fps - 30) < 0.01, fps],
  ["duration 90s (+/-0.1)", Math.abs(dur - 90) <= 0.1, `${dur.toFixed(3)}s`],
  ["frame count 2700", Number(v?.nb_frames) === 2700, v?.nb_frames],
  ["audio stream present", Boolean(a), a?.codec_name],
  ["audio is stereo", a?.channels === 2, a?.channels],
  ["audio covers the reel", a && Math.abs(Number(a.duration) - 90) <= 0.2, a && `${Number(a.duration).toFixed(3)}s`],
  ["h264 / yuv420p", v?.codec_name === "h264" && v?.pix_fmt === "yuv420p", `${v?.codec_name} ${v?.pix_fmt}`],
];

console.log(`${file}\n${(statSync(file).size / 1048576).toFixed(1)} MB\n`);
let bad = 0;
for (const [label, ok, got] of checks) {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label.padEnd(24)} ${got ?? ""}`);
  if (!ok) bad++;
}
console.log(bad ? `\n${bad} check(s) failed` : "\nall checks passed");
process.exit(bad ? 1 : 0);
