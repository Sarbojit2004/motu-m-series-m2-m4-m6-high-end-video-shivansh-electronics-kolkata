/**
 * Compressed review copies of the master.
 *
 * The delivered master is CRF 18 and 57.8 MiB, which is over the 30 MiB limit
 * on most chat and messaging surfaces. These are for review only — the master
 * is what gets published.
 *
 * Both keep all 5,340 frames and the full 178.000 s; only bitrate (and, for the
 * 720p copy, resolution) differ. The frame count is asserted, so a preview can
 * never quietly become a different cut of the video.
 *
 *   usage: node scripts/make-preview.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const dir = join(out, "preview");
mkdirSync(dir, { recursive: true });

const master = join(out, "motu-m-series-portrait-flick-trial.mp4");
if (!existsSync(master)) throw new Error(`master not built yet: ${master}`);

const EXPECT = 5340;
const probeFrames = (file) => {
  const r = spawnSync(ffmpeg,
    ["-hide_banner", "-loglevel", "error", "-i", file, "-map", "0:v:0", "-c", "copy", "-f", "framecrc", "-"],
    { encoding: "utf8", maxBuffer: 1 << 30 });
  return (r.stdout ?? "").split("\n").filter((l) => l.startsWith("0,")).length;
};

const variants = [
  { name: "motu-m-series-portrait-flick-trial-preview-1080.mp4", crf: 27, ab: "160k", scale: null },
  { name: "motu-m-series-portrait-flick-trial-preview.mp4", crf: 30, ab: "128k", scale: "720:1280" },
];

for (const v of variants) {
  const dst = join(dir, v.name);
  const args = ["-y", "-hide_banner", "-loglevel", "error", "-i", master];
  if (v.scale) args.push("-vf", `scale=${v.scale}:flags=lanczos`);
  args.push(
    "-c:v", "libx264", "-preset", "slow", "-crf", String(v.crf), "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", v.ab, "-movflags", "+faststart", dst,
  );
  const r = spawnSync(ffmpeg, args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${v.name} failed: ${(r.stderr ?? "").slice(-300)}`);
  const n = probeFrames(dst);
  if (n !== EXPECT) throw new Error(`${v.name} is ${n}f, expected ${EXPECT}f`);
  console.log(`${v.name}  ${(statSync(dst).size / 1024 / 1024).toFixed(1)} MiB  ${n} frames`);
}
