import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { BRAND, COLORS, PRICE, SPACE, hexA } from "../theme";
import { LOGO } from "../assets";
import { micro, spec, subhead, headline } from "../fonts";
import { EASE, ramp } from "../lib/anim";
import { Rise } from "./Type";

/**
 * SECTION 6 LOGO RULE.
 *
 * Both logos are used EXACTLY as supplied: opaque, with their own white
 * background intact. They are deliberately NOT keyed transparent, and they are
 * NOT placed inside a box, card, plate or rounded backing of any kind — each
 * one sits directly on the video, sized to suit the space it occupies.
 *
 * What makes that work is the palette rather than a compositing trick: the page
 * is held in a near-white range (COLORS.paper #F6F8FA), so the logo's own white
 * ground is within ~4% of the page behind it and reads as continuous. Nothing
 * is keyed, alpha-masked or blended — the file on disk is drawn as-is.
 *
 * (`mix-blend-mode: multiply` cannot be used here: Scene applies a transform
 * for its entrance, which creates a stacking context and isolates the blend
 * from the page behind it — the logo then renders with a visible white
 * rectangle over dark content. Layout discipline plus a near-white page is the
 * reliable fix. This is carried forward from the AVB build, which hit it.)
 */
export const Logo: React.FC<{
  which: "motu" | "shivansh";
  width: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ which, width, opacity = 1, style }) => (
  <Img
    src={which === "motu" ? LOGO.motu() : LOGO.shivansh()}
    style={{ width, height: "auto", display: "block", opacity, ...style }}
  />
);

export type BrandMode =
  | "none"
  | "cornerLogo"
  | "lowerThird"
  | "brandBeat"
  | "price"
  | "contact"
  | "outro";

/** Persistent corner mark — used during hero shots and technical beats. */
export const ShivanshCorner: React.FC<{
  delay?: number;
  position?: "tl" | "tr" | "bl" | "br";
  width?: number;
  withUrl?: boolean;
}> = ({ delay = 12, position = "tr", width = 268, withUrl = true }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 20, EASE.out);
  const vert = position.startsWith("t") ? { top: SPACE.marginY } : { bottom: SPACE.marginY };
  const horz = position.endsWith("l") ? { left: SPACE.marginX } : { right: SPACE.marginX };
  const align = position.endsWith("l") ? "flex-start" : "flex-end";
  return (
    <div
      style={{
        position: "absolute",
        ...vert,
        ...horz,
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        gap: 7,
        opacity: t,
        transform: `translateY(${(1 - t) * -8}px)`,
      }}
    >
      <Logo which="shivansh" width={width} />
      {withUrl ? (
        <span style={{ ...micro(19, 700, "0.1em"), color: COLORS.motuBlue }}>{BRAND.website}</span>
      ) : null}
    </div>
  );
};

/**
 * MOTU corner mark — used sparingly, far less often than Shivansh (Section 6).
 *
 * Anchored BOTTOM-LEFT. A first QA pass placed it top-left, where it collided
 * with the eyebrow on every top-aligned heading (`c1-thesis`, `c7-transform`).
 * Shivansh owns top-right, and no beat in the schedule carries both this mark
 * and the bottom-left lower-third, so bottom-left is unconflicted.
 */
export const MotuCorner: React.FC<{
  delay?: number;
  position?: "tl" | "tr" | "bl" | "br";
  width?: number;
}> = ({ delay = 12, position = "bl", width = 178 }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 20, EASE.out);
  const vert = position.startsWith("t") ? { top: SPACE.marginY } : { bottom: SPACE.marginY };
  const horz = position.endsWith("l") ? { left: SPACE.marginX } : { right: SPACE.marginX };
  return (
    <div style={{ position: "absolute", ...vert, ...horz, opacity: t * 0.95 }}>
      <Logo which="motu" width={width} />
    </div>
  );
};

/** Lower-third contact strip shown during technical explanation beats. */
export const ShivanshLowerThird: React.FC<{ detail?: string; delay?: number }> = ({
  detail,
  delay = 14,
}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 22, EASE.out);
  return (
    <div
      style={{
        position: "absolute",
        left: SPACE.marginX,
        bottom: SPACE.marginY,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: t,
        transform: `translateX(${(1 - t) * -22}px)`,
      }}
    >
      <Logo which="shivansh" width={244} />
      <div style={{ width: 1, height: 44, background: COLORS.lineStrong }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ ...micro(21, 800, "0.1em"), color: COLORS.motuBlue }}>{BRAND.website}</span>
        <span style={{ ...micro(17, 600, "0.12em"), color: COLORS.slate }}>
          {detail ?? BRAND.region}
        </span>
      </div>
    </div>
  );
};

/** Full branding beat — logo, role, region, URL. Flat ground, nothing boxed. */
export const BrandBeat: React.FC<{ delay?: number }> = ({ delay = 6 }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      padding: `${SPACE.marginY}px ${SPACE.marginX}px`,
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, textAlign: "center" }}>
      <Rise delay={delay} y={16}>
        <Logo which="shivansh" width={720} />
      </Rise>
      <Rise delay={delay + 10} y={14}>
        <div style={{ ...subhead(35, 600), color: COLORS.inkSoft, maxWidth: 1400 }}>
          {BRAND.role}
        </div>
      </Rise>
      <Rise delay={delay + 16} y={12}>
        <div style={{ ...micro(28, 800, "0.16em"), color: COLORS.slate }}>for {BRAND.region}</div>
      </Rise>
      <Rise delay={delay + 22} y={12}>
        <div style={{ ...spec(46, 800, "0.03em"), color: COLORS.motuBlue }}>{BRAND.website}</div>
      </Rise>
    </div>
  </AbsoluteFill>
);

/**
 * PRICE LOCKUP (Section 1, Facts 1 + 2).
 *
 * All THREE MOPs are stated distinctly — never rounded, never blended into a
 * single range or a "starting from" figure — AND, separately, the viewer is
 * directed to the website to check the best current price. Both are true and
 * both appear together; the website direction never replaces the figures.
 */
export const PriceLockup: React.FC<{ delay?: number; compact?: boolean }> = ({
  delay = 4,
  compact = false,
}) => {
  const rows: { name: string; price: string; io: string }[] = [
    { name: "MOTU M2", price: PRICE.m2, io: "2 in / 2 out" },
    { name: "MOTU M4", price: PRICE.m4, io: "4 in / 4 out" },
    { name: "MOTU M6", price: PRICE.m6, io: "6 in / 4 out" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: compact ? 20 : 30, width: "100%" }}>
      <Rise delay={delay} y={12}>
        <div style={{ ...micro(26, 800, "0.2em"), color: COLORS.slate }}>
          Market Operating Price — {PRICE.note}
        </div>
      </Rise>
      <div style={{ display: "flex", gap: compact ? 26 : 40, justifyContent: "center", flexWrap: "nowrap" }}>
        {rows.map((r, i) => (
          <Rise key={r.name} delay={delay + 10 + i * 7} y={16}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: compact ? "22px 34px" : "30px 48px",
                background: COLORS.paperLift,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 24,
                boxShadow: `0 10px 30px ${COLORS.shadow}`,
                minWidth: compact ? 300 : 372,
              }}
            >
              <span style={{ ...micro(23, 800, "0.16em"), color: COLORS.ink }}>{r.name}</span>
              <span style={{ ...spec(compact ? 60 : 74, 800, "0.005em"), color: COLORS.motuBlue, lineHeight: 1 }}>
                {r.price}
              </span>
              <span style={{ ...micro(19, 700, "0.12em"), color: COLORS.slateDim }}>{r.io}</span>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={delay + 34} y={12}>
        <div
          style={{
            ...subhead(compact ? 30 : 35, 700),
            color: COLORS.ink,
            textAlign: "center",
          }}
        >
          Visit{" "}
          <span style={{ ...spec(compact ? 32 : 38, 800, "0.02em"), color: COLORS.motuBlue }}>
            {BRAND.website}
          </span>{" "}
          to check the best price
        </div>
      </Rise>
    </div>
  );
};

/** Contact panel — socials, WhatsApp numbers, address. */
export const ContactPanel: React.FC<{ delay?: number }> = ({ delay = 4 }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      padding: `${SPACE.marginY}px ${SPACE.marginX}px`,
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center", maxWidth: 1600 }}>
      <Rise delay={delay} y={14}>
        <Logo which="shivansh" width={560} />
      </Rise>
      <Rise delay={delay + 8} y={12}>
        <div style={{ ...spec(44, 800, "0.03em"), color: COLORS.motuBlue }}>{BRAND.website}</div>
      </Rise>
      <Rise delay={delay + 14} y={12}>
        <div style={{ display: "flex", gap: 30, flexWrap: "wrap", justifyContent: "center" }}>
          {[BRAND.instagram, BRAND.facebook, BRAND.youtube, BRAND.linkedin].map((s) => (
            <span key={s} style={{ ...micro(25, 600, "0.06em"), color: COLORS.slate, textTransform: "none" }}>
              {s}
            </span>
          ))}
        </div>
      </Rise>
      <Rise delay={delay + 20} y={12}>
        <div style={{ display: "flex", gap: 26, justifyContent: "center" }}>
          {BRAND.whatsapp.map((w) => (
            <span key={w} style={{ ...spec(35, 700, "0.02em"), color: COLORS.ink }}>
              {w}
            </span>
          ))}
        </div>
      </Rise>
      <Rise delay={delay + 26} y={12}>
        <div style={{ ...subhead(29, 500), color: COLORS.slateDim, maxWidth: 1420 }}>{BRAND.address}</div>
      </Rise>
    </div>
  </AbsoluteFill>
);

/** Closing lockup — both logos, the three prices, the URL, the designation. */
export const Outro: React.FC<{ delay?: number }> = ({ delay = 2 }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      padding: `${SPACE.marginY}px ${SPACE.marginX}px`,
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center" }}>
      <Rise delay={delay} y={14}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <Logo which="motu" width={330} />
          <div style={{ width: 1, height: 82, background: COLORS.lineStrong }} />
          <Logo which="shivansh" width={470} />
        </div>
      </Rise>
      <Rise delay={delay + 10} y={12}>
        <div style={{ ...headline(52, 800), color: COLORS.ink }}>M2 · M4 · M6</div>
      </Rise>
      <Rise delay={delay + 16} y={12}>
        <div style={{ display: "flex", gap: 34, alignItems: "baseline" }}>
          {[PRICE.m2, PRICE.m4, PRICE.m6].map((p) => (
            <span key={p} style={{ ...spec(46, 800, "0.01em"), color: COLORS.motuBlue }}>
              {p}
            </span>
          ))}
        </div>
      </Rise>
      <Rise delay={delay + 20} y={10}>
        <div style={{ ...micro(21, 700, "0.14em"), color: COLORS.slateDim }}>{PRICE.note}</div>
      </Rise>
      <Rise delay={delay + 26} y={12}>
        <div style={{ ...spec(40, 800, "0.03em"), color: COLORS.ink }}>{BRAND.website}</div>
      </Rise>
      <Rise delay={delay + 32} y={10}>
        <div style={{ ...subhead(30, 600), color: COLORS.slate, maxWidth: 1720 }}>
          {BRAND.name} — {BRAND.role} for {BRAND.region}
        </div>
      </Rise>
    </div>
  </AbsoluteFill>
);

/** Dispatch — one place that maps a beat's declared brand mode to its form. */
export const BrandLayer: React.FC<{ mode: BrandMode; motu?: boolean; detail?: string }> = ({
  mode,
  motu = false,
  detail,
}) => (
  <>
    {mode === "cornerLogo" ? <ShivanshCorner /> : null}
    {mode === "lowerThird" ? <ShivanshLowerThird detail={detail} /> : null}
    {motu && (mode === "cornerLogo" || mode === "lowerThird" || mode === "none") ? (
      <MotuCorner />
    ) : null}
  </>
);
