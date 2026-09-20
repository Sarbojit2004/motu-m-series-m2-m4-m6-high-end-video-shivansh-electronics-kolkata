import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { ACCENT, FONT, INK, formatFor, MODELS, type AccentKey } from "../theme.ts";

// ─────────────────────────────────────────────────────────────────────────────
// DEMONSTRATIVES
//
// The graphics that make a claim checkable rather than merely audible. Every
// number drawn below was read off the 4096 px plan views in this repository —
// the gain scale really is marked +6 to +65, the mid really does sweep 150 Hz
// to 3 kHz, the meter really does print dBu and dBFS side by side, and the
// Lexicon table really is two banks of sixteen with those names on it.
//
// All of them are SVG or plain boxes with hard shadows. Nothing here uses
// filter: blur() or drop-shadow(): at 4K those are full-surface convolutions
// that run on every frame, and a single careless one costs more than the rest
// of the frame put together.
//
// Everything takes a `width` and derives its own geometry from it, so the same
// component draws correctly in a 2160 px-wide column and a 3840 px-wide one.
// ─────────────────────────────────────────────────────────────────────────────

const HARD = (px: number) => `0 ${px}px ${px * 2}px rgba(0,0,0,0.92), 0 0 ${px}px rgba(0,0,0,0.8)`;

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

type Base = { accent: AccentKey; f: number; width: number };

// ── the chapter tag ──────────────────────────────────────────────────────────

export const ChapterTag: React.FC<{ accent: AccentKey; label: string; intro: number; width: number }> = ({
  accent, label, intro, width,
}) => {
  const acc = ACCENT[accent];
  const h = width * 0.030;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: width * 0.016, opacity: intro }}>
      <div
        style={{
          width: width * 0.0075,
          height: h,
          background: acc.glow,
          transform: `scaleY(${interpolate(intro, [0, 1], [0.2, 1])})`,
          transformOrigin: "50% 50%",
        }}
      />
      <div
        style={{
          fontFamily: FONT.display,
          fontSize: h * 0.72,
          letterSpacing: h * 0.13,
          color: acc.glow,
          textTransform: "uppercase",
          textShadow: HARD(Math.round(h * 0.06)),
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ── position through the film ────────────────────────────────────────────────

export const ProgressRule: React.FC<{ p: number; accent: AccentKey; width: number }> = ({ p, accent, width }) => {
  const acc = ACCENT[accent];
  const h = Math.max(4, Math.round(width / 360));
  return (
    <div style={{ width, height: h, background: "rgba(255,255,255,0.16)", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${clamp01(p) * 100}%`, background: acc.glow }} />
    </div>
  );
};

// ── the extra facts the voice does not have time for ─────────────────────────

export const SpecChips: React.FC<Base & { items: string[] }> = ({ items, accent, f, width }) => {
  const { fps } = useVideoConfig();
  const acc = ACCENT[accent];
  const size = width * 0.0215;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: width * 0.011, width }}>
      {items.map((t, i) => {
        const s = spring({ frame: f - 8 - i * 4, fps, config: { damping: 200, mass: 0.45 }, durationInFrames: 14 });
        return (
          <div
            key={t}
            style={{
              fontFamily: FONT.display,
              fontSize: size,
              letterSpacing: size * 0.1,
              color: INK.onDark,
              textTransform: "uppercase",
              padding: `${size * 0.42}px ${size * 0.72}px`,
              border: `${Math.max(2, size * 0.075)}px solid ${acc.glow}66`,
              background: "rgba(8,10,14,0.42)",
              opacity: s,
              transform: `translateY(${interpolate(s, [0, 1], [18, 0])}px)`,
              textShadow: HARD(Math.round(size * 0.08)),
            }}
          >
            {t}
          </div>
        );
      })}
    </div>
  );
};

// ── the gain scale ───────────────────────────────────────────────────────────

/**
 * The preamp's own arc, +6 to +65, with the pointer travelling up it.
 *
 * Drawn as the actual dial rather than as a bar chart, because the number on
 * screen is a number printed on the panel and the viewer should recognise it
 * when the detail shot arrives.
 */
export const GainDial: React.FC<Base & { to?: number }> = ({ accent, f, width, to = 65 }) => {
  const acc = ACCENT[accent];
  const S = width * 0.30;
  const cx = S / 2;
  const cy = S * 0.56;
  const r = S * 0.34;
  const A0 = 150;
  const A1 = 390;
  const p = ease(clamp01(f / 34));
  const v = interpolate(p, [0, 1], [6, to]);
  const ang = interpolate(v, [6, 65], [A0, A1]);
  const pt = (a: number, rr: number) => [cx + rr * Math.cos((a * Math.PI) / 180), cy + rr * Math.sin((a * Math.PI) / 180)];
  const [ax, ay] = pt(A0, r);
  const [bx, by] = pt(ang, r);
  const [ex, ey] = pt(A1, r);
  const big = ang - A0 > 180 ? 1 : 0;

  return (
    <div style={{ width: S, position: "relative" }}>
      <svg width={S} height={S * 0.82} viewBox={`0 0 ${S} ${S * 0.82}`}>
        <path d={`M ${ax} ${ay} A ${r} ${r} 0 1 1 ${ex} ${ey}`} stroke="rgba(255,255,255,0.20)" strokeWidth={S * 0.045} fill="none" strokeLinecap="round" />
        <path d={`M ${ax} ${ay} A ${r} ${r} 0 ${big} 1 ${bx} ${by}`} stroke={acc.glow} strokeWidth={S * 0.045} fill="none" strokeLinecap="round" />
        {Array.from({ length: 13 }).map((_, i) => {
          const a = A0 + ((A1 - A0) * i) / 12;
          const [x1, y1] = pt(a, r * 0.80);
          const [x2, y2] = pt(a, r * 0.90);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.34)" strokeWidth={S * 0.008} />;
        })}
        <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#FFFFFF" strokeWidth={S * 0.022} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={S * 0.045} fill="#FFFFFF" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: S * 0.40,
          width: S,
          textAlign: "center",
          fontFamily: FONT.display,
          fontSize: S * 0.17,
          color: INK.onDark,
          letterSpacing: 2,
          textShadow: HARD(Math.round(S * 0.012)),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        +{Math.round(v)} dB
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT.display,
          fontSize: S * 0.072,
          letterSpacing: 2,
          color: INK.onDarkSoft,
          textShadow: HARD(Math.round(S * 0.008)),
        }}
      >
        <span>+6</span>
        <span>GHOST PREAMP</span>
        <span>+65</span>
      </div>
    </div>
  );
};

// ── the EQ curve, with the mid sweeping ──────────────────────────────────────

/**
 * The Sapphyre EQ drawn as the curve it makes, with the mid band travelling
 * from 150 Hz to 3 kHz — which is the one control that a specification sheet
 * cannot convey and a moving picture can.
 */
export const EqCurve: React.FC<Base> = ({ accent, f, width }) => {
  const acc = ACCENT[accent];
  const W = width;
  const H = width * 0.30;
  const pad = W * 0.05;
  const x = (hz: number) => pad + ((Math.log10(hz) - Math.log10(20)) / (Math.log10(20000) - Math.log10(20))) * (W - pad * 2);
  const y = (db: number) => H / 2 - (db / 18) * (H / 2 - H * 0.10);

  // The sweep runs 150 Hz -> 3 kHz and back, so the shot can be held.
  const t = clamp01(f / 150);
  const tri = t < 0.5 ? t * 2 : 2 - t * 2;
  const midHz = Math.pow(10, interpolate(ease(tri), [0, 1], [Math.log10(150), Math.log10(3000)]));
  const gain = interpolate(ease(clamp01(f / 26)), [0, 1], [0, 1]);

  const band = (hz: number, db: number, q: number, shelf: 0 | -1 | 1) => (freq: number) => {
    const o = Math.log10(freq / hz);
    if (shelf === 0) return db * Math.exp(-(o * o) / (2 * q * q));
    return (db / (1 + Math.exp(-(shelf > 0 ? o : -o) * 5)));
  };
  const lf = band(60, 7.5 * gain, 0, -1);
  const mf = band(midHz, 8.5 * gain, 0.22, 0);
  const hf = band(12000, 6.5 * gain, 0, 1);

  const pts: string[] = [];
  for (let i = 0; i <= 130; i++) {
    const hz = Math.pow(10, Math.log10(20) + (i / 130) * (Math.log10(20000) - Math.log10(20)));
    pts.push(`${i === 0 ? "M" : "L"} ${x(hz).toFixed(1)} ${y(lf(hz) + mf(hz) + hf(hz)).toFixed(1)}`);
  }

  const ticks: [number, string][] = [[60, "60"], [150, "150"], [1000, "1k"], [3000, "3k"], [12000, "12k"]];

  return (
    <div style={{ width: W }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <line x1={pad} y1={y(0)} x2={W - pad} y2={y(0)} stroke="rgba(255,255,255,0.22)" strokeWidth={Math.max(2, W / 900)} />
        {ticks.map(([hz, l]) => (
          <g key={hz}>
            <line x1={x(hz)} y1={H * 0.08} x2={x(hz)} y2={H * 0.92} stroke="rgba(255,255,255,0.11)" strokeWidth={Math.max(1, W / 1600)} />
            <text x={x(hz)} y={H * 0.99} fill="rgba(255,255,255,0.52)" fontFamily={FONT.display} fontSize={W * 0.020} textAnchor="middle">{l}</text>
          </g>
        ))}
        <path d={pts.join(" ")} stroke={acc.glow} strokeWidth={Math.max(3, W / 300)} fill="none" strokeLinejoin="round" />
        <circle cx={x(midHz)} cy={y(mf(midHz) + lf(midHz) + hf(midHz))} r={W * 0.011} fill="#FFFFFF" />
      </svg>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONT.display,
          fontSize: W * 0.021,
          letterSpacing: W * 0.002,
          color: INK.onDarkSoft,
          textShadow: HARD(Math.round(W * 0.002)),
        }}
      >
        <span>LF SHELF 60 Hz</span>
        <span style={{ color: acc.glow }}>MID SWEEP {midHz < 1000 ? `${Math.round(midHz)} Hz` : `${(midHz / 1000).toFixed(2)} kHz`}</span>
        <span>HF SHELF 12 kHz</span>
      </div>
    </div>
  );
};

// ── the compressor transfer curve ────────────────────────────────────────────

/**
 * OverEasy against a hard knee, drawn as the transfer curve.
 *
 * Both lines share a threshold; the difference is the shape of the corner, and
 * that shape is the entire reason the narration says "arrives gradually".
 */
export const CompCurve: React.FC<Base> = ({ accent, f, width }) => {
  const acc = ACCENT[accent];
  const W = width * 0.44;
  const H = W;
  const pad = W * 0.11;
  const g = (v: number) => pad + v * (W - pad * 2);
  const gy = (v: number) => H - pad - v * (H - pad * 2);

  const thr = 0.56;
  const ratio = 4;
  const hard = (i: number) => (i <= thr ? i : thr + (i - thr) / ratio);
  const knee = 0.34;
  const easy = (i: number) => {
    const d = i - thr;
    if (d < -knee) return i;
    if (d > knee) return thr + d / ratio;
    const a = (d + knee) / (2 * knee);
    return i - ((1 - 1 / ratio) * (d + knee) * a) / 2;
  };

  const reveal = clamp01((f - 8) / 34);
  const line = (fn: (i: number) => number, upTo: number) => {
    const out: string[] = [];
    for (let i = 0; i <= 80; i++) {
      const v = (i / 80) * upTo;
      out.push(`${i === 0 ? "M" : "L"} ${g(v).toFixed(1)} ${gy(fn(v)).toFixed(1)}`);
    }
    return out.join(" ");
  };

  return (
    <div style={{ width: W }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={pad} y={pad} width={W - pad * 2} height={H - pad * 2} fill="rgba(8,10,14,0.40)" stroke="rgba(255,255,255,0.14)" strokeWidth={Math.max(2, W / 400)} />
        <line x1={g(0)} y1={gy(0)} x2={g(1)} y2={gy(1)} stroke="rgba(255,255,255,0.20)" strokeWidth={Math.max(2, W / 500)} strokeDasharray={`${W / 60} ${W / 60}`} />
        <path d={line(hard, 1)} stroke="rgba(255,255,255,0.34)" strokeWidth={Math.max(2, W / 340)} fill="none" />
        <path d={line(easy, Math.max(0.001, reveal))} stroke={acc.glow} strokeWidth={Math.max(4, W / 170)} fill="none" strokeLinecap="round" />
        <line x1={g(thr)} y1={pad} x2={g(thr)} y2={H - pad} stroke={`${acc.glow}55`} strokeWidth={Math.max(2, W / 500)} />
        <text x={g(thr) + W * 0.02} y={pad + W * 0.06} fill={acc.glow} fontFamily={FONT.display} fontSize={W * 0.052} letterSpacing={1.4}>THRESHOLD</text>
      </svg>
      <div style={{ display: "flex", gap: W * 0.06, fontFamily: FONT.display, fontSize: W * 0.052, color: INK.onDarkSoft, textShadow: HARD(Math.round(W * 0.005)) }}>
        <span style={{ color: acc.glow }}>■ dbx OverEasy</span>
        <span>□ HARD KNEE</span>
      </div>
    </div>
  );
};

// ── the Lexicon bank ─────────────────────────────────────────────────────────

const FX_A = ["S.HALL", "L.HALL", "V.HALL", "D.HALL", "S.PLT", "L.PLT", "V.PLT", "D.PLT",
              "ROOM", "STUDIO", "CHMBR", "AMB", "ARENA", "GATED", "REV", "K.RAOKE"];
const FX_B = ["SPRING", "S.DLY", "D.DLY", "T.DLY", "P.DLY", "M.DLY", "R.DLY", "CHORUS",
              "FLANGR", "PHASER", "TREM/P", "VIBRTO", "RV/DL S", "RV/DL L", "PHSDEL", "ROTDEL"];

/**
 * The two banks of sixteen exactly as they are printed on the surface.
 *
 * Laid out as four columns of eight rather than two of sixteen: sixteen rows is
 * taller than the technical block has room for in either frame, and a list that
 * runs off the bottom of the picture reads as a mistake rather than as a spec.
 */
export const FxTable: React.FC<Base> = ({ accent, f, width }) => {
  const acc = ACCENT[accent];
  const W = width;
  const colW = W * 0.235;
  const rowH = colW * 0.235;
  const size = rowH * 0.56;
  const lit = Math.min(32, Math.max(0, Math.floor((f - 6) / 1.6)));

  const col = (names: string[], label: string, off: number) => (
    <div style={{ display: "flex", flexDirection: "column", gap: rowH * 0.10 }}>
      <div style={{ fontFamily: FONT.display, fontSize: size * 0.94, letterSpacing: 2.4, color: acc.glow, textShadow: HARD(2), paddingBottom: rowH * 0.14 }}>
        {label}
      </div>
      {names.map((n, i) => {
        const on = off + i < lit;
        return (
          <div
            key={n + off}
            style={{
              fontFamily: FONT.display,
              fontSize: size,
              letterSpacing: 1.0,
              color: on ? INK.onDark : "rgba(255,255,255,0.24)",
              background: on ? `${acc.key}99` : "rgba(255,255,255,0.05)",
              borderLeft: `${Math.max(3, W / 240)}px solid ${on ? acc.glow : "rgba(255,255,255,0.12)"}`,
              padding: `${rowH * 0.15}px ${rowH * 0.28}px`,
              width: colW,
              textShadow: HARD(2),
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: W * 0.018 }}>
      {col(FX_A.slice(0, 8), "A 1-8", 0)}
      {col(FX_A.slice(8), "A 9-16", 8)}
      {col(FX_B.slice(0, 8), "B 1-8", 16)}
      {col(FX_B.slice(8), "B 9-16", 24)}
    </div>
  );
};

// ── the dual meter ───────────────────────────────────────────────────────────

const DBU = [20, 16, 12, 8, 4, 0, -4, -8, -12, -16, -20, -24];
const DBFS = [0, -4, -8, -12, -16, -20, -24, -28, -32, -36, -40, -44];

/**
 * The SSM meter: analogue dBu and digital dBFS side by side, on the same rungs.
 *
 * Both scales are printed on the real panel and both are lit from the same
 * level here, which is exactly the point the narration makes — one desk, one
 * reading, no conversion in the engineer's head.
 */
export const MeterPair: React.FC<Base> = ({ accent, f, width }) => {
  const acc = ACCENT[accent];
  const W = width * 0.54;
  const rowH = W * 0.068;
  const size = rowH * 0.55;
  // A programme-like level: rises in, then breathes.
  const lvl = interpolate(ease(clamp01(f / 26)), [0, 1], [0, 8.4]) + Math.sin(f / 9) * 1.15 + Math.sin(f / 23) * 0.8;
  const litFrom = Math.max(0, Math.round(11 - lvl));

  return (
    <div style={{ width: W }}>
      {DBU.map((d, i) => {
        const on = i >= litFrom;
        const hot = i <= 2;
        const warm = i <= 4;
        const c = hot ? "#FF4B3A" : warm ? "#FFC940" : acc.glow;
        return (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: W * 0.05, height: rowH }}>
            <div style={{ width: W * 0.20, textAlign: "right", fontFamily: FONT.display, fontSize: size, color: INK.onDarkSoft, fontVariantNumeric: "tabular-nums", textShadow: HARD(2) }}>
              {d > 0 ? `+${d}` : d}
            </div>
            <div style={{ width: rowH * 0.62, height: rowH * 0.62, borderRadius: "50%", background: on ? c : "rgba(255,255,255,0.10)", border: `${Math.max(1, W / 400)}px solid rgba(255,255,255,0.18)` }} />
            <div style={{ width: rowH * 0.62, height: rowH * 0.62, borderRadius: "50%", background: on ? c : "rgba(255,255,255,0.10)", border: `${Math.max(1, W / 400)}px solid rgba(255,255,255,0.18)` }} />
            <div style={{ width: W * 0.22, fontFamily: FONT.display, fontSize: size, color: INK.onDarkSoft, fontVariantNumeric: "tabular-nums", textShadow: HARD(2) }}>
              {DBFS[i]}
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: W * 0.05, paddingTop: rowH * 0.3 }}>
        <div style={{ width: W * 0.20, textAlign: "right", fontFamily: FONT.display, fontSize: size * 1.05, letterSpacing: 2, color: acc.glow, textShadow: HARD(2) }}>dBu</div>
        <div style={{ width: rowH * 1.9 }} />
        <div style={{ fontFamily: FONT.display, fontSize: size * 1.05, letterSpacing: 2, color: acc.glow, textShadow: HARD(2) }}>dBFS</div>
      </div>
    </div>
  );
};

// ── the four consoles as channel counts ──────────────────────────────────────

/**
 * The lineup as what actually differs between the four: the number of strips.
 *
 * The master block is drawn identically on every row, at the same width, which
 * is the film's argument made visible — everything to the right of the faders
 * is the same desk four times over.
 */
export const ChannelLadder: React.FC<Base & { highlight?: number }> = ({ accent, f, width, highlight }) => {
  const acc = ACCENT[accent];
  const W = width;
  const rowH = W * 0.082;
  const gap = W * 0.018;
  const labelW = W * 0.34;
  const barW = W - labelW - W * 0.02;
  const maxStrips = 24;

  return (
    <div style={{ width: W, display: "flex", flexDirection: "column", gap }}>
      {MODELS.map((m, i) => {
        const on = clamp01((f - 6 - i * 7) / 16);
        const strips = m.mono;
        const unitW = (barW * 0.72) / maxStrips;
        const hot = highlight === m.total;
        return (
          <div key={m.short} style={{ display: "flex", alignItems: "center", gap: W * 0.02, opacity: on, transform: `translateX(${interpolate(on, [0, 1], [-W * 0.02, 0])}px)` }}>
            <div
              style={{
                width: labelW,
                fontFamily: FONT.display,
                fontSize: rowH * 0.50,
                letterSpacing: rowH * 0.05,
                color: hot ? acc.glow : INK.onDarkSoft,
                textShadow: HARD(3),
                textAlign: "right",
              }}
            >
              {m.name}
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: unitW * 0.22, height: rowH }}>
              {Array.from({ length: strips }).map((_, k) => (
                <div
                  key={k}
                  style={{
                    width: unitW * 0.74,
                    height: rowH * 0.80,
                    background: hot ? acc.glow : "rgba(255,255,255,0.82)",
                    opacity: clamp01((f - 8 - i * 7 - k * 0.7) / 8),
                  }}
                />
              ))}
              {/* the master block, identical on every row */}
              <div style={{ width: unitW * 0.5 }} />
              <div
                style={{
                  width: barW * 0.20,
                  height: rowH * 0.92,
                  background: `${acc.key}`,
                  border: `${Math.max(2, W / 700)}px solid ${acc.glow}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT.display,
                  fontSize: rowH * 0.32,
                  letterSpacing: rowH * 0.03,
                  color: acc.glow,
                  textShadow: HARD(2),
                }}
              >
                MASTER
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── the USB path ─────────────────────────────────────────────────────────────

/** Four channels out to the computer, four back — drawn as the path it is. */
export const UsbPath: React.FC<Base> = ({ accent, f, width }) => {
  const acc = ACCENT[accent];
  const W = width * 0.76;
  const H = W * 0.30;
  const on = clamp01((f - 6) / 22);
  const dash = -((f * 2.6) % 40);

  const lane = (i: number, dir: 1 | -1) => {
    const y = H * (0.20 + i * 0.20);
    return (
      <g key={`${dir}-${i}`}>
        <line
          x1={dir > 0 ? W * 0.22 : W * 0.78}
          y1={y}
          x2={dir > 0 ? W * 0.78 : W * 0.22}
          y2={y}
          stroke={dir > 0 ? acc.glow : "rgba(255,255,255,0.5)"}
          strokeWidth={Math.max(3, W / 260)}
          strokeDasharray="22 18"
          strokeDashoffset={dir > 0 ? dash : -dash}
          opacity={on}
        />
      </g>
    );
  };

  const box = (x: number, label: string) => (
    <g>
      <rect x={x} y={H * 0.08} width={W * 0.20} height={H * 0.84} fill="rgba(8,10,14,0.55)" stroke={`${acc.glow}88`} strokeWidth={Math.max(2, W / 420)} />
      <text x={x + W * 0.10} y={H * 0.56} fill={INK.onDark} fontFamily={FONT.display} fontSize={W * 0.035} letterSpacing={2} textAnchor="middle">{label}</text>
    </g>
  );

  return (
    <div style={{ width: W }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {box(W * 0.02, "DESK")}
        {box(W * 0.78, "COMPUTER")}
        {[0, 1].map((i) => lane(i, 1))}
        {[2, 3].map((i) => lane(i, -1))}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.display, fontSize: W * 0.032, letterSpacing: 2, color: INK.onDarkSoft, textShadow: HARD(2) }}>
        <span style={{ color: acc.glow }}>4 OUT — RECORD &amp; STREAM</span>
        <span>4 IN — PLAYBACK &amp; RETURN</span>
      </div>
    </div>
  );
};

// ── aux routing ──────────────────────────────────────────────────────────────

/** Four aux sends, each switchable pre or post fade, plus mix-to-aux. */
export const AuxMatrix: React.FC<Base> = ({ accent, f, width }) => {
  const acc = ACCENT[accent];
  const W = width * 0.96;
  const rowH = W * 0.088;
  const size = rowH * 0.34;
  const rows: [string, string, string][] = [
    ["A1", "PRE FADE", "WEDGE — IGNORES THE FADER"],
    ["A2", "PRE FADE", "IN-EAR — INDEPENDENT"],
    ["A3", "POST FADE", "EFFECTS — FOLLOWS THE FADER"],
    ["A4", "POST FADE", "RECORD / BROADCAST"],
  ];
  return (
    <div style={{ width: W, display: "flex", flexDirection: "column", gap: rowH * 0.16 }}>
      {rows.map(([a, mode, use], i) => {
        const on = clamp01((f - 6 - i * 6) / 14);
        const pre = mode === "PRE FADE";
        return (
          <div key={a} style={{ display: "flex", alignItems: "center", gap: W * 0.028, opacity: on, transform: `translateX(${interpolate(on, [0, 1], [-W * 0.03, 0])}px)` }}>
            <div style={{ flex: "0 0 auto", width: rowH * 1.1, height: rowH * 0.78, background: acc.key, border: `${Math.max(2, W / 500)}px solid ${acc.glow}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: size * 1.05, color: acc.glow, textShadow: HARD(2) }}>
              {a}
            </div>
            {/* Both columns are nowrap: at this size "PRE FADE" wrapped onto two
                lines and ran into the description beside it. */}
            <div style={{ flex: "0 0 auto", width: W * 0.22, whiteSpace: "nowrap", fontFamily: FONT.display, fontSize: size * 0.94, letterSpacing: 1.6, color: pre ? acc.glow : "rgba(255,255,255,0.66)", textShadow: HARD(2) }}>{mode}</div>
            <div style={{ whiteSpace: "nowrap", fontFamily: FONT.display, fontSize: size * 0.94, letterSpacing: 1.2, color: INK.onDarkSoft, textShadow: HARD(2) }}>{use}</div>
          </div>
        );
      })}
    </div>
  );
};
