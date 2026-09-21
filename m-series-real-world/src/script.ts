// ─────────────────────────────────────────────────────────────────────────────
// THE SPEECH SCRIPTS — single source of truth for both deliverables.
//
// One file produces the timestamped read-aloud scripts and every on-screen
// caption for both films, so the voice and the picture cannot drift apart.
//
// PACING CARRIED OVER EXACTLY from the AVB series and the UltraLite-mk5 / 828
// films, by instruction: 165 words per minute written, a 0.4 s breath between
// segments, a 0.2 s beat after a caption that closes a thought. That lands at
// roughly 154 wpm effective, which is the rate those films were cut to.
//
// WHAT THESE FILMS ARGUE. The M-Series is three sizes of one machine. The
// converters are the same, the preamps are the same, the round trip is the
// same; what changes is how many things you can point at it. So the writing
// never says a bigger box sounds better — it says a bigger box holds a bigger
// room. That is both the honest reading of the specification and the more
// useful thing for someone deciding.
//
// EVERY NUMBER SPOKEN HERE IS IN theme.ts:SPEC and was checked against dealer
// and trade documentation first. Anything not in that table is not said.
//
// NO COMPETITOR is named, alluded to or implied. Where the writing contrasts,
// it contrasts with an outcome — a take you cannot use — never with another
// manufacturer.
//
// NO PRICING. Not a figure, not a currency, not a comparison, in either film,
// by instruction.
//
// NO BRANDING in any caption. Shivansh Electronics and MOTU appear only on the
// end screen — six seconds on the reel, ten on the explainer.
// ─────────────────────────────────────────────────────────────────────────────

import type { AccentKey } from "./theme.ts";

/** Words per minute the scripts are written to. */
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
  /** How many words this really is when read aloud (numerals and model names expand). */
  sw?: number;
  /** Hold an extra beat after this caption. */
  beat?: boolean;
};

export type Segment = {
  id: string;
  accent: AccentKey;
  /** The chapter name, carried by the standing ProductRule in both films. */
  chapter: string;
  /**
   * The one-line claim this chapter actually makes, striped under its name.
   * The chapter name alone does not differentiate anything — "THE GAIN" could
   * be any chapter of any film. The claim is what tells a viewer landing on a
   * random frame what is being argued.
   */
  spec?: string;
  captions: Caption[];
};

// ═════════════════════════════════════════════════════════════════════════════
// THE 90-SECOND VERTICAL REEL
//
// A reel is watched in a feed with a thumb hovering, so it opens inside a
// failure rather than on a product. "The take was right, the recording wasn't"
// is a thing that has happened to everyone who would buy one of these, and it
// is the only sentence in the film that needs no explaining.
// ═════════════════════════════════════════════════════════════════════════════

export const REEL_SEGMENTS: Segment[] = [
  {
    id: "hook",
    accent: "shared",
    chapter: "M-SERIES",
    spec: "THE TAKE YOU ONLY GET ONCE",
    captions: [
      { t: "You only find out afterwards.", e: "afterwards" },
      { t: "The take was right.", e: "right" },
      { t: "The recording wasn't.", e: "wasn't", beat: true },
      { t: "And you cannot record it again.", e: "again" },
      { t: "And the room has gone home.", e: "gone home", beat: true },
    ],
  },
  {
    id: "range",
    accent: "shared",
    chapter: "THREE SIZES",
    spec: "2 IN · 4 IN · 6 IN",
    captions: [
      { t: "Three interfaces.", e: "Three" },
      { t: "Two in. Four in. Six in.", e: "Six", sw: 6 },
      { t: "One goes in a backpack.", e: "backpack" },
      { t: "One runs a four-microphone table.", e: "four-microphone", sw: 7 },
      { t: "Underneath, they are the same machine.", e: "same machine", beat: true },
    ],
  },
  {
    id: "signal",
    accent: "signal",
    chapter: "THE SIGNAL",
    spec: "ESS SABRE32 ULTRA · 120 dB",
    captions: [
      { t: "The converter does not change with the size.", e: "does not change" },
      { t: "ESS Sabre32 Ultra, in all three.", e: "Sabre32", sw: 8 },
      { t: "A hundred and twenty decibels of dynamic range.", e: "twenty", sw: 9 },
      { t: "The quietest thing you can record,", e: "quietest" },
      { t: "and the loudest, in the same take.", e: "same take", beat: true },
    ],
  },
  {
    id: "gain",
    accent: "gain",
    chapter: "THE GAIN",
    spec: "−129 dBu EIN · ALL THREE",
    captions: [
      { t: "Four preamps on the six. Two on the others.", e: "Four", sw: 10 },
      { t: "All of them measure minus one twenty-nine dBu.", e: "minus", sw: 11 },
      { t: "That is what the microphone hears", e: "hears" },
      { t: "when nothing at all is happening.", e: "nothing", beat: true },
    ],
  },
  {
    id: "latency",
    accent: "latency",
    chapter: "LATENCY",
    spec: "2.5 ms ROUND TRIP",
    captions: [
      { t: "Two and a half milliseconds, in and back out.", e: "and back", sw: 10 },
      { t: "Sing into it and hear yourself.", e: "yourself" },
      { t: "Not an echo of yourself.", e: "echo", beat: true },
      { t: "Play a soft synth like it is hardware.", e: "hardware", beat: true },
    ],
  },
  {
    id: "room",
    accent: "room",
    chapter: "THE ROOM",
    spec: "ONE ENGINE · EVERY ROOM",
    captions: [
      { t: "A bedroom at midnight, one guitar.", e: "midnight" },
      { t: "Four people around a table, four microphones.", e: "Four", sw: 8 },
      { t: "A band playing live, all of it at once.", e: "at once" },
      { t: "A hall, with the doors about to open.", e: "doors" },
      { t: "The same converters in every one.", e: "every one", beat: true },
    ],
  },
  {
    id: "close",
    accent: "shared",
    chapter: "M-SERIES",
    spec: "M2 · M4 · M6",
    captions: [
      { t: "You do not step up to a better sound.", e: "better sound" },
      { t: "The sound was never the thing you were missing.", e: "never", beat: true },
      { t: "You step up to a bigger room.", e: "bigger room", beat: true },
      { t: "M2. M4. M6.", e: "M6", sw: 6, beat: true },
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// THE FIVE-MINUTE LANDSCAPE EXPLAINER
//
// The reel makes the argument. This film proves it, in the order someone
// actually decides: first what is shared (so the choice is never about sound
// quality), then what differs (so the choice is about the work), then the
// three machines in the rooms they belong in, then how to pick.
//
// Chapters six, seven and eight are deliberately written as places rather than
// as feature lists, because that is what the footage is.
// ═════════════════════════════════════════════════════════════════════════════

export const VIDEO_SEGMENTS: Segment[] = [
  {
    id: "open",
    accent: "shared",
    chapter: "THE PROBLEM",
    spec: "THE ONE LINK YOU CANNOT REDO",
    captions: [
      { t: "Everything about a recording is recoverable", e: "recoverable" },
      { t: "except the recording.", e: "except", beat: true },
      { t: "You can re-mix it. You can re-edit it.", e: "re-mix" },
      { t: "You can sit with it for a week.", e: "a week" },
      { t: "What you cannot do is go back", e: "cannot" },
      { t: "and put a better converter in front of a take", e: "better converter" },
      { t: "that has already happened.", e: "already", beat: true },
      { t: "So the interface is not the accessory.", e: "not the accessory" },
      { t: "It is the part of the chain", e: "the part" },
      { t: "that you only get one attempt at.", e: "one attempt", beat: true },
    ],
  },
  {
    id: "range",
    accent: "shared",
    chapter: "THREE SIZES",
    spec: "2 IN · 4 IN · 6 IN",
    captions: [
      { t: "There are three of them.", e: "three" },
      { t: "Two in and two out.", e: "Two", sw: 5 },
      { t: "Four in and four out.", e: "Four", sw: 5 },
      { t: "Six in and four out.", e: "Six", sw: 5, beat: true },
      { t: "The smallest takes a microphone and a guitar", e: "a guitar" },
      { t: "and draws all its power down one USB-C cable.", e: "one cable", sw: 11 },
      { t: "The largest carries four microphone preamps", e: "four preamps", sw: 7 },
      { t: "and two separate headphone outputs.", e: "two", sw: 6, beat: true },
      { t: "That is the entire difference between them.", e: "entire", beat: true },
    ],
  },
  {
    id: "signal",
    accent: "signal",
    chapter: "THE SIGNAL",
    spec: "ESS SABRE32 ULTRA · 120 dB",
    captions: [
      { t: "Because the converter is the same in all three.", e: "the same" },
      { t: "ESS Sabre32 Ultra.", e: "Sabre32", sw: 5 },
      { t: "A hundred and twenty decibels of dynamic range", e: "twenty", sw: 8 },
      { t: "on the outputs of every one of them.", e: "every one", beat: true },
      { t: "Dynamic range is the distance", e: "distance" },
      { t: "between the softest thing the converter can hear", e: "softest" },
      { t: "and the loudest thing it can hold without breaking.", e: "without breaking", beat: true },
      { t: "A hundred and twenty decibels is a very long way.", e: "long way", sw: 10 },
      { t: "It means a fingertip on a string", e: "fingertip" },
      { t: "and the snare that follows it", e: "snare" },
      { t: "can live in the same file, at the same setting.", e: "same file", beat: true },
    ],
  },
  {
    id: "gain",
    accent: "gain",
    chapter: "THE GAIN",
    spec: "−129 dBu EIN · ALL THREE",
    captions: [
      { t: "The preamps are the same as well.", e: "the same" },
      { t: "Minus one hundred and twenty-nine dBu", e: "Minus", sw: 7 },
      { t: "of equivalent input noise.", e: "noise", beat: true },
      { t: "That number is the sound of the preamp itself", e: "the preamp itself" },
      { t: "with nothing plugged into it.", e: "nothing" },
      { t: "The floor underneath everything you record.", e: "floor", beat: true },
      { t: "It matters most on the quiet microphones.", e: "quiet" },
      { t: "A ribbon on a room. A dynamic on a voice", e: "ribbon" },
      { t: "that is being spoken rather than projected.", e: "spoken", beat: true },
      { t: "Those are the ones that ask for real gain,", e: "real gain" },
      { t: "and hear everything you do not want them to.", e: "everything", beat: true },
    ],
  },
  {
    id: "latency",
    accent: "latency",
    chapter: "THE ROUND TRIP",
    spec: "2.5 ms ROUND TRIP",
    captions: [
      { t: "Two and a half milliseconds.", e: "Two and a half", sw: 5 },
      { t: "In, through the computer, and back out.", e: "and back out", beat: true },
      { t: "At twenty-four bit, ninety-six kilohertz,", e: "twenty-four", sw: 7 },
      { t: "on a thirty-two sample buffer.", e: "thirty-two", sw: 6, beat: true },
      { t: "Two and a half milliseconds is the delay", e: "the delay", sw: 8 },
      { t: "of standing about three feet from your own amplifier.", e: "three feet", sw: 10 },
      { t: "Which is to say you will not notice it,", e: "not notice" },
      { t: "and that is the whole point.", e: "whole point", beat: true },
      { t: "You stop performing around the equipment", e: "stop performing" },
      { t: "and go back to performing.", e: "performing", beat: true },
    ],
  },
  {
    id: "monitor",
    accent: "monitor",
    chapter: "HEARING IT",
    spec: "DIRECT MONITORING · FULL-COLOUR METERS",
    captions: [
      { t: "All of which you have to be able to hear.", e: "hear", beat: true },
      { t: "Every input has a button marked MON.", e: "MON", sw: 7 },
      { t: "Press it and that input goes straight to the outputs,", e: "straight" },
      { t: "through the hardware, around the computer entirely.", e: "around the computer", beat: true },
      { t: "Nothing you sing can arrive late,", e: "arrive late" },
      { t: "because nothing you sing is going anywhere first.", e: "anywhere first", beat: true },
      { t: "On the four and the six there is a knob as well,", e: "a knob", sw: 12 },
      { t: "marked input at one end and playback at the other,", e: "playback" },
      { t: "so you can sit yourself inside the track", e: "inside" },
      { t: "instead of on top of it.", e: "on top", beat: true },
      { t: "And the screen is not decoration.", e: "not decoration" },
      { t: "Full colour, every channel, in and out at once.", e: "every channel" },
      { t: "You see a signal clipping before you hear it.", e: "before", beat: true },
    ],
  },
  {
    id: "m2",
    accent: "room",
    chapter: "THE SMALLEST ROOM",
    spec: "2 IN / 2 OUT · BUS POWERED",
    captions: [
      { t: "So: which one.", e: "which one", beat: true },
      { t: "Two inputs is a voice and an instrument.", e: "a voice", sw: 8 },
      { t: "It is a songwriter at a desk at midnight.", e: "midnight" },
      { t: "It is a field recordist on a tailgate", e: "tailgate" },
      { t: "with no mains power anywhere in sight.", e: "no mains", beat: true },
      { t: "One cable carries the audio and the power both,", e: "One cable" },
      { t: "so the whole rig is a laptop, a microphone,", e: "the whole rig" },
      { t: "and something that fits in the lid of the case.", e: "fits", beat: true },
    ],
  },
  {
    id: "m4",
    accent: "room",
    chapter: "THE WORKING ROOM",
    spec: "4 IN / 4 OUT · INPUT-PLAYBACK MIX",
    captions: [
      { t: "Four in and four out is a desk that has grown.", e: "grown", sw: 10 },
      { t: "Two microphone inputs on the front,", e: "on the front", sw: 6 },
      { t: "two line inputs on the back", e: "on the back", sw: 6 },
      { t: "for the synthesiser that never gets unplugged.", e: "never", beat: true },
      { t: "Four outputs means a second pair of monitors,", e: "a second pair", sw: 8 },
      { t: "or a feed to a camera,", e: "a camera" },
      { t: "or a headphone mix for somebody else in the room.", e: "somebody else", beat: true },
      { t: "It is the one that stops you re-patching.", e: "re-patching", beat: true },
    ],
  },
  {
    id: "m6",
    accent: "room",
    chapter: "THE FULL ROOM",
    spec: "6 IN / 4 OUT · 4 PREAMPS · 2 HEADPHONES",
    captions: [
      { t: "Six in and four out is other people.", e: "other people", sw: 8 },
      { t: "Four microphone preamps, each with its own gain", e: "its own gain", sw: 8 },
      { t: "and its own phantom power.", e: "phantom", beat: true },
      { t: "That is four people at a table,", e: "four people", sw: 7 },
      { t: "all recorded separately, all fixable separately.", e: "separately", beat: true },
      { t: "It is a drum kit that still sounds like a drum kit.", e: "drum kit" },
      { t: "It is a band playing at the same time", e: "at the same time" },
      { t: "because that is the only way they play well.", e: "play well", beat: true },
      { t: "And two headphone outputs, which sounds small", e: "two", sw: 8 },
      { t: "until there are two of you.", e: "two of you", sw: 6, beat: true },
    ],
  },
  {
    id: "choose",
    accent: "monitor",
    chapter: "CHOOSING",
    spec: "THE CHOICE IS A COUNT",
    captions: [
      { t: "Which means the choice is not about quality.", e: "not about quality" },
      { t: "It cannot be. The quality is identical.", e: "identical", beat: true },
      { t: "The choice is a count.", e: "a count" },
      { t: "How many things need to be happening at once,", e: "at once" },
      { t: "and how many people need to hear it.", e: "hear it", beat: true },
      { t: "Answer those two and the model picks itself.", e: "picks itself", sw: 9, beat: true },
      { t: "And whichever you answer,", e: "whichever" },
      { t: "the converters, the preamps and the round trip", e: "the round trip" },
      { t: "are the ones you would have chosen anyway.", e: "anyway", beat: true },
    ],
  },
  {
    id: "close",
    accent: "shared",
    chapter: "M-SERIES",
    spec: "M2 · M4 · M6",
    captions: [
      { t: "You do not step up to a better sound.", e: "better sound" },
      { t: "The sound was never the thing you were missing.", e: "never", beat: true },
      { t: "You step up to a bigger room.", e: "bigger room", beat: true },
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// THE TIMELINE
//
// Every duration in both films is DERIVED from this, never typed. A caption's
// length on screen is how long its words take to say at WPM, plus its beat;
// a chapter is its captions end to end, plus a breath. Editing a line re-times
// the picture that sits under it, because the shot plan pins shots to caption
// indices rather than to timestamps.
// ═════════════════════════════════════════════════════════════════════════════

/** Words as actually SPOKEN — "M6" is two words, "120" is four. */
export const spokenWords = (c: Caption): number =>
  c.sw ?? c.t.trim().split(/\s+/).filter(Boolean).length;

export type TimedCaption = Caption & { start: number; end: number; i: number };

export type TimedSegment = Omit<Segment, "captions"> & {
  start: number;
  end: number;
  words: number;
  captions: TimedCaption[];
};

export const buildTimeline = (
  segments: Segment[],
): { segments: TimedSegment[]; total: number; words: number } => {
  let t = 0;
  let words = 0;
  const out = segments.map((seg) => {
    const start = t;
    let segWords = 0;
    const captions = seg.captions.map((c, i) => {
      const w = spokenWords(c);
      segWords += w;
      const dur = (w / WPM) * 60 + (c.beat ? BEAT : 0);
      const cap: TimedCaption = { ...c, i, start: t, end: t + dur };
      t += dur;
      return cap;
    });
    words += segWords;
    const end = t;
    t += SEGMENT_GAP;
    return { ...seg, start, end, words: segWords, captions };
  });
  return { segments: out, total: t - SEGMENT_GAP, words };
};
