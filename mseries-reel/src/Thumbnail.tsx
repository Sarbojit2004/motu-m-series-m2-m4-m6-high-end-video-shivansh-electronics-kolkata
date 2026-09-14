import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ACCENT, FONT, GROUND, INK, SAFE, TYPE, VIDEO } from "./theme.ts";
import { ASSETS } from "./assets.ts";
import { IO } from "./components/Demonstratives.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// THE THUMBNAIL — 2160 x 3840, one still.
//
// A thumbnail for this particular reel has an unusual job. The three products
// are visually identical, so a hero shot of any one of them is a picture of
// "a MOTU interface" and tells a browsing viewer nothing. What makes someone
// stop is the QUESTION the reel answers, and the question only exists once all
// three are in frame together.
//
// So the thumbnail is built as three labelled bands — M2, M4, M6, each with its
// input count and its own accent — under the reel's own caption lockup, set in
// the same two faces at full opacity. It is legible as a tile at 200 px wide:
// three colours, three numbers, one question.
//
// No logo, no company name, no number. The reel keeps all of that for its end
// screen and the poster follows the same rule.
// ─────────────────────────────────────────────────────────────────────────────

const HARD = "0 5px 12px rgba(0,0,0,0.94), 0 0 6px rgba(0,0,0,0.8)";

const HERO: Record<"pm2" | "pm4" | "pm6", string> = {
  pm2: "motu-m2-1-jpg",
  pm4: "motu-m4-7-jpg",
  pm6: "motu-m6-3-jpg",
};

const find = (slug: string) => ASSETS.find((a) => a.slug === slug)!;

const BAND_TOP = 1500;
const BAND_H = 700;

const Band: React.FC<{ product: "pm2" | "pm4" | "pm6"; i: number }> = ({ product, i }) => {
  const accent = ACCENT[product];
  const asset = find(HERO[product]);
  const n = IO[product].mic + IO[product].line;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: BAND_TOP + i * BAND_H,
        width: VIDEO.width,
        height: BAND_H,
        overflow: "hidden",
        borderTop: i === 0 ? "none" : "4px solid rgba(0,0,0,0.65)",
      }}
    >
      <Img
        src={staticFile(`images/${asset.file}`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 46%",
          filter: "brightness(0.86) contrast(1.12) saturate(1.06)",
        }}
      />
      {/* Left-weighted grade, so the label always has ground under it. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, rgba(5,5,7,0.90) 0%, rgba(5,5,7,0.55) 38%, rgba(5,5,7,0.14) 66%, rgba(5,5,7,0.40) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 18,
          background: accent.glow,
          boxShadow: `0 0 60px ${accent.glow}`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 44,
        }}
      >
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 150,
            letterSpacing: 6,
            color: accent.glow,
            textShadow: HARD,
            lineHeight: 0.9,
          }}
        >
          {accent.short}
        </div>
        <div style={{ width: 4, height: 120, background: "rgba(255,255,255,0.30)" }} />
        <div>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 104,
              color: INK.onDark,
              textShadow: HARD,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {n}
          </div>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 34,
              letterSpacing: 5,
              color: INK.onDarkSoft,
              textShadow: HARD,
              marginTop: 6,
            }}
          >
            INPUTS
          </div>
        </div>
      </div>

      {/* The slot ladder, repeated small — the reel's own graphic as a badge. */}
      <div style={{ position: "absolute", right: SAFE.right, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 10 }}>
        {Array.from({ length: 6 }).map((_, k) => (
          <div
            key={k}
            style={{
              width: 44,
              height: 106,
              borderRadius: 10,
              border: `4px solid ${k < n ? accent.glow : "rgba(255,255,255,0.42)"}`,
              background: k < n ? `${accent.glow}E0` : "rgba(255,255,255,0.08)",
              boxShadow: k < n ? `0 0 22px ${accent.glow}` : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: GROUND.dark, fontFamily: FONT.display }}>
    {/* the room */}
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse 92% 46% at 50% 18%, #1D1D25 0%, #0C0C11 55%, #050507 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        opacity: 0.4,
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(255,255,255,0.07) 0 2px, rgba(0,0,0,0) 2px 140px)," +
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.07) 0 2px, rgba(0,0,0,0) 2px 140px)",
      }}
    />

    {/* ── the lockup, in the reel's own two faces ───────────────────────── */}
    <div style={{ position: "absolute", left: SAFE.left, top: 300, width: VIDEO.width - SAFE.left * 2 }}>
      <div
        style={{
          fontSize: 44,
          letterSpacing: 9,
          color: ACCENT.pm4.glow,
          textShadow: HARD,
          marginBottom: 44,
        }}
      >
        THREE INTERFACES · ONE ENGINE
      </div>
      <div
        style={{
          fontSize: TYPE.before.size,
          letterSpacing: TYPE.before.track,
          color: INK.onDark,
          textShadow: HARD,
          lineHeight: 1.08,
        }}
      >
        SAME ENGINE IN ALL THREE.
      </div>
      <div
        style={{
          fontFamily: FONT.script,
          fontSize: 400,
          color: ACCENT.pm2.glow,
          lineHeight: 0.98,
          padding: "16px 30px 26px 0",
          marginLeft: -8,
          transform: "rotate(-1.6deg)",
          textShadow: `0 8px 16px rgba(0,0,0,0.95), 0 0 8px rgba(0,0,0,0.85), 0 0 60px ${ACCENT.pm2.glow}55`,
        }}
      >
        Which
      </div>
      <div
        style={{
          fontSize: 150,
          letterSpacing: TYPE.after.track,
          color: INK.onDark,
          textShadow: HARD,
          lineHeight: 1.02,
        }}
      >
        ONE DO YOU NEED?
      </div>
    </div>

    {/* ── the three bands ───────────────────────────────────────────────── */}
    <Band product="pm2" i={0} />
    <Band product="pm4" i={1} />
    <Band product="pm6" i={2} />

    {/* ── the answer, as a footer rule ──────────────────────────────────── */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: BAND_TOP + BAND_H * 3,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #0A0A0D 0%, #050507 100%)",
        borderTop: `6px solid ${ACCENT.pm6.glow}`,
      }}
    >
      <div
        style={{
          fontSize: 58,
          letterSpacing: 7,
          color: INK.onDarkSoft,
          textShadow: HARD,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        CHOOSE BY HOW MANY INPUTS YOU NEED.
        <br />
        <span style={{ color: INK.onDark }}>NEVER BY HOW GOOD IT SOUNDS.</span>
      </div>
    </div>
  </AbsoluteFill>
);
