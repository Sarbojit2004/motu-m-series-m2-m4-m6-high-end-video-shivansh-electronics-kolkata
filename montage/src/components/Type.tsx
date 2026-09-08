import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { C, DISPLAY_TRIM, FONT } from "../theme";
import { hashStr, mulberry } from "../rand";
import { tornPath } from "../torn";

/**
 * Technique #2 + #3 - giant condensed display type that builds letter by
 * letter, at a size that bleeds past the frame rather than sitting safely
 * inside it.
 */
export const GiantLine: React.FC<{
  text: string;
  size: number;
  local: number;
  delay: number;
  color?: string;
  /** alternate every other letter into the accent colour */
  alt?: boolean;
  altColor?: string;
  /** per-letter reveal step, in frames */
  step?: number;
  align?: "left" | "right" | "center";
  shadow?: boolean;
  seed?: string;
}> = ({
  text,
  size,
  local,
  delay,
  color = C.ink,
  alt = false,
  altColor = C.crimson,
  step = 1.4,
  align = "left",
  shadow = true,
  seed = text,
}) => {
  const { fps } = useVideoConfig();
  const r = mulberry(hashStr(seed));
  const letters = text.split("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 0.86,
        letterSpacing: -size * 0.012,
        whiteSpace: "pre",
        marginTop: -size * DISPLAY_TRIM,
      }}
    >
      {letters.map((ch, i) => {
        const at = delay + i * step;
        const s = spring({
          frame: local - at,
          fps,
          config: { damping: 14, mass: 0.52, stiffness: 190 },
          durationInFrames: 18,
        });
        // each letter is set by hand: its own tiny tilt and drop
        const rot = (r() - 0.5) * 3.2;
        const dy = (r() - 0.5) * 0.05 * size;
        const col = alt && i % 2 === 1 ? altColor : color;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: col,
              opacity: interpolate(s, [0, 0.35], [0, 1], {
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${(1 - s) * (size * 0.30) + dy * (1 - s)}px)
                          scale(${interpolate(s, [0, 1], [0.72, 1])})
                          rotate(${rot * (1 - s)}deg)`,
              textShadow: shadow
                ? `${size * 0.022}px ${size * 0.030}px 0 rgba(22,18,16,0.42)`
                : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Technique #5 - short phrases inside solid colour rectangles that stack and
 * overlap each other and the photography.
 */
export const TagLabel: React.FC<{
  text: string;
  size: number;
  local: number;
  delay: number;
  bg?: string;
  fg?: string;
  rotate?: number;
  torn?: boolean;
  from?: "left" | "right" | "up";
  seed?: string;
}> = ({
  text,
  size,
  local,
  delay,
  bg = C.ink,
  fg = C.bone,
  rotate = -1.6,
  torn = false,
  from = "left",
  seed = text,
}) => {
  const { fps } = useVideoConfig();
  const s = spring({
    frame: local - delay,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 165 },
    durationInFrames: 20,
  });
  const dx = from === "left" ? -1 : from === "right" ? 1 : 0;
  const dy = from === "up" ? -1 : 0;
  const w = text.length * size * 0.62 + size * 1.5;
  const h = size * 1.72;

  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: bg,
        color: fg,
        fontFamily: FONT.tag,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.055,
        padding: `${size * 0.34}px ${size * 0.72}px ${size * 0.38}px`,
        opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translate(${(1 - s) * dx * size * 3.2}px, ${
          (1 - s) * dy * size * 2.4
        }px) rotate(${rotate * (0.4 + 0.6 * s)}deg) scale(${interpolate(
          s,
          [0, 1],
          [0.86, 1]
        )})`,
        boxShadow: torn ? undefined : `${size * 0.11}px ${size * 0.15}px 0 rgba(22,18,16,0.30)`,
        clipPath: torn ? tornPath(w, h, hashStr(seed), 0.05) : undefined,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};
