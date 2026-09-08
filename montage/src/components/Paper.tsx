import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";

/**
 * Technique #1 - the torn/crumpled paper world the whole reel sits on.
 *
 * The sheet and the blind-shadow streaks are separate plates drifting at
 * different rates, so the light keeps moving across the paper for the whole
 * 90 seconds instead of sitting still behind the cuts.
 */
export const Paper: React.FC<{
  sheet: number;
  streak: number;
  /** frames since this composition started */
  local: number;
  hold: number;
  lean: number;
}> = ({ sheet, streak, local, hold, lean }) => {
  const t = hold > 0 ? local / hold : 0;

  // the sheet creeps; never enough to read as a move, always enough to breathe
  const pScale = interpolate(t, [0, 1], [1.06, 1.13]);
  const pX = interpolate(t, [0, 1], [0, -18 * lean]);
  const pY = interpolate(t, [0, 1], [0, -14]);

  // the light travels the other way, which keeps the two from locking together
  const sScale = interpolate(t, [0, 1], [1.16, 1.09]);
  const sX = interpolate(t, [0, 1], [-26 * lean, 22 * lean]);
  const sY = interpolate(t, [0, 1], [10, -16]);

  const cover: React.CSSProperties = {
    position: "absolute",
    width: W,
    height: H,
    objectFit: "cover",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <Img
        src={staticFile(`art/paper-${sheet}.jpg`)}
        style={{
          ...cover,
          transform: `translate(${pX}px, ${pY}px) scale(${pScale})`,
        }}
      />
      <Img
        src={staticFile(`art/streaks-${streak}.jpg`)}
        style={{
          ...cover,
          mixBlendMode: "multiply",
          opacity: 0.80,
          transform: `translate(${sX}px, ${sY}px) scale(${sScale})`,
        }}
      />
      {/* grain sits on the sheet, never over the photography */}
      <Grain opacity={0.13} />
    </AbsoluteFill>
  );
};

/** Fine print grain over the whole frame, tiled rather than stretched. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.13 }) => {
  const frame = useCurrentFrame();
  // shift the tile every other frame so the grain crawls like film
  const step = Math.floor(frame / 2) % 6;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile("art/grain.png")})`,
        backgroundSize: "256px 256px",
        backgroundPosition: `${step * 37}px ${step * 53}px`,
        mixBlendMode: "overlay",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
