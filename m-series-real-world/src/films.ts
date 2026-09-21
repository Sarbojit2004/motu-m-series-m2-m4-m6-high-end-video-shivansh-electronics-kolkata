// ─────────────────────────────────────────────────────────────────────────────
// THE TWO DELIVERABLES, assembled from the script and the shot plan.
//
// Nothing here is a number someone chose. The timeline comes from how long the
// words take to say; the shots come from which caption they are pinned to; the
// composition's length is the timeline plus the end screen, rounded to a frame.
// Editing a caption re-times both films and moves the picture with it.
// ─────────────────────────────────────────────────────────────────────────────

import { FORMATS, type FormatId } from "./theme.ts";
import { REEL_SEGMENTS, VIDEO_SEGMENTS, buildTimeline, type TimedSegment } from "./script.ts";
import { REEL_SHOTS, VIDEO_SHOTS, placeShots, type ResolvedShot } from "./shots.ts";

export type Film = {
  id: FormatId;
  segments: TimedSegment[];
  shots: ResolvedShot[];
  /** When the narration ends and the end screen begins. */
  speechEnd: number;
  outroSeconds: number;
  total: number;
  durationInFrames: number;
  words: number;
  /** The mastered stems, both already at unity — see scripts/gen_audio.py. */
  bed: string;
  transitions: string;
  vo: string;
};

const assemble = (id: FormatId): Film => {
  const fmt = FORMATS[id];
  const isReel = id === "reel";
  const tl = buildTimeline(isReel ? REEL_SEGMENTS : VIDEO_SEGMENTS);
  // `from` is honoured only in the reel: the reel takes each deployment's main
  // section, the explainer plays every one complete from its first frame.
  const shots = placeShots(tl.segments, isReel ? REEL_SHOTS : VIDEO_SHOTS, isReel);
  const total = tl.total + fmt.outroSeconds;
  return {
    id,
    segments: tl.segments,
    shots,
    speechEnd: tl.total,
    outroSeconds: fmt.outroSeconds,
    total,
    durationInFrames: Math.round(total * fmt.fps),
    words: tl.words,
    bed: `audio/music-bed-${id}.mp3`,
    transitions: `audio/transitions-${id}.wav`,
    vo: `vo/vo-${id}.wav`,
  };
};

export const REEL = assemble("reel");
export const VIDEO = assemble("video");

export const filmFor = (width: number, height: number): Film =>
  height >= width ? REEL : VIDEO;
