/**
 * Project zip — everything needed to reopen, re-preview and re-render this
 * build from scratch, minus what is reproducible (node_modules) or huge and
 * copied from the parent repo (raw brand images, sound files).
 *
 *   usage: node scripts/make-zip.mjs
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "..", "dist-zip");
mkdirSync(out, { recursive: true });
const zip = join(out, "motu-m-series-portrait-flick-trial-project.zip");
// `zip -r` APPENDS to an existing archive; without this a re-run keeps whatever
// a previous run put in, and tightened exclusions silently do nothing.
if (existsSync(zip)) rmSync(zip);

const r = spawnSync("zip", [
  "-r", "-q", zip, "flick-trial",
  "-x",
  // Reproducible, duplicated, or delivered as their own files.
  "flick-trial/node_modules/*",
  "flick-trial/flick-output/remotion/node_modules/*",
  "flick-trial/logs/*",
  "flick-trial/flick-output/qa/*",              // QA stills and contact sheets, 53 MB
  "flick-trial/flick-output/scenes/*",          // 25 per-scene renders, 60 MB
  "flick-trial/flick-output/brand-assets/images/*",  // staged twice; the copy the
  "flick-trial/flick-output/brand-assets/logos/*",   // build actually reads is
                                                     // remotion/public/brand-assets
  "flick-trial/out/_*",                         // assembly intermediates
  "flick-trial/out/concat-list.txt",
  "flick-trial/out/*.wav",                      // shipped as their own files
  "flick-trial/out/*.mp4",                      // ditto
], { cwd: join(root, ".."), encoding: "utf8", maxBuffer: 1 << 28 });

if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
console.log(`${zip}  ${(statSync(zip).size / 1e6).toFixed(1)} MB`);
