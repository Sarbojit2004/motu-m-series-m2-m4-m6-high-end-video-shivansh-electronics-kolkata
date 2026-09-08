import React from "react";
import { Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";
import { objectShadow } from "../theme";
import { hashStr, mulberry } from "../rand";

/**
 * Technique #4 + #7 - a screenprinted photograph behaving like a printed tile
 * dropped onto the sheet: it lands with a tiny overshoot, sits at an angle,
 * and keeps drifting for as long as it is on screen.
 */
export const Plate: React.FC<{
  id: string;
  local: number;
  hold: number;
  delay?: number;
  /** width in composition px */
  width: number;
  x: number;
  y: number;
  rotate?: number;
  /** how far the plate creeps across its hold, in px */
  drift?: number;
  driftDir?: number;
  zoom?: number;
  shadow?: number;
  opacity?: number;
  z?: number;
}> = ({
  id,
  local,
  hold,
  delay = 0,
  width,
  x,
  y,
  rotate = 0,
  drift = 16,
  driftDir = 1,
  zoom = 0.035,
  shadow = 16,
  opacity = 1,
  z = 2,
}) => {
  const { fps } = useVideoConfig();
  const r = mulberry(hashStr(id));
  const s = spring({
    frame: local - delay,
    fps,
    config: { damping: 15, mass: 0.75, stiffness: 150 },
    durationInFrames: 22,
  });
  const t = hold > 0 ? Math.min(1, Math.max(0, local / hold)) : 0;

  // the settle: overshoots its angle, then eases onto its mark
  const rot = rotate + (1 - s) * (r() - 0.5) * 6.5;
  const scale = interpolate(s, [0, 1], [1.07, 1]) * (1 + t * zoom);
  const dx = x + t * drift * driftDir;
  const dy = y + t * drift * 0.45;

  return (
    <Img
      src={staticFile(`art/img/${id}.png`)}
      style={{
        position: "absolute",
        left: dx,
        top: dy,
        width,
        zIndex: z,
        opacity: opacity * interpolate(s, [0, 0.25], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${(1 - s) * 34}px) rotate(${rot}deg) scale(${scale})`,
        filter: objectShadow(shadow),
      }}
    />
  );
};
