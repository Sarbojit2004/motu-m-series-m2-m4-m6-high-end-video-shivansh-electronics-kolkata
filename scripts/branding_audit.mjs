// Static audit of the hard copy rules, run over all of src/.
//
//   node scripts/branding_audit.mjs
//
// These are the constraints a visual pass over stills can miss, so they are
// checked mechanically instead of by eye:
//
//   1. No competing audio-interface brand is named anywhere.
//   2. "MRP" never appears; pricing is always MOP.
//   3. The distributor designation is exact — the full territory, and the words
//      "Authorized Distributor" rather than dealer/reseller.
//   4. The territory is never generalised to pan-India / across India.
//   5. No scene imports or references a logo asset.
//   6. Nothing implies the M2 or M4 are sonically inferior.
//   7. Prices match the brief's verified MOP figures exactly.
//   8. objectFit:'cover' is not used on any content image (no-crop rule).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, {withFileTypes: true})) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(e.name)) files.push(p);
  }
})(SRC);

const read = (p) => fs.readFileSync(p, 'utf8');
const rel = (p) => path.relative(ROOT, p);

/**
 * Comments are stripped before any copy check runs.
 *
 * Several of these rules are also *documented* in the source — copy.ts spells
 * out "never MRP", "never dealer/reseller", "never pan-India", and theme.ts
 * records that the type system was ported from the TASCAM Sonicview project,
 * which the brief requires be attributed. Scanning raw text flags all of that
 * as a violation of the very rule it is describing. Only rendered copy matters,
 * so the checks look at code with comments removed.
 *
 * The line-comment lookbehind protects `https://` (preceded by a colon) so URLs
 * in string literals survive.
 */
const strip = (txt) =>
  txt.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(?<![:/])\/\/[^\n]*/g, ' ');
const code = (p) => strip(read(p));

const fails = [];
const notes = [];
const ok = (cond, msg, detail = '') => {
  console.log(`  ${cond ? '✓' : '✗'} ${msg}${detail ? `  ${detail}` : ''}`);
  if (!cond) fails.push(msg);
};

console.log('\nBRANDING & COPY AUDIT');
console.log('='.repeat(66));

// ---- 1. competing brands -------------------------------------------------
const BANNED_BRANDS = [
  'Focusrite', 'Scarlett', 'Universal Audio', 'Apollo', 'PreSonus', 'AudioBox',
  'Behringer', 'RME', 'Babyface', 'Steinberg', 'Audient', 'SSL',
  'Solid State Logic', 'Zoom', 'Tascam', 'Arturia', 'Native Instruments',
  'Komplete Audio', 'Antelope', 'Clarett', 'Volt', 'iD14', 'Evo',
];
const brandHits = [];
for (const f of files) {
  const txt = code(f);
  for (const b of BANNED_BRANDS) {
    const re = new RegExp(`\\b${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(txt)) brandHits.push(`${rel(f)}: "${b}"`);
  }
}
ok(brandHits.length === 0, 'no competing interface brand named', brandHits.join('; '));

// ---- 2. MRP / generic price ---------------------------------------------
const mrpHits = files.filter((f) => /\bMRP\b/i.test(code(f))).map(rel);
ok(mrpHits.length === 0, '"MRP" never used', mrpHits.join(', '));

// ---- 3/4. distributor designation ---------------------------------------
const copyRaw = read(path.join(SRC, 'lib', 'copy.ts'));
const copy = strip(copyRaw);
const EXACT =
  'Shivansh Electronics is the Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India.';
ok(copyRaw.includes(EXACT), 'exact unabbreviated distributor designation present');
ok(
  /Authorized Distributor/.test(copy) &&
    !/\b(reseller|dealership)\b/i.test(copy) &&
    !/\bdealer\b/i.test(copy),
  '"Authorized Distributor" used, never dealer/reseller',
);
const GENERALISED = [/pan-?india/i, /across india/i, /all over india/i, /throughout india/i];
const genHits = [];
for (const f of files) {
  const txt = code(f);
  for (const g of GENERALISED) if (g.test(txt)) genHits.push(`${rel(f)}: ${g}`);
}
ok(genHits.length === 0, 'territory never generalised beyond East and North East India', genHits.join('; '));

// every file that renders CTA copy must pull the full line from copy.ts rather
// than re-typing a shortened variant
const adhoc = [];
for (const f of files) {
  if (f.endsWith('copy.ts')) continue;
  const txt = code(f);
  if (/Authorized Distributor of MOTU/.test(txt)) adhoc.push(rel(f));
}
ok(
  adhoc.length === 0,
  'designation is never re-typed outside copy.ts',
  adhoc.length ? `re-typed in ${adhoc.join(', ')}` : '',
);

// ---- 4b. the full designation actually appears in BOTH parts ------------
// The slim ambient ContactStrip deliberately carries only "Authorized
// Distributor" (the full territory overflowed the strip's 924px box into the
// right margin). So the complete statement has to be carried elsewhere in each
// reel: DistributorBlock mid-reel, and the Outro. Verify both parts do.
const partFiles = {1: path.join(SRC, 'scenes', 'part1.tsx'), 2: path.join(SRC, 'scenes', 'part2.tsx')};
for (const [n, fp] of Object.entries(partFiles)) {
  if (!fs.existsSync(fp)) continue;
  const body = code(fp);
  const hasBlock = /<DistributorBlock\b/.test(body);
  const hasOutro = /<Outro\b/.test(body);
  ok(
    hasBlock && hasOutro,
    `Part ${n} carries the full designation (DistributorBlock + Outro)`,
    `block=${hasBlock} outro=${hasOutro}`,
  );
}
const brandSrc = code(path.join(SRC, 'components', 'Brand.tsx'));
ok(
  /PARTNER_ROLE_STRIP/.test(brandSrc) && !/PARTNER_ROLE_SHORT/.test(brandSrc),
  'ContactStrip uses the strip-sized role label, not the full-territory one',
);
ok(
  /overflow: 'hidden'/.test(brandSrc),
  'ContactStrip clips its own box, so copy cannot spill into a margin',
);

// ---- 5. logo assets -----------------------------------------------------
const ledger = JSON.parse(read(path.join(SRC, 'lib', 'ledger.json')));
const logos = ledger.filter((e) => e.part === 0);
ok(logos.length === 2, 'both logo files are in the ledger as excluded', `${logos.length}`);
ok(
  logos.every((e) => e.slug === null),
  'excluded logos carry no slug, so A() cannot resolve them',
);
const imgDir = path.join(ROOT, 'public', 'img');
const onDisk = fs.existsSync(imgDir) ? fs.readdirSync(imgDir) : [];
ok(
  !onDisk.some((f) => /logo/i.test(f)),
  'no logo file was copied into public/img',
  onDisk.filter((f) => /logo/i.test(f)).join(', '),
);
// no scene may reference an excluded id
const sceneFiles = files.filter((f) => /scenes[/\\]/.test(f));
const logoIds = new Set(logos.map((e) => e.id));
const logoRefs = [];
for (const f of sceneFiles) {
  const txt = read(f);
  for (const m of txt.matchAll(/\bid=\{(\d+)\}/g)) {
    if (logoIds.has(Number(m[1]))) logoRefs.push(`${rel(f)}: id ${m[1]}`);
  }
}
ok(logoRefs.length === 0, 'no scene references an excluded logo id', logoRefs.join('; '));

// ---- 6. quality-tier framing -------------------------------------------
const TIER_PHRASES = [
  /\bentry[- ]level\b/i,
  /\bbudget (option|model|choice)\b/i,
  /\bcheaper?\b/i,
  /\bthe cheap one\b/i,
  /\blesser\b/i,
  /\bcompromise on (sound|audio|quality|fidelity)\b/i,
  /\bstep up to better (sound|audio)\b/i,
  /\bbetter sound(ing)? than\b/i,
  /\binferior\b/i,
];
const tierHits = [];
for (const f of files) {
  const body = code(f);
  for (const p of TIER_PHRASES) if (p.test(body)) tierHits.push(`${rel(f)}: ${p}`);
}
ok(tierHits.length === 0, 'no quality-tier framing of the M2 or M4', tierHits.join('; '));

// ---- 7. verified MOP figures -------------------------------------------
const WANT = {M2: '₹26,900', M4: '₹32,900', M6: '₹55,900'};
const mopBlock = copyRaw.match(/export const MOP = \{([\s\S]*?)\} as const;/);
ok(Boolean(mopBlock), 'MOP table present in copy.ts');
if (mopBlock) {
  for (const [k, v] of Object.entries(WANT)) {
    ok(new RegExp(`${k}:\\s*'${v}'`).test(mopBlock[1]), `MOP ${k} = ${v}`);
  }
}
ok(/MOP, incl\. GST/.test(copyRaw), 'MOP suffix wording "MOP, incl. GST" present');

// any rupee figure anywhere must be one of the three verified values
const rupeeHits = new Set();
for (const f of files) {
  for (const m of code(f).matchAll(/₹[\d,]+/g)) rupeeHits.add(m[0]);
}
const stray = [...rupeeHits].filter((r) => !Object.values(WANT).includes(r));
ok(stray.length === 0, 'no unverified rupee figure appears', stray.join(', '));

// ---- 8. no-crop rule ----------------------------------------------------
const coverHits = [];
for (const f of files) {
  // Stage.tsx's ambient wash is the one sanctioned use: it is blurred to 40px
  // and carries no readable detail by design.
  if (/Stage\.tsx$/.test(f)) continue;
  for (const m of code(f).matchAll(/objectFit:\s*['"]cover['"]/g)) {
    coverHits.push(`${rel(f)} @${m.index}`);
  }
}
ok(
  coverHits.length === 0,
  "objectFit:'cover' not used on any content image",
  coverHits.join('; '),
);
const media = code(path.join(SRC, 'components', 'Media.tsx'));
ok(/fit = 'contain'/.test(media), "Media.Shot defaults to objectFit:'contain'");

// scenes must go through the aspect-solving wrappers, not raw <Img>
const rawImg = sceneFiles.filter((f) => /<Img\b/.test(code(f))).map(rel);
ok(rawImg.length === 0, 'scenes never place a raw <Img>', rawImg.join(', '));

console.log('='.repeat(66));
console.log(`${fails.length} failure(s)`);
for (const n of notes) console.log(`  · ${n}`);
for (const e of fails) console.log(`  ✗ ${e}`);
if (!fails.length) console.log('\nALL BRANDING & COPY CHECKS PASSED');
process.exit(fails.length ? 1 : 0);
