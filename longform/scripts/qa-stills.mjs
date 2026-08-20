// Section 10 checkpoint 5 — render a still for every beat and inspect it.
//
// One frame is taken at ~55% through each beat, which is past the entrance
// animation and before the exit fade, so what lands on disk is the beat at
// rest — the state a viewer actually reads.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadSchedule, tc } from "./_load.mjs";
import { browserExecutable } from "./browser.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");
const OUT = resolve(PROJ, "out/qa");

const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const fresh = process.argv.includes("--fresh");
if (fresh) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const { BEATS, BEAT_STARTS, frames } = await loadSchedule();

console.log("bundling…");
const serveUrl = await bundle({
  entryPoint: resolve(PROJ, "src/index.ts"),
  onProgress: () => {},
});
const browser = browserExecutable();
console.log(`chromium: ${browser}`);
const comp = await selectComposition({ serveUrl, id: "LongForm", inputProps: {}, browserExecutable: browser });

const targets = BEATS.map((b, i) => ({
  b,
  i,
  frame: BEAT_STARTS[i] + Math.round(frames(b.sec) * 0.55),
})).filter(({ b }) => only.length === 0 || only.includes(b.id));

console.log(`rendering ${targets.length} stills…`);
for (const { b, i, frame } of targets) {
  const file = resolve(OUT, `${String(i).padStart(2, "0")}-${b.id}.png`);
  await renderStill({
    composition: comp,
    serveUrl,
    output: file,
    frame,
    imageFormat: "png",
    browserExecutable: browser,
    chromiumOptions: { gl: "angle" },
  });
  console.log(`  ${String(i).padStart(2, "0")}  ${tc(frame).padStart(5)}  ${b.id.padEnd(16)} ${b.kind}`);
}
console.log(`\nstills -> ${OUT}`);
