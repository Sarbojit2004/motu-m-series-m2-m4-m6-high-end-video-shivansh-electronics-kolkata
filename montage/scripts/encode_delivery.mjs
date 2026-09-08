#!/usr/bin/env node
/**
 * Turn the render into the delivery master.
 *
 * Two things need fixing after `npm run render`:
 *
 * 1. **Bitrate.** The reel carries a moving film-grain overlay over the whole
 *    paper backdrop, and grain is expensive to compress. A visually-transparent
 *    render lands around 73 Mbps / 800 MB, which is not a file anyone wants to
 *    hand over. CRF 22 is indistinguishable from it at 100% on both product
 *    detail and the flat paper gradients (checked frame by frame), at roughly a
 *    fifth of the size.
 *
 * 2. **Colour range.** Remotion rasterises frames as JPEG, so x264 tags the
 *    result `yuvj420p` - full-range. Players that assume limited-range for
 *    8-bit h264 will crush or wash the result. This converts to limited range
 *    once and tags bt709 properly.
 *
 * CRF 22 is visually transparent but lands around 174 MB, over GitHub's 100 MB
 * per-file limit, so the committed master uses a higher CRF. On product detail
 * and type the two are indistinguishable at 100%; the cost is grain fidelity in
 * flat paper, visible only under heavy contrast boost. Re-run with a lower CRF
 * for an archive master:
 *
 *   node scripts/encode_delivery.mjs                 # default, fits in git
 *   CRF=22 node scripts/encode_delivery.mjs in.mp4 archive.mp4
 */
import { execFileSync } from "node:child_process";
import { existsSync, renameSync, statSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const FFMPEG = process.env.FFMPEG_BIN ?? "ffmpeg";
const CRF = process.env.CRF ?? "24";

const src = process.argv[2] ?? join(PROJ, "out", "motu-mseries-montage-4k.mp4");
const dst = process.argv[3] ?? src;               // in place by default
const tmp = dst.replace(/\.mp4$/, ".tmp.mp4");

if (!existsSync(src)) {
  console.error(`not found: ${src}\nrun: npm run render`);
  process.exit(1);
}
const before = statSync(src).size;

console.log(`encoding delivery master from ${src} (${(before / 1048576).toFixed(0)} MB) at CRF ${CRF}`);
execFileSync(
  FFMPEG,
  [
    "-y", "-v", "error", "-stats",
    "-i", src,
    "-vf", "scale=in_range=full:out_range=tv",
    "-c:v", "libx264", "-crf", CRF, "-preset", "medium", "-tune", "film",
    "-pix_fmt", "yuv420p",
    "-color_range", "tv", "-colorspace", "bt709",
    "-color_primaries", "bt709", "-color_trc", "bt709",
    "-c:a", "aac", "-b:a", "256k",
    "-movflags", "+faststart",
    tmp,
  ],
  { stdio: "inherit" }
);

if (dst === src) unlinkSync(src);
renameSync(tmp, dst);

const after = statSync(dst).size;
console.log(
  `\n${dst}\n  ${(before / 1048576).toFixed(0)} MB -> ${(after / 1048576).toFixed(0)} MB ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller)`
);
if (after > 100 * 1024 * 1024) {
  console.warn(
    `\nWARNING: ${(after / 1048576).toFixed(0)} MB exceeds GitHub's 100 MB per-file limit.` +
      ` Re-run with a higher CRF, e.g. CRF=25.`
  );
}
