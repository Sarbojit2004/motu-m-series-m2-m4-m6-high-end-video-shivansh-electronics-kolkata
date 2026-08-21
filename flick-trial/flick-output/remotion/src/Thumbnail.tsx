import React from "react";
import { AbsoluteFill } from "remotion";
import { BRAND, COLORS, PRICE, SAFE, hexA } from "./lib/theme";
import { Frame } from "./components/Media";
import { Logo } from "./components/Brand";
import { Fonts, Ground } from "./components/Shell";
import { micro, spec } from "./components/Type";

/**
 * 1080x1920 cover frame. Both logos appear, drawn plain — MOTU left, Shivansh
 * right — and all three MOPs are stated distinctly, never blended or rounded.
 * Every image is `contain`, same as the video: nothing is cropped here either.
 */
const ROWS = [
  { img: "m2-front-panel", p: "MOTU M2", io: "2 IN / 2 OUT", v: PRICE.m2 },
  { img: "m4-front-panel", p: "MOTU M4", io: "4 IN / 4 OUT", v: PRICE.m4 },
  { img: "m6-front-panel", p: "MOTU M6", io: "6 IN / 4 OUT", v: PRICE.m6 },
];

export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <Fonts />
    <Ground seed={2} />
    <AbsoluteFill style={{
      padding: `${SAFE.top - 84}px ${SAFE.marginX}px ${SAFE.bottom - 96}px ${SAFE.marginX}px`,
      display: "flex", flexDirection: "column", gap: 26,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Logo which="motu" width={210} />
        <Logo which="shivansh" width={330} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ ...micro(28, 800, "0.2em"), color: COLORS.motuBlue }}>THE MOTU M-SERIES</div>
        <div style={{
          fontFamily: "Archivo, system-ui, sans-serif", fontWeight: 900, fontSize: 116,
          lineHeight: 0.96, letterSpacing: "-0.02em", textTransform: "uppercase",
          color: COLORS.ink, whiteSpace: "pre-line",
        }}>{"ONE ENGINE.\nTHREE SIZES."}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "center" }}>
        {ROWS.map((r) => (
          <div key={r.p} style={{
            display: "grid", gridTemplateColumns: "1.05fr 1fr", alignItems: "center", gap: 18,
            background: COLORS.paperLift, border: `1px solid ${COLORS.line}`, borderRadius: 24,
            padding: "16px 22px", boxShadow: `0 10px 30px ${hexA(COLORS.ink, 0.09)}`,
          }}>
            <div style={{ height: 150 }}><Frame name={r.img} duration={1} amount={0} scaleTo={1} radius={12} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ ...micro(26, 800, "0.13em"), color: COLORS.ink }}>{r.p}</span>
              <span style={{ ...micro(18, 700, "0.1em"), color: COLORS.slateDim }}>{r.io}</span>
              <span style={{ ...spec(60, 800), color: COLORS.motuBlue, lineHeight: 1.06 }}>{r.v}</span>
            </div>
          </div>
        ))}
        <div style={{ ...micro(21, 700, "0.12em"), color: COLORS.slate, textAlign: "center" }}>
          {PRICE.note}
        </div>
      </div>

      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ ...spec(46, 800, "0.02em"), color: COLORS.motuBlue }}>{BRAND.website}</div>
        <div style={{ ...micro(20, 600, "0.09em"), color: COLORS.slate, lineHeight: 1.5 }}>
          {BRAND.name} — {BRAND.role}<br />for {BRAND.region}
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
