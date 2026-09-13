import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, FONT, INK, TYPE, type ProductKey } from "../theme.ts";
import type { TimedCaption } from "../script.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE CAPTION LOCKUP
//
// Rebuilt to the supplied type specimen. The earlier version revealed a caption
// word by word and recoloured the emphasised one as it was spoken; that is gone.
// A caption is now a single designed lockup that arrives whole, built from the
// two faces in the specimen:
//
//     IT HAS                 lead-in   — display caps, small, muted
//        no                  the word  — script face, accent colour, huge
//     MICROPHONE PREAMPS     tail      — display caps, medium, full ink
//
// The sentence is split AT its key word, so the script face always lands on the
// term the sentence turns on — never on a filler word, and never on nothing.
// When the key word opens the sentence the lead-in is simply absent and the
// lockup becomes the two-tier arrangement of the specimen itself:
//
//        Sixteen
//     BALANCED LINE INPUTS
//
// Because the whole thing animates as one object, the reel no longer depends on
// per-word timing to look right — which also means it will not drift out of
// sync when the client's recorded read runs faster or slower than the script.
//
// WHAT IS DIFFERENT IN THIS REEL. The picture now fills the frame, so the
// lockup sits ON the product rather than beside it, and the whole overlay
// layer is held at TYPE_OPACITY (0.64 — 36% transparent) so the image reads
// through the letterforms. The quieter parts of a frame stay visible
// underneath while the words stay dominant enough to read on a phone. That
// opacity is applied ONCE, by the layer in Reel.tsx that owns every overlay,
// rather than here — so the caption and the demonstratives beside it can never
// drift to different transparencies, and the still frame used for the
// thumbnail can opt out of it entirely.
//
// Transparency costs contrast, and the obvious fix — a dark scrim behind the
// text — would hide exactly the content the transparency exists to reveal. So
// contrast is bought back with a hard, tight drop shadow on every tier
// instead: it darkens only the few pixels around each glyph, which is enough
// to separate type from any background without covering the picture.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  caption: TimedCaption;
  startFrame: number;
  product: ProductKey;
  env: "light" | "dark";
  width?: number;
  align?: "left" | "center";
  /** Multiplier on the whole lockup, for tight frames. */
  scale?: number;
};

/** Splits a caption into lead-in / key word / tail around its emphasis. */
export const splitCaption = (t: string, e?: string) => {
  const words = t.trim().split(/\s+/).filter(Boolean);
  const norm = (x: string) => x.replace(/[^\w.,+-]/g, "").toLowerCase();

  if (e) {
    const target = e.split(/\s+/).filter(Boolean);
    for (let i = 0; i + target.length <= words.length; i++) {
      if (target.every((tw, k) => norm(words[i + k]) === norm(tw))) {
        return {
          before: words.slice(0, i).join(" "),
          key: words.slice(i, i + target.length).join(" "),
          after: words.slice(i + target.length).join(" "),
        };
      }
    }
  }

  // No emphasis declared, or it did not match: fall back to the longest word,
  // which is very nearly always the carrying term in a technical line.
  let bi = 0;
  for (let i = 1; i < words.length; i++) {
    if (norm(words[i]).length > norm(words[bi]).length) bi = i;
  }
  return {
    before: words.slice(0, bi).join(" "),
    key: words[bi] ?? t,
    after: words.slice(bi + 1).join(" "),
  };
};

/** Trailing punctuation is dropped from the script word — a brush script
 *  carrying a full stop reads as a typo, not as punctuation. */
const cleanKey = (k: string) => k.replace(/[.,;:]+$/, "");

export const Caption: React.FC<Props> = ({
  caption,
  startFrame,
  product,
  env,
  width,
  align = "left",
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  const durF = Math.max(1, Math.round((caption.end - caption.start) * fps));

  const accent = ACCENT[product];
  const keyColor = env === "light" ? accent.key : accent.glow;
  const ink = env === "light" ? INK.onLight : INK.onDark;
  const soft = env === "light" ? INK.onLightSoft : INK.onDarkSoft;

  const { before, key, after } = splitCaption(caption.t, caption.e);

  // One entrance for the whole lockup, and a small internal stagger so the
  // tiers settle in reading order rather than snapping together.
  const enter = spring({ frame: local, fps, config: { damping: 200, mass: 0.55 }, durationInFrames: 14 });
  const keyIn = spring({ frame: local - 3, fps, config: { damping: 170, mass: 0.5, stiffness: 120 }, durationInFrames: 18 });
  const tailIn = spring({ frame: local - 6, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: 14 });

  const outAt = durF - 7;
  const exit = local > outAt ? interpolate(local, [outAt, durF], [1, 0], { extrapolateRight: "clamp" }) : 1;

  // The script word settles from slightly large and slightly rotated — the
  // energy of a brush stroke landing, not a UI element sliding in.
  const keyScale = interpolate(keyIn, [0, 1], [1.14, 1]);
  const keyTilt = interpolate(keyIn, [0, 1], [-3.2, -1.4]);

  const S = (n: number) => n * scale;

  // The script face is set at one size for short keys and stepped down for
  // longer ones, so a two-word key never runs past the safe margin. Measured
  // against the widest key in the script ("Shivansh Electronics", 20 chars).
  const keyLen = cleanKey(key).length;
  const fit = keyLen <= 8 ? 1 : keyLen <= 12 ? 0.80 : keyLen <= 16 ? 0.64 : 0.54;
  const items: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: align === "center" ? "center" : "flex-start",
  };

  return (
    <div style={{ width: width ?? "100%", opacity: exit, ...items }}>
      {before ? (
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: S(TYPE.before.size),
            letterSpacing: TYPE.before.track,
            color: env === "light" ? "#221F19" : INK.onDark,
            textTransform: "uppercase",
            lineHeight: 1.1,
            // A tight, opaque shadow — the only thing separating 64%-opaque
            // type from a photograph behind it.
            textShadow: `0 ${S(3)}px ${S(7)}px rgba(0,0,0,0.92), 0 0 ${S(3)}px rgba(0,0,0,0.75)`,
            opacity: enter,
            transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
            marginBottom: S(6),
          }}
        >
          {before}
        </div>
      ) : null}

      <div
        style={{
          fontFamily: FONT.script,
          fontSize: S(TYPE.script.size) * fit,
          letterSpacing: TYPE.script.track,
          color: keyColor,
          lineHeight: 0.98,
          // A script face needs room the sans does not — its descenders and
          // the swash on the capital both overshoot the em box.
          padding: `${S(18)}px ${S(26)}px ${S(30)}px 0`,
          marginLeft: S(-6),
          opacity: keyIn,
          transform: `translateY(${interpolate(keyIn, [0, 1], [40, 0])}px) scale(${keyScale}) rotate(${keyTilt}deg)`,
          transformOrigin: align === "center" ? "50% 70%" : "8% 70%",
          // A 90 px-radius glow behind a 330 px script word spanning most of the
          // frame is a very large convolution, and it runs on every one of
          // 5,400 frames — measured at 2.4 s/frame against 1.3 s/frame for the
          // previous cut. A tighter glow plus a small drop shadow reads the
          // same on a black ground for a fraction of the cost.
          textShadow: `0 ${S(5)}px ${S(11)}px rgba(0,0,0,0.95), 0 0 ${S(5)}px rgba(0,0,0,0.8), 0 0 ${S(34)}px ${accent.glow}44`,
          whiteSpace: "nowrap",
        }}
      >
        {cleanKey(key)}
      </div>

      {after ? (
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: S(TYPE.after.size),
            letterSpacing: TYPE.after.track,
            color: INK.onDark,
            textTransform: "uppercase",
            lineHeight: 1.06,
            opacity: tailIn,
            transform: `translateY(${interpolate(tailIn, [0, 1], [30, 0])}px)`,
            textShadow: `0 ${S(4)}px ${S(9)}px rgba(0,0,0,0.94), 0 0 ${S(4)}px rgba(0,0,0,0.78)`,
            maxWidth: "100%",
          }}
        >
          {after}
        </div>
      ) : null}

    </div>
  );
};
