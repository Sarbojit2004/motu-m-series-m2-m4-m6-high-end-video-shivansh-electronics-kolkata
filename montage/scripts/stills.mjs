#!/usr/bin/env node
/**
 * QA stills. Renders one frame from the middle of every beat span in the
 * schedule (plus the cold open and close), so the whole reel can be reviewed
 * as contact sheets without waiting for a full 4K render.
 *
 *   node scripts/stills.mjs            every shot
 *   node scripts/stills.mjs m6-4 close only these keys
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");
const OUT = join(PROJ, "out", "qa");
mkdirSync(OUT, { recursive: true });

const BEAT = 60 / 93;
const bf = (b) => Math.round(b * BEAT * 30);

const src = await import(join(PROJ, "src", "schedule.ts"))
  .catch(() => null);

// schedule.ts is TypeScript; read the beat spans out of it directly instead
const { readFileSync } = await import("node:fs");
const text = readFileSync(join(PROJ, "src", "schedule.ts"), "utf8");
const shots = [...text.matchAll(/key:\s*"([^"]+)",\s*from:\s*([\d.]+),\s*to:\s*([\d.]+)/g)]
  .map((m) => ({ key: m[1], from: Number(m[2]), to: Number(m[3]) }));

const marks = [
  { key: "open-a", frame: bf(1.2) },
  { key: "open-b", frame: bf(4.6) },
  { key: "open-c", frame: bf(8.6) },
  ...shots.map((s) => ({ key: s.key, frame: bf(s.from) + Math.round((bf(s.to) - bf(s.from)) * 0.62) })),
  { key: "close-a", frame: bf(129.4) },
  { key: "close-b", frame: bf(133.6) },
  { key: "close-c", frame: bf(138.4) },
];

const only = process.argv.slice(2);
const wanted = only.length ? marks.filter((m) => only.includes(m.key)) : marks;

for (const m of wanted) {
  const file = join(OUT, `${String(m.frame).padStart(4, "0")}-${m.key}.png`);
  process.stdout.write(`${m.key} @ ${m.frame}  `);
  execFileSync(
    "npx",
    ["remotion", "still", "Montage", file, `--frame=${m.frame}`, "--image-format=png", "--log=error"],
    { cwd: PROJ, stdio: ["ignore", "ignore", "inherit"] }
  );
  console.log("ok");
}
console.log(`\n${wanted.length} stills -> ${OUT}`);
