#!/usr/bin/env node
/**
 * Cut the RATATA track to the reel.
 *
 * The reel takes 90.000s of the source starting at t=20.2438s - the track's
 * beat 31 - so reel t=0 lands exactly on a beat and the three product
 * movements change where the track itself changes section:
 *
 *   source 57.02s -> reel 36.77s   first drop-out        -> M2 ends, M4 opens
 *   source 76.37s -> reel 56.13s   big pre-chorus drop   -> M4 ends, M6 opens
 *   source 109.93s -> reel 89.69s  the hard break        -> the final frames
 *
 * Nothing is time-stretched: the cut is a straight trim, so the grid the reel
 * is edited against is the track's own.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");
const REPO = resolve(PROJ, "..");

const FFMPEG = process.env.FFMPEG_BIN ?? "ffmpeg";
const FFPROBE = process.env.FFPROBE_BIN ?? "ffprobe";

const SRC = join(REPO, "Leo - Ratata Video  Thalapathy Vijay  Anirudh Ravichander.mp3");
const OUT_DIR = join(PROJ, "public", "audio");
const OUT = join(OUT_DIR, "montage-bed.mp3");

const START = 20.2438;
const DURATION = 90.0;
const FADE_IN = 0.05;      // just enough to kill the splice click
const FADE_OUT = 0.22;     // the reel ends inside the track's own break

if (!existsSync(SRC)) {
  console.error(`missing source track: ${SRC}`);
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

// The bundled ffmpeg build has a reduced filter set (no afade), so the tiny
// splice fades are applied as a volume envelope, which is always compiled in.
const env =
  `volume=volume='min(1\\,t/${FADE_IN})*min(1\\,(${DURATION}-t)/${FADE_OUT})':eval=frame`;

execFileSync(
  FFMPEG,
  [
    "-y", "-v", "error",
    "-ss", String(START),
    "-t", String(DURATION),
    "-i", SRC,
    "-af", env,
    "-c:a", "libmp3lame", "-b:a", "256k", "-ar", "44100", "-ac", "2",
    OUT,
  ],
  { stdio: "inherit" }
);

const probe = JSON.parse(
  execFileSync(FFPROBE, [
    "-v", "error", "-print_format", "json",
    "-show_entries", "format=duration:stream=sample_rate,channels,codec_name",
    OUT,
  ]).toString()
);
const dur = Number(probe.format.duration);
const st = probe.streams[0];

console.log(`music bed  ${OUT}`);
console.log(`  source    ${START}s .. ${(START + DURATION).toFixed(4)}s`);
console.log(`  duration  ${dur.toFixed(3)}s  (target ${DURATION.toFixed(3)}s)`);
console.log(`  stream    ${st.codec_name} ${st.sample_rate}Hz ${st.channels}ch`);
console.log(`  size      ${(statSync(OUT).size / 1024).toFixed(0)} KB`);

if (Math.abs(dur - DURATION) > 0.06) {
  console.error(`music bed duration ${dur} != reel duration ${DURATION}`);
  process.exit(1);
}
