import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ACCENT, FONT, GROUND, SAFE, TYPE_OPACITY, VIDEO, sec, type ProductKey } from "./theme.ts";
import { buildTimeline, type SegmentId } from "./script.ts";
import { buildShots, type Shot } from "./shots.ts";
import { Caption } from "./components/Caption.tsx";
import { BleedShot, MosaicBleed, PanelBleed, SplitBleed } from "./components/Staged.tsx";
import {
  TRANS,
  TRANS_CUE,
  TransitionIn,
  transitionFor,
  type TransitionKind,
} from "./components/Transitions.tsx";
import {
  IoLadder,
  LadderCompare,
  LatencyTrace,
  ProductTag,
  ProgressRule,
  ScaleMeter,
  SpecChips,
} from "./components/Demonstratives.tsx";
import { Outro } from "./components/Outro.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// MOTU M-SERIES — 90 s full-bleed vertical reel, 2160 x 3840.
//
// Three data structures drive everything and there is not one hand-typed frame
// number below:
//
//   script.ts  what is said, and when  — spoken word count sets every duration
//   shots.ts   what is shown, and when — derived from the caption groups
//   this file  how it is staged, transitioned, annotated and mixed
//
// THE LAYER STACK, bottom to top:
//
//   1. picture   full-bleed photography, edge to edge, under a camera move.
//                Overlapping sequences so every shot change is a transition
//                rather than a cut.
//   2. scrim     a light gradient across the top eighth only. The overlay in
//                that zone is dense technical text at 64% opacity, and half
//                the product photography is shot on white seamless; without
//                it the spec block would sit on a blown-out field. It is kept
//                to the top, where the subject almost never is.
//   3. overlay   everything typographic — the caption lockup, the product tag,
//                the demonstratives, the spec chips. This ENTIRE layer is held
//                at TYPE_OPACITY, which is where the brief's "36% transparent"
//                lives. One multiplier, applied once, so nothing can drift.
//   4. outro     the end screen, and the only place any brand mark appears.
// ─────────────────────────────────────────────────────────────────────────────

const { segments, total } = buildTimeline();
const { shots } = buildShots();

/** The end screen takes the frame the moment the last word is finished. */
const OUTRO_AT = 83.5;

// ── Shot placement ───────────────────────────────────────────────────────────

type Placed = Shot & { trans: TransitionKind; from: number; to: number };

/**
 * Each shot runs until the next one starts — not until its own caption group
 * ends. The difference is the 0.4 s breath between segments, which would
 * otherwise be a hole in the picture; here the outgoing shot simply holds
 * through it while the narration takes a breath.
 */
const PLACED: Placed[] = shots.map((s, i) => {
  const next = shots[i + 1];
  const firstOfSeg = i === 0 || shots[i - 1].segment !== s.segment;
  return {
    ...s,
    trans: transitionFor(s.seed, firstOfSeg, i === 0),
    from: s.start,
    to: next ? next.start : OUTRO_AT + 0.7,
  };
});

const Stage: React.FC<{ shot: Placed; f: number; dur: number }> = ({ shot, f, dur }) => {
  const p = dur > 0 ? Math.min(1, Math.max(0, f / dur)) : 0;
  const common = { env: shot.env, product: shot.product, p, f, seed: shot.seed };
  const a = shot.assets;
  switch (shot.kind) {
    case "panel":
      return <PanelBleed asset={a[0]} {...common} />;
    case "split":
      return <SplitBleed asset={a[0]} second={a[1] ?? a[0]} {...common} />;
    case "mosaic":
      return <MosaicBleed asset={a[0]} assets={a} lineup={shot.reprise} {...common} />;
    default:
      return <BleedShot asset={a[0]} {...common} />;
  }
};

const ShotLayer: React.FC<{ shot: Placed }> = ({ shot }) => {
  const f = useCurrentFrame();
  const dur = Math.max(1, sec(shot.to) - sec(shot.from));
  return (
    <TransitionIn kind={shot.trans} f={f} accent={ACCENT[shot.product].glow}>
      <Stage shot={shot} f={f} dur={dur} />
    </TransitionIn>
  );
};

// ── The overlay ──────────────────────────────────────────────────────────────

/**
 * The extra product text the brief asked for.
 *
 * Deliberately NOT a restatement of the narration — every chip carries a fact
 * the voice does not have time to say, so a viewer reading the screen and a
 * viewer listening to the voice come away with different halves of the same
 * datasheet. Nothing here is a comparison, and no other manufacturer is named
 * or implied anywhere.
 */
const CHIPS: Record<SegmentId, string[]> = {
  hook: [],
  engine: [
    "FULL-COLOUR LCD METERING",
    "LOOPBACK FOR STREAMING",
    "DC-COUPLED OUTPUTS",
    "CLASS-COMPLIANT USB-C",
  ],
  m2: ["2 COMBO INPUTS", "48V ON BOTH", "USB-C BUS POWER", "5-PIN MIDI IN / OUT", "JUST OVER A POUND"],
  m4: [
    "+2 REAR LINE INPUTS",
    "INPUT MONITOR MIX KNOB",
    "4 DC-COUPLED OUTPUTS",
    "MIRRORED RCA OUT",
    "USB-C BUS POWER",
  ],
  m6: [
    "4 COMBO PREAMPS, REAR",
    "+2 LINE INPUTS",
    "2 HEADPHONE OUTPUTS",
    "A / B MONITOR SWITCH",
    "15V DC INLET",
  ],
  close: [],
};

/** Contiguous windows, so the overlay never has a gap to fall through. */
const WINDOWS = segments.map((s, i) => ({
  id: s.id,
  product: (s.product ?? "shared") as ProductKey,
  start: s.start,
  end: segments[i + 1] ? segments[i + 1].start : OUTRO_AT,
}));

// The engine section's three demonstratives are bound to the captions that
// state them, so a re-timed script moves the graphics with the words.
const ENGINE = segments.find((s) => s.id === "engine")!;
const capStart = (frag: string) => ENGINE.captions.find((c) => c.t.includes(frag))?.start ?? 0;
const T_DR = capStart("120 dB") - 0.15;
const T_EIN = capStart("129") - 0.15;
const T_RTL = capStart("2.5") - 0.15;

const EngineDemo: React.FC<{ t: number; frame: number; width: number }> = ({ t, frame, width }) => {
  if (t >= T_RTL) return <LatencyTrace product="shared" f={frame - sec(T_RTL)} width={width} />;
  if (t >= T_EIN)
    return (
      <ScaleMeter
        title="INPUT NOISE · EIN"
        value={-129}
        min={-140}
        max={0}
        unit="dBu"
        fillFrom="value"
        product="shared"
        f={frame - sec(T_EIN)}
        width={width}
      />
    );
  if (t >= T_DR)
    return (
      <ScaleMeter
        title="DYNAMIC RANGE"
        value={120}
        min={0}
        max={140}
        unit="dB"
        product="shared"
        f={frame - sec(T_DR)}
        width={width}
      />
    );
  return null;
};

const TopBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const w = WINDOWS.find((x) => t >= x.start && t < x.end);
  if (!w) return null;

  const f = frame - sec(w.start);
  const durF = Math.max(1, sec(w.end) - sec(w.start));
  const fade = Math.min(
    interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(f, [durF - 8, durF], [1, 0], { extrapolateLeft: "clamp" }),
  );
  const intro = interpolate(f, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const demo =
    w.id === "engine" ? (
      <EngineDemo t={t} frame={frame} width={SAFE.w} />
    ) : w.id === "close" ? (
      <LadderCompare f={f} width={SAFE.w} />
    ) : w.product === "pm2" || w.product === "pm4" || w.product === "pm6" ? (
      <IoLadder product={w.product} f={f} width={SAFE.w} />
    ) : null;

  const chips = CHIPS[w.id];

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.left,
        top: SAFE.top + 36,
        width: SAFE.w,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 36,
        opacity: fade,
      }}
    >
      <ProductTag product={w.product} intro={intro} />
      {demo}
      {chips.length ? <SpecChips items={chips} product={w.product} f={f} width={SAFE.w} /> : null}
    </div>
  );
};

// ── SFX ──────────────────────────────────────────────────────────────────────

/**
 * The cue sheet, derived rather than typed.
 *
 * Every cue name below is NEW — none of the AVB explainer's palette is reused,
 * and scripts/gen_audio.py synthesises them from different material (see the
 * header there). The two films sit on the same channel and must not share a
 * sound signature any more than they share a colour triad.
 */
type Cue = { at: number; cue: string; gain: number };

const SFX_PLAN: Cue[] = (() => {
  const out: Cue[] = [];

  // One cue under every shot change — the move and the sound are chosen
  // together, so a whip pan is always an air pass and a wipe is always a snap.
  for (const s of PLACED) {
    out.push({ at: Math.max(0, s.from - 0.06), cue: TRANS_CUE[s.trans], gain: 1 });
  }

  for (const seg of segments) {
    // A short riser into each segment, ahead of the first word.
    out.push({ at: Math.max(0, seg.start - 0.45), cue: "riser-short", gain: 1 });

    for (const c of seg.captions) {
      // A near-subliminal mark where a thought lands.
      if (c.beat) out.push({ at: c.start + 0.04, cue: "tick-glass", gain: 1 });
    }

    // The input slots lighting up, one blip each — the one place in the reel
    // where a graphic and a sound are locked frame for frame.
    if (seg.product) {
      const n = { pm2: 2, pm4: 4, pm6: 6 }[seg.product];
      for (let i = 0; i < n; i++) out.push({ at: seg.start + (10 + i * 5) / VIDEO.fps, cue: "count-blip", gain: 1 });
    }
  }

  // The comparison ladder building at the close.
  const close = segments.find((s) => s.id === "close")!;
  for (let i = 0; i < 3; i++) out.push({ at: close.start + (8 + i * 10) / VIDEO.fps, cue: "count-blip", gain: 1 });

  out.push({ at: OUTRO_AT - 0.2, cue: "outro-bloom", gain: 1 });
  return out.sort((a, b) => a.at - b.at);
})();

// ── The composition ──────────────────────────────────────────────────────────

const OutroLayer: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" }) }}>
      <Outro />
    </AbsoluteFill>
  );
};

export const Reel: React.FC = () => {
  const outroFrom = sec(OUTRO_AT);

  return (
    <AbsoluteFill style={{ background: GROUND.dark, fontFamily: FONT.display }}>
      {/* ── 1. picture ─────────────────────────────────────────────────── */}
      {PLACED.map((s, i) => {
        const from = sec(s.from);
        const tail = PLACED[i + 1] ? TRANS[PLACED[i + 1].trans] : 0;
        const dur = Math.max(1, sec(s.to) - from + tail);
        return (
          <Sequence key={s.seed} from={from} durationInFrames={dur}>
            <ShotLayer shot={s} />
          </Sequence>
        );
      })}

      {/* ── 2. scrim, top eighth only ──────────────────────────────────── */}
      <Sequence from={0} durationInFrames={outroFrom}>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(4,4,6,0.66) 0%, rgba(4,4,6,0.48) 26%, rgba(4,4,6,0.18) 62%, rgba(4,4,6,0) 100%)",
            height: VIDEO.height * 0.36,
          }}
        />
      </Sequence>

      {/* ── 3. overlay — the whole typographic layer, at 64% ───────────── */}
      <Sequence from={0} durationInFrames={outroFrom}>
        <AbsoluteFill style={{ opacity: TYPE_OPACITY }}>
          {/* position through the reel, on the safe-box ceiling */}
          <ReelProgress />

          <TopBlock />

          {segments.map((seg) =>
            seg.captions.map((c, i) => (
              <Sequence
                key={`${seg.id}-${i}`}
                from={sec(c.start)}
                durationInFrames={Math.max(1, sec(c.end) - sec(c.start))}
              >
                <div
                  style={{
                    position: "absolute",
                    left: SAFE.left,
                    width: SAFE.w,
                    bottom: SAFE.bottom,
                  }}
                >
                  <Caption
                    caption={c}
                    startFrame={0}
                    product={(seg.product ?? "shared") as ProductKey}
                    env="dark"
                  />
                </div>
              </Sequence>
            )),
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── 4. the end screen ──────────────────────────────────────────── */}
      <Sequence from={outroFrom} durationInFrames={VIDEO.durationInFrames - outroFrom}>
        <OutroLayer />
      </Sequence>

      {/* ── audio ──────────────────────────────────────────────────────── */}
      {/* The narration the client records drops in at this path. A silent
          placeholder of exactly 90.000 s already sits there, so swapping the
          file is the only step — no code change, no re-timing.

          Everything below is already mastered to its final perceived loudness
          by scripts/gen_audio.py — the bed and the reference transition cue at
          -23 LUFS (EBU R128), each cue trimmed relative to the bed. So every
          source plays at unity here: a volume multiplier in the timeline would
          silently undo that mastering, which is exactly what made the previous
          film's bed inaudible at roughly -37 LUFS. */}
      <Audio src={staticFile("audio/vo.wav")} volume={1} />
      <Audio src={staticFile("audio/music-bed.mp3")} volume={1} />

      {SFX_PLAN.map((s, i) => (
        <Sequence key={i} from={sec(s.at)} durationInFrames={75}>
          <Audio src={staticFile(`audio/sfx/${s.cue}.wav`)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Reel position, held across every segment boundary without a blink. */
const ReelProgress: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const w = WINDOWS.find((x) => t >= x.start && t < x.end);
  return (
    <div style={{ position: "absolute", left: SAFE.left, top: SAFE.top, width: SAFE.w }}>
      <ProgressRule p={t / OUTRO_AT} product={w?.product ?? "shared"} />
    </div>
  );
};

export const REEL_TOTAL = total;
export const REEL_OUTRO_AT = OUTRO_AT;
