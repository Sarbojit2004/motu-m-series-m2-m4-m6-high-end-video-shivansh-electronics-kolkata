import React from "react";
import { Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";
import { C, FONT, objectShadow } from "../theme";

/**
 * Branding, presented in the reel's own language: each mark sits on a torn
 * scrap of the same paper as the backdrop rather than floating over the
 * scene as a foreign corporate lockup.
 *
 * Contact details are the ones this client uses across the repository.
 */
export const CONTACT = {
  whatsapp: "+91 98316 62458",
  site: "www.shivanshelectronics.in",
} as const;

export const LogoTag: React.FC<{
  which: "motu" | "shivansh";
  local: number;
  delay: number;
  width: number;
  x: number;
  y: number;
  rotate?: number;
}> = ({ which, local, delay, width, x, y, rotate = -1.8 }) => {
  const { fps } = useVideoConfig();
  const s = spring({
    frame: local - delay,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 175 },
    durationInFrames: 20,
  });
  return (
    <Img
      src={staticFile(`art/logo-${which}.png`)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        zIndex: 12,
        opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${(1 - s) * 26}px) rotate(${
          rotate * (0.3 + 0.7 * s)
        }deg) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        filter: objectShadow(11, 0.3),
      }}
    />
  );
};

const WhatsAppMark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
    <path
      fill={color}
      d="M16 3.2A12.7 12.7 0 0 0 5.1 22.5L3.4 28.8l6.5-1.7A12.7 12.7 0 1 0 16 3.2Zm0 2.3a10.4 10.4 0 1 1-5.3 19.4l-.4-.2-3.9 1 1-3.8-.3-.4A10.4 10.4 0 0 1 16 5.5Zm-4.7 5.2c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.4 3.6 1.5 3.9c.2.2 2.6 4.1 6.4 5.6 3.1 1.2 3.8 1 4.4.9.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.8-.5l-2.6-1.3c-.4-.1-.6-.2-.9.2l-1.2 1.5c-.2.3-.4.3-.8.1a8.5 8.5 0 0 1-2.5-1.6 9.6 9.6 0 0 1-1.8-2.2c-.2-.4 0-.5.2-.7l.6-.7c.2-.2.2-.4.3-.6.1-.3 0-.5 0-.7l-1.2-2.8c-.3-.7-.6-.6-.8-.6h-.7Z"
    />
  </svg>
);

const GlobeMark: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ flexShrink: 0 }}>
    <g fill="none" stroke={color} strokeWidth={2.1}>
      <circle cx="16" cy="16" r="12.4" />
      <ellipse cx="16" cy="16" rx="5.4" ry="12.4" />
      <path d="M4.4 12h23.2M4.4 20h23.2" strokeLinecap="round" />
    </g>
  </svg>
);

/**
 * WhatsApp + website, on their own torn strip. Mandatory at the close, used
 * once mid-reel on a wide, calm composition where it will not compete.
 */
export const ContactStrip: React.FC<{
  local: number;
  delay: number;
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  dark?: boolean;
}> = ({ local, delay, x, y, scale = 1, rotate = -1.2, dark = true }) => {
  const { fps } = useVideoConfig();
  const s = spring({
    frame: local - delay,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 170 },
    durationInFrames: 20,
  });
  const fs = 27 * scale;
  const bg = dark ? C.ink : C.bone;
  const fg = dark ? C.bone : C.ink;

  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: fs * 0.55,
    fontFamily: FONT.tag,
    fontWeight: 700,
    fontSize: fs,
    letterSpacing: fs * 0.035,
    color: fg,
  };

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 12,
        display: "flex",
        flexDirection: "column",
        gap: fs * 0.42,
        alignItems: "flex-start",
        opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${(1 - s) * 22}px) rotate(${rotate * s}deg)`,
      }}
    >
      <div
        style={{
          ...row,
          backgroundColor: bg,
          padding: `${fs * 0.34}px ${fs * 0.7}px ${fs * 0.38}px`,
          boxShadow: `${fs * 0.1}px ${fs * 0.14}px 0 rgba(22,18,16,0.30)`,
        }}
      >
        <WhatsAppMark size={fs * 1.12} color={fg} />
        {CONTACT.whatsapp}
      </div>
      <div
        style={{
          ...row,
          backgroundColor: bg,
          padding: `${fs * 0.34}px ${fs * 0.7}px ${fs * 0.38}px`,
          boxShadow: `${fs * 0.1}px ${fs * 0.14}px 0 rgba(22,18,16,0.30)`,
        }}
      >
        <GlobeMark size={fs * 1.12} color={fg} />
        {CONTACT.site}
      </div>
    </div>
  );
};
