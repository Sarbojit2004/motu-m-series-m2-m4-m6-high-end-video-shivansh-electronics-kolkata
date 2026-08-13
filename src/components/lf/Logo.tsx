import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {LF_CANVAS} from '../../lib/lf-theme';
import {BrandKey, Pos} from '../../lib/lf-brand-plan';
import {EASE_IN_OUT, EASE_OUT, ramp} from '../../lib/anim';

/**
 * A logo placed DIRECTLY on screen — no box, card or plate.
 *
 * Section 9 is emphatic about this, and the supplied files defeat it on their
 * own: both ship as artwork on an opaque white rounded rectangle (measured
 * opaque-bbox fill 96.6% and 98.0%). scripts/prep_logos.py keys that plate off
 * into public/logo/*.png, so what this component draws is bare artwork. There
 * is deliberately no background, border, or backing shape anywhere below.
 *
 * LEGIBILITY WITHOUT A BOX. The MOTU wordmark is #6090F0, which is only 2.83:1
 * against the paper ground — fine for a large brand shape, soft at corner size.
 * Rather than recolour a brand mark or put it back on a plate, each mark gets a
 * faint drop-shadow that lifts it off the ground. A shadow is not a box: it
 * adds no visible edge or fill, it just separates the artwork from the paper.
 *
 * MOVEMENT. Section 9 requires marks that "constantly change position, and
 * appear and disappear" rather than sitting pinned. Placement comes from the
 * audited plan in lib/lf-brand-plan.ts, and each appearance enters and leaves
 * deliberately — a short eased slide from the nearest frame edge, combined with
 * a fade and a slight scale — never an abrupt cut to a static mark.
 */

const SRC: Record<BrandKey, string> = {
  motu: 'logo/motu.png',
  shivansh: 'logo/shivansh.png',
};

/** Natural pixel ratios of the plate-stripped files, for width from height. */
const RATIO: Record<BrandKey, number> = {
  motu: 1952 / 326, // 5.988
  shivansh: 2322 / 664, // 3.497
};

/** Comfortable inset for a placed mark — well inboard of the LF_PAD floor. */
const MX = 104;
const MY = 96;

export const logoSize = (brand: BrandKey, h: number) => ({w: Math.round(h * RATIO[brand]), h});

/** Resolves a slot to a top-left coordinate for a given mark size. */
export const logoAnchor = (
  pos: Pos,
  w: number,
  h: number,
): {x: number; y: number; dx: number; dy: number} => {
  const left = MX;
  const right = LF_CANVAS.w - MX - w;
  const cx = Math.round((LF_CANVAS.w - w) / 2);
  const top = MY;
  const bottom = LF_CANVAS.h - MY - h;
  const cy = Math.round((LF_CANVAS.h - h) / 2);

  // dx/dy is the entrance offset — always from the nearest frame edge, so the
  // mark reads as arriving into the frame rather than materialising in place
  const map: Record<Pos, {x: number; y: number; dx: number; dy: number}> = {
    tl: {x: left, y: top, dx: -34, dy: 0},
    tc: {x: cx, y: top, dx: 0, dy: -28},
    tr: {x: right, y: top, dx: 34, dy: 0},
    cl: {x: left, y: cy, dx: -34, dy: 0},
    center: {x: cx, y: cy, dx: 0, dy: 20},
    cr: {x: right, y: cy, dx: 34, dy: 0},
    bl: {x: left, y: bottom, dx: -34, dy: 0},
    bc: {x: cx, y: bottom, dx: 0, dy: 28},
    br: {x: right, y: bottom, dx: 34, dy: 0},
  };
  return map[pos];
};

/**
 * One logo appearance.
 *
 * `at` / `dur` are local to the enclosing scene. The mark fades and slides in
 * over `inF`, holds, then leaves over `outF`.
 */
export const LogoMark: React.FC<{
  brand: BrandKey;
  pos: Pos;
  /** Height in px. Width follows the artwork's own ratio. */
  size?: number;
  at?: number;
  dur?: number;
  inF?: number;
  outF?: number;
  /** Override the resolved anchor, for marks composed inside a beat layout. */
  x?: number;
  y?: number;
  opacity?: number;
}> = ({brand, pos, size = 54, at = 0, dur = 120, inF = 20, outF = 18, x, y, opacity = 1}) => {
  const f = useCurrentFrame() - at;
  const {w, h} = logoSize(brand, size);
  const a = logoAnchor(pos, w, h);

  const inP = ramp(f, [0, inF], [0, 1], EASE_OUT);
  const outP = ramp(f, [dur - outF, dur], [1, 0], EASE_IN_OUT);
  const p = Math.min(inP, outP);
  if (p <= 0.002) return null;

  const tx = (1 - inP) * a.dx - (1 - outP) * a.dx * 0.45;
  const ty = (1 - inP) * a.dy - (1 - outP) * a.dy * 0.45;
  const s = 0.955 + 0.045 * inP;

  return (
    <div
      style={{
        position: 'absolute',
        left: x ?? a.x,
        top: y ?? a.y,
        width: w,
        height: h,
        opacity: p * opacity,
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s})`,
        transformOrigin: 'center center',
      }}
    >
      <Img
        src={staticFile(SRC[brand])}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          // lifts the mark off the light ground without adding a box
          filter:
            brand === 'motu'
              ? 'drop-shadow(0 2px 10px rgba(10,16,23,0.16)) drop-shadow(0 1px 2px rgba(10,16,23,0.10))'
              : 'drop-shadow(0 2px 12px rgba(10,16,23,0.13))',
        }}
      />
    </div>
  );
};

/**
 * A bare mark sized and positioned by explicit coordinates, for use inside a
 * composed branding beat where the surrounding copy sets the layout.
 */
export const LogoInline: React.FC<{
  brand: BrandKey;
  size?: number;
  delay?: number;
  style?: React.CSSProperties;
}> = ({brand, size = 72, delay = 0, style}) => {
  const f = useCurrentFrame();
  const {w, h} = logoSize(brand, size);
  const p = ramp(f, [delay, delay + 22], [0, 1], EASE_OUT);
  return (
    <div
      style={{
        width: w,
        height: h,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px) scale(${0.96 + 0.04 * p})`,
        ...style,
      }}
    >
      <Img
        src={staticFile(SRC[brand])}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          filter:
            brand === 'motu'
              ? 'drop-shadow(0 2px 10px rgba(10,16,23,0.16)) drop-shadow(0 1px 2px rgba(10,16,23,0.10))'
              : 'drop-shadow(0 2px 12px rgba(10,16,23,0.13))',
        }}
      />
    </div>
  );
};
