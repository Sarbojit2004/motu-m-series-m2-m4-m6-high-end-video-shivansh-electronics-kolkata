import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, hexA } from "../theme";
import { EASE, ramp, countUp, group } from "../lib/anim";
import { editorial, headline, micro, spec, subhead } from "../fonts";

/** Entrance wrapper — a short rise plus fade, the house entrance everywhere. */
export const Rise: React.FC<{
  delay?: number;
  len?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, len = 20, y = 22, children, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, len, EASE.out);
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * y}px)`, ...style }}>{children}</div>
  );
};

/**
 * Eyebrow — the small tracked label above a headline.
 * Section 7 floor: never below 22px on a 1920x1080 canvas.
 */
export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> = ({
  children,
  color = COLORS.motuBlue,
  delay = 0,
}) => (
  <Rise delay={delay} y={12}>
    <div style={{ ...micro(24, 800, "0.2em"), color }}>{children}</div>
  </Rise>
);

/**
 * Headline. `size` is chosen per beat rather than fixed, but the Section 7 bar
 * is that headline-tier text is never below 64px on this canvas — comfortably
 * legible at 1920x1080, not "legible if you look closely".
 */
export const Headline: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  delay?: number;
  serif?: boolean;
  style?: React.CSSProperties;
}> = ({ children, size = 88, weight = 800, color = COLORS.ink, delay = 4, serif = false, style }) => (
  <Rise delay={delay}>
    <div
      style={{
        ...(serif ? editorial(size, weight === 800 ? 600 : weight) : headline(size, weight)),
        color,
        whiteSpace: "pre-line",
        ...style,
      }}
    >
      {children}
    </div>
  </Rise>
);

/** Subheadline — the "why this matters" translation line, in muted slate. */
export const Sub: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  max?: number;
}> = ({ children, size = 34, color = COLORS.slate, delay = 12, max = 1180 }) => (
  <Rise delay={delay} y={16}>
    <div style={{ ...subhead(size), color, maxWidth: max, whiteSpace: "pre-line" }}>{children}</div>
  </Rise>
);

/** A single verified specification, as a chip. Only Section 4 figures reach these. */
export const SpecChip: React.FC<{
  label: string;
  value: string;
  delay?: number;
  accent?: string;
  size?: number;
}> = ({ label, value, delay = 0, accent = COLORS.ink, size = 44 }) => (
  <Rise delay={delay} y={16}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 9,
        padding: "22px 28px",
        background: COLORS.paperLift,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 20,
        boxShadow: `0 6px 20px ${COLORS.shadow}`,
        minWidth: 0,
      }}
    >
      <span style={{ ...micro(19, 700, "0.15em"), color: COLORS.slateDim }}>{label}</span>
      <span style={{ ...spec(size, 800, "0.01em"), color: accent, lineHeight: 1.05 }}>{value}</span>
    </div>
  </Rise>
);

/**
 * Animated spec counter. Tabular numerals keep the digits from reflowing as the
 * number climbs, which is why `spec()` sets them.
 */
export const Counter: React.FC<{
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay?: number;
  len?: number;
  decimals?: number;
  accent?: string;
  size?: number;
}> = ({ to, suffix = "", prefix = "", label, delay = 0, len = 34, decimals = 0, accent = COLORS.amber, size = 82 }) => {
  const frame = useCurrentFrame();
  const v = countUp(frame, delay, len, to);
  const shown = decimals > 0 ? v.toFixed(decimals) : group(v);
  return (
    <Rise delay={delay} y={14}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ ...spec(size, 800, "0.005em"), color: accent, lineHeight: 1 }}>
          {prefix}
          {shown}
          {suffix}
        </span>
        <span style={{ ...micro(21, 700, "0.15em"), color: COLORS.slate }}>{label}</span>
      </div>
    </Rise>
  );
};

/** A thin rule used to separate a heading block from what follows. */
export const Rule: React.FC<{ delay?: number; width?: number; color?: string }> = ({
  delay = 0,
  width = 168,
  color = COLORS.motuBlue,
}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 26, EASE.out);
  return <div style={{ height: 5, width: width * t, background: color, borderRadius: 3 }} />;
};

/** Small pill label — used for capacity markers like "2 in / 2 out". */
export const Pill: React.FC<{
  children: React.ReactNode;
  delay?: number;
  tone?: "blue" | "green" | "amber" | "neutral";
  size?: number;
}> = ({ children, delay = 0, tone = "blue", size = 22 }) => {
  const c =
    tone === "green" ? COLORS.signal : tone === "amber" ? COLORS.amber : tone === "neutral" ? COLORS.slate : COLORS.motuBlue;
  return (
    <Rise delay={delay} y={10}>
      <span
        style={{
          ...micro(size, 800, "0.14em"),
          color: c,
          background: hexA(c, 0.09),
          border: `1px solid ${hexA(c, 0.26)}`,
          padding: "10px 18px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </Rise>
  );
};
