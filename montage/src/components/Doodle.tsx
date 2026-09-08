import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";

/**
 * Technique #6 - the recurring hand-drawn circle that sweeps in around a key
 * piece of type. Drawn as a stroke-dashoffset sweep so it reads as one
 * continuous marker gesture rather than a fade.
 */
export const CircleNote: React.FC<{
  local: number;
  delay: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  color?: string;
  stroke?: number;
}> = ({ local, delay, x, y, w, h, rotate = -4, color = C.annotate, stroke = 13 }) => {
  const p = interpolate(local - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rx = w / 2 - stroke;
  const ry = h / 2 - stroke;

  // a marker circle: just over one turn round an ellipse, with enough wobble
  // that it reads as drawn by hand rather than plotted
  const N = 72;
  const turns = 1.07;
  const from = -0.42 * Math.PI;
  const pts: string[] = [];
  let len = 0;
  let prev: [number, number] | null = null;
  for (let i = 0; i <= N; i++) {
    const a = from + turns * 2 * Math.PI * (i / N);
    const wob = 1 + 0.032 * Math.sin(a * 3.1 + 1.2) + 0.018 * Math.sin(a * 5.7);
    const cx = w / 2 + Math.cos(a) * rx * wob;
    const cy = h / 2 + Math.sin(a) * ry * wob * (1 + 0.05 * (i / N));
    if (prev) len += Math.hypot(cx - prev[0], cy - prev[1]);
    prev = [cx, cy];
    pts.push(`${cx.toFixed(1)},${cy.toFixed(1)}`);
  }
  const d = `M ${pts.join(" L ")}`;
  const total = len;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `rotate(${rotate}deg)`,
        zIndex: 9,
        overflow: "visible",
      }}
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={total}
        strokeDashoffset={total * (1 - p)}
        opacity={0.92}
      />
    </svg>
  );
};

/** Technique #7 - a small hand-drawn sparkle, dropped on like a sticker. */
export const Star: React.FC<{
  local: number;
  delay: number;
  x: number;
  y: number;
  size: number;
  color?: string;
  rotate?: number;
}> = ({ local, delay, x, y, size, color = C.ink, rotate = 0 }) => {
  const { fps } = useVideoConfig();
  const s = spring({
    frame: local - delay,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 200 },
    durationInFrames: 16,
  });
  const h = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        left: x - h,
        top: y - h,
        zIndex: 9,
        opacity: s,
        transform: `rotate(${rotate + (1 - s) * 90}deg) scale(${s})`,
      }}
    >
      <path
        d="M50 2 C54 34 66 46 98 50 C66 54 54 66 50 98 C46 66 34 54 2 50 C34 46 46 34 50 2 Z"
        fill={color}
      />
    </svg>
  );
};
