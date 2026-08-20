// Section 9, Layer 2 — the FOUR sounds this project synthesizes, and only those.
//
// Every prior build in this workflow synthesized its whole transition/foley
// palette because none existed. That is no longer true: five real, finished
// sound files now ship in the MOTU AVB ecosystem repository, and this project
// REUSES them directly (see scripts/copy-assets.mjs and src/assets.ts).
//
// These four are synthesized because the AVB set genuinely does not cover them:
//
//   xlr-lock     An XLR barrel locking into a combo jack is metallic with a
//                sprung latch. `rj45-snap` is a PLASTIC network-latch — the
//                wrong physical object. This is exactly the compact-desktop-
//                versus-rack-connector case Section 9 anticipates.
//   usbc-seat    The M-Series is USB-C bus-powered; a rack unit has no
//                equivalent gesture and the AVB set has no equivalent sound.
//   counter-tick The committed AVB five contain no short tick at all, and the
//                animated spec counters need one.
//   panel-air    A band-limited transition marker. Deliberately NOT a whoosh.
//
// Character rules, unchanged from the workflow: precise, physical, high-
// frequency, everything high-passed at 900 Hz or above so nothing competes with
// the music bed. No large cinematic low-frequency whooshes anywhere.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/audio/sfx/new");
mkdirSync(OUT, { recursive: true });

const SR = 48000;
const buf = (sec) => new Float32Array(Math.round(SR * sec));
const decay = (i, n, tau) => Math.exp((-i / n) * tau);

/** Raised-cosine fade so nothing starts or ends on a discontinuity. */
function deClick(x, ms = 3) {
  const n = Math.min(Math.round((ms / 1000) * SR), Math.floor(x.length / 2));
  for (let i = 0; i < n; i++) {
    const g = 0.5 - 0.5 * Math.cos((Math.PI * i) / n);
    x[i] *= g;
    x[x.length - 1 - i] *= g;
  }
  return x;
}

/** Transposed-direct-form-II biquad. */
function biquad(x, b0, b1, b2, a1, a2) {
  let z1 = 0, z2 = 0;
  const y = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const out = b0 * x[i] + z1;
    z1 = b1 * x[i] - a1 * out + z2;
    z2 = b2 * x[i] - a2 * out;
    y[i] = out;
  }
  return y;
}
function hp(x, f, q = 0.707) {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
  const a0 = 1 + a;
  return biquad(x, (1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0, (-2 * c) / a0, (1 - a) / a0);
}
function bp(x, f, q = 4) {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
  const a0 = 1 + a;
  return biquad(x, a / a0, 0, -a / a0, (-2 * c) / a0, (1 - a) / a0);
}

/** Deterministic PRNG so every build produces byte-identical SFX. */
function rng(seed) {
  let s = seed >>> 0;
  return () => (((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1);
}
function noise(sec, seed) {
  const x = buf(sec), r = rng(seed);
  for (let i = 0; i < x.length; i++) x[i] = r();
  return x;
}
/** Damped sine partial — the body of every metallic/resonant element. */
function partial(x, freq, tau, amp, phase = 0) {
  for (let i = 0; i < x.length; i++) {
    x[i] += amp * Math.sin((2 * Math.PI * freq * i) / SR + phase) * decay(i, x.length, tau);
  }
  return x;
}
function mix(target, src, gain = 1, offsetSec = 0) {
  const off = Math.round(offsetSec * SR);
  for (let i = 0; i < src.length; i++) {
    const j = i + off;
    if (j >= 0 && j < target.length) target[j] += src[i] * gain;
  }
  return target;
}
function normalize(x, peak = 0.9) {
  let m = 0;
  for (const v of x) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < x.length; i++) x[i] = (x[i] / m) * peak;
  return x;
}

/** 48 kHz / 16-bit / stereo WAV, matching the reused AVB files exactly. */
function writeWav(name, mono, width = 0.12) {
  const n = mono.length;
  const data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const d = Math.max(0, i - Math.round(width * 0.001 * SR));
    const l = Math.max(-1, Math.min(1, mono[i]));
    const r = Math.max(-1, Math.min(1, mono[d]));
    data.writeInt16LE((l * 32767) | 0, i * 4);
    data.writeInt16LE((r * 32767) | 0, i * 4 + 2);
  }
  const head = Buffer.alloc(44);
  head.write("RIFF", 0);
  head.writeUInt32LE(36 + data.length, 4);
  head.write("WAVE", 8);
  head.write("fmt ", 12);
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20);
  head.writeUInt16LE(2, 22);
  head.writeUInt32LE(SR, 24);
  head.writeUInt32LE(SR * 4, 28);
  head.writeUInt16LE(4, 32);
  head.writeUInt16LE(16, 34);
  head.write("data", 36);
  head.writeUInt32LE(data.length, 40);
  writeFileSync(resolve(OUT, `${name}.wav`), Buffer.concat([head, data]));
  return { name, sec: +(n / SR).toFixed(3) };
}

/**
 * XLR barrel seating into a combo jack, then the latch springing home.
 * Brighter and more metallic than the RJ-45's plastic body, and the latch
 * lands later (a mic connector travels further than a network plug).
 */
function xlrLock() {
  const x = buf(0.26);
  // barrel sliding into the collar — short, dry, metallic scrape
  mix(x, deClick(normalize(bp(noise(0.030, 8101), 3400, 1.6), 0.55), 2), 0.62, 0);
  // the shell bottoming out
  const seat = buf(0.10);
  partial(seat, 2180, 16, 0.46);
  partial(seat, 3520, 20, 0.26);
  partial(seat, 5410, 25, 0.12);
  mix(x, deClick(seat, 1), 0.85, 0.042);
  // sprung latch
  const latch = buf(0.09);
  partial(latch, 2960, 19, 0.42);
  partial(latch, 4780, 24, 0.20);
  mix(x, deClick(latch, 1), 0.7, 0.108);
  return deClick(normalize(hp(x, 1100), 0.84), 2);
}

/**
 * USB-C seating. Small, damped and close-mic'd — the sound of a 7-inch desktop
 * box, not a rack rail. Short body, no ring: the connector is tiny and the
 * shell absorbs it.
 */
function usbcSeat() {
  const x = buf(0.11);
  mix(x, deClick(normalize(bp(noise(0.008, 4242), 4200, 2.4), 0.7), 1), 0.6, 0);
  const body = buf(0.055);
  partial(body, 1980, 26, 0.40);
  partial(body, 3160, 30, 0.18);
  partial(body, 4900, 34, 0.07);
  mix(x, deClick(body, 1), 0.8, 0.010);
  return deClick(normalize(hp(hp(x, 1250), 1250), 0.7), 1.5);
}

/** Very short relay/logic tick for the animated spec counters. */
function counterTick() {
  const x = buf(0.028);
  mix(x, hp(noise(0.004, 6161), 3200), 0.5);
  partial(x, 6400, 26, 0.34);
  return deClick(normalize(hp(x, 2000), 0.66), 1);
}

/**
 * Panel move — deliberately NOT a whoosh. Band-limited air 3-9 kHz, very short,
 * so it marks a transition without occupying the bed's register.
 */
function panelAir(sec = 0.44, seed = 909) {
  let x = noise(sec, seed);
  x = bp(x, 5200, 0.9);
  x = hp(x, 2600);
  const n = x.length;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    x[i] *= Math.sin(Math.PI * t) ** 2.2 * (0.6 + 0.4 * t);
  }
  return deClick(normalize(x, 0.4), 12);
}

const built = [
  writeWav("xlr-lock", xlrLock()),
  writeWav("usbc-seat", usbcSeat()),
  writeWav("counter-tick", counterTick()),
  writeWav("panel-air", panelAir()),
];

console.log(`sfx: ${built.length} NEW files synthesized -> public/audio/sfx/new/`);
for (const b of built) console.log(`   ${b.name.padEnd(14)} ${b.sec}s`);
console.log("     (five further sounds are REUSED from the AVB repository, not regenerated)");
