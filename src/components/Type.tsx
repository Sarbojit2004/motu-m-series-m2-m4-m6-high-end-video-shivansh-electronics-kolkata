import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F} from '../lib/theme';
import {pop, ramp, stag} from '../lib/anim';

/**
 * Type system ported structurally from the completed TASCAM Sonicview reels
 * (prompt Section 8b): Barlow Condensed display / Inter UI / JetBrains Mono
 * technical, with the same weight pairing, size hierarchy and tracking
 * relationships. Colours re-derived for this project's own light ground.
 *
 * The five levels map onto the creative brief's Section 8 hierarchy:
 *   Display -> headline claims      (boldest — product + defining trait)
 *   Sub     -> subheadline          (medium — the "why this matters" line)
 *   Body    -> supporting prose
 *   Spec    -> specification callouts (mono, verified numbers only)
 *   Micro   -> micro callouts        (I/O counts, MOP context, protocol data)
 */

/** Soft light halo used only when type sits over a photographic plate. */
export const LIFT = '0 1px 0 rgba(255,255,255,0.86), 0 2px 18px rgba(255,255,255,0.58)';

export const Display: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: 600 | 700 | 800;
  color?: string;
  lh?: number;
  tracking?: number;
  align?: 'left' | 'center' | 'right';
  caps?: boolean;
  lift?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  size = 96,
  weight = 800,
  color = C.ink,
  lh = 0.9,
  tracking = -0.5,
  align = 'left',
  caps = true,
  lift = false,
  style,
}) => (
  <div
    style={{
      fontFamily: F.display,
      fontWeight: weight,
      fontSize: size,
      lineHeight: lh,
      letterSpacing: tracking,
      color,
      textAlign: align,
      textTransform: caps ? 'uppercase' : 'none',
      whiteSpace: 'pre-line',
      textShadow: lift ? LIFT : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Small all-caps eyebrow. */
export const Kicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  weight?: 600 | 700 | 800;
  tracking?: number;
  style?: React.CSSProperties;
}> = ({children, color = C.inkDim, size = 21, weight = 700, tracking = 3.6, style}) => (
  <div
    style={{
      fontFamily: F.ui,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: tracking,
      textTransform: 'uppercase',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Subheadline — medium weight, slightly italicised, explains the "why". */
export const Sub: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: 400 | 500 | 600;
  lh?: number;
  align?: 'left' | 'center' | 'right';
  italic?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  size = 30,
  color = C.inkSoft,
  weight = 500,
  lh = 1.34,
  align = 'left',
  italic = true,
  style,
}) => (
  <div
    style={{
      fontFamily: F.ui,
      fontWeight: weight,
      fontSize: size,
      lineHeight: lh,
      color,
      textAlign: align,
      fontStyle: italic ? 'italic' : 'normal',
      letterSpacing: 0.1,
      whiteSpace: 'pre-line',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Plain body copy — no italic. */
export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: 400 | 500 | 600 | 700;
  lh?: number;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}> = ({children, size = 27, color = C.inkSoft, weight = 500, lh = 1.38, align = 'left', style}) => (
  <div
    style={{
      fontFamily: F.ui,
      fontWeight: weight,
      fontSize: size,
      lineHeight: lh,
      color,
      textAlign: align,
      letterSpacing: 0.1,
      whiteSpace: 'pre-line',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Verified technical figures — monospace, structured, tabular numerals. */
export const Spec: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: 300 | 400 | 500 | 700;
  tracking?: number;
  style?: React.CSSProperties;
}> = ({children, size = 24, color = C.inkSoft, weight = 400, tracking = 1.0, style}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontWeight: weight,
      fontSize: size,
      letterSpacing: tracking,
      color,
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'pre-line',
      ...style,
    }}
  >
    {children}
  </div>
);

/** Micro callouts — small, wide tracking, attached to graphics. */
export const Micro: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  tracking?: number;
  caps?: boolean;
  style?: React.CSSProperties;
}> = ({children, size = 16, color = C.inkDim, tracking = 2.6, caps = true, style}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: tracking,
      textTransform: caps ? 'uppercase' : 'none',
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Word-by-word kinetic headline. */
export const KineticLine: React.FC<{
  text: string;
  size?: number;
  color?: string;
  weight?: 600 | 700 | 800;
  delay?: number;
  per?: number;
  gap?: number;
  lh?: number;
  align?: 'left' | 'center' | 'right';
  highlight?: {word: number; color: string}[];
  lift?: boolean;
  style?: React.CSSProperties;
}> = ({
  text,
  size = 88,
  color = C.ink,
  weight = 800,
  delay = 0,
  per = 3.4,
  gap = 16,
  lh = 0.94,
  align = 'left',
  highlight = [],
  lift = false,
  style,
}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const hl = new Map(highlight.map((h) => [h.word, h.color]));
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${gap * 0.3}px ${gap}px`,
        justifyContent:
          align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = pop(f, stag(i, per, delay), 15);
        return (
          <span
            key={i}
            style={{
              fontFamily: F.display,
              fontWeight: weight,
              fontSize: size,
              lineHeight: lh,
              letterSpacing: -0.5,
              textTransform: 'uppercase',
              color: hl.get(i) ?? color,
              display: 'inline-block',
              transform: `translateY(${(1 - s) * 30}px)`,
              opacity: Math.min(1, s * 1.6),
              textShadow: lift ? LIFT : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Odometer-style figure that counts up then holds. */
export const CountUp: React.FC<{
  to: number;
  dur: number;
  decimals?: number;
  size?: number;
  color?: string;
  suffix?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({to, dur, decimals = 0, size = 120, color = C.ink, suffix = '', delay = 0, style}) => {
  const f = useCurrentFrame();
  const v = ramp(f, [delay, delay + dur], [0, to]);
  return (
    <div
      style={{
        fontFamily: F.display,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 0.88,
        color,
        letterSpacing: -1,
        fontVariantNumeric: 'tabular-nums',
        display: 'flex',
        alignItems: 'baseline',
        ...style,
      }}
    >
      {v.toFixed(decimals)}
      {suffix ? (
        <span style={{fontSize: size * 0.34, marginLeft: 8, letterSpacing: 0}}>{suffix}</span>
      ) : null}
    </div>
  );
};

/** Thin accent rule used to separate hierarchy levels. */
export const Rule: React.FC<{
  w?: number;
  color?: string;
  thickness?: number;
  style?: React.CSSProperties;
}> = ({w = 96, color = C.ink, thickness = 4, style}) => (
  <div
    style={{width: w, height: thickness, backgroundColor: color, borderRadius: thickness, ...style}}
  />
);

/** Small solid chip — spec tag. */
export const Chip: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, bg = C.ink, color = C.paperHi, size = 17, style}) => (
  <div
    style={{
      fontFamily: F.mono,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: 1.8,
      textTransform: 'uppercase',
      color,
      backgroundColor: bg,
      padding: '7px 13px 6px',
      borderRadius: 5,
      display: 'inline-block',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * A spec callout that animates in beside a hardware feature — the brief's
 * "Supporting Specification Callouts" level. Only verified figures from the
 * brief's Section 4 table are ever passed here.
 */
export const SpecCard: React.FC<{
  label: string;
  value: string;
  delay?: number;
  accent?: string;
  width?: number;
  style?: React.CSSProperties;
}> = ({label, value, delay = 0, accent = C.motu, width, style}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 16], [0, 1]);
  return (
    <div
      style={{
        width,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        backgroundColor: C.paperHi,
        border: `1px solid ${C.lineSoft}`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: 8,
        padding: '13px 16px 14px',
        boxShadow: '0 12px 30px -20px rgba(10,16,23,0.30)',
        ...style,
      }}
    >
      <Micro color={C.inkDim} size={13} tracking={2.2}>
        {label}
      </Micro>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 500,
          fontSize: 27,
          letterSpacing: 0.2,
          color: C.ink,
          marginTop: 6,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
    </div>
  );
};

/**
 * The Market Operating Price callout.
 *
 * Terminology is fixed by the brief: "Market Operating Price" / "MOP", incl.
 * GST. Never "MRP", never a bare "price".
 */
export const MopTag: React.FC<{
  product: string;
  amount: string;
  delay?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({product, amount, delay = 0, size = 1, style}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + 18], [0, 1]);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        borderRadius: 8,
        overflow: 'hidden',
        border: `1px solid ${C.line}`,
        backgroundColor: C.paperHi,
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        boxShadow: '0 14px 32px -22px rgba(10,16,23,0.34)',
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: C.ink,
          color: C.paperHi,
          fontFamily: F.display,
          fontWeight: 800,
          fontSize: 26 * size,
          letterSpacing: 0.6,
          padding: `${10 * size}px ${14 * size}px ${8 * size}px`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {product}
      </div>
      <div style={{padding: `${8 * size}px ${16 * size}px ${9 * size}px`}}>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 700,
            fontSize: 30 * size,
            letterSpacing: 0.2,
            color: C.ink,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1.05,
          }}
        >
          {amount}
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontWeight: 500,
            fontSize: 12.5 * size,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: C.inkDim,
            marginTop: 2,
          }}
        >
          per unit · MOP · incl. GST
        </div>
      </div>
    </div>
  );
};
