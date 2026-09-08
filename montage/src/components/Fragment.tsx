import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { C, H, W } from "../theme";
import { aspect } from "../catalog";
import { hashStr, mulberry } from "../rand";

/**
 * A hard crop of one screenprinted plate, blown up so a single detail fills
 * the frame. The cold open and the closing callback are built from these.
 */
export const Fragment: React.FC<{
  id: string;
  local: number;
  hold: number;
  seed?: number;
}> = ({ id, local, hold, seed = 0 }) => {
  const r = mulberry(hashStr(id) + seed * 7717);
  const ar = aspect(id);
  // fill the frame from the short side, then push well past it
  const base = Math.max(W, H * ar);
  const scale = base * (1.7 + r() * 0.55);
  const t = hold > 0 ? local / hold : 0;

  // bias the offset toward the middle: a hard crop should land on the subject
  const ox = (r() - 0.5) * scale * 0.24;
  const oy = (r() - 0.5) * (scale / ar) * 0.20;
  const rot = (r() - 0.5) * 7;
  const push = interpolate(t, [0, 1], [1, 1.08]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.ink }}>
      <Img
        src={staticFile(`art/img/${id}.png`)}
        style={{
          position: "absolute",
          left: W / 2 + ox,
          top: H / 2 + oy,
          width: scale,
          transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${push})`,
        }}
      />
    </AbsoluteFill>
  );
};
