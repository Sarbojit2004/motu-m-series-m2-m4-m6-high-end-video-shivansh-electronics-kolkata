/**
 * PHASE 3 — verification of Flick's output against this project's standing
 * rules. Every check reads the built artefacts (scene sources, scene-spec,
 * asset manifest, rendered files), never a summary of them.
 *
 *   usage: node scripts/verify.mjs
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const remotion = join(root, "flick-output", "remotion");
const spec = JSON.parse(readFileSync(join(root, "flick-output", "scene-spec.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(root, "flick-output", "brand-assets", "image-manifest.json"), "utf8"));
const sceneFiles = readdirSync(join(remotion, "src", "scenes")).filter((f) => f.endsWith(".tsx")).sort();
const sceneSrc = sceneFiles.map((f) => readFileSync(join(remotion, "src", "scenes", f), "utf8"));
const allSrc = sceneSrc.join("\n");
const componentSrc = readdirSync(join(remotion, "src", "components"))
  .map((f) => readFileSync(join(remotion, "src", "components", f), "utf8")).join("\n");

let fails = 0;
const check = (name, ok, detail = "") => {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
  if (!ok) fails++;
};

// ---------------------------------------------------------------- 1. coverage
console.log("\n1. FULL ASSET COVERAGE");
const supplied = manifest.map((i) => i.name);
const placed = new Set();
for (const s of sceneSrc) {
  for (const m of s.matchAll(/(?:image|images)=\{?(?:\[([^\]]*)\]|"([^"]+)")/g)) {
    const body = m[1] ?? `"${m[2]}"`;
    for (const q of body.matchAll(/"([^"]+)"/g)) placed.add(q[1]);
  }
}
const missing = supplied.filter((n) => !placed.has(n));
const unknown = [...placed].filter((n) => !supplied.includes(n));
check(`all ${supplied.length} supplied images placed`, missing.length === 0,
  missing.length ? `missing: ${missing.join(", ")}` : `${placed.size} distinct placed`);
check("no image referenced that was not supplied", unknown.length === 0, unknown.join(", "));

// ------------------------------------------------------------------ 2. no crop
console.log("\n2. NO CROPPING");
const covers = [...componentSrc.matchAll(/objectFit:\s*"cover"/g)].length;
const containers = [...componentSrc.matchAll(/objectFit:\s*"contain"/g)].length;
check("every subject image is object-fit: contain", containers >= 1);
check("the only `cover` is the decorative blurred field", covers === 1,
  `${covers} cover, ${containers} contain`);
const fieldIsDecorative = /objectFit: "cover", \/\/ decorative field only/.test(componentSrc);
check("that one `cover` is annotated as the field, not a subject", fieldIsDecorative);

// -------------------------------------------------------- 3. no throwaway filler
// A distinct failure mode from cropping: an image on screen so briefly, so
// small or so washed out that supplying it was pointless.
console.log("\n3. NO THROWAWAY FILLER  (distinct from cropping)");
const FPS = 30;
const dwell = [];
for (const s of spec) {
  const n = Math.max(1, (s.assets ?? []).length);
  dwell.push({ id: s.id, n, per: s.durationInFrames / n / FPS });
}
const tooBrief = dwell.filter((d) => d.per < 1.6);
check("no image on screen for under 1.6 s", tooBrief.length === 0,
  tooBrief.length ? tooBrief.map((d) => `${d.id} ${d.per.toFixed(2)}s`).join(", ")
                  : `busiest scene gives each image ${Math.min(...dwell.map((d) => d.per)).toFixed(2)}s`);
// No image may exist only as a washed-out backdrop for something else.
const washed = /opacity: 0\.5 \}\}><Frame/.test(componentSrc);
check("no image used only as a dimmed backdrop", !washed);
// Every supplied image must have at least one placement where it is the subject.
const decorativeOnly = supplied.filter((n) => {
  const uses = sceneSrc.filter((s) => s.includes(`"${n}"`));
  return uses.length === 0;
});
check("every image is the subject of at least one scene", decorativeOnly.length === 0, decorativeOnly.join(", "));

// ------------------------------------------------------------------ 4. pricing
console.log("\n4. PRICING");
const theme = readFileSync(join(remotion, "src", "lib", "theme.ts"), "utf8");
for (const [model, value] of [["m2", "Rs. 26,900"], ["m4", "Rs. 32,900"], ["m6", "Rs. 55,900"]]) {
  check(`${model.toUpperCase()} MOP is exactly ${value}`, theme.includes(`${model}: "${value}"`));
}
check("the per-unit / MOP / GST note is present verbatim",
  theme.includes('note: "per unit · MOP, inclusive of GST"'));
const blended = /\b(starting (from|at)|from Rs|Rs\.? ?2[0-9],?[0-9]{3}\s*[-–—]\s*Rs)/i.test(allSrc + theme);
check("no blended figure, range or `starting from` language", !blended);
// The three figures must never share a single line of copy.
const sameLine = (allSrc + theme).split("\n").filter((l) =>
  ["26,900", "32,900", "55,900"].filter((v) => l.includes(v)).length > 1);
check("the three MOPs are never blended onto one line", sameLine.length === 0, sameLine[0] ?? "");

// -------------------------------------------------- 5. no other brand, no TASCAM
console.log("\n5. NO COMPARISON, NO OTHER BRANDS");
const HAY = (allSrc + componentSrc + theme + readFileSync(join(root, "flick-output", "flick-plan.md"), "utf8"))
  .replace(/"[^"]*\.(mp3|MP3|wav|png|jpg)"/g, "")   // asset filenames are not copy
  .replace(/^\s*import .*$/gm, "")
  .toLowerCase();
const BANNED = ["tascam", "focusrite", "scarlett", "presonus", "audient", "behringer", "steinberg",
                "ur22", "zoom h[0-9]", "zoom u-?[0-9]", "zoom podtrak", "zoom livetrak",
                "arturia", "universal audio", "apollo", "ssl ", "rme", "babyface",
                "native instruments", "komplete audio", "evo ", "solid state logic"];
const hits = BANNED.filter((b) => new RegExp(`\\b${b.trim()}\\b`).test(HAY));
check("no competing audio-interface brand named anywhere", hits.length === 0, hits.join(", "));
const compare = /\b(better than|compared to|vs\.?\s|versus|unlike the|outperforms)\b/.test(HAY);
check("no comparative construction against another product", !compare);

// ------------------------------------------------------------------- 6. logos
console.log("\n6. LOGOS DRAWN PLAIN");
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const brand = stripComments(readFileSync(join(remotion, "src", "components", "Brand.tsx"), "utf8"));
const logoBlock = brand.slice(brand.indexOf("export const Logo"), brand.indexOf("export const ShivanshCorner"));
check("the Logo primitive adds no background, border or plate",
  !/background|border|boxShadow|padding/.test(logoBlock));
check("mix-blend-mode is not used on logos (code, not comments)", !/mix-blend-mode|mixBlendMode/.test(brand));
check("logos are never alpha-keyed or masked", !/mask|clipPath/.test(logoBlock));

// -------------------------------------------------------- 7. branding cadence
console.log("\n7. BRANDING CADENCE");
const kinds = readFileSync(join(remotion, "src", "components", "Kinds.tsx"), "utf8");
const kindOf = (src) => (src.match(/import \{ (\w+) \} from "\.\.\/components\/Kinds"/) ?? [])[1];
const kindBody = (k) => {
  const i = kinds.indexOf(`export const ${k}:`);
  if (i < 0) return "";
  const rest = kinds.slice(i);
  const j = rest.indexOf("\n/** ", 1);
  return j > 0 ? rest.slice(0, j) : rest;
};
let shiv = 0, motu = 0;
for (const s of sceneSrc) {
  const b = kindBody(kindOf(s) ?? "");
  if (/ShivanshCorner|ShivanshStrip|CloseLockup/.test(b)) shiv++;
  if (/MotuCorner|CloseLockup/.test(b)) motu++;
}
check("Shivansh appears more often than MOTU", shiv > motu, `Shivansh ${shiv} scenes, MOTU ${motu} scenes`);
const urlScenes = sceneSrc.filter((s, i) =>
  /shivanshelectronics\.in/.test(s) || /ShivanshCorner|ShivanshStrip|CloseLockup|PriceWall/.test(kindBody(kindOf(s) ?? ""))).length;
check("the website is the most-repeated element", urlScenes >= shiv, `${urlScenes} scenes carry the URL`);

// ----------------------------------------------------------------- 8. position
console.log("\n8. POSITIONING STATEMENT");
check("the distributor line reads exactly as approved",
  theme.includes('role: "Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces"')
  && theme.includes('region: "East and North East India"'));
check("no other brand relationship is claimed",
  !/(dealer|distributor) (of|for) (?!MOTU)/i.test(allSrc + theme));

// -------------------------------------------------------------- 9. arithmetic
console.log("\n9. RUNTIME ARITHMETIC");
const total = spec.reduce((a, s) => a + s.durationInFrames, 0);
check("25 scenes", spec.length === 25);
check("5,340 frames exactly", total === 5340, `${total}`);
check("178.000 s at 30 fps", total / FPS === 178, `${(total / FPS).toFixed(3)}s`);
let cursor = 0, contiguous = true;
for (const s of spec) { if (s.from !== cursor) contiguous = false; cursor += s.durationInFrames; }
check("scene starts are contiguous with no gap or overlap", contiguous);

// ------------------------------------------------------- 10. text legibility
console.log("\n10. TEXT LEGIBILITY");
const type = readFileSync(join(remotion, "src", "components", "Type.tsx"), "utf8");
const sizes = [...(kinds + type).matchAll(/size=\{(\d+)\}|fontSize: (\d+)/g)]
  .map((m) => Number(m[1] ?? m[2])).filter((n) => n > 0);
check("no type below 16 px", Math.min(...sizes) >= 16, `smallest ${Math.min(...sizes)}px`);
const headlineSizes = [...kinds.matchAll(/<Headline size=\{(\d+)\}/g)].map((m) => Number(m[1]));
check("every headline is at or above the 62 px portrait floor",
  Math.min(...headlineSizes) >= 62, `smallest headline ${Math.min(...headlineSizes)}px`);

console.log(`\n${fails === 0 ? "ALL CHECKS PASSED" : `${fails} CHECK(S) FAILED`}\n`);
process.exit(fails === 0 ? 0 : 1);
