import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {C, CANVAS, SAFE, ZONE, Part, accent} from '../lib/theme';
import {A} from '../lib/images';
import {rnd} from '../lib/anim';

/**
 * FULL-FRAME LIGHT GROUND.
 *
 * Creative brief Section 6: the M-Series chassis is extruded black metal with a
 * vivid full-colour LCD, so it must sit against "a light, architectural
 * environment — soft platinum grey, warm studio white, or a subtle light
 * gradient", lit with "soft, sweeping, continuous specular highlights", and
 * negative fill should keep the chassis blacks deep while the background stays
 * light and inviting.
 *
 * `Stage` paints that environment. Content is composed across the whole
 * 1080x1920 frame — the safe zone is a PLACEMENT CONTRACT, not a clip rect —
 * and the ambient strips (0..250 and 1580..1920) are given a deliberate,
 * slightly recessed tone plus their own texture so they read as the unlit
 * margins of a clean studio space rather than as dead bars.
 *
 * The accent tint is held very low so the LCD metering stays the most saturated
 * thing in frame, per the brief's explicit cinematography rule.
 */

const GRAIN =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
       <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/></filter>
       <rect width="180" height="180" filter="url(#n)" opacity="0.5"/>
     </svg>`,
  );

/** Faint schematic grid — engineering-drawing texture, never a focal element. */
const Grid: React.FC<{opacity?: number}> = ({opacity = 0.46}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
      backgroundSize: '72px 72px',
      maskImage:
        'radial-gradient(ellipse 78% 54% at 50% 47%, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.16) 58%, rgba(0,0,0,0) 88%)',
      WebkitMaskImage:
        'radial-gradient(ellipse 78% 54% at 50% 47%, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.16) 58%, rgba(0,0,0,0) 88%)',
    }}
  />
);

/**
 * Blurred extension of a hero asset into the ambient strips. Masked to be
 * fully present only above y=250 and below y=1580, so it can never compete
 * with primary content — exactly the "non-critical ambient fill" those zones
 * are reserved for. Heavily desaturated and brightened so it stays a light
 * wash and never darkens the margins.
 */
export const AmbientPhoto: React.FC<{
  id: number;
  opacity?: number;
  blur?: number;
  scale?: number;
  drift?: number;
}> = ({id, opacity = 0.55, blur = 40, scale = 1.36, drift = 1}) => {
  const f = useCurrentFrame();
  const mask =
    `linear-gradient(180deg,
      rgba(0,0,0,1) 0px,
      rgba(0,0,0,1) ${ZONE.topAmbientEnd - 150}px,
      rgba(0,0,0,0) ${ZONE.topAmbientEnd + 74}px,
      rgba(0,0,0,0) ${ZONE.bottomAmbientStart - 74}px,
      rgba(0,0,0,1) ${ZONE.bottomAmbientStart + 150}px,
      rgba(0,0,0,1) ${CANVAS.h}px)`;
  return (
    <AbsoluteFill style={{maskImage: mask, WebkitMaskImage: mask, overflow: 'hidden'}}>
      <Img
        src={A(id)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: `blur(${blur}px) saturate(0.62) brightness(1.12) contrast(0.90)`,
          transform: `scale(${scale}) translateY(${drift * f * 0.028}px)`,
          opacity,
          display: 'block',
        }}
      />
      <AbsoluteFill style={{backgroundColor: 'rgba(242,244,247,0.26)'}} />
    </AbsoluteFill>
  );
};

/**
 * Faint measurement rails in the ambient strips — engineering-drawing texture
 * that gives the top and bottom zones structure without ever carrying
 * information the viewer needs to read.
 */
export const AmbientRails: React.FC<{part: Part; opacity?: number}> = ({part, opacity = 0.52}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  const rail = (top: number, dir: number) => (
    <div style={{position: 'absolute', left: 0, top, width: CANVAS.w, height: 46}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 22,
          width: CANVAS.w,
          height: 1,
          backgroundColor: C.line,
        }}
      />
      {new Array(45).fill(0).map((_, i) => {
        const major = i % 5 === 0;
        const x = ((i * 24 + f * 0.26 * dir) % (CANVAS.w + 48)) - 24;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: major ? 12 : 17,
              width: major ? 2 : 1,
              height: major ? 20 : 10,
              backgroundColor: major ? a : C.line,
              opacity: major ? 0.38 : 0.58,
            }}
          />
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {rail(ZONE.topAmbientEnd - 98, 1)}
      {rail(ZONE.bottomAmbientStart + 54, -1)}
    </AbsoluteFill>
  );
};

/** Slow-drifting technical particles — ambient motion, no information. */
export const AmbientMotes: React.FC<{part: Part; n?: number; opacity?: number}> = ({
  part,
  n = 24,
  opacity = 0.46,
}) => {
  const f = useCurrentFrame();
  const a = accent(part);
  return (
    <AbsoluteFill style={{opacity}}>
      {new Array(n).fill(0).map((_, i) => {
        const sx = rnd(i * 3 + 1);
        const sy = rnd(i * 7 + 5);
        const sp = 0.1 + rnd(i * 11 + 3) * 0.24;
        const inTop = i % 2 === 0;
        const y = inTop
          ? (sy * (ZONE.topAmbientEnd + 40) + f * sp) % (ZONE.topAmbientEnd + 40)
          : ZONE.bottomAmbientStart + ((sy * 300 + f * sp) % 340);
        const s = 2 + rnd(i * 13 + 9) * 3.2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: sx * CANVAS.w,
              top: y,
              width: s,
              height: s,
              borderRadius: s,
              backgroundColor: i % 3 === 0 ? a : C.inkDim,
              opacity: 0.14 + rnd(i * 17) * 0.22,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{part: Part; children: React.ReactNode; wash?: number}> = ({
  part,
  children,
  wash = 1,
}) => {
  const a = accent(part);
  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      {/* vertical base wash — ambient strips sit slightly deeper than the
          primary area, so the safe zone reads as the lit region */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            ${C.paperEdge} 0%, ${C.paperDeep} 7%, ${C.paper} 15%,
            ${C.paperHi} 44%, ${C.paperHi} 56%,
            ${C.paper} 84%, ${C.paperDeep} 94%, ${C.paperEdge} 100%)`,
        }}
      />
      {/* soft sweeping key light out of the primary area — the brief's
          "continuous specular" studio environment */}
      <AbsoluteFill
        style={{
          opacity: wash,
          background: `radial-gradient(ellipse 84% 44% at 50% 43%,
            rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.44) 44%, rgba(255,255,255,0) 78%)`,
        }}
      />
      {/* accent tint held deliberately low so the LCD stays the most
          saturated element in frame */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 64% 32% at 50% 39%, ${a}0D 0%, ${a}00 72%)`,
        }}
      />
      <Grid />
      <AmbientRails part={part} opacity={0.5} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg,
            ${a}10 0%, ${a}00 13%,
            ${a}00 87%, ${a}10 100%)`,
          pointerEvents: 'none',
        }}
      />
      {children}
      {/* grain last so it sits over content, unifying photo and vector */}
      <AbsoluteFill
        style={{
          backgroundImage: `url("${GRAIN}")`,
          backgroundSize: '180px 180px',
          opacity: 0.085,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/** Positions a box inside the primary safe rect using 0..1 fractions. */
export const Safe: React.FC<{
  l?: number;
  t?: number;
  w?: number;
  h?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({l = 0, t = 0, w = 1, h, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.x + l * SAFE.w,
      top: SAFE.y + t * SAFE.h,
      width: w * SAFE.w,
      height: h === undefined ? undefined : h * SAFE.h,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Absolute placement in safe-rect pixel coordinates (0..936 x 0..1330). */
export const At: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = 0, y = 0, w, h, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: SAFE.x + x,
      top: SAFE.y + y,
      width: w,
      height: h,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Verification overlay — never rendered in a delivered composition. */
export const SafeGuides: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: CANVAS.w,
        height: ZONE.topAmbientEnd,
        background: 'rgba(255,0,0,0.16)',
        borderBottom: '2px solid rgba(255,0,0,0.9)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: ZONE.bottomAmbientStart,
        width: CANVAS.w,
        height: CANVAS.h - ZONE.bottomAmbientStart,
        background: 'rgba(255,0,0,0.16)',
        borderTop: '2px solid rgba(255,0,0,0.9)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: ZONE.margin,
        height: CANVAS.h,
        background: 'rgba(255,140,0,0.16)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        width: ZONE.margin,
        height: CANVAS.h,
        background: 'rgba(255,140,0,0.16)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: SAFE.x,
        top: SAFE.y,
        width: SAFE.w,
        height: SAFE.h,
        border: '2px dashed rgba(0,140,255,0.95)',
      }}
    />
  </AbsoluteFill>
);
