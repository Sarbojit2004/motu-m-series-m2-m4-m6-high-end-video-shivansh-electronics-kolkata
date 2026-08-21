import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { COLORS, RADII, hexA } from "../lib/theme";
import { asset, img, WIDE } from "../lib/assets";
import { EASE, gimbal, mapClamp, ramp } from "../lib/anim";

/**
 * THE RULE THIS FILE EXISTS TO ENFORCE.
 *
 * Every image renders `object-fit: contain`. Nothing is ever `cover`, so no
 * image is cropped, clipped or trimmed to fit a composition. Where an aspect
 * ratio does not match the slot, the difference is absorbed by deliberate
 * ground treatment — never by cutting into the subject.
 *
 * 25 of the 30 supplied images are landscape-oriented (AR 1.40-4.41). In a
 * 1080x1920 frame those are width-bound: scaled complete to the frame width
 * they leave height over. That leftover is FILLED, not cropped away.
 */

/** Fill behind a wide image: a blurred, dimmed copy of the image itself. */
const Field: React.FC<{ name: string; drift: { x: number; y: number } }> = ({ name, drift }) => {
  const light = asset(name).bg === "light";
  return (
    <>
      <AbsoluteFill>
        <Img
          src={img(name)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover", // decorative field only — the complete image sits on top
            filter: `blur(46px) saturate(${light ? 1.0 : 1.15})`,
            transform: `scale(1.35) translate(${drift.x * 0.4}px, ${drift.y * 0.4}px)`,
            opacity: light ? 0.7 : 0.5,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background: light
            ? `linear-gradient(180deg, ${hexA(COLORS.paperLift, 0.86)} 0%, ${hexA(COLORS.paper, 0.7)} 50%, ${hexA(COLORS.paperEdge, 0.84)} 100%)`
            : hexA(COLORS.paper, 0.42),
        }}
      />
    </>
  );
};

/**
 * A single supplied image, shown COMPLETE. Wide images get the field behind
 * them; near-square images fit the slot unaided and need none.
 */
export const Frame: React.FC<{
  name: string;
  duration: number;
  amount?: number;
  scaleFrom?: number;
  scaleTo?: number;
  label?: string;
  radius?: number;
  hug?: boolean;
  style?: React.CSSProperties;
}> = ({ name, duration, amount = 0.7, scaleFrom = 1, scaleTo = 1.035, label, radius = RADII.card, hug, style }) => {
  const frame = useCurrentFrame();
  const a = asset(name);
  const wide = a.ar >= WIDE;
  const g = gimbal(frame, name.length * 3 + 1, amount);
  const p = mapClamp(frame, [0, Math.max(1, duration)], [0, 1], EASE.linear);
  const scale = scaleFrom + (scaleTo - scaleFrom) * p;

  // `hug` sizes the frame to the image instead of the slot: the card ends where
  // the picture ends, so a very wide image is never marooned in empty ground.
  const box: React.CSSProperties = hug
    ? { width: "100%", aspectRatio: `${a.ar}`, maxHeight: "100%", margin: "auto" }
    : { width: "100%", height: "100%" };

  return (
    <div style={{ position: "relative", ...box, overflow: "hidden", borderRadius: radius, ...style }}>
      {wide ? <Field name={name} drift={g} /> : null}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 8 }}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${g.x}px, ${g.y}px) scale(${scale})`,
            willChange: "transform",
          }}
        >
          <Img
            src={img(name)}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              objectFit: "contain", // <- the complete image, always
              borderRadius: RADII.plate,
              boxShadow: a.bg === "light"
                ? `0 14px 40px ${hexA(COLORS.ink, 0.13)}`
                : `0 20px 54px ${hexA(COLORS.ink, 0.28)}`,
            }}
          />
        </div>
      </AbsoluteFill>
      {label ? <Caption text={label} /> : null}
    </div>
  );
};

export const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      left: 16,
      top: 14,
      fontFamily: "Archivo, system-ui, sans-serif",
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: "0.13em",
      textTransform: "uppercase",
      color: COLORS.slate,
      background: hexA(COLORS.paperLift, 0.93),
      padding: "8px 14px",
      borderRadius: 8,
      border: `1px solid ${COLORS.line}`,
    }}
  >
    {text}
  </div>
);

/**
 * MACRO-TO-FULL-REVEAL. Opens hard on a detail with simulated shallow depth of
 * field, glides back as focus expands until the COMPLETE, uncropped unit is on
 * screen, then holds with a slow drift. ~35% macro / 65% reveal-and-hold.
 * The macro phase is a camera move, not a crop: it always resolves.
 */
export const MacroReveal: React.FC<{
  name: string;
  duration: number;
  fx?: number;
  fy?: number;
  macroScale?: number;
}> = ({ name, duration, fx = 0.5, fy = 0.5, macroScale = 3.1 }) => {
  const frame = useCurrentFrame();
  const macroEnd = Math.round(duration * 0.35);
  const revealEnd = macroEnd + Math.round((duration - macroEnd) * 0.62);
  const scale =
    frame < macroEnd
      ? mapClamp(frame, [0, macroEnd], [macroScale, macroScale * 0.88], EASE.soft)
      : mapClamp(frame, [macroEnd, revealEnd], [macroScale * 0.88, 1], EASE.out);
  const settle = mapClamp(frame, [revealEnd, duration], [1, 0.988], EASE.linear);
  const final = frame < macroEnd ? scale : Math.min(scale, 1) * (scale <= 1.001 ? settle : 1);
  const blur = mapClamp(frame, [0, macroEnd * 0.9], [5.5, 0], EASE.out);
  const g = gimbal(frame, name.length, 0.8);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `translate(${g.x * 0.5}px, ${g.y * 0.5}px) scale(${final})`,
          transformOrigin: `${fx * 100}% ${fy * 100}%`,
          willChange: "transform",
        }}
      >
        <Frame name={name} duration={duration} amount={0} scaleTo={1} />
      </div>
      {blur > 0.05 ? (
        <AbsoluteFill
          style={{
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: `radial-gradient(46% 46% at ${fx * 100}% ${fy * 100}%, transparent 0%, #000 100%)`,
            WebkitMaskImage: `radial-gradient(46% 46% at ${fx * 100}% ${fy * 100}%, transparent 0%, #000 100%)`,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
};

/**
 * PORT DENSITY SWEEP. A slow lateral track along a connector row, focal plane
 * rolling jack to jack. The last ~30% pulls out to the COMPLETE unit, so the
 * full-and-legible rule holds within the beat.
 */
export const PortSweep: React.FC<{
  name: string;
  duration: number;
  zoom?: number;
  from?: number;
  to?: number;
}> = ({ name, duration, zoom = 2.0, from = 0.08, to = 0.92 }) => {
  const frame = useCurrentFrame();
  const sweepEnd = Math.round(duration * 0.7);
  const p = mapClamp(frame, [0, sweepEnd], [from, to], EASE.inOut);
  const scale = frame < sweepEnd ? zoom : mapClamp(frame, [sweepEnd, duration], [zoom, 1], EASE.out);
  const originX = frame < sweepEnd ? p : mapClamp(frame, [sweepEnd, duration], [p, 0.5], EASE.out);
  const roll = Math.abs(Math.sin(p * Math.PI * 5)) * 1.7;
  const blur = frame < sweepEnd ? roll : mapClamp(frame, [sweepEnd, duration], [roll, 0], EASE.out);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${scale})`,
          transformOrigin: `${originX * 100}% 50%`,
          willChange: "transform",
          filter: blur > 0.05 ? `blur(${blur}px)` : "none",
        }}
      >
        <Frame name={name} duration={duration} amount={0} scaleTo={1} />
      </div>
    </div>
  );
};

/**
 * Several COMPLETE images in sequence inside one scene, cross-dissolved.
 * Grouping shortens an image's screen time; it never crops it. Each still gets
 * its own full hold, its own drift and its own caption.
 */
export const Sequence: React.FC<{
  items: { name: string; label?: string }[];
  duration: number;
  blend?: number;
}> = ({ items, duration, blend = 10 }) => {
  const frame = useCurrentFrame();
  const n = Math.max(1, items.length);
  const hold = duration / n;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {items.map((it, i) => {
        const local = frame - i * hold;
        const fin = i === 0 ? 1 : Math.min(1, Math.max(0, local / blend));
        const fout = i === n - 1 ? 1 : Math.min(1, Math.max(0, (hold + blend - local) / blend));
        const o = Math.max(0, Math.min(fin, fout));
        if (o <= 0.002) return null;
        return (
          <AbsoluteFill key={`${it.name}-${i}`} style={{ opacity: o, willChange: "opacity" }}>
            <Frame name={it.name} duration={Math.round(hold)} amount={0.55} label={it.label} />
          </AbsoluteFill>
        );
      })}
    </div>
  );
};

/** Two complete images stacked — uses the tall canvas instead of fighting it. */
export const Stack: React.FC<{
  items: { name: string; label?: string }[];
  duration: number;
  gap?: number;
}> = ({ items, duration, gap = 18 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: `repeat(${items.length}, minmax(0, 1fr))`,
        gap,
        width: "100%",
        height: "100%",
      }}
    >
      {items.map((it, i) => {
        const t = ramp(frame, i * 6, 16, EASE.out);
        return (
          <div key={it.name} style={{ minHeight: 0, opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
            <Frame name={it.name} duration={duration} amount={0.45} label={it.label} />
          </div>
        );
      })}
    </div>
  );
};
