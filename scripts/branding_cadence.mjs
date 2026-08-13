// Audits the long-form branding plan against Section 9's three hard rules.
//
//   1. No gap longer than MAX_GAP seconds without visible Shivansh presence.
//   2. Every major product chapter contains at least one Shivansh beat.
//   3. Both marks genuinely MOVE — no mark pinned to one slot, and no mark
//      repeating one slot more than SLOT_CAP times across the runtime.
//
// It reads src/lib/lf-brand-plan.ts and src/lib/lf-theme.ts and computes the
// real absolute timeline, so it reflects what actually renders rather than a
// separately maintained list. Also prints the timestamped appearance table
// that validation checkpoint 6 asks to be produced.
//
//   node scripts/branding_cadence.mjs
import fs from 'node:fs';

const MAX_GAP = 30; // seconds — Section 9 says "roughly 25-30"
const SLOT_CAP = 3; // times one mark may reuse a single slot
const FPS = 30;

const themeSrc = fs.readFileSync('src/lib/lf-theme.ts', 'utf8');
const planSrc = fs.readFileSync('src/lib/lf-brand-plan.ts', 'utf8');

// -- scene table ------------------------------------------------------------
const scenes = [];
let cursor = 0;
for (const m of themeSrc.matchAll(
  /\{id:\s*'(\w+)',\s*ch:\s*'(\w+)',\s*dur:\s*(\d+),\s*label:\s*'([^']*)'\}/g,
)) {
  scenes.push({id: m[1], ch: m[2], dur: +m[3], label: m[4], from: cursor});
  cursor += +m[3];
}
const byId = new Map(scenes.map((s) => [s.id, s]));
const TOTAL = cursor;

// -- branding beats ---------------------------------------------------------
const beats = [];
for (const m of planSrc.matchAll(
  /\{scene:\s*'(\w+)',\s*at:\s*(\d+),\s*dur:\s*(\d+),\s*brand:\s*'(\w+)',\s*pos:\s*'(\w+)',\s*form:\s*'(\w+)'/g,
)) {
  const s = byId.get(m[1]);
  if (!s) {
    console.log(`  ✗ beat references unknown scene ${m[1]}`);
    process.exit(1);
  }
  const start = s.from + +m[2];
  beats.push({
    scene: m[1],
    ch: s.ch,
    start,
    end: start + +m[3],
    brand: m[4],
    pos: m[5],
    form: m[6],
  });
}
beats.sort((a, b) => a.start - b.start);

const fails = [];
const t = (f) => (f / FPS).toFixed(1).padStart(6);

console.log(`\nBRANDING CADENCE AUDIT`);
console.log(`  runtime ${(TOTAL / FPS).toFixed(1)}s · ${beats.length} appearances`);
console.log('='.repeat(84));
console.log(`  ${'START'.padStart(6)} ${'END'.padStart(6)}  ${'BRAND'.padEnd(9)} ${'POS'.padEnd(7)} ${'FORM'.padEnd(6)} SCENE  CHAPTER`);
console.log('-'.repeat(84));
for (const b of beats) {
  console.log(
    `  ${t(b.start)} ${t(b.end)}  ${b.brand.padEnd(9)} ${b.pos.padEnd(7)} ${b.form.padEnd(6)} ${b.scene}   ${b.ch}`,
  );
}

// -- rule 1: Shivansh gaps --------------------------------------------------
const sh = beats.filter((b) => b.brand === 'shivansh');
console.log(`\n--- rule 1: Shivansh gap <= ${MAX_GAP}s ---`);
let prevEnd = 0;
let worst = 0;
for (const b of sh) {
  const gap = (b.start - prevEnd) / FPS;
  if (gap > worst) worst = gap;
  if (gap > MAX_GAP) {
    fails.push(`gap of ${gap.toFixed(1)}s before ${b.scene} @${(b.start / FPS).toFixed(1)}s`);
    console.log(`  ✗ ${gap.toFixed(1)}s gap before ${b.scene} @${(b.start / FPS).toFixed(1)}s`);
  }
  prevEnd = Math.max(prevEnd, b.end);
}
const tailGap = (TOTAL - prevEnd) / FPS;
if (tailGap > worst) worst = tailGap;
if (tailGap > MAX_GAP) {
  fails.push(`trailing gap of ${tailGap.toFixed(1)}s`);
  console.log(`  ✗ trailing gap ${tailGap.toFixed(1)}s`);
}
console.log(`  ${worst <= MAX_GAP ? '✓' : '✗'} largest gap ${worst.toFixed(1)}s  (limit ${MAX_GAP}s)`);
console.log(`  · ${sh.length} Shivansh appearances`);

// -- rule 2: every product chapter carries a Shivansh beat -----------------
console.log(`\n--- rule 2: every product chapter has a Shivansh beat ---`);
for (const ch of ['engine', 'm2', 'm4', 'm6']) {
  const n = sh.filter((b) => b.ch === ch).length;
  const ok = n > 0;
  if (!ok) fails.push(`chapter ${ch} has no Shivansh beat`);
  console.log(`  ${ok ? '✓' : '✗'} ${ch.padEnd(8)} ${n} appearance(s)`);
}

// -- rule 3: marks actually move -------------------------------------------
console.log(`\n--- rule 3: positional variation ---`);
for (const brand of ['shivansh', 'motu']) {
  const list = beats.filter((b) => b.brand === brand);
  const slots = new Map();
  for (const b of list) slots.set(b.pos, (slots.get(b.pos) ?? 0) + 1);
  const distinct = slots.size;
  const maxRepeat = Math.max(...slots.values());
  const forms = new Set(list.map((b) => b.form));

  if (distinct < 2) {
    fails.push(`${brand} never moves — only slot "${[...slots.keys()][0]}"`);
  }
  if (maxRepeat > SLOT_CAP) {
    const worstSlot = [...slots.entries()].find(([, n]) => n === maxRepeat)[0];
    fails.push(`${brand} reuses slot "${worstSlot}" ${maxRepeat}x (cap ${SLOT_CAP})`);
  }
  // consecutive repeats read as "pinned"
  for (let i = 1; i < list.length; i++) {
    if (list[i].pos === list[i - 1].pos) {
      fails.push(`${brand} repeats slot "${list[i].pos}" back-to-back (${list[i - 1].scene} -> ${list[i].scene})`);
    }
  }
  const ok = distinct >= 2 && maxRepeat <= SLOT_CAP;
  console.log(
    `  ${ok ? '✓' : '✗'} ${brand.padEnd(9)} ${list.length} appearances · ${distinct} distinct slots ` +
      `(max reuse ${maxRepeat}) · ${forms.size} form(s): ${[...forms].join(', ')}`,
  );
  console.log(`      slots: ${[...slots.entries()].map(([k, v]) => `${k}×${v}`).join('  ')}`);
}

// -- rule 4: MOTU present but less frequent, and present mid-video ---------
console.log(`\n--- rule 4: MOTU present, less frequent, includes mid-video ---`);
const mo = beats.filter((b) => b.brand === 'motu');
const lessFrequent = mo.length < sh.length;
if (!lessFrequent) fails.push(`MOTU (${mo.length}) is not less frequent than Shivansh (${sh.length})`);
console.log(`  ${lessFrequent ? '✓' : '✗'} MOTU ${mo.length} vs Shivansh ${sh.length}`);
const midLo = TOTAL * 0.25;
const midHi = TOTAL * 0.8;
const mid = mo.filter((b) => b.start > midLo && b.start < midHi);
if (mid.length < 1) fails.push('MOTU has no genuine mid-video appearance');
console.log(
  `  ${mid.length >= 1 ? '✓' : '✗'} ${mid.length} mid-video appearance(s): ` +
    mid.map((b) => `${(b.start / FPS).toFixed(0)}s`).join(', '),
);

console.log('\n' + '='.repeat(84));
if (fails.length) {
  console.log(`FAILED — ${fails.length} problem(s)`);
  for (const f of fails) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log('BRANDING CADENCE OK — all Section 9 rules satisfied');
