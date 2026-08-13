import React from 'react';
import {Img, useCurrentFrame} from 'remotion';
import {C, LF_CANVAS, LF_PAD} from '../../lib/lf-theme';
import {A, Box, fitBox, meta} from '../../lib/images';
import {EASE_OUT, ramp} from '../../lib/anim';

/**
 * Media presentation for the landscape light ground.
 *
 * THE NO-CROP CONTRACT — carried over from the reels and, if anything, more
 * important here. Section 3 says to prefer resizing and padding over cropping
 * and to use a deliberate background treatment rather than cropping into the
 * subject.
 *
 * Two mechanisms enforce it:
 *
 *  1. Every box is solved by `fitBox` to the asset's EXACT aspect ratio, so an
 *     `objectFit: contain` image fills its box precisely — no letterbox bars,
 *     and nothing cut off.
 *
 *  2. Motion scales the PLATE (frame and image together), never the image
 *     inside a fixed frame. A Ken-Burns zoom of the inner image is exactly what
 *     eats edges; growing the whole plate cannot.
 *
 * `clampMove` then limits that plate growth to the room the box actually has
 * before it would cross the LF_PAD edge inset — the same guard the reels needed
 * once plate-scaling was introduced, rederived for this canvas.
 */

const PLATE_SHADOW =
  '0 30px 74px -34px rgba(10,16,23,0.44), 0 4px 12px -3px rgba(10,16,23,0.08)';

/**
 * Rewrites a push-in so the plate can never cross the edge inset.
 *
 * A plate scaling 1.0 -> 1.04 grows by 2% of its width on each side. If the box
 * has less than that in spare room, the push is re-expressed as a settle-IN
 * (0.96 -> 1.0) which reads as the same deliberate move but grows inward.
 */
const clampMove = (box: Box, z: [number, number]): [number, number] => {
  const leftRoom = box.x - LF_PAD;
  const rightRoom = LF_CANVAS.w - LF_PAD - (box.x + box.w);
  const topRoom = box.y - LF_PAD;
  const botRoom = LF_CANVAS.h - LF_PAD - (box.y + box.h);
  const room = Math.max(0, Math.min(leftRoom, rightRoom, topRoom, botRoom));

  const maxScale = 1 + (2 * room) / Math.max(box.w, box.h);
  const hi = Math.max(z[0], z[1]);
  if (hi <= maxScale) return z;

  // no room to grow outward — invert into a settle-in of the same magnitude
  const delta = Math.abs(z[1] - z[0]);
  return z[1] > z[0] ? [1 - delta, 1] : [1, 1 - delta];
};

export type Move = {z?: [number, number]; x?: [number, number]; y?: [number, number]};

/**
 * A photograph on a raised plate.
 *
 * `plate` gives the light-ground presence a bare cut-out would lack. The six
 * transparent panel cutouts pass `plate` too — their transparency then shows
 * the plate colour, which reads as an intentional spec card rather than a
 * floating shape.
 */
export const Shot: React.FC<{
  id: number;
  box: Box;
  dur: number;
  move?: Move;
  radius?: number;
  opacity?: number;
  plate?: boolean;
  pad?: number;
  bg?: string;
  border?: string | null;
  shadow?: boolean;
  grayscale?: number;
  style?: React.CSSProperties;
}> = ({
  id,
  box,
  dur,
  move,
  radius = 16,
  opacity = 1,
  plate = true,
  pad = 0,
  bg,
  border,
  shadow = true,
  grayscale = 0,
  style,
}) => {
  const f = useCurrentFrame();
  const t = dur <= 0 ? 0 : Math.min(1, Math.max(0, f / dur));
  const e = EASE_OUT(t);

  const z = clampMove(box, move?.z ?? [1, 1.028]);
  const s = z[0] + (z[1] - z[0]) * e;
  const mx = move?.x ?? [0, 0];
  const my = move?.y ?? [0, 0];
  const tx = mx[0] + (mx[1] - mx[0]) * e;
  const ty = my[0] + (my[1] - my[0]) * e;

  const bd = border === undefined ? (plate ? C.line : null) : border;

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        borderRadius: radius,
        overflow: 'hidden',
        opacity,
        backgroundColor: bg ?? (plate ? C.paperHi : 'transparent'),
        border: bd ? `1px solid ${bd}` : undefined,
        boxShadow: shadow ? PLATE_SHADOW : undefined,
        // the whole plate moves — the image inside is never zoomed, so no crop
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${s})`,
        ...style,
      }}
    >
      <Img
        src={A(id)}
        style={{
          width: `calc(100% - ${pad * 2}px)`,
          height: `calc(100% - ${pad * 2}px)`,
          marginLeft: pad,
          marginTop: pad,
          objectFit: 'contain',
          filter: grayscale ? `grayscale(${grayscale})` : undefined,
          display: 'block',
        }}
      />
    </div>
  );
};

/**
 * Hero convenience: solve an aspect-correct box inside a region and draw it.
 *
 * This is the default presentation for a scene's single hero asset — Section 3
 * asks for one hero per beat given real compositional weight.
 */
export const Hero: React.FC<{
  id: number;
  dur: number;
  x: number;
  y: number;
  maxW: number;
  maxH: number;
  align?: 'center' | 'left' | 'right';
  vcenter?: boolean;
  move?: Move;
  radius?: number;
  opacity?: number;
  plate?: boolean;
  pad?: number;
  bg?: string;
  shadow?: boolean;
  style?: React.CSSProperties;
}> = ({id, dur, x, y, maxW, maxH, align = 'center', vcenter = false, ...rest}) => {
  let box = fitBox(id, x, y, maxW, maxH, align);
  if (vcenter) box = {...box, y: y + Math.round((maxH - box.h) / 2)};
  return <Shot id={id} box={box} dur={dur} {...rest} />;
};

/**
 * A full-width band for the ultra-wide transparent panel cutouts.
 *
 * The six panel PNGs run 3.26:1 to 4.41:1. Boxing one into a general-purpose
 * region would waste most of the frame, so they get their own presentation:
 * the box takes the available width and derives its height from the asset's own
 * ratio, which is both the largest legible presentation and, again, uncropped.
 */
export const PanelBand: React.FC<{
  id: number;
  dur: number;
  x: number;
  y: number;
  w: number;
  move?: Move;
  opacity?: number;
  plate?: boolean;
  padY?: number;
  radius?: number;
  shadow?: boolean;
}> = ({id, dur, x, y, w, padY = 22, ...rest}) => {
  const m = meta(id);
  const h = Math.round(w / (m.w / m.h));
  return <Shot id={id} box={{x, y, w, h: h + padY * 2}} dur={dur} pad={0} {...rest} />;
};

/** Two assets side by side, top-aligned, each solved to its own ratio. */
export const Pair: React.FC<{
  ids: [number, number];
  dur: number;
  x: number;
  y: number;
  w: number;
  maxH: number;
  gap?: number;
  delay?: number;
  stagger?: number;
  move?: Move;
}> = ({ids, dur, x, y, w, maxH, gap = 26, delay = 0, stagger = 8, move}) => {
  const f = useCurrentFrame();
  const cw = (w - gap) / 2;
  // solve both, then align to the SHORTER height so the pair shares a top AND
  // a bottom line — two ratios in one row otherwise read as a mistake
  const a = fitBox(ids[0], x, y, cw, maxH);
  const b = fitBox(ids[1], x + cw + gap, y, cw, maxH);
  const h = Math.min(a.h, b.h);
  const ba = fitBox(ids[0], x, y, cw, h);
  const bb = fitBox(ids[1], x + cw + gap, y, cw, h);
  return (
    <>
      {[ba, bb].map((box, i) => {
        const d = delay + i * stagger;
        const p = ramp(f, [d, d + 18], [0, 1]);
        return (
          <Shot
            key={ids[i]}
            id={ids[i]}
            box={box}
            dur={dur}
            move={move}
            opacity={p}
            style={{transform: `translateY(${(1 - p) * 18}px)`}}
          />
        );
      })}
    </>
  );
};

/** Staggered n-up row for supporting assets. Each solved to its own ratio. */
export const Row: React.FC<{
  ids: number[];
  dur: number;
  x: number;
  y: number;
  w: number;
  maxH: number;
  gap?: number;
  delay?: number;
  stagger?: number;
}> = ({ids, dur, x, y, w, maxH, gap = 22, delay = 0, stagger = 7}) => {
  const f = useCurrentFrame();
  const n = ids.length;
  const cw = (w - gap * (n - 1)) / n;
  const boxes = ids.map((id, i) => fitBox(id, x + i * (cw + gap), y, cw, maxH));
  const h = Math.min(...boxes.map((b) => b.h));
  return (
    <>
      {ids.map((id, i) => {
        const box = fitBox(id, x + i * (cw + gap), y, cw, h);
        const d = delay + i * stagger;
        const p = ramp(f, [d, d + 18], [0, 1]);
        return (
          <Shot
            key={id}
            id={id}
            box={box}
            dur={dur}
            opacity={p}
            radius={13}
            style={{transform: `translateY(${(1 - p) * 16}px)`}}
          />
        );
      })}
    </>
  );
};
