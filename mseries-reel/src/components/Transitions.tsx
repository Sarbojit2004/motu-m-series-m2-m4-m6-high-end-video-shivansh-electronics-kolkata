import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { VIDEO } from "../theme.ts";

// ─────────────────────────────────────────────────────────────────────────────
// TRANSITIONS
//
// Full-bleed shots cannot simply cut: at 2160 x 3840 a hard cut between two
// photographs of near-identical grey chassis reads as a glitch rather than an
// edit. But a plain cross-dissolve on every one of thirty shots reads as a
// slideshow. So every shot arrives under one of eight moves, chosen from the
// shot's own seed, with the larger moves reserved for segment boundaries.
//
// HOW THE OVERLAP WORKS. Each shot's Sequence is extended past its own end by
// the incoming shot's transition length, and the next shot is stacked on top of
// it. So the incoming shot animates in over a still-live outgoing shot — never
// over the background — and nothing ever dips to black between two shots.
//
// WHAT IS DELIBERATELY ABSENT: filter: blur(). At 4K a full-surface Gaussian is
// a convolution over 8.3 million pixels on every frame it runs; on the previous
// build a single 90px text glow cost more than the entire rest of the frame.
// Every move below is transform, opacity, clip-path or a gradient — all of
// which the compositor does cheaply. The motion blur a whip pan wants is
// suggested instead by a travelling accent streak: one linear-gradient div.
// ─────────────────────────────────────────────────────────────────────────────

export type TransitionKind =
  | "fade"
  | "wipeDiag"
  | "whipLeft"
  | "whipRight"
  | "punchIn"
  | "pullBack"
  | "slideUp"
  | "flash";

/** Frames each move takes. Longer than a cut, shorter than a dissolve. */
export const TRANS: Record<TransitionKind, number> = {
  fade: 11,
  wipeDiag: 13,
  whipLeft: 9,
  whipRight: 9,
  punchIn: 8,
  pullBack: 10,
  slideUp: 11,
  flash: 7,
};

/** The biggest moves are held back for the moments the narration also turns. */
const BOUNDARY: TransitionKind[] = ["wipeDiag", "whipLeft", "flash", "whipRight", "slideUp"];
const INSIDE: TransitionKind[] = ["punchIn", "pullBack", "fade", "slideUp", "punchIn", "wipeDiag"];

export const transitionFor = (seed: number, boundary: boolean, first: boolean): TransitionKind => {
  if (first) return "fade";
  return boundary ? BOUNDARY[seed % BOUNDARY.length] : INSIDE[seed % INSIDE.length];
};

/** Which SFX cue belongs under each move. */
export const TRANS_CUE: Record<TransitionKind, string> = {
  fade: "air-pass",
  wipeDiag: "gate-snap",
  whipLeft: "slide-air",
  whipRight: "slide-air",
  punchIn: "impact-soft",
  pullBack: "impact-soft",
  slideUp: "riser-short",
  flash: "chime-lift",
};

const smooth = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
/** Decelerating — the incoming shot arrives fast and settles, never bounces. */
const out = (p: number) => 1 - Math.pow(1 - p, 3);

/** The diagonal the wipe and the split-screen staging share. */
const DIAG_DROP = 22; // % of frame height across 140% of frame width
const DIAG_DEG = -(Math.atan2((DIAG_DROP / 100) * VIDEO.height, 1.4 * VIDEO.width) * 180) / Math.PI;

type Props = {
  kind: TransitionKind;
  /** Frames since this shot began. */
  f: number;
  accent: string;
  children: React.ReactNode;
};

export const TransitionIn: React.FC<Props> = ({ kind, f, accent, children }) => {
  const n = TRANS[kind];
  const raw = Math.min(1, Math.max(0, f / n));

  // Past the move the wrapper is a plain container — no transform, no
  // clip-path, nothing for the compositor to keep re-solving over the
  // remaining hundred frames of the shot.
  if (f >= n) return <AbsoluteFill>{children}</AbsoluteFill>;

  const e = out(raw);
  let style: React.CSSProperties = {};
  let streak: React.ReactNode = null;

  switch (kind) {
    case "fade":
      style = { opacity: smooth(raw) };
      break;

    case "punchIn":
      style = {
        opacity: Math.min(1, raw * 2.2),
        transform: `scale(${interpolate(e, [0, 1], [1.17, 1])})`,
      };
      break;

    case "pullBack":
      style = {
        opacity: Math.min(1, raw * 2),
        transform: `scale(${interpolate(e, [0, 1], [0.86, 1])})`,
      };
      break;

    case "slideUp":
      // A physical slide, so it holds full opacity from the first frame — a
      // fading slide reads as two effects fighting one another.
      style = { transform: `translateY(${interpolate(e, [0, 1], [VIDEO.height, 0])}px)` };
      break;

    case "whipLeft":
    case "whipRight": {
      // whipLeft = the frame flies in from the right and settles left.
      const from = kind === "whipLeft" ? VIDEO.width : -VIDEO.width;
      const x = interpolate(e, [0, 1], [from, 0]);
      style = { transform: `translateX(${x}px)` };
      streak = (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: VIDEO.width * 0.42,
            left: x - (kind === "whipLeft" ? VIDEO.width * 0.42 : -VIDEO.width),
            background: `linear-gradient(${kind === "whipLeft" ? 90 : 270}deg, ${accent}00 0%, ${accent}B0 62%, #FFFFFFE6 100%)`,
            opacity: interpolate(raw, [0, 0.4, 1], [0.85, 0.5, 0]),
          }}
        />
      );
      break;
    }

    case "wipeDiag": {
      // A tilted front sweeping up the frame, revealing the incoming shot
      // below it.
      const a = interpolate(e, [0, 1], [150, -30]);
      const b = a - DIAG_DROP;
      style = { clipPath: `polygon(-20% ${a}%, 120% ${b}%, 120% 220%, -20% 220%)` };
      streak = (
        <div
          style={{
            position: "absolute",
            left: "-20%",
            width: "140%",
            height: 9,
            top: `${(a + b) / 2}%`,
            background: accent,
            boxShadow: `0 0 70px ${accent}`,
            opacity: interpolate(raw, [0, 0.82, 1], [1, 0.85, 0]),
            transform: `rotate(${DIAG_DEG}deg)`,
            transformOrigin: "50% 50%",
          }}
        />
      );
      break;
    }

    case "flash":
    default: {
      style = { opacity: Math.min(1, raw * 3) };
      streak = (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 92% 62% at 50% 46%, #FFFFFF 0%, ${accent} 44%, ${accent}00 78%)`,
            opacity: interpolate(raw, [0, 0.22, 1], [0, 0.58, 0]),
          }}
        />
      );
      break;
    }
  }

  return (
    <>
      <AbsoluteFill style={style}>{children}</AbsoluteFill>
      {streak ? <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>{streak}</AbsoluteFill> : null}
    </>
  );
};
