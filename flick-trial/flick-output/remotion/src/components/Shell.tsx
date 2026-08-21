import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, SAFE, VIDEO, hexA } from "../lib/theme";
import { EASE, gimbal, inOut, ramp } from "../lib/anim";
import { FONT_CSS } from "./Type";

export const Fonts: React.FC = () => <style dangerouslySetInnerHTML={{ __html: FONT_CSS }} />;

/** Light ground for the entire runtime, no exceptions. */
export const Ground: React.FC<{ flat?: boolean; seed?: number }> = ({ flat = false, seed = 0 }) => {
  const f = useCurrentFrame();
  const g = gimbal(f, seed, 0.4);
  if (flat) return <AbsoluteFill style={{ background: COLORS.paperLift }} />;
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <AbsoluteFill style={{
        background: `radial-gradient(105% 70% at ${50 + g.x * 0.5}% ${22 + g.y * 0.4}%, ${COLORS.paperLift} 0%, ${COLORS.paper} 48%, ${COLORS.paperEdge} 100%)`,
      }} />
    </AbsoluteFill>
  );
};

export type Enter = "rise" | "cut" | "dissolve" | "wipeUp" | "scaleIn" | "slide" | "sweep";

/**
 * Scene wrapper. Applies the caption-safe zone (top 180 / bottom 220 / sides 64)
 * to everything inside, so no text, logo or callout can land under a platform
 * overlay. Background imagery is rendered outside this box when it should bleed.
 *
 * `enter` varies per scene: at 25 scenes a single repeated entrance becomes the
 * noticeable pattern of the piece.
 */
export const Scene: React.FC<{
  duration: number; children: React.ReactNode; pad?: boolean;
  reserveBottom?: number; enter?: Enter; style?: React.CSSProperties;
}> = ({ duration, children, pad = true, reserveBottom = 0, enter = "rise", style }) => {
  const f = useCurrentFrame();
  const o = inOut(f, duration, 10, 9);
  const t = ramp(f, 0, 14, EASE.out);
  const tq = ramp(f, 0, 20, EASE.out);
  const fx: React.CSSProperties =
    enter === "cut" ? { transform: "none" }
    : enter === "dissolve" ? { transform: `scale(${0.998 + t * 0.002})` }
    : enter === "wipeUp" ? { clipPath: `inset(${(1 - tq) * 100}% 0% 0% 0%)`, transform: `translateY(${(1 - t) * 18}px)` }
    : enter === "scaleIn" ? { transform: `scale(${1.045 - t * 0.045})` }
    : enter === "slide" ? { transform: `translateX(${(1 - t) * 46}px) scale(${0.997 + t * 0.003})` }
    : enter === "sweep" ? { transform: `scale(${0.994 + t * 0.006})` }
    : { transform: `scale(${0.995 + t * 0.005})` };

  return (
    <AbsoluteFill style={{
      opacity: enter === "cut" ? Math.min(1, o * 1000) : o, ...fx,
      padding: pad ? `${SAFE.top}px ${SAFE.marginX}px ${SAFE.bottom + reserveBottom}px ${SAFE.marginX}px` : 0,
      ...style,
    }}>
      {children}
      {enter === "sweep" && tq < 1 ? (
        <AbsoluteFill style={{
          pointerEvents: "none",
          background: `linear-gradient(115deg, transparent ${tq * 140 - 40}%, ${hexA(COLORS.paperLift, 0.85)} ${tq * 140 - 16}%, transparent ${tq * 140 + 8}%)`,
        }} />
      ) : null}
    </AbsoluteFill>
  );
};

/** Copy above, media below — the portrait workhorse. */
export const CopyOverMedia: React.FC<{ copy: React.ReactNode; media: React.ReactNode; gap?: number; mediaFlex?: number }> =
({ copy, media, gap = 24, mediaFlex = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap, height: "100%", minHeight: 0 }}>
    <div style={{ flexShrink: 0 }}>{copy}</div>
    <div style={{ flex: mediaFlex, minHeight: 0 }}>{media}</div>
  </div>
);

export const Col: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> =
({ children, gap = 14, style }) => (
  <div style={{ display: "flex", flexDirection: "column", gap, minWidth: 0, ...style }}>{children}</div>
);

export const Hairlines: React.FC<{ opacity?: number }> = ({ opacity = 0.7 }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
    <svg width="100%" height="100%" viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`} preserveAspectRatio="none">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={0} y1={220 + i * 245} x2={VIDEO.width} y2={220 + i * 245}
          stroke={hexA(COLORS.ink, 0.035)} strokeWidth={1} />
      ))}
    </svg>
  </AbsoluteFill>
);
