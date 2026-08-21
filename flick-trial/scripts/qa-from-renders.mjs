/**
 * Pulls a frame back OUT of each rendered scene and builds a contact sheet.
 *
 * The pre-render QA pass worked on `remotion still` output. This one works on
 * the actual MP4s, so it catches anything that only appears after encoding —
 * and confirms the fixes made between stills and render actually landed.
 *
 *   usage: node scripts/qa-from-renders.mjs [fraction]   (default 0.88)
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const spec = JSON.parse(readFileSync(join(root, "flick-output", "scene-spec.json"), "utf8"));
const frac = Number(process.argv[2] ?? 0.88);
const qa = join(root, "flick-output", "qa", "renders");
mkdirSync(qa, { recursive: true });

let n = 0;
for (const [i, s] of spec.entries()) {
  const src = join(root, "flick-output", "scenes", s.id, `${s.id}.mp4`);
  if (!existsSync(src)) { console.log(`skip ${s.id} (not rendered)`); continue; }
  const at = Math.round(s.durationInFrames * frac);
  const dst = join(qa, `${String(i + 1).padStart(2, "0")}-${s.id}.png`);
  const r = spawnSync(ffmpeg, [
    "-y", "-hide_banner", "-loglevel", "error", "-i", src,
    "-vf", `select=eq(n\\,${at})`, "-vframes", "1", dst,
  ], { encoding: "utf8" });
  if (r.status !== 0) { console.log(`FAIL ${s.id}`); continue; }
  n++;
}
console.log(`${n} frames extracted to flick-output/qa/renders/`);
