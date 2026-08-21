import React from "react";
import { staticFile, useCurrentFrame } from "remotion";
import { COLORS, SAFE, hexA } from "../lib/theme";
import { EASE, countUp, ramp } from "../lib/anim";

/**
 * Type system from BRAND-GUIDE.md. Archivo carries headlines, spec callouts and
 * micro-labels; Fraunces is held back for the hook and the closing turn.
 * Headline floor 62px, micro floor 18px — the "readable at a glance on a phone"
 * bar, for the actual time the scene is on screen.
 */
export const FONT_CSS = `
@font-face { font-family:'Archivo'; src:url('${staticFile("brand-assets/archivo-normal.woff2")}') format('woff2'); font-weight:100 900; font-display:block; }
@font-face { font-family:'Fraunces'; src:url('${staticFile("brand-assets/fraunces-normal.woff2")}') format('woff2'); font-weight:100 900; font-display:block; }
`;

const ARCHIVO = "Archivo, system-ui, sans-serif";
const FRAUNCES = "Fraunces, Georgia, serif";

export const headline = (size: number, weight = 800): React.CSSProperties => ({
  fontFamily: ARCHIVO, fontWeight: weight, fontSize: size, lineHeight: 1.03,
  letterSpacing: "-0.015em", textTransform: "uppercase",
});
export const editorial = (size: number, weight = 600): React.CSSProperties => ({
  fontFamily: FRAUNCES, fontWeight: weight, fontSize: size, lineHeight: 1.06, letterSpacing: "-0.02em",
});
export const subhead = (size: number, weight = 500): React.CSSProperties => ({
  fontFamily: ARCHIVO, fontWeight: weight, fontSize: size, lineHeight: 1.28,
});
export const spec = (size: number, weight = 800, tracking = "0.01em"): React.CSSProperties => ({
  fontFamily: ARCHIVO, fontWeight: weight, fontSize: size, letterSpacing: tracking,
  fontVariantNumeric: "tabular-nums", fontFeatureSettings: '"tnum" 1',
});
export const micro = (size: number, weight = 700, tracking = "0.14em"): React.CSSProperties => ({
  fontFamily: ARCHIVO, fontWeight: weight, fontSize: size, letterSpacing: tracking, textTransform: "uppercase",
});

export const Rise: React.FC<{ delay?: number; len?: number; y?: number; children: React.ReactNode; style?: React.CSSProperties }> =
({ delay = 0, len = 18, y = 20, children, style }) => {
  const f = useCurrentFrame();
  const t = ramp(f, delay, len, EASE.out);
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * y}px)`, ...style }}>{children}</div>;
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; delay?: number }> =
({ children, color = COLORS.motuBlue, delay = 0 }) => (
  <Rise delay={delay} y={10}><div style={{ ...micro(24, 800, "0.2em"), color }}>{children}</div></Rise>
);

export const Headline: React.FC<{ children: React.ReactNode; size?: number; color?: string; delay?: number; serif?: boolean }> =
({ children, size = 74, color = COLORS.ink, delay = 3, serif = false }) => (
  <Rise delay={delay}>
    <div style={{ ...(serif ? editorial(size) : headline(size)), color, whiteSpace: "pre-line" }}>{children}</div>
  </Rise>
);

export const Sub: React.FC<{ children: React.ReactNode; size?: number; color?: string; delay?: number }> =
({ children, size = 30, color = COLORS.slate, delay = 10 }) => (
  <Rise delay={delay} y={14}>
    <div style={{ ...subhead(size), color, maxWidth: SAFE.contentW, whiteSpace: "pre-line" }}>{children}</div>
  </Rise>
);

export const Rule: React.FC<{ delay?: number; width?: number; color?: string }> =
({ delay = 0, width = 130, color = COLORS.motuBlue }) => {
  const f = useCurrentFrame();
  return <div style={{ height: 5, width: width * ramp(f, delay, 24, EASE.out), background: color, borderRadius: 3 }} />;
};

/** Callout chip — arrives one by one, per the approved sequential direction. */
export const Chip: React.FC<{ children: React.ReactNode; delay?: number; tone?: "blue" | "alert" | "green" | "neutral"; size?: number }> =
({ children, delay = 0, tone = "blue", size = 22 }) => {
  const c = tone === "alert" ? COLORS.alert : tone === "green" ? COLORS.signal : tone === "neutral" ? COLORS.slate : COLORS.motuBlue;
  return (
    <Rise delay={delay} y={10}>
      <span style={{
        ...micro(size, 800, "0.12em"), color: c, background: hexA(c, 0.09),
        border: `1px solid ${hexA(c, 0.28)}`, padding: "11px 19px", borderRadius: 999,
        whiteSpace: "nowrap", display: "inline-block",
      }}>{children}</span>
    </Rise>
  );
};

/** Animated spec counter. Tabular numerals stop the digits reflowing. */
export const Counter: React.FC<{
  to: number; suffix?: string; prefix?: string; label: string;
  delay?: number; len?: number; decimals?: number; color?: string; size?: number;
}> = ({ to, suffix = "", prefix = "", label, delay = 0, len = 30, decimals = 0, color = COLORS.amber, size = 120 }) => {
  const f = useCurrentFrame();
  const v = countUp(f, delay, len, to);
  const shown = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-IN");
  return (
    <Rise delay={delay} y={12}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ ...spec(size, 800, "0.005em"), color, lineHeight: 1 }}>{prefix}{shown}{suffix}</span>
        <span style={{ ...micro(21, 700, "0.14em"), color: COLORS.slate }}>{label}</span>
      </div>
    </Rise>
  );
};

/** Price lockup — one product, one distinct figure. Never blended. */
export const PriceRow: React.FC<{ product: string; price: string; note?: string; delay?: number; size?: number }> =
({ product, price, note, delay = 0, size = 78 }) => (
  <Rise delay={delay} y={14}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <span style={{ ...micro(26, 800, "0.16em"), color: COLORS.ink }}>{product}</span>
      <span style={{ ...spec(size, 800), color: COLORS.motuBlue, lineHeight: 1 }}>{price}</span>
      {note ? <span style={{ ...micro(19, 700, "0.12em"), color: COLORS.slateDim }}>{note}</span> : null}
    </div>
  </Rise>
);
