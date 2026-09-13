import React from "react";
import { AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, CONTACT, FONT, GROUND, INK, SAFE, VIDEO } from "../theme.ts";
import { SiteIcon, WhatsAppIcon } from "./Icons.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// THE END SCREEN
//
// The client's instruction was exact: no logo, no company name, no number and
// no website anywhere in the body of the reel — all of it here, and only here.
// That is the right call for a feed video. Branding sprinkled through a reel
// asks a viewer to ignore it thirty times; branding withheld until the end
// arrives once, on a viewer who has already decided to watch to the end.
//
// The two supplied logos are dark artwork on a white rounded plate, not
// transparent cut-outs. Dropping them on a dark ground would put two white
// rectangles in the middle of the frame. So the end screen is built the other
// way round: a dark room, and a cream CARD inside it that the logos are native
// to. The card is also what makes three phone numbers legible — they sit on a
// solid ground rather than over a photograph.
// ─────────────────────────────────────────────────────────────────────────────

const WA = "#128C7E";
const SITE = "#1F5FD0";

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const accent = ACCENT.shared;

  const rise = spring({ frame: f, fps, config: { damping: 200, mass: 0.8 }, durationInFrames: 26 });
  const at = (d: number, dur = 16) =>
    spring({ frame: f - d, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: dur });

  // A slow continuous push, so the end screen is never a frozen JPEG.
  const dolly = 1 + Math.min(f, 240) / 240 * 0.035;

  return (
    <AbsoluteFill style={{ background: GROUND.dark, fontFamily: FONT.display, overflow: "hidden" }}>
      {/* ── the room ───────────────────────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 88% 52% at 50% 40%, #1B1B22 0%, #0C0C10 54%, #050507 100%)",
        }}
      />
      {/* A blueprint grid, kept as one repeating gradient rather than hundreds
          of divs — the same field the reel's staging implies, made explicit. */}
      <AbsoluteFill
        style={{
          opacity: 0.42 * rise,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.075) 0 2px, rgba(0,0,0,0) 2px 132px)," +
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.075) 0 2px, rgba(0,0,0,0) 2px 132px)",
          transform: `scale(${dolly})`,
        }}
      />
      {/* Slow drifting motes, so the dark has depth. */}
      {Array.from({ length: 26 }).map((_, i) => {
        const rx = random(`ox${i}`);
        const ry = random(`oy${i}`);
        const rs = random(`os${i}`);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rx * VIDEO.width,
              top: ry * VIDEO.height,
              width: 4 + rs * 7,
              height: 4 + rs * 7,
              borderRadius: "50%",
              background: "rgba(255,246,233,0.5)",
              opacity: (0.16 + rs * 0.3) * rise,
              transform: `translateY(${Math.sin((f + i * 24) / 78) * 22}px)`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 66% 32% at 50% 86%, ${accent.glow}14 0%, rgba(0,0,0,0) 72%)`,
        }}
      />

      {/* ── the three, once more, as a strip ───────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.w,
          top: SAFE.top + 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          opacity: at(4),
          transform: `translateY(${interpolate(at(4), [0, 1], [-30, 0])}px)`,
        }}
      >
        {(["pm2", "pm4", "pm6"] as const).map((k, i) => (
          <React.Fragment key={k}>
            {i ? <div style={{ width: 14, height: 14, borderRadius: 7, background: "rgba(255,246,233,0.35)" }} /> : null}
            <div
              style={{
                fontSize: 104,
                letterSpacing: 8,
                color: ACCENT[k].glow,
                textShadow: "0 6px 14px rgba(0,0,0,0.9)",
              }}
            >
              {ACCENT[k].short}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ── the card ───────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          width: SAFE.w,
          top: "53%",
          transform: `translateY(-50%) translateY(${interpolate(rise, [0, 1], [90, 0])}px) scale(${interpolate(
            rise,
            [0, 1],
            [0.94, 1],
          )})`,
          opacity: rise,
          background: `linear-gradient(180deg, ${GROUND.lightLift} 0%, ${GROUND.light} 62%, ${GROUND.lightSink} 100%)`,
          borderRadius: 56,
          padding: "96px 82px 82px",
          boxShadow: "0 46px 120px rgba(0,0,0,0.72)",
          border: "3px solid rgba(255,255,255,0.22)",
        }}
      >
        {/* the two logos, together and once */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 74,
            paddingBottom: 54,
            opacity: at(6),
          }}
        >
          <Img src={staticFile("logos/shivansh.png")} style={{ height: 258, width: "auto" }} />
          <div style={{ width: 3, height: 188, background: "rgba(24,22,20,0.16)" }} />
          <Img src={staticFile("logos/motu.png")} style={{ height: 210, width: "auto" }} />
        </div>

        {/* the distributor line, verbatim */}
        <div
          style={{
            textAlign: "center",
            fontSize: 43,
            letterSpacing: 3.0,
            lineHeight: 1.5,
            color: INK.onLightSoft,
            textTransform: "uppercase",
            opacity: at(12),
          }}
        >
          {CONTACT.role}
          <br />
          <span style={{ color: accent.key, letterSpacing: 4.0 }}>{CONTACT.region}</span>
        </div>

        <div style={{ height: 3, background: "rgba(24,22,20,0.14)", margin: "48px 0 12px", opacity: at(16) }} />

        {/* all three numbers, each with the WhatsApp mark */}
        {CONTACT.whatsapp.map((num, i) => {
          const p = at(20 + i * 6, 15);
          return (
            <div
              key={num}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                padding: "34px 0",
                borderBottom: "2px solid rgba(24,22,20,0.10)",
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-30, 0])}px)`,
              }}
            >
              <WhatsAppIcon size={104} color={WA} />
              <div
                style={{
                  fontSize: 92,
                  letterSpacing: 1.4,
                  color: INK.onLight,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {num}
              </div>
            </div>
          );
        })}

        {/* the website */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 34,
            padding: "34px 0 6px",
            opacity: at(42, 15),
            transform: `translateX(${interpolate(at(42, 15), [0, 1], [-30, 0])}px)`,
          }}
        >
          <SiteIcon size={98} color={SITE} />
          <div style={{ fontSize: 76, letterSpacing: 0.6, color: INK.onLight }}>{CONTACT.site}</div>
        </div>

        <div
          style={{
            textAlign: "center",
            paddingTop: 46,
            fontSize: 46,
            letterSpacing: 7,
            color: INK.onLightSoft,
            opacity: at(50, 16),
          }}
        >
          {CONTACT.brand} · {CONTACT.city}
        </div>
      </div>
    </AbsoluteFill>
  );
};
