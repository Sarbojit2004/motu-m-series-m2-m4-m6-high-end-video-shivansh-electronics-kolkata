import React from 'react';
import {Img, useCurrentFrame} from 'remotion';
import {C, SAFE} from '../lib/theme';
import {A, Box, fitBox, fitBoxC, meta} from '../lib/images';
import {EASE_CAMERA, plateMove, ramp} from '../lib/anim';

/**
 * Media presentation for a LIGHT ground — and the enforcement point for the
 * delivery requirement that every image be shown COMPLETE, never cropped or
 * cut off.
 *
 * HOW NO-CROP IS GUARANTEED
 *
 * Two mechanisms, together:
 *
 *  1. Every box is solved by `fitBox`/`fitBoxC` from the asset's true pixel
 *     dimensions recorded in the ledger, so the box carries the image's EXACT
 *     aspect ratio. With `objectFit: contain` the image then fills its box
 *     precisely — no letterbox bars, and no part of the frame discarded.
 *     `HeroShot`, `Band`, `Pair`, `Trio` and `SeqShot` all solve their own
 *     boxes, so a caller cannot accidentally hand them a mismatched ratio.
 *
 *  2. Camera motion scales the PLATE — the frame and the image together — via
 *     `plateMove`, instead of zooming the image inside a fixed frame. A
 *     conventional Ken Burns necessarily crops, because the frame stays put
 *     while the image grows past it. Here the whole composed unit eases
 *     forward, so the subject stays entirely in view at every one of the 2640
 *     frames while the shot still reads as the brief's slow, eased push-in.
 *
 * `objectFit: 'cover'` is deliberately NOT the default anywhere in this
 * project, and is used only by the deliberately-blurred ambient wash in
 * Stage.tsx, which carries no readable detail by design.
 *
 * PLATE TREATMENT. The M-Series product renders are shot on white and the six
 * panel assets are transparent cutouts, so on a light page they need a plate to
 * have presence: a marginally raised paperHi card with a hairline rule and a
 * soft contact shadow. That reads as a clean spec card and keeps the black
 * chassis the darkest thing in frame — the point of the brief's light-
 * background direction.
 *
 * Coordinates are pixels inside the primary safe rect (0..936 x 0..1330).
 */

// Horizontal extent beyond the box is `spread + blur/2`, so these two layers
// bleed ~2px and ~3px sideways respectively. SHADOW_BLEED reserves for that in
// the scale clamp below.
const PLATE_SHADOW =
  '0 26px 64px -30px rgba(10,16,23,0.44), 0 3px 10px -2px rgba(10,16,23,0.09)';
const SHADOW_BLEED = 4;

/**
 * Largest scale a plate may reach without leaving the primary safe rect.
 *
 * The no-crop camera move scales the whole plate about its centre, which means a
 * plate that already spans the full safe width would grow straight into the
 * 72px side margins — a safe-zone violation caught by
 * scripts/safezone_audit.py on a full-width hero in P1S02.
 *
 * Rather than forbid full-width plates or drop the motion, the requested scale
 * is clamped to whatever the box's own side room allows. A plate with space
 * around it still gets the full push-in; a full-bleed plate is held at 1.0 and
 * its `move` is expressed as a settle-in instead (see `inwardMove`).
 */
const maxScaleFor = (box: Box): number => {
  const room = Math.min(box.x, SAFE.w - (box.x + box.w)) - SHADOW_BLEED;
  if (box.w <= 0) return 1;
  return Math.max(1, 1 + (2 * Math.max(0, room)) / box.w);
};

/**
 * Rewrites a push-out into a settle-in when the box has no side room.
 *
 * `[1.0, 1.035]` on a full-width plate becomes `[0.966, 1.0]`: the same eased
 * travel and the same sense of the camera moving in, but the plate arrives at
 * its designed geometry instead of overshooting past it. Motion is preserved
 * rather than discarded.
 */
const clampMove = (z: [number, number], box: Box): [number, number] => {
  const zMax = maxScaleFor(box);
  const hi = Math.max(z[0], z[1]);
  if (hi <= zMax) return z;
  const travel = Math.abs(z[1] - z[0]);
  return z[1] >= z[0] ? [zMax - travel, zMax] : [zMax, zMax - travel];
};

export type Move = {
  z?: [number, number];
  x?: [number, number];
  y?: [number, number];
};

type ShotProps = {
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
  rotate?: number;
  grayscale?: number;
  /**
   * Escape hatch, used nowhere in the delivered scenes. Present only so a
   * future decorative element can opt out; anything readable must stay
   * 'contain'.
   */
  fit?: 'contain' | 'cover';
  style?: React.CSSProperties;
};

/**
 * A single image on a plate. Prefer `HeroShot`/`Band` — they solve the
 * aspect-matched box for you. Use `Shot` directly only with a box that already
 * came out of `fitBox`.
 */
export const Shot: React.FC<ShotProps> = ({
  id,
  box,
  dur,
  move,
  radius = 14,
  opacity = 1,
  plate = true,
  pad = 0,
  bg,
  border,
  shadow = true,
  rotate = 0,
  grayscale = 0,
  fit = 'contain',
  style,
}) => {
  const f = useCurrentFrame();
  // The scale is clamped to the box's own side room so a push-in can never
  // carry the plate into the 72px side margins.
  const z = clampMove(move?.z ?? [1.0, 1.03], box);
  const tf = plateMove(f, dur, z, move?.x ?? [0, 0], move?.y ?? [0, 0]);
  const bd = border === undefined ? (plate ? C.line : null) : border;

  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.x + box.x,
        top: SAFE.y + box.y,
        width: box.w,
        height: box.h,
        borderRadius: radius,
        opacity,
        backgroundColor: bg ?? (plate ? C.paperHi : 'transparent'),
        border: bd ? `1px solid ${bd}` : undefined,
        boxShadow: shadow ? PLATE_SHADOW : undefined,
        overflow: 'hidden',
        ...style,
        // Applied AFTER the caller's style on purpose: the plate transform is
        // what keeps the image uncropped, so it must not be overridable.
        // Callers adjust it through `move` and `rotate` instead.
        transform: `${tf} rotate(${rotate}deg)`,
        transformOrigin: 'center center',
      }}
    >
      <Img
        src={A(id)}
        style={{
          width: `calc(100% - ${pad * 2}px)`,
          height: `calc(100% - ${pad * 2}px)`,
          marginLeft: pad,
          marginTop: pad,
          objectFit: fit,
          filter: grayscale ? `grayscale(${grayscale})` : undefined,
          display: 'block',
        }}
      />
    </div>
  );
};

/**
 * The default way to present a photograph: the largest aspect-correct plate
 * that fits the given area, horizontally centred, with an eased push-in.
 */
export const HeroShot: React.FC<
  Omit<ShotProps, 'box'> & {
    x?: number;
    y?: number;
    maxW?: number;
    maxH?: number;
    align?: 'center' | 'left' | 'right';
    vcenter?: boolean;
  }
> = ({id, x = 0, y = 0, maxW = SAFE.w, maxH = 700, align = 'center', vcenter = false, ...rest}) => {
  const box = vcenter ? fitBoxC(id, x, y, maxW, maxH) : fitBox(id, x, y, maxW, maxH, align);
  return <Shot id={id} box={box} {...rest} />;
};

/**
 * Full-width band for the six ultra-wide transparent panel cutouts (aspect
 * 3.26 - 4.41). Their height follows from the safe width, so the whole front or
 * rear panel is legible edge to edge — these are the most technically valuable
 * assets in the set and must never be trimmed.
 */
export const Band: React.FC<
  Omit<ShotProps, 'box' | 'dur'> & {
    dur: number;
    y: number;
    w?: number;
    x?: number;
    padY?: number;
  }
> = ({id, y, w = SAFE.w, x = 0, padY = 18, dur, ...rest}) => {
  const m = meta(id);
  const innerW = w - padY * 2;
  const h = Math.round(innerW / (m.w / m.h)) + padY * 2;
  return (
    <Shot
      id={id}
      dur={dur}
      box={{x, y, w, h}}
      pad={padY}
      radius={12}
      {...rest}
    />
  );
};

/** Height a `Band` will occupy — so callers can lay out around it. */
export const bandHeight = (id: number, w = SAFE.w, padY = 18): number => {
  const m = meta(id);
  return Math.round((w - padY * 2) / (m.w / m.h)) + padY * 2;
};

/**
 * Two aspect-matched plates side by side.
 *
 * Used only where a comparison is the actual point — chiefly the I/O
 * comparison the brief's "I/O Comparison Bar" concept calls for. It is not a
 * coverage mechanism: at this project's asset density the default is one hero
 * per beat.
 */
export const Pair: React.FC<{
  ids: [number, number];
  dur: number;
  y: number;
  gap?: number;
  maxH?: number;
  delay?: number;
  stagger?: number;
  radius?: number;
  /**
   * 'top' (default) gives both plates a common top edge. Because each plate is
   * sized to its own aspect ratio the two heights differ, and centring them
   * independently made the row read as a see-saw with nothing aligned. A shared
   * top edge is the stronger alignment cue and cannot overflow, since a
   * top-aligned box occupies [y, y+h] ⊆ [y, y+maxH].
   */
  align?: 'top' | 'middle';
}> = ({ids, dur, y, gap = 22, maxH = 420, delay = 0, stagger = 8, radius = 12, align = 'top'}) => {
  const f = useCurrentFrame();
  const colW = (SAFE.w - gap) / 2;
  return (
    <>
      {ids.map((id, i) => {
        const x = i * (colW + gap);
        const b =
          align === 'middle'
            ? fitBoxC(id, x, y, colW, maxH)
            : fitBox(id, x, y, colW, maxH, 'center');
        const p = ramp(f, [delay + i * stagger, delay + i * stagger + 18], [0, 1]);
        return (
          <Shot
            key={id}
            id={id}
            dur={dur}
            box={b}
            radius={radius}
            opacity={p}
            move={{z: [1.0, 1.025]}}
          />
        );
      })}
    </>
  );
};

/**
 * Three stacked full-width bands — the Part 1 hook, establishing the family by
 * showing the M2, M4 and M6 front panels one above the other so the ascending
 * input count is visible at a glance. No supplied image shows all three units
 * together, so this composition is how the family is established.
 */
export const Trio: React.FC<{
  ids: [number, number, number];
  dur: number;
  y: number;
  gap?: number;
  w?: number;
  /** Omit to centre the stack inside the safe rect. */
  x?: number;
  delay?: number;
  stagger?: number;
  padY?: number;
}> = ({ids, dur, y, gap = 20, w = SAFE.w, x, delay = 0, stagger = 12, padY = 14}) => {
  const f = useCurrentFrame();
  const left = x ?? Math.round((SAFE.w - w) / 2);
  let cursor = y;
  const rows = ids.map((id) => {
    const h = bandHeight(id, w, padY);
    const row = {id, y: cursor, h};
    cursor += h + gap;
    return row;
  });
  return (
    <>
      {rows.map((r, i) => {
        const d = delay + i * stagger;
        const p = ramp(f, [d, d + 20], [0, 1], EASE_CAMERA);
        return (
          <Shot
            key={r.id}
            id={r.id}
            dur={dur}
            box={{x: left, y: r.y, w, h: r.h}}
            pad={padY}
            radius={12}
            opacity={p}
            move={{z: [1.0, 1.018]}}
          />
        );
      })}
    </>
  );
};

/** Total height a `Trio` occupies. */
export const trioHeight = (
  ids: [number, number, number],
  w = SAFE.w,
  gap = 20,
  padY = 14,
): number => ids.reduce((a, id) => a + bandHeight(id, w, padY), 0) + gap * (ids.length - 1);

/**
 * Steps through several assets in one slot with a cross-dissolve, each solved
 * to its OWN aspect ratio so every image in the sequence is shown complete.
 *
 * Reserved for scenes that genuinely present a sequence — e.g. the three
 * multi-source tracking scenarios (drum kit, podcast panel, live duo). It holds
 * the outgoing frame underneath while the incoming one fades over it, so a step
 * never flashes to the ground colour.
 */
export const SeqShot: React.FC<{
  ids: number[];
  dur: number;
  y: number;
  maxW?: number;
  maxH?: number;
  fadeF?: number;
  radius?: number;
  move?: Move;
}> = ({ids, dur, y, maxW = SAFE.w, maxH = 620, fadeF = 14, radius = 14, move}) => {
  const f = useCurrentFrame();
  const per = dur / Math.max(1, ids.length);
  const i = Math.min(ids.length - 1, Math.max(0, Math.floor(f / per)));
  const local = f - i * per;
  const g = i > 0 ? Math.min(1, Math.max(0, local / fadeF)) : 1;

  const boxOf = (n: number) => fitBoxC(n, 0, y, maxW, maxH);

  return (
    <>
      {i > 0 && g < 1 ? (
        <Shot
          key={`prev-${i}`}
          id={ids[i - 1]}
          dur={per}
          box={boxOf(ids[i - 1])}
          radius={radius}
          move={move}
        />
      ) : null}
      <Shot
        key={`cur-${i}`}
        id={ids[i]}
        dur={per}
        box={boxOf(ids[i])}
        radius={radius}
        opacity={g}
        move={move}
      />
    </>
  );
};

/**
 * A dark-plate presentation for the bundled-software screenshot collage, which
 * is itself a dark UI montage. Sitting it on the ink plate rather than paperHi
 * stops a bright rim appearing around dark pixels — and keeps it aspect-exact.
 */
export const ScreenShot: React.FC<{
  id: number;
  dur: number;
  y: number;
  maxW?: number;
  maxH?: number;
  radius?: number;
  move?: Move;
  opacity?: number;
}> = ({id, dur, y, maxW = SAFE.w, maxH = 520, radius = 12, move, opacity = 1}) => (
  <Shot
    id={id}
    dur={dur}
    box={fitBoxC(id, 0, y, maxW, maxH)}
    radius={radius}
    move={move}
    opacity={opacity}
    bg={C.screen}
    border={C.ink}
    pad={10}
  />
);
