import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { ACCENT, FONT, GROUND, INK, MODELS, SPEC, formatFor } from "./theme.ts";
import { LINEUP_3Q, img } from "./assets.ts";
import { FONT_FACE_CSS } from "./fonts.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE COVERS
//
// A cover is read at thumbnail size in a grid, so it has to survive being
// small — but it also has to survive being looked at, and the first pass did
// not: three units, one line and a lot of empty frame.
//
// It now carries the film's actual argument rather than decoration:
//
//   the shared rail   the four numbers that are the SAME in all three, which
//                     is the whole thesis — nothing here is per-model
//   the lineup        the three units at their real relative widths, each
//                     labelled with the one thing that differs: its counts
//   the headline      the thesis in words
//   the meter motif   a six-channel bar echoing the LCD on the hardware, so
//                     the frame reads as audio rather than as a product shelf
//
// NO LOGOS. Neither mark appears on either cover, by instruction — and the
// films carry none until their end screens either, so a branded cover would
// contradict them.
// ─────────────────────────────────────────────────────────────────────────────

const CHIPS = [
  { k: "SABRE32", v: "ESS ULTRA DAC" },
  { k: `${SPEC.dynamicRange} dB`, v: "DYNAMIC RANGE" },
  { k: `${SPEC.ein} dBu`, v: "INPUT NOISE" },
  { k: `${SPEC.roundTrip} ms`, v: "ROUND TRIP" },
];

/** The colour meter that runs on every one of these units. */
const Meter: React.FC<{ S: number; w: number; h: number; seed: number }> = ({ S, w, h, seed }) => {
  const bars = 6;
  return (
    <div style={{ display: "flex", gap: 3 * S, width: w, height: h, alignItems: "flex-end" }}>
      {Array.from({ length: bars }, (_, i) => {
        const t = ((Math.sin(seed * 12.9898 + i * 4.1414) + 1) / 2) * 0.62 + 0.30;
        return (
          <div key={i} style={{ flex: 1, height: `${t * 100}%`, borderRadius: 1.5 * S, overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
            <div style={{ height: "62%", background: "#2ECC63" }} />
            <div style={{ height: "26%", background: "#E8C22B" }} />
            <div style={{ height: "12%", background: "#D8432E" }} />
          </div>
        );
      })}
    </div>
  );
};

export const Thumbnail: React.FC = () => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const P = fmt.portrait;
  const S = W / (P ? 2160 : 3840);
  const acc = ACCENT.shared;
  const sig = ACCENT.signal;
  const hair = "rgba(255,255,255,0.14)";

  return (
    <AbsoluteFill style={{ background: GROUND.dark, overflow: "hidden", fontFamily: FONT.display }}>
      <style>{FONT_FACE_CSS}</style>

      {/* room */}
      <AbsoluteFill style={{ background: `radial-gradient(110% 76% at 50% 26%, ${sig.glow}1F 0%, ${acc.glow}0A 44%, transparent 78%)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 46%, ${GROUND.darkSink} 100%)` }} />
      {/* a faint rule grid, so the frame has structure instead of void */}
      <AbsoluteFill style={{
        backgroundImage: `repeating-linear-gradient(0deg, ${hair} 0 1px, transparent 1px ${Math.round(120 * S)}px)`,
        opacity: 0.30,
      }} />

      {/* corner ticks */}
      {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([x, y], i) => (
        <div key={i} style={{
          position: "absolute",
          left: x ? undefined : fmt.safe.left * 0.55, right: x ? fmt.safe.right * 0.55 : undefined,
          top: y ? undefined : fmt.safe.top * 0.55, bottom: y ? fmt.safe.bottom * 0.30 : undefined,
          width: 54 * S, height: 54 * S,
          borderLeft: x ? "none" : `${3 * S}px solid ${sig.glow}`,
          borderRight: x ? `${3 * S}px solid ${sig.glow}` : "none",
          borderTop: y ? "none" : `${3 * S}px solid ${sig.glow}`,
          borderBottom: y ? `${3 * S}px solid ${sig.glow}` : "none",
          opacity: 0.55,
        }} />
      ))}

      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "space-between",
        padding: `${fmt.safe.top * (P ? 0.72 : 0.62)}px ${fmt.safe.left}px ${fmt.safe.bottom * (P ? 0.34 : 0.50)}px`,
      }}>

        {/* ── the shared rail: what does NOT change ─────────────────────── */}
        <div style={{ width: "100%" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 14 * S,
            marginBottom: 16 * S, justifyContent: "center",
          }}>
            <div style={{ height: 2 * S, flex: 1, background: hair }} />
            <span style={{ fontSize: (P ? 40 : 32) * S, letterSpacing: 8 * S, color: sig.glow }}>
              IDENTICAL IN ALL THREE
            </span>
            <div style={{ height: 2 * S, flex: 1, background: hair }} />
          </div>
          <div style={{ display: "flex", gap: (P ? 16 : 22) * S, justifyContent: "center" }}>
            {CHIPS.map((c) => (
              <div key={c.v} style={{
                flex: 1, textAlign: "center",
                padding: `${(P ? 26 : 22) * S}px ${10 * S}px`,
                borderRadius: 12 * S,
                background: "rgba(255,255,255,0.045)",
                border: `${Math.max(1, 2 * S)}px solid ${sig.glow}3A`,
              }}>
                <div style={{ fontSize: (P ? 60 : 52) * S, color: INK.onDark, letterSpacing: 0, whiteSpace: "nowrap" }}>{c.k}</div>
                <div style={{ marginTop: 8 * S, fontSize: (P ? 30 : 25) * S, letterSpacing: 4 * S, color: INK.onDarkDim, whiteSpace: "nowrap" }}>{c.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── the lineup: what DOES change ─────────────────────────────── */}
        <div style={{
          display: "flex", flexDirection: P ? "column" : "row",
          alignItems: "center", justifyContent: "center", gap: (P ? 34 : 54) * S, width: "100%",
        }}>
          {LINEUP_3Q.map(({ slug, rel }, i) => {
            const m = MODELS[i];
            return (
              <div key={slug} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 * S }}>
                <Img src={staticFile(img(slug).file)} style={{
                  width: (P ? 1500 : 1010) * S * rel, height: "auto",
                  filter: `saturate(1.06) drop-shadow(0 ${14 * S}px ${22 * S}px rgba(0,0,0,0.6))`,
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14 * S }}>
                  <span style={{ fontSize: (P ? 62 : 52) * S, letterSpacing: 3 * S, color: INK.onDark }}>{m.short}</span>
                  <div style={{ width: 2 * S, height: (P ? 34 : 28) * S, background: hair }} />
                  <span style={{ fontSize: (P ? 38 : 32) * S, letterSpacing: 3 * S, color: sig.glow }}>
                    {m.inputs} IN / {m.outputs} OUT
                  </span>
                  <Meter S={S} w={(P ? 96 : 78) * S} h={(P ? 44 : 36) * S} seed={i + 1} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── the thesis ───────────────────────────────────────────────── */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: (P ? 196 : 158) * S, lineHeight: 1.02, letterSpacing: -1 * S,
            color: INK.onDark, textShadow: `0 ${6 * S}px 0 rgba(0,0,0,0.72)`,
          }}>
            THE SAME MACHINE
          </div>
          <div style={{
            fontFamily: FONT.script, fontSize: (P ? 268 : 222) * S, lineHeight: 1.0,
            color: sig.glow, textShadow: `0 ${7 * S}px 0 rgba(0,0,0,0.72)`, marginTop: 6 * S,
          }}>
            three sizes
          </div>
          <div style={{
            marginTop: 18 * S, fontSize: (P ? 40 : 33) * S, letterSpacing: 7 * S, color: INK.onDarkSoft,
          }}>
            YOU DO NOT STEP UP TO A BETTER SOUND
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
