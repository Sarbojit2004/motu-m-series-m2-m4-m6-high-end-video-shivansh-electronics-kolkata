// Renders one still per long-form scene, sampled late enough that every staged
// reveal in that scene has settled.
//
// Sampling matters: a still at a scene's first frame catches the layout at
// opacity 0 and proves nothing. Each scene is sampled at 78% of its own
// duration, which is past the last reveal delay in every scene and before the
// closing cross-dissolve.
//
//   node scripts/lf_stills.mjs            all scenes
//   node scripts/lf_stills.mjs L09 L20    named scenes only
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';

const src = fs.readFileSync('src/lib/lf-theme.ts', 'utf8');
const scenes = [];
let cursor = 0;
for (const m of src.matchAll(
  /\{id:\s*'(\w+)',\s*ch:\s*'(\w+)',\s*dur:\s*(\d+),\s*label:\s*'([^']*)'\}/g,
)) {
  scenes.push({id: m[1], ch: m[2], dur: +m[3], label: m[4], from: cursor});
  cursor += +m[3];
}

const only = process.argv.slice(2);
const pick = only.length ? scenes.filter((s) => only.includes(s.id)) : scenes;

fs.mkdirSync('frames/lf', {recursive: true});
console.log(`rendering ${pick.length} still(s) → frames/lf\n`);

for (const s of pick) {
  const f = s.from + Math.round(s.dur * 0.78);
  const out = `frames/lf/${s.id}@${f}.png`;
  execFileSync(
    'npx',
    [
      'remotion', 'still', 'LongForm', out,
      '--frame', String(f),
      '--image-format', 'png',
      '--log', 'error',
    ],
    {stdio: 'inherit'},
  );
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`  ${s.id}  f${String(f).padEnd(5)} ${String(kb).padStart(5)} KB  ${s.label}`);
}
console.log(`\nnext: python3 scripts/lf_edge_audit.py frames/lf/*.png`);
