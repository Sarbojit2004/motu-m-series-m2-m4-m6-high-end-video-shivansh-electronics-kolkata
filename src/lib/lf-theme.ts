// Design tokens for the 298-second MOTU M-Series long-form video.
//
// LANDSCAPE 1920x1080, LIGHT BACKGROUND, FULL-FRAME.
//
// The palette, the type families and the accent are REUSED VERBATIM from the
// companion reel series (src/lib/theme.ts) rather than re-derived. Long-form
// Section 6a directs exactly that when the reel series already exists: the two
// formats are one visual identity, and independently re-deriving would risk a
// slightly different result for no gain. Colour tokens are re-exported from
// the reel theme below so there is a single source of truth — editing the reel
// palette moves both formats together, by construction.
//
// WHAT DIFFERS FROM THE REELS
//
//  · Canvas is 1920x1080, not 1080x1920.
//  · There is NO reserved caption box and no top/bottom exclusion zone. The
//    only geometric contract is a modest side inset so nothing critical is
//    clipped by a downstream re-encode or crop.
//  · Type steps up ~1.35x, because a landscape frame is viewed larger and the
//    reel sizes were tuned for a phone held close.
//  · Logos ARE placed here, constantly and deliberately (Section 9) — the
//    exact opposite of the reels' no-added-logo rule. See components/lf/Logo.

import {C, F, FPS} from './theme';

export {C, F, FPS};

export const LF_CANVAS = {w: 1920, h: 1080} as const;

/** 298.000 s at 30 fps. */
export const LF_TOTAL_FRAMES = 8940;

/**
 * Edge inset for anything critical.
 *
 * Section 2 asks for "roughly 40-60px inboard from the true edges" so no
 * critical text or callout risks being clipped downstream. PAD is the hard
 * floor the audit enforces; real compositions sit further in than this (the
 * content rect below), so PAD is a safety net rather than a working margin.
 * Background and ambient imagery may still run to the true edge.
 */
export const LF_PAD = 56;

/** The working content rect — deliberately more generous than LF_PAD. */
export const LF_CONTENT = {
  x: 104,
  y: 84,
  w: LF_CANVAS.w - 104 * 2, // 1712
  h: LF_CANVAS.h - 84 * 2, // 912
} as const;

/** Convenience: the right and bottom edges of the content rect. */
export const LF_RIGHT = LF_CONTENT.x + LF_CONTENT.w; // 1816
export const LF_BOTTOM = LF_CONTENT.y + LF_CONTENT.h; // 996

// ---------------------------------------------------------------------------
// TYPE SCALE — landscape
//
// The reels' hierarchy, stepped up for a frame viewed at desktop/TV size.
// Section 6b sets the bar at "instantly, comfortably readable" and says to
// size up when in doubt, so these are deliberately large.
// ---------------------------------------------------------------------------
// Sizes were tuned DOWN from a first pass (display 104, sub 40) after
// scripts/lf_edge_audit.py caught two left columns walking off the bottom of
// the frame: headlines and body copy both wrapped to more lines than the
// stack budgeted for. At 1080p these are still far above Section 6b's
// "instantly, comfortably readable" bar — 92px display is ~8.5% of frame
// height, 34px body ~3.1%.
export const T = {
  hero: 118, // chapter-opening statement
  display: 92, // scene headline
  displaySm: 72, // secondary headline
  sub: 34, // subheadline — the "why this matters" line
  body: 32, // body copy
  spec: 28, // technical figure
  // Hero technical figure. Only safe for SHORT values — `SpecCard` drops to
  // `spec + 16` for anything longer, because "ESS Sabre32 Ultra™" set at 68px
  // ran a card off the bottom of the frame and out through the side.
  specBig: 68,
  kicker: 25, // all-caps eyebrow
  micro: 21, // micro callout / label
  chip: 23, // chip / tag
} as const;

// ---------------------------------------------------------------------------
// CHAPTERS
//
// Brief Section 12's long-form ratio (~40% shared engine + M2, ~25% M4,
// ~25% M6, ~10% CTA) scaled to 298 s and then adjusted against real beat
// content and the 30-asset coverage requirement, as Section 0a instructs
// rather than applying a blind scale factor:
//
//   engine + M2 combined  108 s  36%   (brief ~40%)
//   M4                     60 s  20%
//   M6                     64 s  21%   — most distinct workflow features AND
//                                        the most assets (12 of 30)
//   CTA                    26 s   9%   (brief ~10%)
//   open + heritage        40 s  13%   — the brief wants MOTU's 1980 pedigree
//                                        established; long-form has the room
//
// Every boundary lands on an exact 2-second musical bar line, so the music
// bed's chapter arc and the picture change together.
// ---------------------------------------------------------------------------
export type ChapterId = 'open' | 'engine' | 'm2' | 'm4' | 'm6' | 'cta';

export const CHAPTERS: {id: ChapterId; label: string; from: number; dur: number}[] = [
  {id: 'open', label: 'The promise', from: 0, dur: 1200},
  {id: 'engine', label: 'The shared engine', from: 1200, dur: 1560},
  {id: 'm2', label: 'MOTU M2', from: 2760, dur: 1680},
  {id: 'm4', label: 'MOTU M4', from: 4440, dur: 1800},
  {id: 'm6', label: 'MOTU M6', from: 6240, dur: 1920},
  {id: 'cta', label: 'Where to buy', from: 8160, dur: 780},
];

// ---------------------------------------------------------------------------
// SCENE TABLE — the single source of truth for timing. Sums to 8940.
// ---------------------------------------------------------------------------
export type LFScene = {id: string; dur: number; label: string; ch: ChapterId};

export const LF_SCENES: LFScene[] = [
  // -- ch1 open + heritage — 1200 ----------------------------------------
  {id: 'L01', ch: 'open', dur: 300, label: 'Hook — one engine, three sizes'},
  {id: 'L02', ch: 'open', dur: 280, label: 'The choice creators are handed'},
  {id: 'L03', ch: 'open', dur: 320, label: 'MOTU — Cambridge, Massachusetts, 1980'},
  {id: 'L04', ch: 'open', dur: 300, label: 'The M-Series premise'},

  // -- ch2 the shared engine — 1560 --------------------------------------
  {id: 'L05', ch: 'engine', dur: 300, label: 'ESS Sabre32 Ultra DAC'},
  {id: 'L06', ch: 'engine', dur: 280, label: '120 dB dynamic range'},
  {id: 'L07', ch: 'engine', dur: 270, label: '−129 dBu EIN preamps'},
  {id: 'L08', ch: 'engine', dur: 270, label: '2.5 ms round-trip latency'},
  {id: 'L09', ch: 'engine', dur: 290, label: 'The LCD metering reveal'},
  {id: 'L10', ch: 'engine', dur: 150, label: 'Shared-spec recap'},

  // -- ch3 MOTU M2 — 1680 -------------------------------------------------
  {id: 'L11', ch: 'm2', dur: 300, label: 'MOTU M2 — 2 in / 2 out'},
  {id: 'L12', ch: 'm2', dur: 280, label: 'M2 front panel'},
  {id: 'L13', ch: 'm2', dur: 270, label: 'M2 rear I/O'},
  {id: 'L14', ch: 'm2', dur: 330, label: 'Loopback signal path'},
  {id: 'L15', ch: 'm2', dur: 280, label: 'DC-coupled outputs — CV / modular'},
  {id: 'L16', ch: 'm2', dur: 220, label: 'M2 in the world · MOP'},

  // -- ch4 MOTU M4 — 1800 -------------------------------------------------
  {id: 'L17', ch: 'm4', dur: 200, label: 'I/O expansion slide → M4'},
  {id: 'L18', ch: 'm4', dur: 300, label: 'MOTU M4 — 4 in / 4 out'},
  {id: 'L19', ch: 'm4', dur: 290, label: 'Rear line inputs — no repatching'},
  {id: 'L20', ch: 'm4', dur: 330, label: 'The Input Monitor Mix knob'},
  {id: 'L21', ch: 'm4', dur: 330, label: 'M4 workflows'},
  {id: 'L22', ch: 'm4', dur: 350, label: 'M4 · MOP · branding beat'},

  // -- ch5 MOTU M6 — 1920 -------------------------------------------------
  {id: 'L23', ch: 'm6', dur: 180, label: 'I/O expansion slide → M6'},
  {id: 'L24', ch: 'm6', dur: 290, label: 'MOTU M6 — four mic preamps'},
  {id: 'L25', ch: 'm6', dur: 260, label: 'Tracking a kit'},
  {id: 'L26', ch: 'm6', dur: 270, label: 'A panel, a duo, a room'},
  {id: 'L27', ch: 'm6', dur: 260, label: 'A/B monitor switching'},
  {id: 'L28', ch: 'm6', dur: 250, label: 'Dual headphone outputs · cue mixing'},
  {id: 'L29', ch: 'm6', dur: 240, label: 'Standalone DC power'},
  {id: 'L30', ch: 'm6', dur: 170, label: 'M6 · MOP · branding beat'},

  // -- ch6 close — 780 ----------------------------------------------------
  {id: 'L31', ch: 'cta', dur: 190, label: 'What is in every box'},
  {id: 'L32', ch: 'cta', dur: 240, label: 'The range — 2, 4, 6'},
  {id: 'L33', ch: 'cta', dur: 350, label: 'CTA & full contact block'},
];

export const lfSceneStart = (id: string): number => {
  let f = 0;
  for (const s of LF_SCENES) {
    if (s.id === id) return f;
    f += s.dur;
  }
  return f;
};

export const lfDuration = (): number => LF_SCENES.reduce((a, s) => a + s.dur, 0);

/** Frame -> seconds, for the audit scripts and the VO script cross-check. */
export const secs = (f: number): number => f / FPS;
