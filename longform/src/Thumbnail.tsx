import React from "react";
import { AbsoluteFill } from "remotion";
import { A } from "./assets";
import { BRAND, COLORS, PRICE, SPACE, hexA } from "./theme";
import { headline, micro, spec, subhead } from "./fonts";
import { Plate } from "./components/Media";
import { Logo } from "./components/Brand";
import { Fonts } from "./components/Shell";

/**
 * LANDSCAPE THUMBNAIL — 1920 x 1080.
 *
 * Composition rules it has to satisfy at once: the light palette of the video,
 * all three MOPs stated distinctly, the website as the primary marketed URL and
 * best-price direction, both logos legible and drawn directly on screen with no
 * box, and a full uncropped view of the hero products.
 *
 * The three front-panel plates are used because they are the only images in the
 * set that show all three units at a matching angle and scale — which is the
 * whole "one engine, three sizes" claim in one picture. Every one goes through
 * Plate (`object-fit: contain`), so all three are complete and uncropped.
 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.paper }}>
    <Fonts />
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 92% at 50% 8%, ${COLORS.paperLift} 0%, ${COLORS.paper} 48%, ${COLORS.paperEdge} 100%)`,
      }}
    />
    <AbsoluteFill style={{ padding: `${SPACE.marginY}px ${SPACE.marginX}px` }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* header — both logos, directly on screen, never boxed */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Logo which="motu" width={252} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <Logo which="shivansh" width={392} />
            <span style={{ ...micro(22, 800, "0.1em"), color: COLORS.motuBlue }}>{BRAND.website}</span>
          </div>
        </div>

        {/* claim */}
        <div style={{ marginTop: 18 }}>
          <div style={{ ...micro(25, 800, "0.22em"), color: COLORS.motuBlue }}>
            MOTU M-SERIES · M2 · M4 · M6
          </div>
          <div style={{ ...headline(104, 900), color: COLORS.ink, marginTop: 10 }}>
            One engine. Three sizes.
          </div>
          <div style={{ ...subhead(30, 500), color: COLORS.slate, marginTop: 8 }}>
            Identical ESS Sabre32 Ultra™ DAC · 120 dB dynamic range · −129 dBu EIN · 2.5 ms latency
          </div>
        </div>

        {/* the three units, complete and uncropped */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gridTemplateRows: "minmax(0, 1fr)",
            gap: 26,
            marginTop: 14,
            alignItems: "center",
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
                display: "flex",
                flexDirection: "column",
                gap: 10,
                minWidth: 0,
                minHeight: 0,
                height: "100%",
                justifyContent: "center",
              }}
            >
              <div style={{ flex: 1, minHeight: 0 }}>
                <Plate idx={u.idx} style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 12 }}>
                <span style={{ ...headline(40, 900), color: COLORS.ink }}>{u.name}</span>
                <span style={{ ...micro(19, 700, "0.1em"), color: COLORS.slateDim }}>{u.io}</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ ...spec(52, 800, "0.005em"), color: COLORS.motuBlue }}>{u.price}</span>
              </div>
            </div>
          ))}
        </div>

        {/* price framing + best-price direction */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `2px solid ${hexA(COLORS.ink, 0.12)}`,
            paddingTop: 16,
            marginTop: 6,
          }}
        >
          <span style={{ ...micro(21, 700, "0.14em"), color: COLORS.slate }}>
            Market Operating Price — {PRICE.note}
          </span>
          <span style={{ ...spec(30, 800, "0.02em"), color: COLORS.ink }}>
            Best price at{" "}
            <span style={{ color: COLORS.motuBlue }}>{BRAND.website}</span>
          </span>
        </div>
        <div style={{ ...micro(19, 600, "0.1em"), color: COLORS.slateDim, marginTop: 8 }}>
          {BRAND.name} — {BRAND.role} for {BRAND.region}
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
