import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, SAFE, VIDEO, hexA } from "../theme";
import { FONT_FACE_CSS } from "../fonts";
import { EASE, ramp, gimbal, inOut } from "../lib/anim";

/** The page. Light ground for the entire runtime, no exceptions (Section 2.2). */
export const Ground: React.FC<{ flat?: boolean; seed?: number }> = ({ flat = false, seed = 0 }) => {
  const frame = useCurrentFrame();
  const g = gimbal(frame, seed, 0.4);
  if (flat) return <AbsoluteFill style={{ background: COLORS.paperLift }} />;
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(105% 70% at ${50 + g.x * 0.5}% ${22 + g.y * 0.4}%, ` +
            `${COLORS.paperLift} 0%, ${COLORS.paper} 48%, ${COLORS.paperEdge} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Fonts: React.FC = () => (
  <style dangerouslySetInnerHTML={{ __html: FONT_FACE_CSS }} />
);

/**
 * Scene wrapper — the caption-safe zone made structural.
 *
 * Everything placed inside this box sits within top 180 / bottom 220 / side 64,
 * the values pulled unchanged from the AVB reel builds. Background and ambient
 * imagery is rendered OUTSIDE this box by the scene itself when it wants to
 * bleed into those bands, which Section 2.2 explicitly allows.
 *
 * `reserveBottom` gives the lower-third strip its own band, so it never lands
 * on top of media that runs to the bottom of the content box.
 */
/**
 * ENTRANCE VOCABULARY (Section 2).
 *
 * At 34 beats in 178 s, a single repeated entrance becomes the noticeable
 * pattern of the piece — there are simply enough beats for repetition to
 * register. Six styles are assigned across the schedule so none carries more
 * than a handful of beats; `npm run guard` fails the build if one dominates.
 */
export type Enter = "rise" | "cut" | "dissolve" | "wipeUp" | "scaleIn" | "slide" | "sweep";

export const Scene: React.FC<{
  duration: number;
  children: React.ReactNode;
  pad?: boolean;
  reserveBottom?: number;
  enter?: Enter;
  style?: React.CSSProperties;
}> = ({ duration, children, pad = true, reserveBottom = 0, enter = "rise", style }) => {
  const frame = useCurrentFrame();
  const o = inOut(frame, duration, 10, 9);
  const t = ramp(frame, 0, 14, EASE.out);
  const tq = ramp(frame, 0, 20, EASE.out);

  // Per-style entrance. Every one resolves to identity by ~frame 20, so the
  // beat itself is never distorted while it is being read.
  const fx: React.CSSProperties =
    enter === "cut"
      ? { transform: "none" }
      : enter === "dissolve"
        ? { transform: `scale(${0.998 + t * 0.002})` }
        : enter === "wipeUp"
          ? {
              clipPath: `inset(${(1 - tq) * 100}% 0% 0% 0%)`,
              transform: `translateY(${(1 - t) * 18}px)`,
            }
          : enter === "scaleIn"
            ? { transform: `scale(${1.045 - t * 0.045})` }
            : enter === "slide"
              ? { transform: `translateX(${(1 - t) * 46}px) scale(${0.997 + t * 0.003})` }
              : enter === "sweep"
                ? { transform: `scale(${0.994 + t * 0.006})` }
                : { transform: `scale(${0.995 + t * 0.005})` };

  return (
    <AbsoluteFill
      style={{
        opacity: enter === "cut" ? Math.min(1, o * 1000) : o,
        ...fx,
        padding: pad
          ? `${SAFE.top}px ${SAFE.marginX}px ${SAFE.bottom + reserveBottom}px ${SAFE.marginX}px`
          : 0,
        ...style,
      }}
    >
      {children}
      {enter === "sweep" && tq < 1 ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            background:
              `linear-gradient(115deg, transparent ${tq * 140 - 40}%, ` +
              `${hexA(COLORS.paperLift, 0.85)} ${tq * 140 - 16}%, ` +
              `transparent ${tq * 140 + 8}%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/**
 * Vertical stack — the portrait workhorse. Where the landscape build reaches
 * for a two-column Split, portrait stacks: copy above, media below.
 */
export const Stack: React.FC<{
  children: React.ReactNode;
  gap?: number;
  style?: React.CSSProperties;
}> = ({ children, gap = 18, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap, minWidth: 0, height: "100%", ...style }}>
    {children}
  </div>
);

/** Copy block over media, with the media taking the remaining height. */
export const CopyOverMedia: React.FC<{
  copy: React.ReactNode;
  media: React.ReactNode;
  gap?: number;
  mediaFlex?: number;
}> = ({ copy, media, gap = 26, mediaFlex = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap, height: "100%", minHeight: 0 }}>
    <div style={{ flexShrink: 0 }}>{copy}</div>
    <div style={{ flex: mediaFlex, minHeight: 0 }}>{media}</div>
  </div>
);

/** A soft decorative hairline field, scaled for the tall canvas. */
export const Hairlines: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
    <svg width="100%" height="100%" viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`} preserveAspectRatio="none">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line
          key={i}
          x1={0}
          y1={220 + i * 245}
          x2={VIDEO.width}
          y2={220 + i * 245}
          stroke={hexA(COLORS.ink, 0.035)}
          strokeWidth={1}
        />
      ))}
    </svg>
  </AbsoluteFill>
);
