// ─────────────────────────────────────────────────────────────────────────────
// FRAMING — proves that no picture in either film is cut.
//
// The defect this exists to catch was a single comparison that read the wrong
// way round and silently cropped 54 photographic shots to a third of their
// width in the vertical film. Nothing failed, nothing warned; the films
// rendered and looked plausible until someone looked at a frame and asked why
// a whole desk had become a corner of a keyboard.
//
// So the geometry is now arithmetic that runs without a browser, and this walks
// EVERY shot in BOTH films, samples the camera across the whole of each one,
// and asserts two things on every sample:
//
//   1. the plate carrying the picture lies entirely inside its stage, so no
//      edge of the picture is ever outside the frame;
//   2. the plate's aspect ratio is the picture's own, so nothing is stretched.
//
// A shot that is allowed to bleed is held to the tolerance instead: it must
// keep at least 92% of its height, or 85% of its width.
//
// Exits non-zero on any failure, so it can gate a render.
// ─────────────────────────────────────────────────────────────────────────────

import { REEL, VIDEO } from "../src/films.ts";
import { FORMATS } from "../src/theme.ts";
import {
  clampToStage, coverKeeps, mayBleed, plateIn, stageFor, stagedCamera,
} from "../src/components/Stage.ts";

const MOVES = ["push", "pull", "trackLeft", "trackRight", "tiltUp", "tiltDown", "orbit"];
const moveFor = (seed) => MOVES[seed % MOVES.length];

const EPS = 0.75; // sub-pixel: a rounded edge is not a crop
let failures = 0;
const fail = (msg) => { failures += 1; console.log(`  FAIL  ${msg}`); };

/** The half-extent of a box of w x h turned by rot degrees and scaled. */
const span = (w, h, scale, rot) => {
  const r = (Math.abs(rot) * Math.PI) / 180;
  return {
    w: (w * Math.cos(r) + h * Math.sin(r)) * scale,
    h: (w * Math.sin(r) + h * Math.cos(r)) * scale,
  };
};

const SAMPLES = 41;

for (const film of [REEL, VIDEO]) {
  const fmt = FORMATS[film.id];
  const { width: W, height: H, fps } = fmt;
  const stage = stageFor(fmt, W, H);
  const frameAr = W / H;

  let bled = 0, staged = 0, worstBleed = 1, tightest = Infinity, motion = [];

  console.log(`\n${film.id.toUpperCase()}  ${W}x${H}   stage ${Math.round(stage.w)}x${Math.round(stage.h)} at y=${Math.round(stage.y)}`);

  for (const shot of film.shots) {
    const kind = shot.kind ?? "bleed";
    if (kind !== "bleed" && kind !== "clip") continue;

    // placeShots resolves each reference into the asset record itself.
    const src = kind === "clip" ? shot.clip : shot.asset;
    if (!src) continue; // a clip that has not been downloaded yet
    const ar = src.ar;
    const where = `${film.id} ${src.slug} ar=${ar.toFixed(3)}`;

    if (mayBleed(ar, frameAr)) {
      bled += 1;
      const { axis, keep } = coverKeeps(ar, frameAr);
      worstBleed = Math.min(worstBleed, keep);
      const tol = axis === "width" ? 0.85 : 0.92;
      if (keep < tol - 1e-9) fail(`${where} bled but keeps only ${(keep * 100).toFixed(1)}% of its ${axis}`);
      continue;
    }

    staged += 1;
    const plate = plateIn(stage, ar);

    // The plate must carry the picture's own shape, or the picture is squeezed.
    const plateAr = plate.w / plate.h;
    if (Math.abs(plateAr - ar) > 0.002) fail(`${where} plate is ${plateAr.toFixed(4)}:1, picture is ${ar.toFixed(4)}:1`);

    const len = Math.max(1, Math.round((shot.end - shot.start) * fps));
    let minSlackX = Infinity, minSlackY = Infinity, travel = 0;
    let prev = null;

    for (let i = 0; i < SAMPLES; i += 1) {
      const p = i / (SAMPLES - 1);
      const f = Math.round(p * len);
      const raw = stagedCamera(moveFor(shot.seed), p, f, shot.seed, stage, plate);
      const cam = clampToStage(raw, stage, plate);
      const s = span(plate.w, plate.h, cam.scale, cam.rot);

      // Distance from each plate edge to the matching stage edge.
      const slackX = stage.w / 2 - (Math.abs(cam.x) + s.w / 2);
      const slackY = stage.h / 2 - (Math.abs(cam.y) + s.h / 2);
      if (slackX < -EPS) fail(`${where} p=${p.toFixed(2)} overruns the stage by ${(-slackX).toFixed(1)} px horizontally`);
      if (slackY < -EPS) fail(`${where} p=${p.toFixed(2)} overruns the stage by ${(-slackY).toFixed(1)} px vertically`);
      minSlackX = Math.min(minSlackX, slackX);
      minSlackY = Math.min(minSlackY, slackY);

      // The stage itself must lie inside the frame.
      if (stage.x < -EPS || stage.y < -EPS || stage.x + stage.w > W + EPS || stage.y + stage.h > H + EPS)
        fail(`${film.id} stage is outside the frame`);

      const now = { x: cam.x, y: cam.y, s: cam.scale };
      if (prev) travel += Math.hypot(now.x - prev.x, now.y - prev.y) + Math.abs(now.s - prev.s) * plate.w;
      prev = now;
    }

    tightest = Math.min(tightest, minSlackX, minSlackY);
    motion.push(travel);
    if (travel < plate.w * 0.02)
      fail(`${where} barely moves: ${travel.toFixed(0)} px of travel over the shot`);
  }

  motion.sort((a, b) => a - b);
  const med = motion.length ? motion[Math.floor(motion.length / 2)] : 0;
  console.log(`  ${staged} shots placed complete, ${bled} bled`);
  if (bled) console.log(`  worst bleed keeps ${(worstBleed * 100).toFixed(1)}% of the picture`);
  if (staged) {
    console.log(`  tightest clearance to the stage edge: ${tightest.toFixed(1)} px`);
    console.log(`  camera travel per shot: min ${motion[0].toFixed(0)} px, median ${med.toFixed(0)} px, max ${motion[motion.length - 1].toFixed(0)} px`);
  }
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nEvery picture in both films is shown complete.");
process.exit(failures ? 1 : 0);
