import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { C } from "../theme";
import { hashStr } from "../rand";
import { tornPath } from "../torn";

/**
 * Technique #5 - a solid colour block that wipes on and sits under or over
 * the type. Used sparingly: a crimson rule under a headline, a black field
 * behind a word.
 */
export const ColorBlock: React.FC<{
  local: number;
  delay: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  rotate?: number;
  torn?: boolean;
  seed?: string;
  z?: number;
  from?: -1 | 1;
}> = ({
  local,
  delay,
  x,
  y,
  w,
  h,
  color = C.crimson,
  rotate = 0,
  torn = false,
  seed = "block",
  z = 3,
  from = -1,
}) => {
  const { fps } = useVideoConfig();
  const s = spring({
    frame: local - delay,
    fps,
    config: { damping: 16, mass: 0.5, stiffness: 200 },
    durationInFrames: 16,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: color,
        zIndex: z,
        transformOrigin: from < 0 ? "left center" : "right center",
        transform: `rotate(${rotate}deg) scaleX(${interpolate(s, [0, 1], [0, 1])})`,
        clipPath: torn ? tornPath(w, h, hashStr(seed), 0.05) : undefined,
      }}
    />
  );
};
