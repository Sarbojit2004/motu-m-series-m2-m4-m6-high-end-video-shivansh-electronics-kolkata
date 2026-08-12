// Extracts one PNG per scene from a DELIVERED render, for safe-zone auditing.
//
//   node scripts/frames_from_render.mjs 1 out/motu-mseries-reel-part1-engine.mp4
//
// Auditing intermediate stills verifies the composition; auditing frames pulled
// back out of the finished MP4 verifies what was actually shipped — including
// anything the encoder or the scene-overlap cross-dissolves changed. Frames land
// in frames/p<part>/.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const part = Number(process.argv[2] ?? 1);
const target = process.argv[3];
if (!target || !fs.existsSync(target)) {
  console.error('usage: node scripts/frames_from_render.mjs <part> <file.mp4>');
  process.exit(2);
}

const FFMPEG = (() => {
  const p = path.join(process.cwd(), 'node_modules', '@ffmpeg-installer', 'linux-x64', 'ffmpeg');
  return fs.existsSync(p) ? p : 'ffmpeg';
})();

const src = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'theme.ts'), 'utf8');
const tbl = src.match(new RegExp(`export const PART${part}: Scene\\[\\] = \\[([\\s\\S]*?)\\n\\];`));
if (!tbl) {
  console.error(`could not find PART${part} in src/lib/theme.ts`);
  process.exit(2);
}
const rows = [...tbl[1].matchAll(/\{id: '([^']+)', dur: (\d+), label: '([^']*)'\}/g)].map((m) => ({
  id: m[1],
  dur: Number(m[2]),
  label: m[3],
}));

let cursor = 0;
const scenes = rows.map((r) => {
  const from = cursor;
  cursor += r.dur;
  return {...r, from};
});

const outDir = path.join(process.cwd(), 'frames', `p${part}`);
fs.rmSync(outDir, {recursive: true, force: true});
fs.mkdirSync(outDir, {recursive: true});

console.log(`\nEXTRACTING ${scenes.length} frame(s) from ${target}`);
console.log(`  scene table sums to ${cursor} frames\n`);

// 55% into each scene: clear of the incoming cross-dissolve and of the outgoing
// one, so each frame shows its scene fully settled.
for (const s of scenes) {
  const frame = Math.min(cursor - 1, Math.round(s.from + s.dur * 0.55));
  const out = path.join(outDir, `${s.id}@${frame}.png`);
  execFileSync(
    FFMPEG,
    [
      '-v', 'error', '-y',
      // seek by exact frame index rather than by timestamp
      '-i', target,
      '-vf', `select=eq(n\\,${frame})`,
      '-vsync', '0', '-frames:v', '1',
      out,
    ],
    {stdio: ['ignore', 'pipe', 'pipe']},
  );
  const kb = (fs.statSync(out).size / 1024).toFixed(0);
  console.log(`  ${s.id}  f${String(frame).padStart(4)}  ${kb.padStart(5)} KB  ${s.label}`);
}

console.log(`\nwrote ${scenes.length} frame(s) to frames/p${part}`);
console.log(`next: python3 scripts/safezone_audit.py frames/p${part}/*.png`);
