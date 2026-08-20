import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { COLORS, RADII, hexA } from "../theme";
import { img, meta } from "../assets";
import { EASE, ramp, mapClamp, gimbal, inOut } from "../lib/anim";
import { micro } from "../fonts";

/**
 * IMAGE TREATMENT — the rule this whole build exists to honour (Section 3).
 *
 * `Plate` renders with `object-fit: contain`, so the complete product is always
 * visible: nothing is ever permanently cropped, clipped or trimmed to make it
 * fit the runtime. Where an image's aspect ratio does not match its slot, the
 * difference is absorbed by deliberate ground treatment — the light page, a
 * soft well, or a card — never by cutting into the subject.
 *
 * Framing follows the measured background of the source file:
 *   light  -> presented bare; it dissolves into the light page
 *   mixed  -> a soft well, just enough to seat it
 *   dark   -> a deliberate rounded card with a soft shadow, so a dark photo on
 *             a light page reads as an intentional frame
 *
 * Implementation pulled from the approved AVB long-form build's
 * `longform/src/components/Media.tsx` (Section 0.2, Role A).
 */
export type PlateFrame = "auto" | "bare" | "well" | "card";

export const Plate: React.FC<{
  idx: number;
  frame?: PlateFrame;
  radius?: number;
  pad?: number;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ idx, frame = "auto", radius = RADII.card, pad, style, imgStyle, children }) => {
  const m = meta(idx);
  const kind: Exclude<PlateFrame, "auto"> =
    frame !== "auto" ? frame : m.bg === "light" ? "bare" : m.bg === "mixed" ? "well" : "card";
  const padding = pad ?? (kind === "bare" ? 0 : kind === "well" ? 20 : 26);

  const shell: React.CSSProperties =
    kind === "card"
      ? {
          background: COLORS.paperLift,
          border: `1px solid ${COLORS.line}`,
          borderRadius: radius,
          boxShadow: `0 18px 46px ${hexA(COLORS.ink, 0.13)}, 0 2px 8px ${COLORS.shadow}`,
        }
      : kind === "well"
        ? {
            background: hexA(COLORS.paperLift, 0.72),
            border: `1px solid ${hexA(COLORS.ink, 0.07)}`,
            borderRadius: radius,
          }
        : {};

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding,
        ...shell,
        ...style,
      }}
    >
      <Img
        src={img(idx)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain", // <- the complete unit, always
          borderRadius: kind === "card" ? radius - 12 : 0,
          ...imgStyle,
        }}
      />
      {children}
    </div>
  );
};

/**
 * Gimbal micro-movement (Section 3). Continuous sub-pixel drift plus a very
 * shallow scale creep, applied to an already-contained image so the whole unit
 * stays in frame while the shot breathes.
 */
export const Gimbal: React.FC<{
  seed?: number;
  amount?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ seed = 0, amount = 1, children, style }) => {
  const frame = useCurrentFrame();
  const g = gimbal(frame, seed, amount);
  return (
    <div
      style={{
        transform: `translate(${g.x}px, ${g.y}px) scale(${g.scale}) rotate(${g.rot}deg)`,
        willChange: "transform",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * MACRO-TO-FULL-REVEAL (Section 3) — the core hero technique.
 *
 * Opens hard on a specific detail with simulated shallow depth of field, then
 * glides back as focus expands until the complete, uncropped unit is on screen,
 * and holds with a slow continuing drift. Macro phase ~35% of the beat,
 * reveal-and-hold ~65%, the ratio the reference established.
 *
 * The macro phase is a deliberate camera move, not a crop: the reveal always
 * resolves to the entire product within the same beat.
 */
export const MacroReveal: React.FC<{
  idx: number;
  duration: number;
  /** Focal point of the macro phase, 0..1 in image space. */
  fx?: number;
  fy?: number;
  macroScale?: number;
  macroRatio?: number;
  frame?: PlateFrame;
  style?: React.CSSProperties;
}> = ({
  idx,
  duration,
  fx = 0.5,
  fy = 0.5,
  macroScale = 3.1,
  macroRatio = 0.35,
  frame: plateFrame = "auto",
  style,
}) => {
  const frame = useCurrentFrame();
  const macroEnd = Math.round(duration * macroRatio);

  const scale =
    frame < macroEnd
      ? mapClamp(frame, [0, macroEnd], [macroScale, macroScale * 0.88], EASE.soft)
      : mapClamp(
          frame,
          [macroEnd, macroEnd + Math.round((duration - macroEnd) * 0.62)],
          [macroScale * 0.88, 1],
          EASE.out
        );

  const settle = mapClamp(
    frame,
    [macroEnd + Math.round((duration - macroEnd) * 0.62), duration],
    [1, 0.988],
    EASE.linear
  );
  const finalScale = frame < macroEnd ? scale : Math.min(scale, 1) * (scale <= 1.001 ? settle : 1);

  const blur = mapClamp(frame, [0, macroEnd * 0.9], [5.5, 0], EASE.out);
  const g = gimbal(frame, idx, 0.8);

  return (
    <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${g.x * 0.5}px, ${g.y * 0.5}px) scale(${finalScale})`,
          transformOrigin: `${fx * 100}% ${fy * 100}%`,
          willChange: "transform",
        }}
      >
        <Plate idx={idx} frame={plateFrame} style={{ width: "100%", height: "100%" }} />
      </div>
      {blur > 0.05 ? (
        <AbsoluteFill
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `radial-gradient(46% 46% at ${fx * 100}% ${fy * 100}%, transparent 0%, #000 100%)`,
            WebkitMaskImage: `radial-gradient(46% 46% at ${fx * 100}% ${fy * 100}%, transparent 0%, #000 100%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
};

/**
 * PORT DENSITY SWEEP (Section 3) — used SPARINGLY here, and only on the two
 * rear-panel plates that genuinely have connector density to sweep across.
 *
 * The M-Series is a compact desktop line with far fewer connectors than the
 * rack units this technique was built for. That compactness is part of the
 * product's honest identity, so it is not disguised with manufactured visual
 * busyness — the sweep appears twice in the whole 298 s, not once per chapter.
 *
 * The sweep always resolves: the last ~30% pulls out to the complete unit.
 */
export const PortSweep: React.FC<{
  idx: number;
  duration: number;
  zoom?: number;
  from?: number;
  to?: number;
  style?: React.CSSProperties;
}> = ({ idx, duration, zoom = 2.2, from = 0.08, to = 0.92, style }) => {
  const frame = useCurrentFrame();
  const sweepEnd = Math.round(duration * 0.7);

  const p = mapClamp(frame, [0, sweepEnd], [from, to], EASE.inOut);
  const scale = frame < sweepEnd ? zoom : mapClamp(frame, [sweepEnd, duration], [zoom, 1], EASE.out);
  const originX = frame < sweepEnd ? p : mapClamp(frame, [sweepEnd, duration], [p, 0.5], EASE.out);

  // Rolling focal plane: sharp at centre, soft toward the edges of the move.
  const roll = Math.abs(Math.sin(p * Math.PI * 5)) * 1.7;
  const blur = frame < sweepEnd ? roll : mapClamp(frame, [sweepEnd, duration], [roll, 0], EASE.out);

  return (
    <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: `${originX * 100}% 50%`,
          willChange: "transform",
          filter: blur > 0.05 ? `blur(${blur}px)` : "none",
        }}
      >
        <Plate idx={idx} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

/**
 * Slow directional glide for context/lifestyle stills that need life without a
 * full reveal. Scale stays at or below 1.06 and the image stays `contain`, so
 * the subject is never pushed out of frame.
 */
export const Drift: React.FC<{
  idx: number;
  duration: number;
  scaleFrom?: number;
  scaleTo?: number;
  panX?: number;
  panY?: number;
  frame?: PlateFrame;
  style?: React.CSSProperties;
}> = ({
  idx,
  duration,
  scaleFrom = 1.0,
  scaleTo = 1.05,
  panX = 0,
  panY = 0,
  frame: plateFrame = "auto",
  style,
}) => {
  const frame = useCurrentFrame();
  const p = mapClamp(frame, [0, duration], [0, 1], EASE.linear);
  const g = gimbal(frame, idx, 0.6);
  return (
    <div style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", ...style }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform:
            `translate(${panX * p + g.x}px, ${panY * p + g.y}px) ` +
            `scale(${scaleFrom + (scaleTo - scaleFrom) * p})`,
          willChange: "transform",
        }}
      >
        <Plate idx={idx} frame={plateFrame} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

/**
 * Montage tile. Every image in a montage is still shown COMPLETE within its own
 * tile — grouping shortens an image's screen time, it never crops it.
 */
export const MontageTile: React.FC<{
  idx: number;
  delay?: number;
  duration: number;
  label?: string;
  seed?: number;
  style?: React.CSSProperties;
}> = ({ idx, delay = 0, duration, label, seed = 0, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 18, EASE.out);
  const o = inOut(frame, duration, 18, 12);
  return (
    <div
      style={{
        position: "relative",
        minWidth: 0,
        minHeight: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        opacity: Math.min(t, o),
        transform: `translateY(${(1 - t) * 18}px)`,
        ...style,
      }}
    >
      <Gimbal seed={seed + idx} amount={0.55}>
        <Plate idx={idx} style={{ width: "100%", height: "100%" }} />
      </Gimbal>
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 14,
            bottom: 12,
            ...micro(17, 700, "0.14em"),
            color: COLORS.slate,
            background: hexA(COLORS.paperLift, 0.92),
            padding: "6px 11px",
            borderRadius: 7,
            border: `1px solid ${COLORS.line}`,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Row/grid of fully-visible images for honest overview passages. */
export const Montage: React.FC<{
  items: { idx: number; label?: string }[];
  duration: number;
  cols?: number;
  gap?: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({ items, duration, cols, gap = 22, stagger = 5, style }) => {
  const c = cols ?? Math.min(items.length, 3);
  const rows = Math.ceil(items.length / c);
  return (
    <div
      style={{
        display: "grid",
        // minmax(0, ...) is load-bearing: a bare `1fr` track has an `auto`
        // minimum, so each row would grow to the intrinsic height of the image
        // inside it and overflow the frame.
        gridTemplateColumns: `repeat(${c}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gap,
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {items.map((it, i) => (
        <MontageTile
          key={`${it.idx}-${i}`}
          idx={it.idx}
          label={it.label}
          delay={i * stagger}
          duration={duration}
          seed={i * 3}
        />
      ))}
    </div>
  );
};

/**
 * ECOSYSTEM MONTAGE (Section 3) — the cross-product technique, earned here by
 * the verified shared-engine fact rather than borrowed.
 *
 * Each member holds the frame ALONE and WHOLE for `soloHold` frames, in
 * sequence, before all three assemble under one heading that is true of all of
 * them at once. Solo passes guarantee every image in the group is seen complete
 * at full size, so clubbing products never costs an image its full reveal.
 */
export const EcosystemMontage: React.FC<{
  items: { idx: number; label?: string }[];
  duration: number;
  soloHold?: number;
  cols?: number;
  style?: React.CSSProperties;
}> = ({ items, duration, soloHold = 40, cols = 3, style }) => {
  const frame = useCurrentFrame();
  const soloPhase = soloHold * items.length;
  const assembling = frame >= soloPhase;

  if (!assembling) {
    const i = Math.min(items.length - 1, Math.floor(frame / soloHold));
    const local = frame - i * soloHold;
    const t = ramp(local, 0, 12, EASE.out);
    const o = 1 - ramp(local, soloHold - 9, 9, EASE.inOut);
    const it = items[i];
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            opacity: Math.min(t, o),
            transform: `scale(${0.985 + t * 0.015})`,
          }}
        >
          <Gimbal seed={i * 5 + 1} amount={0.7}>
            <Plate idx={it.idx} style={{ width: "100%", height: "100%" }} />
          </Gimbal>
        </div>
        {it.label ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 6,
              textAlign: "center",
              ...micro(20, 700, "0.14em"),
              color: COLORS.slate,
              opacity: Math.min(t, o),
            }}
          >
            {it.label}
          </div>
        ) : null}
      </div>
    );
  }

  const local = frame - soloPhase;
  return (
    <Montage
      items={items}
      duration={Math.max(1, duration - soloPhase)}
      cols={cols}
      stagger={4}
      style={{ opacity: ramp(local, 0, 14, EASE.out), ...style }}
    />
  );
};
