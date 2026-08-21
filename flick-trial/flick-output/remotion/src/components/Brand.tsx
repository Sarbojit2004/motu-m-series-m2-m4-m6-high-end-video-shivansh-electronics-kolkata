import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { BRAND, COLORS, SAFE } from "../lib/theme";
import { LOGO } from "../lib/assets";
import { EASE, ramp } from "../lib/anim";
import { Rise, micro, spec, subhead } from "./Type";

/**
 * LOGO RULE — from BRAND-GUIDE.md, and the one thing Flick has no inherent
 * reason to know.
 *
 * Both logos are drawn EXACTLY as supplied: opaque, with their own white
 * background intact, directly on the video with NO box, card, plate or rounded
 * backing of any kind. They are never alpha-keyed. What makes this work is the
 * palette, not a compositing trick: the page is held in a near-white range, so
 * the logo's own white ground reads as continuous with it.
 *
 * `mix-blend-mode: multiply` is deliberately NOT used — a parent transform
 * creates a stacking context and isolates the blend, which renders the logo
 * with a visible white rectangle over darker content.
 */
export const Logo: React.FC<{ which: "motu" | "shivansh"; width: number; style?: React.CSSProperties }> =
({ which, width, style }) => (
  <Img
    src={which === "motu" ? LOGO.motu() : LOGO.shivansh()}
    style={{ width, height: "auto", display: "block", ...style }}
  />
);

/**
 * Persistent corner mark. Anchored in the BOTTOM band: at 1080 wide the content
 * box is only 952px and headlines run its full width, so a top-anchored mark
 * collides with them. MOTU takes bottom-left, Shivansh bottom-right — 452px of
 * clearance between them at these widths.
 */
export const ShivanshCorner: React.FC<{ delay?: number; width?: number; withUrl?: boolean }> =
({ delay = 10, width = 300, withUrl = true }) => {
  const f = useCurrentFrame();
  const t = ramp(f, delay, 18, EASE.out);
  return (
    <div style={{
      position: "absolute", right: SAFE.marginX, bottom: SAFE.bottom,
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7,
      opacity: t, transform: `translateY(${(1 - t) * -8}px)`,
    }}>
      <Logo which="shivansh" width={width} />
      {withUrl ? <span style={{ ...micro(20, 800, "0.09em"), color: COLORS.motuBlue }}>{BRAND.website}</span> : null}
    </div>
  );
};

export const MotuCorner: React.FC<{ delay?: number; width?: number }> = ({ delay = 10, width = 200 }) => {
  const f = useCurrentFrame();
  const t = ramp(f, delay, 18, EASE.out);
  return (
    <div style={{ position: "absolute", left: SAFE.marginX, bottom: SAFE.bottom, opacity: t * 0.95 }}>
      <Logo which="motu" width={width} />
    </div>
  );
};

/** Lower-third strip — logo, URL, region. */
export const ShivanshStrip: React.FC<{ delay?: number }> = ({ delay = 12 }) => {
  const f = useCurrentFrame();
  const t = ramp(f, delay, 20, EASE.out);
  return (
    <div style={{
      position: "absolute", left: SAFE.marginX, bottom: SAFE.bottom,
      display: "flex", alignItems: "center", gap: 20,
      opacity: t, transform: `translateX(${(1 - t) * -20}px)`,
    }}>
      <Logo which="shivansh" width={280} />
      <div style={{ width: 1, height: 44, background: COLORS.line }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ ...micro(20, 800, "0.09em"), color: COLORS.motuBlue }}>{BRAND.website}</span>
        <span style={{ ...micro(16, 600, "0.11em"), color: COLORS.slate }}>{BRAND.region}</span>
      </div>
    </div>
  );
};

/** Closing lockup — both logos plain and stacked, full designation, URL. */
export const CloseLockup: React.FC<{ delay?: number }> = ({ delay = 2 }) => (
  <AbsoluteFill style={{
    alignItems: "center", justifyContent: "center",
    padding: `${SAFE.top}px ${SAFE.marginX}px ${SAFE.bottom}px ${SAFE.marginX}px`,
  }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, textAlign: "center" }}>
      <Rise delay={delay} y={14}><Logo which="motu" width={340} /></Rise>
      <Rise delay={delay + 6} y={12}><div style={{ width: 220, height: 1, background: COLORS.line }} /></Rise>
      <Rise delay={delay + 10} y={14}><Logo which="shivansh" width={540} /></Rise>
      <Rise delay={delay + 18} y={12}>
        <div style={{ ...subhead(27, 600), color: COLORS.slate, maxWidth: 900 }}>
          {BRAND.name} — {BRAND.role} for {BRAND.region}
        </div>
      </Rise>
      <Rise delay={delay + 24} y={12}>
        <div style={{ ...spec(40, 800, "0.02em"), color: COLORS.motuBlue }}>{BRAND.website}</div>
      </Rise>
    </div>
  </AbsoluteFill>
);
