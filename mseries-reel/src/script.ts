// ─────────────────────────────────────────────────────────────────────────────
// THE SPEECH SCRIPT — single source of truth for this deliverable.
//
// One file produces BOTH the timestamped read-aloud script the client records
// and every on-screen caption, so the two cannot drift apart.
//
// NINETY SECONDS CHANGES THE WRITING, not just the length. The three-minute AVB
// explainer could afford to state its thesis calmly and let the viewer settle
// in. A ninety-second vertical reel is watched in a feed, thumb hovering, and
// it has to earn every one of those seconds. So:
//
//   * It opens on a QUESTION, not a statement. "The same converter. The same
//     preamps. So what actually separates them?" is a hook because the viewer
//     cannot answer it and now wants to.
//   * The answer is deliberately withheld for one beat, then delivered as a
//     counter-intuitive fact: it is NOT sound quality. That reframing is the
//     whole reason to keep watching.
//   * Each product then pays off a specific promise rather than reciting a
//     datasheet — what the extra inputs let you actually DO in a room.
//
// TONE. The client records this himself and describes himself as a plain
// speaker, so there is no rhetoric to perform here: no superlatives, no
// build-up language, no "imagine if". The anticipation is carried by the
// STRUCTURE — an open question, a withheld answer, a widening capability — not
// by the delivery. A plain read of this lands correctly.
//
// No competitor is named, alluded to, or implied anywhere.
// ─────────────────────────────────────────────────────────────────────────────

/** Words per minute the script is written to. */
export const WPM = 165;

/** Gap held after each segment so the reader can breathe and the edit can cut. */
export const SEGMENT_GAP = 0.4;

/** Extra beat after a caption that ends a thought. */
export const BEAT = 0.2;

export type Caption = {
  /** The phrase, exactly as spoken and exactly as captioned on screen. */
  t: string;
  /** The word the script face carries — the term the sentence turns on. */
  e: string;
  /** How many words this really is when read aloud (numerals expand). */
  sw?: number;
  /** Hold an extra beat after this caption. */
  beat?: boolean;
};

export type SegmentId = "hook" | "engine" | "m2" | "m4" | "m6" | "close";

export type Segment = {
  id: SegmentId;
  product: "pm2" | "pm4" | "pm6" | null;
  label: string;
  /** Which background environment this segment lives in. */
  env: "light" | "dark";
  captions: Caption[];
};

export const SEGMENTS: Segment[] = [
  // ── HOOK ───────────────────────────────────────────────────────────────────
  // An open question the viewer cannot answer. Everything after it is the
  // answer arriving in instalments.
  {
    id: "hook",
    product: null,
    label: "MOTU M-Series",
    env: "dark",
    captions: [
      { t: "Three interfaces.", e: "Three" },
      { t: "The same converter.", e: "same" },
      { t: "The same preamps.", e: "preamps" },
      { t: "The same latency.", e: "latency", beat: true },
      { t: "So what actually separates", e: "separates" },
      { t: "the M2, the M4 and the M6?", e: "M6", sw: 8, beat: true },
    ],
  },

  // ── THE ENGINE ─────────────────────────────────────────────────────────────
  // The counter-intuitive answer, then the numbers that back it.
  {
    id: "engine",
    product: null,
    label: "One Engine",
    env: "dark",
    captions: [
      { t: "Not sound quality.", e: "Not", beat: true },
      { t: "All three run the same", e: "All three" },
      { t: "ESS Sabre32 Ultra engine.", e: "Sabre32", sw: 6, beat: true },
      { t: "120 dB of dynamic range.", e: "120 dB", sw: 8 },
      { t: "Minus 129 dBu of input noise.", e: "129", sw: 8 },
      { t: "2.5 milliseconds, round trip.", e: "2.5", sw: 7, beat: true },
      { t: "What changes is how much", e: "how much" },
      { t: "you record at once.", e: "at once", beat: true },
    ],
  },

  // ── M2 ─────────────────────────────────────────────────────────────────────
  {
    id: "m2",
    product: "pm2",
    label: "MOTU M2",
    env: "light",
    captions: [
      { t: "Start with the M2.", e: "M2", sw: 5 },
      { t: "Two combo inputs. Two outputs.", e: "Two", sw: 5 },
      { t: "48 volt phantom on both.", e: "48 volt", sw: 7, beat: true },
      { t: "It runs entirely off the USB-C cable.", e: "USB-C", sw: 9 },
      { t: "Just over a pound on the desk.", e: "a pound", beat: true },
      { t: "The whole studio fits in a bag.", e: "a bag", beat: true },
    ],
  },

  // ── M4 ─────────────────────────────────────────────────────────────────────
  {
    id: "m4",
    product: "pm4",
    label: "MOTU M4",
    env: "dark",
    captions: [
      { t: "The M4 adds two line inputs", e: "M4", sw: 7 },
      { t: "at the back,", e: "back" },
      { t: "and a Mix knob at the front.", e: "Mix knob", beat: true },
      { t: "Blend live input against playback", e: "Blend" },
      { t: "by hand. No routing software.", e: "by hand", beat: true },
      { t: "Two mics stay patched", e: "Two mics" },
      { t: "while a synth records through the rear.", e: "synth", beat: true },
    ],
  },

  // ── M6 ─────────────────────────────────────────────────────────────────────
  {
    id: "m6",
    product: "pm6",
    label: "MOTU M6",
    env: "light",
    captions: [
      { t: "The M6 goes to six.", e: "six", sw: 6 },
      { t: "Four microphone preamps.", e: "Four" },
      { t: "Four gain controls, four phantom switches.", e: "phantom", beat: true },
      { t: "Two headphone outputs,", e: "Two" },
      { t: "each with its own cue mix.", e: "cue mix", beat: true },
      { t: "An A-B switch compares two monitor pairs.", e: "A-B", sw: 9, beat: true },
      { t: "A drum kit, or a four-person panel,", e: "drum kit", sw: 9 },
      { t: "in one pass.", e: "one pass", beat: true },
    ],
  },

  // ── CLOSE ──────────────────────────────────────────────────────────────────
  // Lands the thesis as a buying rule, which is the most useful thing a viewer
  // can take away from ninety seconds.
  {
    id: "close",
    product: null,
    label: "MOTU M-Series",
    env: "dark",
    captions: [
      { t: "Same engine in all three.", e: "Same engine", beat: true },
      { t: "Choose by how many inputs you need.", e: "inputs" },
      { t: "Never by how good it sounds.", e: "Never", beat: true },
      { t: "MOTU M-Series.", e: "M-Series", sw: 4, beat: true },
    ],
  },
];

// ── Derived timing ───────────────────────────────────────────────────────────

export const spokenWords = (c: Caption): number =>
  c.sw ?? c.t.trim().split(/\s+/).length;

export type TimedCaption = Caption & { start: number; end: number; i: number };

export type TimedSegment = Omit<Segment, "captions"> & {
  start: number;
  end: number;
  words: number;
  captions: TimedCaption[];
};

/**
 * Lays every caption on an absolute timeline from its spoken length.
 * No scene duration is ever estimated — it is derived from how long the words
 * take to say, which is what keeps the edit honest to the recorded read.
 */
export const buildTimeline = (): { segments: TimedSegment[]; total: number } => {
  let t = 0;
  const segments = SEGMENTS.map((seg) => {
    const start = t;
    let words = 0;
    const captions = seg.captions.map((c, i) => {
      const w = spokenWords(c);
      words += w;
      const dur = (w / WPM) * 60 + (c.beat ? BEAT : 0);
      const cap: TimedCaption = { ...c, i, start: t, end: t + dur };
      t += dur;
      return cap;
    });
    const end = t;
    t += SEGMENT_GAP;
    return { ...seg, start, end, words, captions };
  });
  return { segments, total: t - SEGMENT_GAP };
};
