/**
 * THE MASTER TIMELINE — the one place where the 25 independently-rendered Flick
 * scenes are described as a single 5,340-frame (178.000 s) piece.
 *
 * Flick builds one composition per scene and deliberately no all-scenes
 * composition, so the picture is assembled by concatenating those renders. The
 * two audio layers, however, have to be CONTINUOUS across the whole runtime —
 * a music bed that restarts every 5-9 seconds is not a bed. So both audio
 * layers are authored here against absolute master frames, driven by the same
 * scene-spec.json that drives the picture. Nothing is re-timed by hand.
 */
import spec from "../data/scene-spec.json";

export type SceneSpan = { id: string; from: number; dur: number; end: number };

export const SCENES: SceneSpan[] = (spec as { id: string; durationInFrames: number; from: number }[]).map((s) => ({
  id: s.id,
  from: s.from,
  dur: s.durationInFrames,
  end: s.from + s.durationInFrames,
}));

export const TOTAL_FRAMES = SCENES[SCENES.length - 1].end; // 5,340

/** Absolute master frame of a scene, by id. */
export const at = (id: string): number => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown scene: ${id}`);
  return s.from;
};

/**
 * MUSIC MOVEMENTS — the same single unified DIABLO deployment the approved
 * portrait build used, re-cut to Flick's 25-scene structure so each movement
 * still enters on a musical point rather than mid-phrase.
 *
 *   M1  scenes 1-2    instruments + bass         the problem, stated plainly
 *   M2  scenes 3-6    instruments + bass         the shared engine
 *   M3  scenes 7-11   + drums                    the first product arrives
 *   M4  scenes 12-16  + melody                   2 -> 4 channels
 *   M5  scenes 17-22  all four, melody up        six channels, fullest spectrum
 *   M6  scene 23      drums pulled back          a breath before the CTA
 *   M7  scenes 24-25  all four, full             the close
 */
export type Stem = { slug: string; gain: number; from?: number };
export type Movement = { id: string; start: number; end: number; stems: Stem[] };

export const MOVEMENTS: Movement[] = [
  { id: "M1", start: at("hook-the-difference"), end: at("one-engine-three-sizes"), stems: [
    { slug: "diablo-instruments", gain: 1.0 },
    { slug: "diablo-bass", gain: 0.5, from: 6 },
  ] },
  { id: "M2", start: at("one-engine-three-sizes"), end: at("m2-introduction"), stems: [
    { slug: "diablo-instruments", gain: 1.0, from: 20 },
    { slug: "diablo-bass", gain: 0.6, from: 20 },
  ] },
  { id: "M3", start: at("m2-introduction"), end: at("m4-introduction"), stems: [
    { slug: "diablo-instruments", gain: 0.95, from: 40 },
    { slug: "diablo-bass", gain: 0.66, from: 40 },
    { slug: "diablo-drums", gain: 0.52, from: 40 },
  ] },
  { id: "M4", start: at("m4-introduction"), end: at("m6-introduction"), stems: [
    { slug: "diablo-instruments", gain: 0.92, from: 70 },
    { slug: "diablo-bass", gain: 0.7, from: 70 },
    { slug: "diablo-drums", gain: 0.6, from: 70 },
    { slug: "diablo-melody", gain: 0.66, from: 70 },
  ] },
  { id: "M5", start: at("m6-introduction"), end: at("shared-extras"), stems: [
    { slug: "diablo-instruments", gain: 0.95, from: 100 },
    { slug: "diablo-bass", gain: 0.72, from: 100 },
    { slug: "diablo-drums", gain: 0.68, from: 100 },
    { slug: "diablo-melody", gain: 0.9, from: 100 },
  ] },
  { id: "M6", start: at("shared-extras"), end: at("all-three-prices-and-cta"), stems: [
    { slug: "diablo-instruments", gain: 1.05, from: 140 },
    { slug: "diablo-bass", gain: 0.6, from: 140 },
    { slug: "diablo-melody", gain: 0.6, from: 140 },
  ] },
  { id: "M7", start: at("all-three-prices-and-cta"), end: TOTAL_FRAMES, stems: [
    { slug: "diablo-instruments", gain: 1.0, from: 8 },
    { slug: "diablo-bass", gain: 0.72, from: 8 },
    { slug: "diablo-drums", gain: 0.7, from: 8 },
    { slug: "diablo-melody", gain: 0.85, from: 8 },
  ] },
];

/** Measured stem length (seconds) — all four DIABLO stems are the same cut. */
export const STEM_SECONDS = 170.54;
