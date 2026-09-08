/**
 * The reel is cut to the RATATA track's own grid, not to clock seconds.
 *
 * Measured from the source mp3: a rock-solid 93.000 BPM with the first beat at
 * t=0.2438s and no drift beyond +/-0.01s across the whole track. The reel takes
 * the 90 seconds starting at track beat 31, so reel t=0 lands exactly on a beat.
 */
import { FPS } from "./theme";

export const BPM = 93.0;
export const BEAT = 60 / BPM;            // 0.6451613 s
export const BAR = BEAT * 4;             // 2.5806452 s

/** Where the music bed is cut from the source track. */
export const MUSIC_START = 20.2438;
export const REEL_SECONDS = 90;
export const DURATION = Math.round(REEL_SECONDS * FPS);   // 2700

/** Beat index -> frame. Fractional beats are allowed. */
export const bf = (beats: number) => Math.round(beats * BEAT * FPS);

/** Beat index -> seconds. */
export const bs = (beats: number) => beats * BEAT;

/** Frames spanned by n beats, measured from beat `from` so runs stay exact. */
export const span = (from: number, to: number) => bf(to) - bf(from);
