// Stages every runtime asset into public/. Pure Node — no Python, no network —
// so the delivered project zip reproduces the render with npm install alone.
//
// Sources:
//   images  : this repository's own raw MOTU M2/M4/M6 photography (Section 0.1)
//   logos   : this repository's own supplied logo pair
//   fonts   : ../_shared/fonts (Archivo + Fraunces, the AVB type system)
//   sfx     : ../_shared/sfx/reuse — the five REAL sound files pulled directly
//             from the MOTU AVB ecosystem repository (Section 9, Role B)
//   music   : ../_shared/music — stems from the AVB repository's sound-effects/
import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");
const PUB = resolve(PROJ, "public");

/**
 * Two supported layouts, so the delivered zip reproduces the render on its own:
 *
 *   repo : sources live one level up (the M-Series repository root) and in
 *          ../_shared, which is how this project is developed.
 *   zip  : sources are vendored INSIDE the project as ./assets and ./_shared,
 *          which is how scripts/make-zip.mjs packages it.
 */
const REPO = existsSync(resolve(PROJ, "assets")) ? resolve(PROJ, "assets") : resolve(PROJ, "..");
const SHARED = existsSync(resolve(PROJ, "_shared"))
  ? resolve(PROJ, "_shared")
  : resolve(PROJ, "../_shared");
console.log(`sources: images <- ${REPO}\n         shared <- ${SHARED}`);

const ASSETS = JSON.parse(readFileSync(resolve(PROJ, "src/asset-manifest.json"), "utf8"));

for (const d of ["img", "logo", "fonts", "audio/sfx/reuse", "audio/sfx/new", "audio/music", "vo"]) {
  mkdirSync(resolve(PUB, d), { recursive: true });
}

const must = (src, label) => {
  if (!existsSync(src)) throw new Error(`Missing ${label}: ${src}`);
  return src;
};

// ------------------------------------------------------------------- images
let n = 0;
ASSETS.forEach((a, i) => {
  const dest = resolve(PUB, "img", `${String(i).padStart(2, "0")}-${a.key}.${a.ext}`);
  copyFileSync(must(resolve(REPO, a.file), `source image ${a.file}`), dest);
  n++;
});
console.log(`images : ${n} curated stills staged`);

// -------------------------------------------------------------------- logos
copyFileSync(must(resolve(REPO, "MOTU LOGO.png"), "MOTU logo"), resolve(PUB, "logo/motu.png"));
copyFileSync(
  must(resolve(REPO, "SHIVANSH ELECTRONICS LOGO FOR VIDEO.png"), "Shivansh logo"),
  resolve(PUB, "logo/shivansh.png")
);
console.log("logos  : 2 staged (used as supplied — opaque, never boxed)");

// -------------------------------------------------------------------- fonts
const FONTS = [
  "archivo-normal.woff2",
  "archivo-italic.woff2",
  "fraunces-normal.woff2",
  "fraunces-italic.woff2",
];
for (const f of FONTS) {
  copyFileSync(must(resolve(SHARED, "fonts", f), `font ${f}`), resolve(PUB, "fonts", f));
}
console.log(`fonts  : ${FONTS.length} staged (Archivo + Fraunces, per Section 7)`);

// ---------------------------------------------------------------------- sfx
const REUSED = ["encoder-click", "talkback-click", "avb-ping", "data-stream", "rj45-snap"];
for (const s of REUSED) {
  copyFileSync(
    must(resolve(SHARED, "sfx/reuse", `${s}.wav`), `reused AVB sfx ${s}`),
    resolve(PUB, "audio/sfx/reuse", `${s}.wav`)
  );
}
console.log(`sfx    : ${REUSED.length} reused straight from the AVB repository`);

// -------------------------------------------------------------------- music
/**
 * PORTRAIT MUSIC — a single unified DIABLO deployment (see src/schedule.ts).
 * Only the four DIABLO stems are staged; the landscape build's Mindscape and
 * Black & Blue chapters have no equivalent here, because this reel runs one
 * continuous track rather than hopping per chapter.
 */
const STEMS = {
  "diablo-bass": "ES_DIABLO STEMS BASS - BLUE STEEL.mp3",
  "diablo-drums": "ES_DIABLO STEMS DRUMS - BLUE STEEL.mp3",
  "diablo-instruments": "ES_DIABLO STEMS INSTRUMENTS - BLUE STEEL.mp3",
  "diablo-melody": "ES_DIABLO STEMS MELODY - BLUE STEEL.mp3",
};
for (const [slug, file] of Object.entries(STEMS)) {
  copyFileSync(
    must(resolve(SHARED, "music", file), `music stem ${file}`),
    resolve(PUB, "audio/music", `${slug}.mp3`)
  );
}
console.log(`music  : ${Object.keys(STEMS).length} stems staged`);

writeFileSync(
  resolve(PUB, "vo/.keep"),
  "Drop the recorded narration here as voiceover-portrait.mp3, then flip HAS_VOICEOVER in src/Audio.tsx.\n"
);
console.log("done.");
