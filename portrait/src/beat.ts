import { VIDEO } from "./theme";
import type { SfxKey } from "./assets";
import type { BrandMode } from "./components/Brand";
import type { Enter } from "./components/Shell";

/** One beat of the long-form. A beat ends when its point has been made. */
export type Beat = {
  id: string;
  ch: number;
  sec: number;
  kind:
    | "coldOpen"
    | "editorial"
    | "ecosystemMontage"
    | "macroReveal"
    | "portSweep"
    | "heroSplit"
    | "montage"
    | "titleCard"
    | "capacity"
    | "counters"
    | "specGrid"
    | "lcd"
    | "loopback"
    | "cv"
    | "software"
    | "macroPair"
    | "fitFill"
    | "rapidSeq"
    | "stackDuo"
    | "brandBeat"
    | "price"
    | "contact"
    | "outro";
  images: number[];
  eyebrow?: string;
  heading?: string;
  sub?: string;
  serif?: boolean;
  labels?: string[];
  cols?: number;
  specs?: { label: string; value: string }[];
  counters?: { to: number; suffix?: string; prefix?: string; label: string; decimals?: number }[];
  pills?: string[];
  product?: "m2" | "m4" | "m6";
  focal?: [number, number];
  macroScale?: number;
  /** ecosystemMontage only — frames each member holds the frame alone. */
  soloHold?: number;
  alert?: boolean;
  /** Entrance style (Section 2 — transition variety across 34 beats). */
  enter?: Enter;
  brand: BrandMode;
  motu?: boolean;
  detail?: string;
  sfx: SfxKey;
};

export const frames = (sec: number): number => Math.round(sec * VIDEO.fps);

export const starts = (beats: Beat[]): number[] => {
  const out: number[] = [];
  let acc = 0;
  for (const b of beats) {
    out.push(acc);
    acc += frames(b.sec);
  }
  return out;
};

export const totalFrames = (beats: Beat[]): number =>
  beats.reduce((a, b) => a + frames(b.sec), 0);

/** One stem's deployment inside a chapter. */
export type MusicPlan = {
  ch: number;
  track: string;
  stems: readonly { slug: string; gain: number; from?: number }[];
};
