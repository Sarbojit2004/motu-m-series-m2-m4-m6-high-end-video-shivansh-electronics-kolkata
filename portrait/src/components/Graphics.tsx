import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, hexA } from "../theme";
import { EASE, ramp, mapClamp } from "../lib/anim";
import { micro, spec } from "../fonts";

/**
 * Section 11 of the brief asks for SVG/CSS-drawable motion assets rather than
 * new videography. These are those assets. Everything here is drawn, animated
 * and coloured from the same tokens as the rest of the build.
 */

/**
 * THE SHARED-DAC MOTIF.
 *
 * A minimalist microchip that "stamps" itself at the head of each product
 * segment — the visual carrier for the one verified fact the whole narrative
 * rests on: the engine is identical in all three units.
 */
export const DacChip: React.FC<{
  delay?: number;
  size?: number;
  label?: string;
  pulse?: boolean;
}> = ({ delay = 0, size = 220, label = "ESS Sabre32 Ultra", pulse = true }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 26, EASE.out);
  const glow = pulse ? 0.5 + 0.5 * Math.sin((frame - delay) / 17) : 1;
  const pins = 7;
  const s = size;
  const body = s * 0.56;
  const off = (s - body) / 2;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: t }}>
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ transform: `scale(${0.9 + t * 0.1})` }}>
        <rect
          x={off}
          y={off}
          width={body}
          height={body}
          rx={s * 0.055}
          fill={hexA(COLORS.motuBlue, 0.06)}
          stroke={COLORS.motuBlue}
          strokeWidth={s * 0.014}
        />
        {Array.from({ length: pins }).map((_, i) => {
          const step = body / (pins + 1);
          const p = off + step * (i + 1);
          const len = s * 0.085 * ramp(frame, delay + 8 + i * 2, 14, EASE.out);
          const c = hexA(COLORS.signal, 0.85);
          return (
            <g key={i} stroke={c} strokeWidth={s * 0.012} strokeLinecap="round">
              <line x1={p} y1={off} x2={p} y2={off - len} />
              <line x1={p} y1={off + body} x2={p} y2={off + body + len} />
              <line x1={off} y1={p} x2={off - len} y2={p} />
              <line x1={off + body} y1={p} x2={off + body + len} y2={p} />
            </g>
          );
        })}
        <circle
          cx={s / 2}
          cy={s / 2}
          r={s * 0.085}
          fill={hexA(COLORS.signalBright, 0.18 + glow * 0.3)}
          stroke={COLORS.signal}
          strokeWidth={s * 0.009}
        />
        <circle cx={off + body * 0.16} cy={off + body * 0.16} r={s * 0.016} fill={COLORS.motuBlue} />
      </svg>
      {label ? (
        <span style={{ ...micro(20, 800, "0.16em"), color: COLORS.motuBlue, textAlign: "center" }}>
          {label}
        </span>
      ) : null}
    </div>
  );
};

/**
 * ANIMATED LOOPBACK SIGNAL PATH.
 *
 * Computer/DAW audio and a live microphone meet inside the interface and leave
 * together as one stream. Drawn rather than photographed because the point is a
 * routing concept, which no still can show.
 */
export const LoopbackDiagram: React.FC<{ delay?: number; width?: number }> = ({
  delay = 0,
  width = 1180,
}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 30, EASE.out);
  const flow = ((frame - delay) * 2.4) % 100;
  const H = 300;
  // Node boxes are 216 wide and drawn centred on x, so the first and last
  // centres must sit at least 108px inboard or the box clips at the viewBox
  // edge. A first QA pass had "Computer / DAW" cut off at x=90.
  const BOX_HALF = 108;
  const INSET = BOX_HALF + 16;
  const nodes = [
    { x: INSET, y: 78, label: "Computer / DAW", tone: COLORS.motuBlue },
    { x: INSET, y: 222, label: "Microphone", tone: COLORS.signal },
    { x: width / 2, y: 150, label: "MOTU M-Series", tone: COLORS.ink },
    { x: width - INSET, y: 150, label: "Livestream", tone: COLORS.amber },
  ];
  const Box: React.FC<{ n: (typeof nodes)[number]; d: number }> = ({ n, d }) => {
    const bt = ramp(frame, delay + d, 18, EASE.out);
    return (
      <g opacity={bt}>
        <rect
          x={n.x - BOX_HALF}
          y={n.y - 33}
          width={BOX_HALF * 2}
          height={66}
          rx={16}
          fill={COLORS.paperLift}
          stroke={hexA(n.tone, 0.45)}
          strokeWidth={2}
        />
        <text
          x={n.x}
          y={n.y + 7}
          textAnchor="middle"
          style={{ ...micro(19, 800, "0.1em") } as React.CSSProperties}
          fill={n.tone}
        >
          {n.label}
        </text>
      </g>
    );
  };
  const path = (from: (typeof nodes)[number], to: (typeof nodes)[number]) =>
    `M ${from.x + BOX_HALF} ${from.y} C ${(from.x + to.x) / 2} ${from.y}, ${(from.x + to.x) / 2} ${to.y}, ${to.x - BOX_HALF} ${to.y}`;

  return (
    <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} style={{ opacity: t, maxWidth: "100%" }}>
      {[
        [nodes[0], nodes[2]],
        [nodes[1], nodes[2]],
        [nodes[2], nodes[3]],
      ].map(([a, b], i) => (
        <g key={i}>
          <path d={path(a, b)} fill="none" stroke={hexA(COLORS.ink, 0.16)} strokeWidth={3} />
          <path
            d={path(a, b)}
            fill="none"
            stroke={i === 2 ? COLORS.amber : i === 0 ? COLORS.motuBlue : COLORS.signal}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="14 86"
            strokeDashoffset={-flow - i * 12}
            opacity={ramp(frame, delay + 16 + i * 5, 16, EASE.out)}
          />
        </g>
      ))}
      {nodes.map((n, i) => (
        <Box key={n.label} n={n} d={i * 5} />
      ))}
    </svg>
  );
};

/**
 * CV / MODULAR DIAGRAM — the DC-coupled outputs sending control voltage to a
 * modular rack. A genuinely uncommon capability at this price, and one that
 * only a drawing can explain.
 */
export const CvDiagram: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 1020 }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 26, EASE.out);
  const H = 236;
  const phase = (frame - delay) * 0.09;
  const pts = Array.from({ length: 90 }, (_, i) => {
    const x = 300 + (i / 89) * (width - 470);
    // a stepped control voltage rather than an audio wave — that is the point
    const step = Math.floor(i / 11);
    const y = 118 - [0, 34, 12, 52, 24, 44, 6, 38][step % 8] * Math.min(1, Math.max(0, phase - step * 0.5));
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={H} viewBox={`0 0 ${width} ${H}`} style={{ opacity: t, maxWidth: "100%" }}>
      <rect x={40} y={62} width={224} height={112} rx={16} fill={COLORS.paperLift} stroke={hexA(COLORS.motuBlue, 0.45)} strokeWidth={2} />
      <text x={152} y={112} textAnchor="middle" style={{ ...micro(18, 800, "0.1em") } as React.CSSProperties} fill={COLORS.motuBlue}>
        DC-COUPLED
      </text>
      <text x={152} y={140} textAnchor="middle" style={{ ...micro(18, 800, "0.1em") } as React.CSSProperties} fill={COLORS.motuBlue}>
        TRS OUT
      </text>
      <polyline points={pts} fill="none" stroke={COLORS.signal} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      <rect x={width - 210} y={40} width={170} height={156} rx={14} fill={COLORS.paperLift} stroke={hexA(COLORS.ink, 0.28)} strokeWidth={2} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle
          key={i}
          cx={width - 210 + 34 + (i % 4) * 34}
          cy={78 + Math.floor(i / 4) * 40}
          r={9}
          fill={hexA(COLORS.ink, 0.1)}
          stroke={hexA(COLORS.ink, 0.4)}
          strokeWidth={2}
        />
      ))}
      <text x={width - 125} y={214} textAnchor="middle" style={{ ...micro(18, 800, "0.1em") } as React.CSSProperties} fill={COLORS.slate}>
        EURORACK
      </text>
    </svg>
  );
};

/**
 * CHANNEL CAPACITY BARS — the single clearest picture of the whole narrative:
 * the engine bar is identical for all three, only the channel bar grows.
 */
export const CapacityBars: React.FC<{ delay?: number; highlight?: "m2" | "m4" | "m6" | null }> = ({
  delay = 0,
  highlight = null,
}) => {
  const frame = useCurrentFrame();
  const rows = [
    { key: "m2", name: "M2", ch: 2, io: "2 in / 2 out" },
    { key: "m4", name: "M4", ch: 4, io: "4 in / 4 out" },
    { key: "m6", name: "M6", ch: 6, io: "6 in / 4 out" },
  ] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26, width: "100%" }}>
      {rows.map((r, i) => {
        const t = ramp(frame, delay + i * 9, 30, EASE.out);
        const dim = highlight && highlight !== r.key ? 0.34 : 1;
        return (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 26, opacity: t * dim }}>
            <span style={{ ...spec(40, 800, "0.02em"), color: COLORS.ink, width: 92 }}>{r.name}</span>
            <div style={{ display: "flex", gap: 9, flex: 1 }}>
              {Array.from({ length: 6 }).map((_, k) => {
                const on = k < r.ch;
                const kt = ramp(frame, delay + i * 9 + 8 + k * 4, 14, EASE.out);
                return (
                  <div
                    key={k}
                    style={{
                      flex: 1,
                      height: 46,
                      borderRadius: 10,
                      background: on ? hexA(COLORS.signal, 0.16 + 0.5 * kt) : hexA(COLORS.ink, 0.05),
                      border: `2px solid ${on ? hexA(COLORS.signal, 0.55) : hexA(COLORS.ink, 0.1)}`,
                      transform: on ? `scaleY(${0.72 + 0.28 * kt})` : "none",
                    }}
                  />
                );
              })}
            </div>
            <span style={{ ...micro(21, 700, "0.12em"), color: COLORS.slate, width: 190, textAlign: "right" }}>
              {r.io}
            </span>
          </div>
        );
      })}
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 6 }}>
        <span style={{ ...micro(21, 800, "0.14em"), color: COLORS.motuBlue, width: 92 }}>ALL</span>
        <div
          style={{
            flex: 1,
            height: 12,
            borderRadius: 6,
            background: `linear-gradient(90deg, ${COLORS.motuBlue}, ${COLORS.motuBlueSoft})`,
            opacity: ramp(frame, delay + 34, 26, EASE.out),
          }}
        />
        <span style={{ ...micro(21, 800, "0.12em"), color: COLORS.motuBlue, width: 190, textAlign: "right" }}>
          One engine
        </span>
      </div>
    </div>
  );
};

/**
 * LCD METER — an animated stand-in for the 160x120 full-colour display, used
 * where the narration is about metering rather than about a specific photo.
 * Bars move to an implied performance; they are decorative, not a claim.
 */
export const LcdMeter: React.FC<{
  delay?: number;
  channels?: number;
  width?: number;
  height?: number;
}> = ({ delay = 0, channels = 6, width = 520, height = 300 }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 22, EASE.out);
  const pad = 18;
  const bw = (width - pad * 2) / channels - 10;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 14,
        background: "#0B0D0F",
        border: `3px solid ${hexA(COLORS.ink, 0.55)}`,
        padding: pad,
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        opacity: t,
        boxShadow: `0 14px 40px ${hexA(COLORS.ink, 0.22)}`,
      }}
    >
      {Array.from({ length: channels }).map((_, i) => {
        const f = frame - delay;
        const lvl =
          0.32 +
          0.34 * Math.abs(Math.sin(f / (9 + i * 2.1) + i)) +
          0.22 * Math.abs(Math.sin(f / (3.4 + i * 0.7)));
        const h = Math.min(1, lvl) * (height - pad * 2);
        return (
          <div
            key={i}
            style={{
              width: bw,
              height: h,
              borderRadius: 3,
              background: `linear-gradient(to top, #16C46A 0%, #16C46A 58%, #E8C21C 78%, #E24A34 100%)`,
              opacity: ramp(frame, delay + 6 + i * 3, 12, EASE.out),
            }}
          />
        );
      })}
    </div>
  );
};
