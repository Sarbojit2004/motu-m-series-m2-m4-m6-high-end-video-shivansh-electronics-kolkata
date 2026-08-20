import React from "react";
import { AbsoluteFill } from "remotion";
import { A } from "./assets";
import { BRAND, COLORS, PRICE, SAFE, hexA } from "./theme";
import { headline, micro, spec, subhead } from "./fonts";
import { Plate } from "./components/Media";
import { Logo } from "./components/Brand";
import { Fonts } from "./components/Shell";

/**
 * PORTRAIT THUMBNAIL — 1080 x 1920.
 *
 * Everything — both logos, all three MOPs, the URL, the designation — sits
 * inside the caption-safe zone (top 180 / bottom 220 / sides 64), so nothing
 * lands under a platform overlay. Only the background gradient reaches the
 * true frame edge.
 *
 * The three front-panel plates are stacked rather than placed in a row: at
 * 1080 wide, three 4:1 panels side by side would be unreadable. Each goes
 * through Plate (`object-fit: contain`), so all three units are complete and
 * uncropped.
 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.paper }}>
    <Fonts />
    <AbsoluteFill
      style={{
        background: `radial-gradient(100% 62% at 50% 12%, ${COLORS.paperLift} 0%, ${COLORS.paper} 46%, ${COLORS.paperEdge} 100%)`,
      }}
    />
    <AbsoluteFill
      style={{ padding: `${SAFE.top}px ${SAFE.marginX}px ${SAFE.bottom}px ${SAFE.marginX}px` }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 16 }}>
        {/* header — BOTH logos, directly on screen, never boxed, inside the safe zone */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              gap: 24,
            }}
          >
            <Logo which="motu" width={216} />
            <Logo which="shivansh" width={470} />
          </div>
          <span style={{ ...micro(25, 800, "0.1em"), color: COLORS.motuBlue }}>{BRAND.website}</span>
        </div>

        {/* claim */}
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div style={{ ...micro(24, 800, "0.2em"), color: COLORS.motuBlue }}>M2 · M4 · M6</div>
          <div style={{ ...headline(92, 900), color: COLORS.ink, marginTop: 8 }}>
            One engine.{"\n"}Three sizes.
          </div>
          <div style={{ ...subhead(26, 500), color: COLORS.slate, marginTop: 10 }}>
            Identical ESS Sabre32 Ultra™ DAC · 120 dB · −129 dBu EIN
          </div>
        </div>

        {/* the three units, complete and uncropped, stacked with their prices */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateRows: "repeat(3, minmax(0, 1fr))",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 14,
            marginTop: 6,
          }}
        >
          {[
            { idx: A.m2Front, name: "M2", io: "2 in / 2 out", price: PRICE.m2 },
            { idx: A.m4Front, name: "M4", io: "4 in / 4 out", price: PRICE.m4 },
            { idx: A.m6Front, name: "M6", io: "6 in / 4 out", price: PRICE.m6 },
          ].map((u) => (
            <div
              key={u.name}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.42fr) minmax(0, 1fr)",
                alignItems: "center",
                gap: 16,
                minHeight: 0,
              }}
            >
              <div style={{ height: "100%", minHeight: 0 }}>
                <Plate idx={u.idx} style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ ...headline(42, 900), color: COLORS.ink }}>{u.name}</span>
                <span style={{ ...micro(18, 700, "0.1em"), color: COLORS.slateDim }}>{u.io}</span>
                <span style={{ ...spec(46, 800, "0.005em"), color: COLORS.motuBlue, marginTop: 4 }}>
                  {u.price}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* price framing + best-price direction */}
        <div
          style={{
            borderTop: `2px solid ${hexA(COLORS.ink, 0.12)}`,
            paddingTop: 14,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <span style={{ ...micro(19, 700, "0.12em"), color: COLORS.slate }}>
            Market Operating Price — {PRICE.noteShort}
          </span>
          <span style={{ ...spec(28, 800, "0.02em"), color: COLORS.ink }}>
            Best price at <span style={{ color: COLORS.motuBlue }}>{BRAND.website}</span>
          </span>
          <span style={{ ...micro(16, 600, "0.08em"), color: COLORS.slateDim, lineHeight: 1.4 }}>
            {BRAND.name} — {BRAND.role} for {BRAND.region}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
