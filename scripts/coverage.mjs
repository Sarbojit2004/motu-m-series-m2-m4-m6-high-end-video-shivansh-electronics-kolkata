// Asset-coverage tracker — the auditable answer to the compulsory-coverage
// requirement.
//
//   node scripts/coverage.mjs
//
// Scans the scene sources for every asset id actually referenced, maps each id
// back to its ledger entry (and to every raw filename merged into it), and
// reports which scene each asset appears in. Fails if any coverage-relevant
// asset is unused, or if a scene references an excluded logo.
//
// Coverage is a requirement on the COMBINED two-part series, so the pass
// criterion is "every distinct asset appears in Part 1 or Part 2", not in each
// reel separately. A `part` is recorded per asset for accounting; an asset may
// also cameo in the other part (the Part 1 hook shows all three front panels to
// establish the family) and that is reported but never double-counted.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const ledger = JSON.parse(fs.readFileSync(path.join(SRC, 'lib', 'ledger.json'), 'utf8'));

const sceneFiles = fs
  .readdirSync(path.join(SRC, 'scenes'))
  .filter((f) => /^part\d\.tsx$/.test(f))
  .sort();

if (sceneFiles.length === 0) {
  console.error('no scene files found in src/scenes');
  process.exit(2);
}

// id -> [{part, scene}]
const uses = new Map();
const record = (id, part, scene) => {
  if (!uses.has(id)) uses.set(id, []);
  uses.get(id).push({part, scene});
};

for (const file of sceneFiles) {
  const part = Number(file.match(/part(\d)/)[1]);
  const txt = fs.readFileSync(path.join(SRC, 'scenes', file), 'utf8');

  // Split the file into per-scene chunks so each id can be attributed. Scenes
  // are the `const Snn: React.FC = ...` blocks, in table order.
  const marks = [...txt.matchAll(/^const (S\d\d):\s*React\.FC/gm)].map((m) => ({
    name: m[1],
    at: m.index,
  }));
  const chunks = marks.map((m, i) => ({
    name: m.name,
    body: txt.slice(m.at, i + 1 < marks.length ? marks[i + 1].at : txt.length),
  }));

  for (const c of chunks) {
    const ids = new Set();
    // <Shot id={4}>, <Band id={2}>, <HeroShot id={7}>, <AmbientPhoto id={9}>
    for (const m of c.body.matchAll(/\bid=\{(\d+)\}/g)) ids.add(Number(m[1]));
    // ids={[...]} for Trio / SeqShot / Pair
    for (const m of c.body.matchAll(/\bids=\{\[([^\]]+)\]\}/g)) {
      for (const n of m[1].split(',')) {
        const v = Number(n.trim());
        if (!Number.isNaN(v)) ids.add(v);
      }
    }
    // a local const array feeding ids={TRIO}
    for (const m of c.body.matchAll(/=\s*\[([\d,\s]+)\]\s*;/g)) {
      for (const n of m[1].split(',')) {
        const v = Number(n.trim());
        if (!Number.isNaN(v)) ids.add(v);
      }
    }
    for (const id of ids) record(id, part, c.name);
  }
}

const usable = ledger.filter((e) => e.part !== 0);
const logos = ledger.filter((e) => e.part === 0);
const fails = [];

console.log('\nASSET COVERAGE');
console.log('='.repeat(80));
console.log(
  `ledger: ${ledger.length} entries · ${usable.length} coverage-relevant distinct assets · ` +
    `${usable.reduce((a, e) => a + e.nRaw, 0)} filenames · ${logos.length} excluded logos`,
);
console.log(`scanned: ${sceneFiles.join(', ')}\n`);

for (const part of [1, 2]) {
  const rows = usable.filter((e) => e.part === part);
  if (rows.length === 0) continue;
  const done = rows.filter((e) => uses.has(e.id)).length;
  console.log(`--- PART ${part} — ${done}/${rows.length} allocated assets placed ---`);
  for (const e of rows) {
    const u = uses.get(e.id) ?? [];
    const here = [...new Set(u.filter((x) => x.part === part).map((x) => x.scene))];
    const other = [...new Set(u.filter((x) => x.part !== part).map((x) => `P${x.part}${x.scene}`))];
    const mark = u.length ? '✓' : '✗';
    const extra = other.length ? `  (cameo ${other.join(',')})` : '';
    const merged = e.nRaw > 1 ? `  [+${e.nRaw - 1} identical file]` : '';
    console.log(
      `  ${mark} ${String(e.id).padStart(2)} ${e.slug.padEnd(26)} ${e.product.padEnd(6)} ` +
        `${e.role.padEnd(8)} ${here.join(',') || '—'}${extra}${merged}`,
    );
    if (!u.length) fails.push(`asset ${e.id} (${e.slug}) is never placed`);
  }
  console.log('');
}

for (const l of logos) {
  if (uses.has(l.id)) fails.push(`excluded logo id ${l.id} is referenced by a scene`);
}

const placed = usable.filter((e) => uses.has(e.id));
const namesCovered = placed.reduce((a, e) => a + e.nRaw, 0);
const namesTotal = usable.reduce((a, e) => a + e.nRaw, 0);

console.log('='.repeat(80));
console.log(`distinct assets placed : ${placed.length}/${usable.length}`);
console.log(`filenames covered      : ${namesCovered}/${namesTotal}`);
console.log(`excluded logos placed  : ${logos.filter((l) => uses.has(l.id)).length}  (must be 0)`);

if (fails.length) {
  console.log('\nFAILURES');
  for (const f of fails) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log('\nCOVERAGE COMPLETE — every coverage-relevant asset appears in the series');
