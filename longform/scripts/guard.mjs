// Section 10 checkpoint 5 / 17 — content integrity, run on the same data that
// renders the video.
//
// Fails the build on: any other audio-interface brand, any TASCAM mention, any
// unrelated Shivansh brand relationship, any rounded/blended price, or a
// runtime that does not land on target.
import { loadSchedule } from "./_load.mjs";

const { BEATS, TOTAL_FRAMES, VIDEO, PRICE, BRAND } = await loadSchedule();

// Matched on WORD BOUNDARIES. Substring matching produced a false positive on
// the first run: "rme" is inside "Perfo(rme)r Lite", which is MOTU's own
// bundled DAW. Short brand tokens must never match mid-word.
const BANNED_BRANDS = [
  "tascam", "focusrite", "scarlett", "presonus", "audient", "universal audio",
  "apollo", "ssl", "solid state logic", "behringer", "steinberg", "ur22",
  "arturia", "rme", "babyface", "zoom", "native instruments", "komplete audio",
  "roland", "yamaha", "akai", "m-audio", "esi", "antelope", "apogee",
].map((b) => ({
  name: b,
  re: new RegExp(`\\b${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"),
}));

/** Every string that actually reaches the screen. */
const text = [];
for (const b of BEATS) {
  for (const k of ["eyebrow", "heading", "sub", "detail"]) if (b[k]) text.push([b.id, k, b[k]]);
  (b.labels ?? []).forEach((l, i) => text.push([b.id, `labels[${i}]`, l]));
  (b.pills ?? []).forEach((p, i) => text.push([b.id, `pills[${i}]`, p]));
  (b.specs ?? []).forEach((s, i) => text.push([b.id, `specs[${i}]`, `${s.label} ${s.value}`]));
  (b.counters ?? []).forEach((c, i) => text.push([b.id, `counters[${i}]`, `${c.label} ${c.suffix ?? ""}`]));
}
// Copy that lives in components rather than the schedule.
text.push(["theme", "BRAND.role", BRAND.role]);
text.push(["theme", "BRAND.region", BRAND.region]);
text.push(["theme", "PRICE.bestPrice", PRICE.bestPrice]);

let fail = 0;
const bad = (msg) => {
  console.log(`  FAIL ${msg}`);
  fail++;
};

console.log("\nBANNED BRAND SCAN");
for (const [id, key, v] of text) {
  for (const brand of BANNED_BRANDS) {
    if (brand.re.test(String(v))) bad(`${id}.${key} mentions "${brand.name}": ${v}`);
  }
}
console.log(`  scanned ${text.length} on-screen strings across ${BEATS.length} beats — ${fail === 0 ? "clean" : `${fail} hit(s)`}`);

console.log("\nPRICE INTEGRITY (Section 1, Facts 1 + 2)");
const EXPECT = { m2: "Rs. 26,900", m4: "Rs. 32,900", m6: "Rs. 55,900" };
for (const [k, v] of Object.entries(EXPECT)) {
  if (PRICE[k] !== v) bad(`PRICE.${k} is "${PRICE[k]}", expected "${v}"`);
  else console.log(`  ok   PRICE.${k} = ${v}`);
}
if (!/incl/i.test(PRICE.note) || !/GST/i.test(PRICE.note)) bad(`PRICE.note must state MOP inclusive of GST: "${PRICE.note}"`);
else console.log(`  ok   PRICE.note = ${PRICE.note}`);

// No blended / rounded / "starting from" language anywhere.
const BLENDED = [/starting\s+(from|at)/i, /\bfrom\s+Rs\.?\s*\d/i, /\bRs\.?\s*\d+\s*[-–]\s*\d/i, /onwards/i];
for (const [id, key, v] of [...text, ["theme", "PRICE.note", PRICE.note]]) {
  for (const re of BLENDED) if (re.test(String(v))) bad(`${id}.${key} uses blended/"starting from" price language: ${v}`);
}
// Any Rs. figure on screen must be one of the three exact MOPs.
const ALLOWED = new Set(Object.values(EXPECT));
for (const [id, key, v] of text) {
  for (const m of String(v).matchAll(/Rs\.?\s*[\d,]+/g)) {
    const norm = m[0].replace(/Rs\.?\s*/, "Rs. ");
    if (!ALLOWED.has(norm)) bad(`${id}.${key} shows a price that is not one of the three MOPs: ${m[0]}`);
  }
}
console.log("  ok   no blended, rounded or 'starting from' price language");

console.log("\nDISTRIBUTOR DESIGNATION (Section 1, Fact 3)");
const ROLE = "Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces";
const REGION = "East and North East India";
if (BRAND.role !== ROLE) bad(`BRAND.role drifted: "${BRAND.role}"`);
else console.log(`  ok   ${ROLE}`);
if (BRAND.region !== REGION) bad(`BRAND.region drifted: "${BRAND.region}"`);
else console.log(`  ok   for ${REGION}`);
if (BRAND.website !== "www.shivanshelectronics.in") bad(`BRAND.website drifted: "${BRAND.website}"`);
else console.log(`  ok   ${BRAND.website}`);

console.log("\nRUNTIME");
if (TOTAL_FRAMES !== VIDEO.durationInFrames) bad(`schedule is ${TOTAL_FRAMES} frames, target ${VIDEO.durationInFrames}`);
else console.log(`  ok   ${TOTAL_FRAMES} frames = ${(TOTAL_FRAMES / VIDEO.fps).toFixed(3)}s at ${VIDEO.fps}fps`);

console.log("\nPACING (Section 5)");
const secs = BEATS.map((b) => b.sec);
const longest = Math.max(...secs);
const avg = secs.reduce((a, b) => a + b, 0) / secs.length;
console.log(`  ${BEATS.length} beats · average ${avg.toFixed(2)}s · longest ${longest}s · shortest ${Math.min(...secs)}s`);
if (longest / (TOTAL_FRAMES / VIDEO.fps) > 0.05) bad(`longest beat ${longest}s is over 5% of runtime`);
else console.log(`  ok   longest beat is ${((longest / (TOTAL_FRAMES / VIDEO.fps)) * 100).toFixed(1)}% of runtime`);

console.log(fail === 0 ? "\nGUARD: PASS\n" : `\nGUARD: ${fail} FAILURE(S)\n`);
process.exit(fail === 0 ? 0 : 1);
