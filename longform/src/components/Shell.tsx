import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, SPACE, hexA } from "../theme";
import { FONT_FACE_CSS } from "../fonts";
import { EASE, ramp, gimbal } from "../lib/anim";
import { inOut } from "../lib/anim";

/**
 * The page. Light ground for the entire runtime, no exceptions (Section 2.1).
 *
 * `flat` drops the gradient for the full-frame branding beats, so the supplied
 * logos — which carry their own white background and are never boxed — have
 * nothing showing an edge behind them.
 */
export const Ground: React.FC<{ flat?: boolean; seed?: number }> = ({ flat = false, seed = 0 }) => {
  const frame = useCurrentFrame();
  const g = gimbal(frame, seed, 0.4);
  if (flat) return <AbsoluteFill style={{ background: COLORS.paperLift }} />;
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(120% 90% at ${50 + g.x * 0.5}% ${18 + g.y * 0.4}%, ` +
            `${COLORS.paperLift} 0%, ${COLORS.paper} 46%, ${COLORS.paperEdge} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Fonts, injected once per composition. */
export const Fonts: React.FC = () => (
  <style dangerouslySetInnerHTML={{ __html: FONT_FACE_CSS }} />
);

/**
 * Scene wrapper. Applies the Section 2.1 edge padding (56 x 52, pulled from the
 * AVB long-form build) to everything placed inside it, so no critical text or
 * callout can reach the true frame edge. Background imagery is rendered OUTSIDE
 * this padded box by the scene itself when it wants to bleed.
 */
export const Scene: React.FC<{
  duration: number;
  children: React.ReactNode;
  pad?: boolean;
  /**
   * Extra bottom padding, in px. Beats that carry the bottom-left lower-third
   * pass ~116 here so the strip has its own band and never lands on top of
   * media that runs to the bottom of the content box. A first QA pass without
   * this had the logo sitting over montage tiles and hiding their labels.
   */
  reserveBottom?: number;
  style?: React.CSSProperties;
}> = ({ duration, children, pad = true, reserveBottom = 0, style }) => {
  const frame = useCurrentFrame();
  const o = inOut(frame, duration, 14, 12);
  const t = ramp(frame, 0, 18, EASE.out);
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        transform: `scale(${0.994 + t * 0.006})`,
        padding: pad
          ? `${SPACE.marginY}px ${SPACE.marginX}px ${SPACE.marginY + reserveBottom}px ${SPACE.marginX}px`
          : 0,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Two-column split: media on one side, copy on the other. */
export const Split: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: string;
  gap?: number;
  align?: React.CSSProperties["alignItems"];
}> = ({ left, right, ratio = "1.08fr 1fr", gap = 56, align = "center" }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: ratio,
      gridTemplateRows: "minmax(0, 1fr)",
      gap,
      width: "100%",
      height: "100%",
      alignItems: align,
    }}
  >
    <div style={{ minWidth: 0, minHeight: 0, height: "100%", display: "flex", alignItems: "center" }}>
      {left}
    </div>
    <div style={{ minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 22 }}>
      {right}
    </div>
  </div>
);

/** Stacked copy block over full-bleed-ish media. */
export const Stack: React.FC<{ children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({
  children,
  gap = 20,
  style,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap, minWidth: 0, ...style }}>{children}</div>
);

/** A soft decorative hairline field — keeps large empty areas from reading flat. */
export const Hairlines: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={0}
          y1={150 + i * 195}
          x2={1920}
          y2={150 + i * 195}
          stroke={hexA(COLORS.ink, 0.035)}
          strokeWidth={1}
        />
      ))}
    </svg>
  </AbsoluteFill>
);
