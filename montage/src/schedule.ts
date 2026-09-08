/**
 * The shot list.
 *
 * Every beat boundary below is an integer index on the RATATA grid, so the
 * three product movements change exactly where the track changes section:
 *
 *   beat  57  = reel 36.77s  the track's first drop-out
 *   beat  87  = reel 56.13s  the big pre-chorus drop-out
 *   beat 128  = reel 82.58s  into the closing bars
 *   beat 138  = reel 89.06s  the track's loudest hit, where branding lands
 *
 * Hold times fall out of that: M2 averages 5.2 beats (3.37s) per composition,
 * M4 4.3 (2.77s) and M6 4.6 (2.94s) - the deliberate-to-faster gradient the
 * brief calls for, all inside the reference's 2.5-3.5s band.
 */

export type Layout =
  | "hero"
  | "band"
  | "plateHigh"
  | "plateLow"
  | "bleedType"
  | "stack"
  | "quiet";

export type Shot = {
  key: string;
  /** inclusive start beat */
  from: number;
  /** exclusive end beat */
  to: number;
  /** catalog id of the photograph this composition is built on */
  img: string;
  /** second photograph, shown as a small tilted printed tile */
  tile?: string;
  layout: Layout;
  /** giant display lines, revealed letter by letter */
  head?: string[];
  /** index of the head line rendered in crimson */
  accent?: number;
  /** boxed sticker labels */
  tag?: string;
  tag2?: string;
  /** hand-drawn circle annotation sweeps in around the headline */
  note?: boolean;
  /** hand-drawn star doodle */
  star?: boolean;
  /** hard flash-to-white on entry */
  flash?: boolean;
  /** contact block (WhatsApp + website) - the one mid-reel branding repeat */
  contact?: boolean;
  paper: 0 | 1 | 2 | 3;
  streak: 0 | 1 | 2;
  /** which way the composition leans, so neighbours do not repeat */
  lean: -1 | 1;
};

export const COLD_OPEN: [number, number] = [0, 10];
export const CLOSE: [number, number] = [128, 139.5];

export const SHOTS: Shot[] = [
  // ---------------------------------------------------------------- M2 -----
  { key: "m2-1", from: 10, to: 16, img: "m2-hero", layout: "hero",
    head: ["MOTU", "M2"], accent: 1, tag: "TWO IN", note: true, flash: true,
    paper: 0, streak: 0, lean: -1 },
  { key: "m2-2", from: 16, to: 21, img: "m2-front", layout: "band",
    head: ["STRAIGHT", "IN"], accent: 1, tag: "TURN IT UP",
    paper: 1, streak: 1, lean: 1 },
  { key: "m2-3", from: 21, to: 26, img: "m2-desk", layout: "plateHigh",
    head: ["A DESK", "IS A", "STUDIO"], accent: 2,
    paper: 2, streak: 0, lean: -1 },
  { key: "m2-4", from: 26, to: 31, img: "m2-glass", layout: "plateLow",
    tag: "PRESS RECORD", star: true, paper: 0, streak: 2, lean: 1 },
  { key: "m2-5", from: 31, to: 37, img: "m2-amp", layout: "bleedType",
    head: ["THE AMP", "IN THE", "ROOM"], accent: 0, tag: "PLUGGED",
    paper: 3, streak: 1, lean: -1 },
  { key: "m2-6", from: 37, to: 42, img: "m2-window", layout: "plateHigh",
    head: ["WHEREVER", "YOU WORK"], accent: 1,
    paper: 1, streak: 0, lean: 1 },
  { key: "m2-7", from: 42, to: 47, img: "m2-keys", layout: "quiet",
    tag: "HANDS DOWN", paper: 2, streak: 2, lean: -1 },
  { key: "m2-8", from: 47, to: 52, img: "m2-rear", layout: "band",
    head: ["ONE CABLE", "OUT"], accent: 1, tag: "AND GO",
    paper: 0, streak: 1, lean: 1 },
  { key: "m2-9", from: 52, to: 57, img: "m2-pod", layout: "stack",
    head: ["SAY IT", "ONCE"], accent: 1, tag: "ROOM READY", note: true,
    paper: 3, streak: 0, lean: -1 },

  // ---------------------------------------------------------------- M4 -----
  { key: "m4-1", from: 57, to: 62, img: "m4-hero", layout: "hero",
    head: ["MOTU", "M4"], accent: 1, tag: "FOUR IN", note: true, flash: true,
    paper: 1, streak: 2, lean: 1 },
  { key: "m4-2", from: 62, to: 66, img: "m4-front", layout: "band",
    head: ["TWO MORE"], accent: 0, tag: "MORE LANES",
    paper: 2, streak: 0, lean: -1 },
  { key: "m4-3", from: 66, to: 70, img: "m4-wood", layout: "plateLow",
    head: ["ROOM TO", "MOVE"], accent: 1, paper: 0, streak: 1, lean: 1 },
  { key: "m4-4", from: 70, to: 75, img: "m4-drums", layout: "plateHigh",
    tag: "MIC THE KIT", star: true, paper: 3, streak: 2, lean: -1 },
  { key: "m4-5", from: 75, to: 79, img: "m4-synth", layout: "bleedType",
    head: ["PLAY IT", "LIVE"], accent: 1, paper: 1, streak: 0, lean: 1 },
  { key: "m4-6", from: 79, to: 83, img: "m4-brick", tile: "m4-rear",
    layout: "stack", head: ["OUT AND", "BACK"], accent: 1, tag: "PATCH IT",
    paper: 2, streak: 1, lean: -1 },
  { key: "m4-7", from: 83, to: 87, img: "m4-room", tile: "m4-soft",
    layout: "stack", head: ["SAME ENGINE", "MORE ROOM"], accent: 1,
    contact: true, paper: 0, streak: 2, lean: 1 },

  // ---------------------------------------------------------------- M6 -----
  { key: "m6-1", from: 87, to: 92, img: "m6-front", layout: "hero",
    head: ["MOTU", "M6"], accent: 1, tag: "SIX IN", note: true, flash: true,
    paper: 3, streak: 0, lean: -1 },
  { key: "m6-2", from: 92, to: 96, img: "m6-hero", layout: "plateLow",
    head: ["ALL SIX", "AT ONCE"], accent: 1, paper: 1, streak: 1, lean: 1 },
  { key: "m6-3", from: 96, to: 101, img: "m6-night", tile: "m6-ui",
    layout: "stack", tag: "EYES ON IT", tag2: "LATE SHIFT",
    paper: 2, streak: 2, lean: -1 },
  { key: "m6-4", from: 101, to: 105, img: "m6-pod3", layout: "plateHigh",
    head: ["EVERY VOICE", "ITS OWN LANE"], accent: 1,
    paper: 0, streak: 0, lean: 1 },
  { key: "m6-5", from: 105, to: 110, img: "m6-desk", layout: "quiet",
    tag: "ROOM TONE", paper: 3, streak: 1, lean: -1 },
  { key: "m6-6", from: 110, to: 114, img: "m6-kit", layout: "plateHigh",
    head: ["MIC THE", "WHOLE KIT"], accent: 1, star: true,
    paper: 1, streak: 2, lean: 1 },
  { key: "m6-7", from: 114, to: 119, img: "m6-studio", tile: "m6-rear",
    layout: "stack", head: ["ALL SIX", "BACK"], accent: 1, tag: "LINE OUT",
    paper: 2, streak: 0, lean: -1 },
  { key: "m6-8", from: 119, to: 123, img: "m6-home", tile: "m6-couch",
    layout: "stack", head: ["THE WHOLE", "ROOM"], accent: 1,
    paper: 0, streak: 1, lean: 1 },
  { key: "m6-9", from: 123, to: 128, img: "m6-live", layout: "bleedType",
    head: ["TAKE IT", "TO THE", "ROOM"], accent: 2, note: true,
    paper: 3, streak: 2, lean: -1 },
];

/** Fragment crops used by the cold open and the closing callback. */
export const FRAGMENTS = {
  open: ["m2-hero", "m6-front", "m4-wood", "m6-live", "m2-keys", "m4-hero"],
  close: ["m2-hero", "m6-ui", "m4-hero", "m6-live", "m6-front", "m4-synth"],
};
