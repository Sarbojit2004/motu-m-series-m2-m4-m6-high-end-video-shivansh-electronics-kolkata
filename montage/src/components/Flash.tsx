import React from "react";
import { AbsoluteFill, interpolate } from "remotion";

/**
 * Technique #9 - a hard flash-to-white used as beat-drop punctuation: a
 * strobe hit between two compositions, never a crossfade.
 */
export const Flash: React.FC<{
  local: number;
  at: number;
  len?: number;
  peak?: number;
  color?: string;
}> = ({ local, at, len = 7, peak = 1, color = "#FFFDF7" }) => {
  const t = local - at;
  if (t < -1 || t > len) return null;
  const o = interpolate(t, [-1, 0, len * 0.28, len], [0, peak, peak * 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{ backgroundColor: color, opacity: o, zIndex: 40, pointerEvents: "none" }}
    />
  );
};
