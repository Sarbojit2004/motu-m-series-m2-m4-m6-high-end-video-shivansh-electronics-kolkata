#!/usr/bin/env node
/**
 * Regenerate src/metrics.ts and src/fonts-inline.ts from the vendored fonts.
 *
 * Headline sizing is done at build time (there is no layout pass to measure
 * against), so the advance widths have to come from the actual face rather
 * than an eyeballed table. Run this whenever a font is changed:
 *
 *   node scripts/gen_metrics.mjs
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const py = `
import json, sys
from fontTools.ttLib import TTFont
out = {}
for name, path in [("display", "public/fonts/anton.woff2"),
                   ("tag", "public/fonts/archivo-700.woff2")]:
    f = TTFont(path)
    upm = f["head"].unitsPerEm
    hmtx, cmap = f["hmtx"], f.getBestCmap()
    adv = {}
    for cp in list(range(32, 127)) + [0xB7, 0x2019]:
        g = cmap.get(cp)
        if g and g in hmtx.metrics:
            adv[chr(cp)] = round(hmtx.metrics[g][0] / upm, 4)
    out[name] = adv
print(json.dumps(out, ensure_ascii=False))
`;

const data = JSON.parse(execFileSync("python3", ["-c", py], { cwd: PROJ }).toString());

const fmt = (o) =>
  Object.entries(o)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${v},`)
    .join("\n");

writeFileSync(
  join(PROJ, "src", "metrics.ts"),
  `/**
 * Advance widths in em, read straight out of the vendored woff2 faces.
 *
 * GENERATED - do not edit by hand. Run: node scripts/gen_metrics.mjs
 */

export const DISPLAY_ADV: Record<string, number> = {
${fmt(data.display)}
};

export const TAG_ADV: Record<string, number> = {
${fmt(data.tag)}
};
`
);
// The faces are also inlined as data URIs. Fetching them over the dev server
// races across render workers at concurrency > 1 and can stall a delayRender;
// a data URI has nothing to race on.
const INLINE = [
  ["MontageDisplay", 400, "public/fonts/anton.woff2"],
  ["MontageTag", 700, "public/fonts/archivo-700.woff2"],
  ["MontageTag", 500, "public/fonts/archivo-500.woff2"],
];

const faces = INLINE.map(([family, weight, file]) => {
  const b64 = readFileSync(join(PROJ, file)).toString("base64");
  return `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:block;src:url(data:font/woff2;base64,${b64}) format("woff2");}`;
}).join("\n");

writeFileSync(
  join(PROJ, "src", "fonts-inline.ts"),
  `/**
 * The vendored woff2 faces, inlined as data URIs.
 *
 * GENERATED - do not edit by hand. Run: node scripts/gen_metrics.mjs
 */

export const FONT_CSS = ${JSON.stringify(faces)};
`
);

console.log(
  `src/metrics.ts written: ${Object.keys(data.display).length} display glyphs, ` +
    `${Object.keys(data.tag).length} tag glyphs`
);
console.log(`src/fonts-inline.ts written: ${(faces.length / 1024).toFixed(0)} KB of CSS`);
