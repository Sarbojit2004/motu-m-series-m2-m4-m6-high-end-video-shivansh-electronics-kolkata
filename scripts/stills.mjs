// Renders one verification still per scene, at a chosen point inside each
// scene's slot, plus an optional safe-zone guide overlay pass.
//
//   node scripts/stills.mjs 1                 # all Part 1 scenes, 55% through
//   node scripts/stills.mjs 1 0.25            # 25% through each scene
//   node scripts/stills.mjs 1 0.55 P1S06      # just one scene
//
// Output: stills/p<part>/<sceneId>@<frame>.png
//
// Every still is inspected for: critical content inside the 250..1580 safe
// band and inboard of the 72px side margins, no text/image overlap, legible
// contrast on the light ground, no added logo overlay, correct MOP wording and
// the full distributor designation wherever CTA copy appears.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const part = Number(process.argv[2] ?? 1);
const at = Number(process.argv[3] ?? 0.55);
const only = process.argv[4];

const src = fs.readFileSync(
  path.join(process.cwd(), 'src', 'lib', 'theme.ts'),
  'utf8',
);

// parse the scene table straight out of theme.ts so this can never drift
const tableMatch = src.match(
  new RegExp(`export const PART${part}: Scene\\[\\] = \\[([\\s\\S]*?)\\n\\];`),
);
if (!tableMatch) {
  console.error(`could not find PART${part} table in src/lib/theme.ts`);
  process.exit(2);
}
const rows = [...tableMatch[1].matchAll(/\{id: '([^']+)', dur: (\d+), label: '([^']*)'\}/g)].map(
  (m) => ({id: m[1], dur: Number(m[2]), label: m[3]}),
);
if (rows.length === 0) {
  console.error('scene table parsed but empty');
  process.exit(2);
}

let cursor = 0;
const scenes = rows.map((r) => {
  const from = cursor;
  cursor += r.dur;
  return {...r, from};
});

const comp = part === 1 ? 'Part1Engine' : 'Part2ScaleUp';
const outDir = path.join(process.cwd(), 'stills', `p${part}`);
fs.mkdirSync(outDir, {recursive: true});

const targets = scenes.filter((s) => !only || s.id === only);
console.log(
  `\nPART ${part} — ${targets.length} still(s) at ${(at * 100).toFixed(0)}% of each scene ` +
    `(table sums to ${cursor} frames)\n`,
);

for (const s of targets) {
  const frame = Math.min(cursor - 1, Math.round(s.from + s.dur * at));
  const out = path.join(outDir, `${s.id}@${frame}.png`);
  process.stdout.write(`  ${s.id}  f${String(frame).padStart(4)}  ${s.label} … `);
  try {
    execFileSync(
      'npx',
      [
        'remotion',
        'still',
        comp,
        out,
        `--frame=${frame}`,
        '--image-format=png',
        '--log=error',
      ],
      {stdio: ['ignore', 'pipe', 'pipe'], timeout: 300000},
    );
    console.log('ok');
  } catch (e) {
    console.log('FAILED');
    console.error(String(e.stderr ?? e.message).slice(0, 1500));
    process.exit(1);
  }
}

console.log(`\nwrote ${targets.length} still(s) to ${path.relpath ?? ''}stills/p${part}`);
