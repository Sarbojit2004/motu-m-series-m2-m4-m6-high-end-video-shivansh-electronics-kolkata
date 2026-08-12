import React from 'react';
import {Composition} from 'remotion';
import {CANVAS, FPS, TOTAL_FRAMES} from './lib/theme';
import {Part1Engine} from './Part1';
import {Part2ScaleUp} from './Part2';
import {
  THUMB_FRAMES,
  Thumb1BN,
  Thumb1EN,
  Thumb1HI,
  Thumb2BN,
  Thumb2EN,
  Thumb2HI,
} from './Thumbnails';

/**
 * Compositions.
 *
 * Both reels are independently renderable:
 *   npm run render:p1   -> out/motu-mseries-reel-part1-engine.mp4
 *   npm run render:p2   -> out/motu-mseries-reel-part2-scaleup.mp4
 *
 * The six trilingual thumbnails are separate compositions at the same 1080x1920
 * canvas. They run THUMB_FRAMES long and are captured as a still partway in, so
 * every staged reveal has settled — a still at frame 0 would catch the layout
 * at opacity 0.
 */

const REEL = {
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: CANVAS.w,
  height: CANVAS.h,
} as const;

const THUMB = {
  durationInFrames: THUMB_FRAMES,
  fps: FPS,
  width: CANVAS.w,
  height: CANVAS.h,
} as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Part1Engine" component={Part1Engine} {...REEL} />
    <Composition id="Part2ScaleUp" component={Part2ScaleUp} {...REEL} />

    <Composition id="Thumb1EN" component={Thumb1EN} {...THUMB} />
    <Composition id="Thumb1HI" component={Thumb1HI} {...THUMB} />
    <Composition id="Thumb1BN" component={Thumb1BN} {...THUMB} />
    <Composition id="Thumb2EN" component={Thumb2EN} {...THUMB} />
    <Composition id="Thumb2HI" component={Thumb2HI} {...THUMB} />
    <Composition id="Thumb2BN" component={Thumb2BN} {...THUMB} />
  </>
);
