/**
 * Assembles the 25 independently-rendered Flick scenes into the single
 * continuous master, then mixes the music bed underneath.
 *
 * This step exists because Flick, by design, builds one composition per scene
 * and explicitly no all-scenes composition. The picture and its foley layer come
 * out of Flick; the concatenation and the bed are this project's own step.
 *
 *   usage: node scripts/assemble-master.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
mkdirSync(out, { recursive: true });

const spec = JSON.parse(readFileSync(join(root, "flick-output", "scene-spec.json"), "utf8"));
const FPS = 30;
const EXPECT = spec.reduce((a, s) => a + s.durationInFrames, 0);

const run = (args, label) => {
  const r = spawnSync(ffmpeg, args, { encoding: "utf8", maxBuffer: 1 << 28 });
  const txt = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  if (r.status !== 0) {
    console.error(txt.split("\n").slice(-20).join("\n"));
    throw new Error(`${label} failed (exit ${r.status})`);
  }
  return txt;
};

/**
 * Exact frame count. This ffmpeg build emits no `frame=` counter under
 * `-c copy -f null`, and the container `time=` field omits the last frame's
 * duration, so neither can be trusted for an exact-length assertion.
 * `framecrc` emits one line per frame and needs no decoding when copying.
 */
const probeFrames = (file) => {
  const r = spawnSync(ffmpeg,
    ["-hide_banner", "-loglevel", "error", "-i", file, "-map", "0:v:0", "-c", "copy", "-f", "framecrc", "-"],
    { encoding: "utf8", maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`probe failed for ${file}: ${(r.stderr ?? "").slice(-300)}`);
  return (r.stdout ?? "").split("\n").filter((l) => l.startsWith("0,")).length;
};

// 1 — verify every scene rendered, and rendered at exactly its spec length.
console.log("Scene inventory");
let total = 0;
const list = [];
for (const s of spec) {
  const f = join(root, "flick-output", "scenes", s.id, `${s.id}.mp4`);
  if (!existsSync(f)) throw new Error(`missing render: ${s.id}`);
  const n = probeFrames(f);
  const ok = n === s.durationInFrames;
  console.log(`  ${ok ? "ok  " : "BAD "} ${s.id.padEnd(26)} ${String(n).padStart(4)}f (spec ${s.durationInFrames})`);
  if (!ok) throw new Error(`${s.id} rendered ${n}f, spec says ${s.durationInFrames}f`);
  total += n;
  list.push(f);
}
if (total !== EXPECT) throw new Error(`scene frames sum to ${total}, expected ${EXPECT}`);
console.log(`  = ${total} frames / ${(total / FPS).toFixed(3)}s\n`);

// 2 — strip audio from each scene FIRST, then concatenate the picture.
//
// Two problems solved here, both caught by the frame assertions below.
//
// (a) Re-encoding through the concat demuxer resamples timestamps at every
//     join and fills the sliver at each seam with a duplicate frame. Across 25
//     joins that produced a 5,378-frame picture from 5,340 frames of source.
//     So the picture is STREAM COPIED, never re-encoded.
//
// (b) A stream copy alone was not enough. Remotion's AAC track runs 40-60 ms
//     past the video in every scene, and an mp4's container duration is the max
//     of its tracks — which is what the concat demuxer uses to offset each
//     segment. The frame count stayed correct but the timeline drifted to
//     179.27 s, and the mux then truncated it to 5,299 frames. Stripping audio
//     from each scene first makes every segment exactly nframes/30, so the
//     offsets are exact.
//
// Discarding the scenes' audio costs nothing: both audio layers come from their
// own full-runtime WAVs, which is also what makes the standalone SFX deliverable
// literally the same samples as the SFX in the master.
const vdir = join(out, "_video-only");
mkdirSync(vdir, { recursive: true });
console.log("Stripping audio from each scene ...");
const vlist = [];
for (const s of spec) {
  const src = join(root, "flick-output", "scenes", s.id, `${s.id}.mp4`);
  const dst = join(vdir, `${s.id}.mp4`);
  run(["-y", "-hide_banner", "-loglevel", "error", "-i", src, "-an", "-c:v", "copy", dst], `strip ${s.id}`);
  const n = probeFrames(dst);
  if (n !== s.durationInFrames) throw new Error(`${s.id}: ${n}f after strip, expected ${s.durationInFrames}f`);
  vlist.push(dst);
}
console.log(`  ${vlist.length} video-only segments, each exactly nframes/30`);

const listFile = join(out, "concat-list.txt");
writeFileSync(listFile, vlist.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n"));
const picture = join(out, "_picture.mp4");
console.log("Concatenating (stream copy) ...");
run([
  "-y", "-hide_banner", "-loglevel", "error",
  "-f", "concat", "-safe", "0", "-i", listFile,
  "-an", "-c:v", "copy",
  picture,
], "concat");

const pictureFrames = probeFrames(picture);
const pictureSecs = pictureFrames / FPS;
console.log(`  ${pictureFrames} frames / ${pictureSecs.toFixed(3)}s`);
if (pictureFrames !== EXPECT) throw new Error(`concatenated picture is ${pictureFrames}f, expected ${EXPECT}f`);

// 3 — mix the two audio layers and mux them onto the picture.
const bed = join(out, "motu-m-series-portrait-flick-trial-music-bed.wav");
const sfx = join(out, "motu-m-series-portrait-flick-trial-transition-sfx-timeline.wav");
for (const [label, f] of [["music bed", bed], ["sfx timeline", sfx]]) {
  if (!existsSync(f)) throw new Error(`${label} not rendered yet: ${f}`);
}
const master = join(out, "motu-m-series-portrait-flick-trial.mp4");
// A true-peak ceiling on the MASTER ONLY. Summed, the two layers touched
// -2.5 dBFS at 100-120 s, where the fullest music movement coincides with a
// transition hit and a ping — over the -3.0 dBFS broadcast-safe ceiling this
// project checks against. About 0.5 dB of gain reduction, which is inaudible.
//
// Deliberately NOT applied to the two standalone WAVs. Those are handed over so
// the client can build their own mix around a voiceover; pre-limiting them would
// take that decision away and bake in a choice made for this particular sum.
console.log("Mixing the music bed and the foley layer onto the picture ...");
run([
  "-y", "-hide_banner", "-loglevel", "error",
  "-i", picture, "-i", sfx, "-i", bed,
  "-filter_complex",
  "[1:a][2:a]amix=inputs=2:duration=longest:dropout_transition=0:normalize=0,"
  + "alimiter=limit=0.66:level=disabled:attack=5:release=60[a]",
  "-map", "0:v:0", "-map", "[a]",
  "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
  master,
], "mix");

const finalFrames = probeFrames(master);
console.log(`\nMaster: ${master}`);
console.log(`  ${finalFrames} frames / ${(finalFrames / FPS).toFixed(3)}s`);
if (finalFrames !== EXPECT) throw new Error(`master is ${finalFrames}f, expected exactly ${EXPECT}f`);
console.log(`  exact: ${EXPECT} frames / 178.000s`);
