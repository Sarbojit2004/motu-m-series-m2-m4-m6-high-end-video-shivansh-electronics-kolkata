// Long-form coverage + content audit.
//
// Section 0 requires this video to independently show every one of the 32
// coverage-relevant filenames — it does NOT share a coverage pool with the
// reel series. So this script checks the long-form scene files alone.
//
// It also re-runs the content rules that are easy to break in a late edit:
// no other interface brand, MOP never relabelled, the distributor designation
// never shortened or its territory generalised, and no quality-tier framing.
//
//   node scripts/lf_coverage.mjs
import fs from 'node:fs';

const ledger = JSON.parse(fs.readFileSync('src/lib/ledger.json', 'utf8'));
const files = ['src/scenes/lf/chapters-a.tsx', 'src/scenes/lf/chapters-b.tsx'];
const raw = files.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
// strip comments so prose in a doc block cannot satisfy or trip a check
const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const usable = ledger.filter((e) => e.part !== 0);
const logos = ledger.filter((e) => e.part === 0);

// -- gather every asset id referenced from a scene -------------------------
const used = new Set();
for (const m of src.matchAll(/\bid=\{(\d+)\}/g)) used.add(+m[1]);
for (const m of src.matchAll(/\bids=\{\[([\d,\s]+)\]\}/g)) {
  for (const n of m[1].split(',')) if (n.trim()) used.add(+n.trim());
}
for (const m of src.matchAll(/\bfromId=\{(\d+)\}|\btoId=\{(\d+)\}/g)) {
  used.add(+(m[1] ?? m[2]));
}
// L01 / L32 drive their panels from a local array
for (const m of src.matchAll(/panels:\s*\[number,\s*number,\s*number\]\s*=\s*\[([\d,\s]+)\]/g)) {
  for (const n of m[1].split(',')) if (n.trim()) used.add(+n.trim());
}
for (const m of src.matchAll(/\[\s*(\d+),\s*'MOTU M[246]'/g)) used.add(+m[1]);

const fails = [];
const missing = usable.filter((e) => !used.has(e.id));
const logoUsed = logos.filter((e) => used.has(e.id));

console.log('\nLONG-FORM COVERAGE');
console.log('='.repeat(72));
console.log(`  distinct assets in ledger : ${usable.length}`);
console.log(`  distinct assets placed    : ${usable.length - missing.length}/${usable.length}`);
const names = usable.reduce((a, e) => a + e.nRaw, 0);
const covered = usable.filter((e) => used.has(e.id)).reduce((a, e) => a + e.nRaw, 0);
console.log(`  filenames covered         : ${covered}/${names}`);
console.log(`  excluded logos placed     : ${logoUsed.length}  (must be 0)`);

if (missing.length) {
  fails.push(`${missing.length} asset(s) never appear`);
  console.log('\n  ✗ NOT PLACED:');
  for (const e of missing) console.log(`      ${e.id}  ${e.slug}  (${e.product}/${e.role})`);
}
if (logoUsed.length) fails.push('a logo file is placed through the image ledger');

// per-product summary
console.log('');
for (const p of ['M2', 'M4', 'M6', 'shared']) {
  const g = usable.filter((e) => e.product === p);
  const n = g.filter((e) => used.has(e.id)).length;
  console.log(`  ${p.padEnd(7)} ${n}/${g.length} distinct`);
}

// -- content rules ----------------------------------------------------------
console.log('\nCONTENT RULES');
console.log('='.repeat(72));

const BRANDS = [
  'Focusrite', 'Universal Audio', 'PreSonus', 'Behringer', 'RME', 'Steinberg',
  'Audient', 'Scarlett', 'Apollo', 'Clarett', 'Babyface', 'Fireface', 'Volt',
  'UMC', 'Studio One', 'SSL', 'Solid State Logic', 'Arturia', 'Antelope',
  'Zoom', 'Tascam', 'Sonodyne', 'Yamaha', 'Roland',
];
const brandHits = BRANDS.filter((b) => new RegExp(`\\b${b}\\b`, 'i').test(src));
if (brandHits.length) fails.push(`other-brand reference: ${brandHits.join(', ')}`);
console.log(`  ${brandHits.length ? '✗' : '✓'} no other interface brand  (${BRANDS.length} names checked)`);

const mrp = /\bMRP\b/i.test(src);
if (mrp) fails.push('"MRP" appears — pricing must be MOP');
console.log(`  ${mrp ? '✗' : '✓'} pricing labelled MOP, never MRP`);

// quality-tier framing
const TIER = [
  /\bbetter\s+sound/i, /\bsounds?\s+better\b/i, /\bsuperior\s+(sound|audio|quality)/i,
  /\b(inferior|lesser|lower)\s+(sound|audio|quality)/i, /\bstep\s+up\s+in\s+(sound|quality)/i,
  /\bentry[- ]level\s+(sound|quality|compromise)/i, /\bbudget\s+(sound|version)\b/i,
  /\bflagship\s+(sound|quality)\b/i,
];
const tierHits = TIER.filter((r) => r.test(src)).map((r) => r.source);
if (tierHits.length) fails.push(`quality-tier framing: ${tierHits.join(' | ')}`);
console.log(`  ${tierHits.length ? '✗' : '✓'} no quality-tier framing  (${TIER.length} patterns)`);

// distributor designation integrity — checked in copy.ts, used everywhere
// Strip comments here too. copy.ts's own doc block NAMES the forbidden
// phrases ("never generalised to 'across India'…", "never swapped for
// 'dealer'…"), so scanning the raw file makes the rule flag its own
// documentation.
const copyRaw = fs.readFileSync('src/lib/copy.ts', 'utf8');
const copy = copyRaw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const EXACT =
  'Shivansh Electronics is the Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India.';
const hasExact = copyRaw.includes(EXACT);
if (!hasExact) fails.push('the exact distributor designation is not present in copy.ts');
console.log(`  ${hasExact ? '✓' : '✗'} exact unabbreviated designation present`);

const GENERALISED = [/across India/i, /pan[- ]India/i, /\ball over India\b/i, /\bthroughout India\b/i];
const genHits = GENERALISED.filter((r) => r.test(src + copy)).map((r) => r.source);
if (genHits.length) fails.push(`territory generalised: ${genHits.join(', ')}`);
console.log(`  ${genHits.length ? '✗' : '✓'} territory never generalised`);

const RESELLER = [/\bdealer\b/i, /\breseller\b/i, /\bstockist\b/i];
const resHits = RESELLER.filter((r) => r.test(src + copy)).map((r) => r.source);
if (resHits.length) fails.push(`generic reseller language: ${resHits.join(', ')}`);
console.log(`  ${resHits.length ? '✗' : '✓'} "Authorized Distributor" never swapped for generic terms`);

console.log('\n' + '='.repeat(72));
if (fails.length) {
  console.log(`FAILED — ${fails.length} problem(s)`);
  for (const f of fails) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log('LONG-FORM COVERAGE + CONTENT OK — every asset appears, all rules hold');
