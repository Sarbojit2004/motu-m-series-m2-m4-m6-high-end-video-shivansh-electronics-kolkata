import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ramp} from '../lib/anim';

/**
 * One timed beat inside a scene.
 *
 * `to` marks where the beat STARTS fading out, not where it has finished, so
 * the beat is fully opaque across the whole [from + fade, to] window and its
 * fade-out overlaps the next beat's fade-in. Treating `to` as the end instead
 * leaves a few frames at every boundary where the outgoing beat has reached
 * zero and the incoming one is still under half — a visible pale gap where the
 * hero image should be. The last beat in a scene passes `to = dur`, so it holds
 * to the end and then dissolves through the scene overlap into the next scene.
 *
 * At this project's pacing most scenes need only one or two beats — a beat is a
 * genuine compositional change, not a montage step.
 */
export const B: React.FC<{
  from: number;
  to: number;
  fade?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({from, to, fade = 13, children, style}) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, [from, from + fade], [0, 1]), ramp(f, [to, to + fade], [1, 0]));
  if (o <= 0.002) return null;
  return <AbsoluteFill style={{opacity: o, ...style}}>{children}</AbsoluteFill>;
};

/**
 * Beat that also slides. Used for the brief's lateral I/O Expansion Slide,
 * where the camera travels horizontally to take in more connectivity.
 */
export const BSlide: React.FC<{
  from: number;
  to: number;
  fade?: number;
  dx?: number;
  dy?: number;
  children: React.ReactNode;
}> = ({from, to, fade = 12, dx = 0, dy = 0, children}) => {
  const f = useCurrentFrame();
  const inP = ramp(f, [from, from + fade], [0, 1]);
  const outP = ramp(f, [to, to + fade], [1, 0]);
  const o = Math.min(inP, outP);
  if (o <= 0.002) return null;
  const x = (1 - inP) * dx - (1 - outP) * dx * 0.5;
  const y = (1 - inP) * dy - (1 - outP) * dy * 0.5;
  return (
    <AbsoluteFill style={{opacity: o, transform: `translate3d(${x}px, ${y}px, 0)`}}>
      {children}
    </AbsoluteFill>
  );
};

/**
 * Standard vertical rhythm inside the 936 x 1330 primary safe rect.
 *
 * Content biases upward inside the box, per the safe-zone contract: the
 * headline block sits high, the hero plate occupies the generous middle, and
 * spec/contact material sits below it — all comfortably inboard of y=1330,
 * which is the 1580px absolute boundary.
 */
export const Y = {
  mark: 4,
  kicker: 62,
  head: 98,
  sub: 250,
  media: 330,
  mediaTall: 300,
  spec: 1000,
  strip: 1272,
} as const;
