/**
 * Project zip — everything needed to reopen, re-preview and re-render this
 * build from scratch, minus what is reproducible (node_modules) or huge and
 * copied from the parent repo (raw brand images, sound files).
 *
 *   usage: node scripts/make-zip.mjs
 */
import { spawnSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "..", "dist-zip");
mkdirSync(out, { recursive: true });
const zip = join(out, "motu-m-series-portrait-flick-trial-project.zip");

const r = spawnSync("zip", [
  "-r", "-q", zip, "flick-trial",
  "-x",
  "flick-trial/node_modules/*",
  "flick-trial/flick-output/remotion/node_modules/*",
  "flick-trial/logs/*",
  "flick-trial/flick-output/qa/*",
], { cwd: join(root, ".."), encoding: "utf8", maxBuffer: 1 << 28 });

if (r.status !== 0) {
  console.error(r.stderr || r.stdout);
  process.exit(1);
}
console.log(`${zip}  ${(statSync(zip).size / 1e6).toFixed(1)} MB`);
