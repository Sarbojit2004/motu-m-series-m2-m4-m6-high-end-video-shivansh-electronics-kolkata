#!/usr/bin/env node
/**
 * Asset-coverage audit.
 *
 * The brief requires every distinct raw MOTU photograph in the repository to
 * appear somewhere in the 90 seconds. This checks that end to end and fails
 * loudly if anything is missing:
 *
 *   1. hash every raw image in the repo root and group byte-identical files
 *   2. check the catalogue covers every distinct image exactly once
 *   3. check every catalogue entry is actually placed in the timeline
 *   4. print where each one lands, in reel order
 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(PROJ, "..");

const BEAT = 60 / 93;
const fmt = (b) => {
  const t = b * BEAT;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${(t % 60).toFixed(2).padStart(5, "0")}`;
};

// ---- 1. the raw images actually present -----------------------------------
const raw = readdirSync(REPO).filter((f) => /^MOTU M[246] \(\d+\)\.(jpg|png)$/i.test(f));
const byHash = new Map();
for (const f of raw) {
  const h = createHash("md5").update(readFileSync(join(REPO, f))).digest("hex");
  if (!byHash.has(h)) byHash.set(h, []);
  byHash.get(h).push(f);
}
const distinct = [...byHash.values()];
const dupes = distinct.filter((g) => g.length > 1);

// ---- 2. catalogue coverage ------------------------------------------------
const cat = JSON.parse(readFileSync(join(PROJ, "catalog.json"), "utf8"));
const cataloguedFiles = new Set(cat.images.map((e) => e.file));

const problems = [];
for (const group of distinct) {
  const hit = group.filter((f) => cataloguedFiles.has(f));
  if (hit.length === 0) problems.push(`uncovered image: ${group.join(" == ")}`);
  if (hit.length > 1) problems.push(`covered twice: ${hit.join(" and ")}`);
}
for (const f of cataloguedFiles) {
  if (!raw.includes(f)) problems.push(`catalogue references a missing file: ${f}`);
}

// ---- 3. timeline placement ------------------------------------------------
const sched = readFileSync(join(PROJ, "src", "schedule.ts"), "utf8");
const shots = [];
for (const m of sched.matchAll(
  /\{\s*key:\s*"([^"]+)",\s*from:\s*([\d.]+),\s*to:\s*([\d.]+),\s*img:\s*"([^"]+)"(?:,\s*tile:\s*"([^"]+)")?/g
)) {
  shots.push({ key: m[1], from: +m[2], to: +m[3], img: m[4], tile: m[5] });
}
const fragBlock = sched.slice(sched.indexOf("export const FRAGMENTS"));
const fragments = [...fragBlock.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);

const placement = new Map();
for (const s of shots) {
  for (const [id, role] of [[s.img, "plate"], [s.tile, "tile"]]) {
    if (!id) continue;
    if (!placement.has(id)) placement.set(id, []);
    placement.get(id).push({ key: s.key, from: s.from, to: s.to, role });
  }
}

for (const e of cat.images) {
  if (!placement.has(e.id)) problems.push(`catalogued but never on screen: ${e.id} (${e.file})`);
}
for (const id of placement.keys()) {
  if (!cat.images.some((e) => e.id === id)) problems.push(`timeline uses unknown id: ${id}`);
}
for (const id of fragments) {
  if (!cat.images.some((e) => e.id === id)) problems.push(`fragment uses unknown id: ${id}`);
}

// ---- 4. report ------------------------------------------------------------
console.log(`raw files in repo root        ${raw.length}`);
console.log(`byte-identical duplicate pairs ${dupes.length}`);
for (const g of dupes) console.log(`  ${g.join("  ==  ")}`);
console.log(`distinct images                ${distinct.length}`);
console.log(`catalogue entries              ${cat.images.length}`);
console.log(`compositions in the timeline   ${shots.length}\n`);

const order = [...placement.entries()].sort((a, b) => a[1][0].from - b[1][0].from);
console.log("  id           product  file                    first seen        role");
console.log("  " + "-".repeat(74));
for (const [id, uses] of order) {
  const e = cat.images.find((x) => x.id === id);
  const u = uses[0];
  const dup = dupes.find((g) => g.includes(e.file));
  console.log(
    `  ${id.padEnd(12)} ${e.product.padEnd(8)} ${e.file.padEnd(23)} ` +
      `${fmt(u.from)}-${fmt(u.to)}  ${u.role}${dup ? "   [covers " + dup.filter((f) => f !== e.file)[0] + "]" : ""}`
  );
}

const counts = cat.images.reduce((a, e) => ((a[e.product] = (a[e.product] ?? 0) + 1), a), {});
console.log(`\nper product: ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join("  ")}`);

if (problems.length) {
  console.error(`\nFAILED: ${problems.length} problem(s)`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`\nOK: all ${distinct.length} distinct raw images appear in the reel.`);
