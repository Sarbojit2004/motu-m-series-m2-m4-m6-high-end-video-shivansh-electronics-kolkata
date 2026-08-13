import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame} from 'remotion';
import {C, LF_CANVAS, LF_CONTENT} from '../../lib/lf-theme';
import {A} from '../../lib/images';
import {ramp, rnd} from '../../lib/anim';

/**
 * The landscape light ground.
 *
 * Same palette and same "the hardware is the darkest thing in frame" logic as
 * the reels, rebuilt for 1920x1080. The difference is structural: the reels
 * reserved dead ambient strips top and bottom that content could never enter,
 * whereas here (Section 2) there is NO reserved caption box and no exclusion
 * zone — composition uses the whole frame, and the only contract is a modest
 * side inset so nothing critical is clipped downstream.
 *
 * So the wash is horizontal-led rather than vertical-led: the frame reads as a
 * wide, evenly lit architectural space with the light pooling slightly left of
 * centre, which is where most hero compositions place their subject.
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

/** Faint engineering-drawing grid. Never a focal element. */
const Grid: React.FC<{opacity?: number}> = ({opacity = 0.45}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px),
                        linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
      maskImage:
        'radial-gradient(ellipse 70% 78% at 46% 50%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.16) 60%, rgba(0,0,0,0) 90%)',
      WebkitMaskImage:
        'radial-gradient(ellipse 70% 78% at 46% 50%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.16) 60%, rgba(0,0,0,0) 90%)',
    }}
  />
);

/**
 * A blurred, desaturated hero asset filling the whole frame behind content.
 *
 * Section 3 asks for "deliberate background treatment (blur-extend, colour
 * field, gradient) rather than cropping into the subject". This is the
 * blur-extend: the same photograph that is presented complete and uncropped in
 * the foreground also fills the frame behind it, so a 1.65:1 photo on a 1.78:1
 * canvas has something considered in the side margins instead of bare paper.
 * It is heavily blurred and washed toward the paper colour so it can never
 * compete with the foreground plate.
 */
export const LFBackdrop: React.FC<{
  id: number;
  opacity?: number;
  blur?: number;
  scale?: number;
  drift?: number;
}> = ({id, opacity = 0.30, blur = 54, scale = 1.18, drift = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={A(id)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: `blur(${blur}px) saturate(0.55) brightness(1.16) contrast(0.86)`,
          transform: `scale(${scale}) translateX(${drift * f * 0.014}px)`,
          opacity,
          display: 'block',
        }}
      />
      <AbsoluteFill style={{backgroundColor: 'rgba(242,244,247,0.42)'}} />
    </AbsoluteFill>
  );
};

/** Slow-drifting technical motes. Ambient motion, carries no information. */
export const LFMotes: React.FC<{n?: number; opacity?: number}> = ({n = 30, opacity = 0.4}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {new Array(n).fill(0).map((_, i) => {
        const sx = rnd(i * 3 + 1);
        const sy = rnd(i * 7 + 5);
        const sp = 0.08 + rnd(i * 11 + 3) * 0.2;
        const x = (sx * LF_CANVAS.w + f * sp * (i % 2 ? 1 : -1)) % LF_CANVAS.w;
        const y = sy * LF_CANVAS.h;
        const s = 2 + rnd(i * 13 + 9) * 3;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x < 0 ? x + LF_CANVAS.w : x,
              top: y,
              width: s,
              height: s,
              borderRadius: s,
              backgroundColor: i % 3 === 0 ? C.motu : C.inkDim,
              opacity: 0.12 + rnd(i * 17) * 0.2,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Thin measurement rail — engineering texture along one edge. */
export const LFRail: React.FC<{y: number; dir?: number; opacity?: number}> = ({
  y,
  dir = 1,
  opacity = 0.5,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, top: y, width: LF_CANVAS.w, height: 40, opacity}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 20,
          width: LF_CANVAS.w,
          height: 1,
          backgroundColor: C.line,
        }}
      />
      {new Array(70).fill(0).map((_, i) => {
        const major = i % 5 === 0;
        const x = ((i * 28 + f * 0.24 * dir) % (LF_CANVAS.w + 56)) - 28;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: major ? 10 : 15,
              width: major ? 2 : 1,
              height: major ? 19 : 10,
              backgroundColor: major ? C.motu : C.line,
              opacity: major ? 0.4 : 0.55,
            }}
          />
        );
      })}
    </div>
  );
};

export const LFStage: React.FC<{children: React.ReactNode; wash?: number; rails?: boolean}> = ({
  children,
  wash = 1,
  rails = true,
}) => (
  <AbsoluteFill style={{backgroundColor: C.paper}}>
    {/* horizontal base wash — a wide, evenly lit space */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(100deg,
          ${C.paperEdge} 0%, ${C.paperDeep} 6%, ${C.paper} 17%,
          ${C.paperHi} 42%, ${C.paperHi} 58%,
          ${C.paper} 82%, ${C.paperDeep} 95%, ${C.paperEdge} 100%)`,
      }}
    />
    {/* key light, pooled slightly left of centre where heroes sit */}
    <AbsoluteFill
      style={{
        opacity: wash,
        background: `radial-gradient(ellipse 62% 76% at 45% 46%,
          rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 46%, rgba(255,255,255,0) 80%)`,
      }}
    />
    {/* faint accent temperature */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 54% 46% at 47% 42%, ${C.motu}0E 0%, ${C.motu}00 74%)`,
      }}
    />
    <Grid />
    {rails ? (
      <>
        <LFRail y={26} dir={1} opacity={0.42} />
        <LFRail y={LF_CANVAS.h - 66} dir={-1} opacity={0.42} />
      </>
    ) : null}
    {children}
    <AbsoluteFill
      style={{
        backgroundImage: `url("${GRAIN}")`,
        backgroundSize: '180px 180px',
        opacity: 0.09,
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }}
    />
  </AbsoluteFill>
);

/** Absolute placement in canvas pixel coordinates. */
export const At: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = 0, y = 0, w, h, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}}>
    {children}
  </div>
);

/** Left column of the standard two-column landscape layout. */
export const Col: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  gap?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x = LF_CONTENT.x, y = LF_CONTENT.y, w = 760, gap = 0, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      display: 'flex',
      flexDirection: 'column',
      gap,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Staggered fade+rise wrapper for a block of content. */
export const Rise: React.FC<{
  delay?: number;
  dy?: number;
  dur?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({delay = 0, dy = 22, dur = 20, children, style}) => {
  const f = useCurrentFrame();
  const p = ramp(f, [delay, delay + dur], [0, 1]);
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * dy}px)`, ...style}}>{children}</div>
  );
};

/** Verification overlay — never rendered in the delivered composition. */
export const LFGuides: React.FC<{pad?: number}> = ({pad = 56}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: pad, height: LF_CANVAS.h, background: 'rgba(255,140,0,0.18)'}} />
    <div style={{position: 'absolute', right: 0, top: 0, width: pad, height: LF_CANVAS.h, background: 'rgba(255,140,0,0.18)'}} />
    <div
      style={{
        position: 'absolute',
        left: LF_CONTENT.x,
        top: LF_CONTENT.y,
        width: LF_CONTENT.w,
        height: LF_CONTENT.h,
        border: '2px dashed rgba(0,140,255,0.9)',
      }}
    />
  </AbsoluteFill>
);
