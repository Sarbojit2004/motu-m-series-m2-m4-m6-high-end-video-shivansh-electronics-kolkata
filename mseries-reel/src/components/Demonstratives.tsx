import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, FONT, INK, SAFE, type ProductKey } from "../theme.ts";

// ─────────────────────────────────────────────────────────────────────────────
// DEMONSTRATIVES — the graphics that EXPLAIN rather than decorate.
//
// The brief asked for extra product text, extra animation and extra
// demonstratives. The temptation is to answer that with more motion. The
// problem this reel actually has is different and much more specific:
//
//   the M2, the M4 and the M6 are the same chassis, the same finish, the same
//   knobs and the same badge position. On a phone, at a glance, in a feed, the
//   photographs of the three products are indistinguishable.
//
// So the extra graphics here all do one job — make the DIFFERENCE visible,
// because the difference is the entire argument of the script. The input ladder
// is the reel's central demonstrative: two lit slots, then four, then six. A
// viewer who reads nothing and hears nothing still comes away with the point.
//
// Everything is drawn with transforms, gradients and solid fills. No blur, no
// drop-shadow filter — see Transitions.tsx for why that matters at 4K.
// ─────────────────────────────────────────────────────────────────────────────

/** The hard, tight shadow that buys contrast back for transparent overlays. */
const HARD = (px: number) =>
  `0 ${px}px ${px * 2.2}px rgba(0,0,0,0.92), 0 0 ${px}px rgba(0,0,0,0.78)`;

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

// ── Reel progress ────────────────────────────────────────────────────────────

/** A hairline showing position through the reel. Sits on the safe-box ceiling. */
export const ProgressRule: React.FC<{ p: number; product: ProductKey }> = ({ p, product }) => {
  const accent = ACCENT[product];
  return (
    <div style={{ position: "relative", height: 6, background: "rgba(255,255,255,0.20)", borderRadius: 3 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${Math.min(1, Math.max(0, p)) * 100}%`,
          background: accent.glow,
          borderRadius: 3,
          boxShadow: `0 0 24px ${accent.glow}`,
        }}
      />
    </div>
  );
};

// ── Product tag ──────────────────────────────────────────────────────────────

/**
 * The persistent product identifier.
 *
 * Not branding — this is the label that tells a viewer which of three
 * identical-looking boxes is currently on screen, and it is the reason the
 * reel can cut between them at all. It carries no logo and no company name.
 */
export const ProductTag: React.FC<{ product: ProductKey; intro: number }> = ({ product, intro }) => {
  const accent = ACCENT[product];
  if (product === "shared") return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 22,
        opacity: intro,
        transform: `translateX(${interpolate(intro, [0, 1], [-34, 0])}px)`,
      }}
    >
      <div style={{ width: 12, height: 62, background: accent.glow, boxShadow: `0 0 26px ${accent.glow}` }} />
      <div
        style={{
          fontFamily: FONT.display,
          fontSize: 66,
          letterSpacing: 7,
          color: accent.glow,
          textShadow: HARD(4),
        }}
      >
        {accent.short}
      </div>
    </div>
  );
};

// ── The input ladder ─────────────────────────────────────────────────────────

export type IoSpec = { mic: number; line: number; out: number; phones: number };

export const IO: Record<"pm2" | "pm4" | "pm6", IoSpec> = {
  // Counts read off the supplied panel photography and the product
  // documentation in the repository root.
  pm2: { mic: 2, line: 0, out: 2, phones: 1 },
  pm4: { mic: 2, line: 2, out: 4, phones: 1 },
  pm6: { mic: 4, line: 2, out: 4, phones: 2 },
};

/** Six is the widest ladder, so every product's slots share one pitch. */
const SLOTS = 6;

const Slot: React.FC<{
  label: string;
  lit: number;
  accent: string;
  width: number;
  filled: boolean;
}> = ({ label, lit, accent, width, filled }) => (
  <div
    style={{
      width,
      height: 116,
      borderRadius: 14,
      border: `4px solid ${filled ? accent : "rgba(255,255,255,0.55)"}`,
      background: filled
        ? `linear-gradient(180deg, ${accent}E6 0%, ${accent}8C 100%)`
        : "rgba(255,255,255,0.10)",
      boxShadow: filled ? `0 0 ${28 * lit}px ${accent}` : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT.display,
      fontSize: 30,
      letterSpacing: 2.4,
      color: filled ? "#0B0A08" : "rgba(255,255,255,0.8)",
      opacity: lit,
      transform: `translateY(${interpolate(lit, [0, 1], [26, 0])}px) scale(${interpolate(lit, [0, 1], [0.82, 1])})`,
    }}
  >
    {label}
  </div>
);

/**
 * The reel's central graphic: how many things you can record AT ONCE.
 *
 * Slots light in sequence, and the count beside them advances with them, so the
 * number is read twice — once as a numeral and once as a quantity. The empty
 * slots stay drawn rather than omitted, which is what makes the M2's ladder
 * legible as "two of a possible six" instead of just "two".
 */
export const IoLadder: React.FC<{ product: "pm2" | "pm4" | "pm6"; f: number; width: number }> = ({
  product,
  f,
  width,
}) => {
  const { fps } = useVideoConfig();
  const accent = ACCENT[product];
  const spec = IO[product];
  const total = spec.mic + spec.line;

  const gap = 18;
  const slotW = (width - gap * (SLOTS - 1)) / SLOTS;

  const litFor = (i: number) =>
    spring({ frame: f - 10 - i * 5, fps, config: { damping: 200, mass: 0.4 }, durationInFrames: 12 });

  // The count follows the slots rather than running its own clock.
  let counted = 0;
  for (let i = 0; i < total; i++) if (litFor(i) > 0.55) counted++;

  const head = spring({ frame: f, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: 14 });
  const outIn = spring({ frame: f - 30, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: 16 });

  return (
    <div style={{ width, fontFamily: FONT.display }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          opacity: head,
          transform: `translateY(${interpolate(head, [0, 1], [18, 0])}px)`,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 38, letterSpacing: 5.2, color: INK.onDark, textShadow: HARD(3) }}>
          SIMULTANEOUS INPUTS
        </div>
        <div
          style={{
            fontSize: 92,
            lineHeight: 0.9,
            color: accent.glow,
            letterSpacing: -1,
            textShadow: HARD(4),
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {counted}
        </div>
      </div>

      <div style={{ display: "flex", gap }}>
        {Array.from({ length: SLOTS }).map((_, i) => {
          const filled = i < total;
          const label = i < spec.mic ? "MIC" : filled ? "LINE" : "—";
          return (
            <Slot
              key={i}
              label={label}
              lit={filled ? litFor(i) : head * 0.55}
              accent={accent.glow}
              width={slotW}
              filled={filled}
            />
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 26,
          marginTop: 22,
          opacity: outIn,
          transform: `translateX(${interpolate(outIn, [0, 1], [-24, 0])}px)`,
        }}
      >
        <div style={{ fontSize: 34, letterSpacing: 4.6, color: INK.onDarkSoft, textShadow: HARD(3) }}>
          OUTPUTS
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                border: `4px solid ${i < spec.out ? accent.glow : "rgba(255,255,255,0.45)"}`,
                background: i < spec.out ? accent.glow : "transparent",
                boxShadow: i < spec.out ? `0 0 18px ${accent.glow}` : "none",
                transform: `scale(${interpolate(
                  spring({ frame: f - 34 - i * 4, fps, config: { damping: 200 }, durationInFrames: 10 }),
                  [0, 1],
                  [0.4, 1],
                )})`,
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 34, letterSpacing: 4.6, color: INK.onDarkSoft, textShadow: HARD(3), marginLeft: 18 }}>
          {spec.phones === 2 ? "TWO HEADPHONE MIXES" : "HEADPHONES"}
        </div>
      </div>
    </div>
  );
};

// ── Spec chips — the extra product text ──────────────────────────────────────

export const SpecChips: React.FC<{
  items: string[];
  product: ProductKey;
  f: number;
  width: number;
}> = ({ items, product, f, width }) => {
  const { fps } = useVideoConfig();
  const accent = ACCENT[product];
  return (
    <div style={{ width, display: "flex", flexWrap: "wrap", gap: 16, fontFamily: FONT.display }}>
      {items.map((s, i) => {
        const p = spring({
          frame: f - 46 - i * 9,
          fps,
          config: { damping: 200, mass: 0.45 },
          durationInFrames: 14,
        });
        return (
          <div
            key={s}
            style={{
              fontSize: 38,
              letterSpacing: 3.0,
              color: INK.onDark,
              padding: "14px 26px",
              border: `3px solid ${accent.glow}99`,
              borderRadius: 999,
              background: "rgba(8,8,10,0.34)",
              textShadow: HARD(3),
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {s}
          </div>
        );
      })}
    </div>
  );
};

// ── Engine demonstratives ────────────────────────────────────────────────────

/**
 * A labelled scale with a fill that sweeps to the value.
 *
 * "120 dB of dynamic range" is a number a viewer cannot picture. Drawn against
 * a scale it becomes a proportion, which they can.
 */
export const ScaleMeter: React.FC<{
  title: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  product: ProductKey;
  f: number;
  width: number;
  /**
   * Which side of the value the accent fill occupies.
   *
   * "min"   the bar grows from the floor to the value — a quantity. Used for
   *         dynamic range, where 120 out of a possible 140 is the point.
   * "value" the bar runs from the value up to the ceiling — a headroom. Used
   *         for the noise figure, where the meaningful reading is not "129" but
   *         "everything above it is signal". Filling to −129 on a −140..0 scale
   *         would draw a 7%% sliver that looks like a broken meter and says the
   *         opposite of what the number means.
   */
  fillFrom?: "min" | "value";
}> = ({ title, value, min, max, unit, product, f, width, fillFrom = "min" }) => {
  const { fps } = useVideoConfig();
  const accent = ACCENT[product];
  const head = spring({ frame: f, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: 12 });
  const sweep = ease(Math.min(1, Math.max(0, (f - 6) / 26)));
  const shown = min + (value - min) * sweep;
  const pct = ((shown - min) / (max - min)) * 100;
  const dec = Math.abs(value) < 10 ? 1 : 0;

  return (
    <div style={{ width, fontFamily: FONT.display, opacity: head }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 38, letterSpacing: 5.2, color: INK.onDark, textShadow: HARD(3) }}>{title}</div>
        <div
          style={{
            fontSize: 96,
            lineHeight: 0.9,
            color: accent.glow,
            textShadow: HARD(4),
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {shown.toFixed(dec)}
          <span style={{ fontSize: 44, letterSpacing: 3, marginLeft: 14, color: INK.onDarkSoft }}>{unit}</span>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: 72,
          borderRadius: 12,
          background: "rgba(255,255,255,0.13)",
          border: "3px solid rgba(255,255,255,0.42)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: fillFrom === "min" ? 0 : `${pct}%`,
            width: fillFrom === "min" ? `${pct}%` : `${100 - pct}%`,
            background: `linear-gradient(90deg, ${accent.key} 0%, ${accent.glow} 100%)`,
            boxShadow: `0 0 30px ${accent.glow}`,
          }}
        />
        {fillFrom === "value" ? (
          <div
            style={{
              position: "absolute",
              left: `${pct}%`,
              top: -6,
              bottom: -6,
              width: 7,
              marginLeft: -3,
              background: "#FFF6E9",
              boxShadow: "0 0 26px rgba(255,246,233,0.9)",
            }}
          />
        ) : null}
        {/* Scale ticks, so the fill is read against something. */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(i / 14) * 100}%`,
              top: 0,
              bottom: 0,
              width: 2,
              background: "rgba(0,0,0,0.35)",
            }}
          />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <div style={{ fontSize: 28, letterSpacing: 3, color: INK.onDarkDim, textShadow: HARD(2) }}>{min}</div>
        <div style={{ fontSize: 28, letterSpacing: 3, color: INK.onDarkDim, textShadow: HARD(2) }}>{max}</div>
      </div>
    </div>
  );
};

/**
 * Round-trip latency drawn as a journey rather than a number: a pulse leaving
 * the input, crossing the converter, and arriving back at the output.
 */
export const LatencyTrace: React.FC<{ product: ProductKey; f: number; width: number }> = ({
  product,
  f,
  width,
}) => {
  const { fps } = useVideoConfig();
  const accent = ACCENT[product];
  const head = spring({ frame: f, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: 12 });
  // A 36-frame loop so the pulse crosses about twice while the line is spoken.
  const t = ((f % 36) / 36);
  const x = ease(t);

  const Node: React.FC<{ label: string; at: number }> = ({ label, at }) => (
    <div
      style={{
        position: "absolute",
        left: `${at}%`,
        top: 0,
        transform: "translateX(-50%)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          border: `4px solid ${accent.glow}`,
          background: "rgba(8,8,10,0.6)",
          margin: "0 auto 12px",
        }}
      />
      <div style={{ fontSize: 28, letterSpacing: 3.2, color: INK.onDarkSoft, textShadow: HARD(2) }}>{label}</div>
    </div>
  );

  return (
    <div style={{ width, fontFamily: FONT.display, opacity: head }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 26,
        }}
      >
        <div style={{ fontSize: 38, letterSpacing: 5.2, color: INK.onDark, textShadow: HARD(3) }}>ROUND TRIP</div>
        <div
          style={{
            fontSize: 96,
            lineHeight: 0.9,
            color: accent.glow,
            textShadow: HARD(4),
            fontVariantNumeric: "tabular-nums",
          }}
        >
          2.5
          <span style={{ fontSize: 44, letterSpacing: 3, marginLeft: 14, color: INK.onDarkSoft }}>ms</span>
        </div>
      </div>

      <div style={{ position: "relative", height: 100 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 11,
            height: 4,
            background: "rgba(255,255,255,0.30)",
          }}
        />
        {/* The pulse. */}
        <div
          style={{
            position: "absolute",
            left: `${x * 100}%`,
            top: 0,
            width: 26,
            height: 26,
            marginLeft: -13,
            borderRadius: 13,
            background: accent.glow,
            boxShadow: `0 0 34px ${accent.glow}`,
            opacity: interpolate(t, [0, 0.06, 0.94, 1], [0, 1, 1, 0]),
          }}
        />
        <Node label="IN" at={0} />
        <Node label="CONVERT" at={50} />
        <Node label="OUT" at={100} />
      </div>
    </div>
  );
};

// ── The comparison ladder — the reel's closing argument ──────────────────────

/**
 * Three ladders side by side: two lit slots, four, six.
 *
 * This is the frame the whole script is built to arrive at. "Choose by how many
 * inputs you need" is an instruction; this is the same instruction as a picture,
 * and it is the one thing a viewer could screenshot and act on. Each column
 * keeps its product's own accent, which is the colour that has been identifying
 * it for the previous minute — so the graphic is legible without re-reading the
 * labels.
 */
export const LadderCompare: React.FC<{ f: number; width: number }> = ({ f, width }) => {
  const { fps } = useVideoConfig();
  const keys = ["pm2", "pm4", "pm6"] as const;
  const colGap = 26;
  const colW = (width - colGap * 2) / 3;
  const cellGap = 8;
  const cellW = (colW - cellGap * 5) / 6;

  const head = spring({ frame: f, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: 14 });

  return (
    <div style={{ width, fontFamily: FONT.display }}>
      <div
        style={{
          fontSize: 38,
          letterSpacing: 5.2,
          color: INK.onDark,
          textShadow: HARD(3),
          marginBottom: 22,
          opacity: head,
          transform: `translateY(${interpolate(head, [0, 1], [18, 0])}px)`,
        }}
      >
        SIMULTANEOUS INPUTS
      </div>

      <div style={{ display: "flex", gap: colGap }}>
        {keys.map((k, ci) => {
          const accent = ACCENT[k];
          const spec = IO[k];
          const total = spec.mic + spec.line;
          const colIn = spring({
            frame: f - 8 - ci * 10,
            fps,
            config: { damping: 200, mass: 0.5 },
            durationInFrames: 16,
          });
          return (
            <div
              key={k}
              style={{
                width: colW,
                opacity: colIn,
                transform: `translateY(${interpolate(colIn, [0, 1], [30, 0])}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 54, letterSpacing: 4, color: accent.glow, textShadow: HARD(3) }}>
                  {accent.short}
                </div>
                <div
                  style={{
                    fontSize: 40,
                    color: INK.onDarkSoft,
                    textShadow: HARD(2),
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {total} IN
                </div>
              </div>
              <div style={{ display: "flex", gap: cellGap }}>
                {Array.from({ length: 6 }).map((_, i) => {
                  const filled = i < total;
                  const lit = spring({
                    frame: f - 18 - ci * 10 - i * 3,
                    fps,
                    config: { damping: 200, mass: 0.35 },
                    durationInFrames: 10,
                  });
                  return (
                    <div
                      key={i}
                      style={{
                        width: cellW,
                        height: 76,
                        borderRadius: 10,
                        border: `3px solid ${filled ? accent.glow : "rgba(255,255,255,0.42)"}`,
                        background: filled ? `${accent.glow}D9` : "rgba(255,255,255,0.08)",
                        boxShadow: filled ? `0 0 ${20 * lit}px ${accent.glow}` : "none",
                        opacity: filled ? lit : colIn * 0.7,
                        transform: `scaleY(${filled ? interpolate(lit, [0, 1], [0.3, 1]) : 1})`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
