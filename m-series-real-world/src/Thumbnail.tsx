import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { ACCENT, FONT, GROUND, INK, formatFor } from "./theme.ts";
import { img } from "./assets.ts";
import { FONT_FACE_CSS } from "./fonts.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE COVERS
//
// A cover is not a frame of the film — it is read at thumbnail size in a grid,
// so it carries three things and nothing else: the three units, one line that
// says what the film argues, and the range mark. No branding, because the films
// carry none until their end screen and a cover that did would contradict them.
//
// The line is the film's own thesis, not a headline written for a cover.
// ─────────────────────────────────────────────────────────────────────────────

export const Thumbnail: React.FC = () => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const P = fmt.portrait;
  const S = W / (P ? 2160 : 3840);
  const acc = ACCENT.shared;
  const sig = ACCENT.signal;

  const fronts = ["m2-front", "m4-front", "m6-front"].map(img);

  return (
    <AbsoluteFill style={{ background: GROUND.dark, overflow: "hidden" }}>
      <style>{FONT_FACE_CSS}</style>
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(110% 80% at 50% 30%, ${sig.glow}22 0%, ${acc.glow}0C 42%, transparent 76%)`,
        }}
      />
      {/* the room floor, so the units are standing on something */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, transparent 52%, ${GROUND.darkSink} 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: P ? 74 * S : 40 * S,
          padding: `${fmt.safe.top}px ${fmt.safe.left}px ${fmt.safe.bottom * 0.5}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: P ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: P ? 34 * S : 56 * S,
          }}
        >
          {fronts.map((a, i) => (
            <Img
              key={a.slug}
              src={staticFile(a.file)}
              style={{
                width: P ? 1800 * S : 1210 * S,
                height: "auto",
                filter: `saturate(1.06) drop-shadow(0 ${16 * S}px ${26 * S}px rgba(0,0,0,0.55))`,
                transform: `translateY(${(i === 1 ? -18 : 0) * S}px)`,
              }}
            />
          ))}
        </div>

        <div style={{ textAlign: "center", maxWidth: fmt.safe.w }}>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: (P ? 164 : 132) * S,
              lineHeight: 1.04,
              letterSpacing: -1 * S,
              color: INK.onDark,
              textShadow: `0 ${6 * S}px 0 rgba(0,0,0,0.7)`,
            }}
          >
            THE SAME MACHINE
          </div>
          <div
            style={{
              fontFamily: FONT.script,
              fontSize: (P ? 230 : 186) * S,
              lineHeight: 1.0,
              color: sig.glow,
              textShadow: `0 ${7 * S}px 0 rgba(0,0,0,0.7)`,
              marginTop: 10 * S,
            }}
          >
            three sizes
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26 * S,
            fontFamily: FONT.display,
            fontSize: (P ? 82 : 66) * S,
            letterSpacing: 10 * S,
            color: INK.onDarkSoft,
          }}
        >
          <span>M2</span>
          <Dot s={S} c={sig.glow} />
          <span>M4</span>
          <Dot s={S} c={sig.glow} />
          <span>M6</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Dot: React.FC<{ s: number; c: string }> = ({ s, c }) => (
  <span style={{ width: 12 * s, height: 12 * s, background: c, borderRadius: 99, display: "inline-block" }} />
);
