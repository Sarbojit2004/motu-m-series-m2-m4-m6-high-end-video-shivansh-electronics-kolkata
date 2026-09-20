import React from "react";
import {
  AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig,
} from "remotion";
import { ACCENT, GROUND, INK, FONT, TYPE_OPACITY, formatFor } from "./theme.ts";
import { dimFor } from "./assets.ts";
import { filmFor } from "./films.ts";
import { Caption } from "./components/Caption.tsx";
import { TransitionIn, transitionFor } from "./components/Transitions.tsx";
import {
  BleedShot, ClipBleed, DetailZoom, MosaicBleed, PanelPlate, ProductPlate, StackBleed,
} from "./components/Staged.tsx";
import { Outro } from "./components/Outro.tsx";
import { FONT_FACE_CSS } from "./fonts.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE FILM
//
// Three layers, in this order and no other:
//
//   1. PICTURE     one staged shot at a time, each arriving on its own
//                  transition. Full bleed, always — nothing letterboxed, no
//                  ground showing through, and no picture ever sliced.
//   2. TYPE        the caption lockup, and in the landscape film a chapter tag
//                  and a progress rule. The WHOLE layer is set to TYPE_OPACITY
//                  in one place, here, so no part of it can drift out of step
//                  with another.
//   3. SOUND       the mastered bed and the mastered transition layer, both at
//                  volume 1. They were levelled against each other in
//                  scripts/gen_audio.py; a multiplier here would undo that
//                  silently, which is exactly the bug that is hard to hear.
//
// The end screen is a Sequence of its own at the very end, outside the type
// layer, because it is the one place branding is allowed and it carries its own
// opacity.
// ─────────────────────────────────────────────────────────────────────────────

const Shot: React.FC<{ shot: ReturnType<typeof filmFor>["shots"][number]; fps: number }> = ({ shot, fps }) => {
  const frame = useCurrentFrame();
  const startF = Math.round(shot.start * fps);
  const f = frame - startF;
  const len = Math.max(1, Math.round((shot.end - shot.start) * fps));
  const p = Math.min(1, Math.max(0, f / len));
  const base = { accent: shot.accentKey, p, f, seed: shot.seed };

  switch (shot.kind) {
    case "clip":
      return <ClipBleed {...base} clip={shot.clip!} startFrom={shot.from} />;
    case "plate":
      return <ProductPlate {...base} asset={shot.asset!} />;
    case "panel":
      return <PanelPlate {...base} asset={shot.asset!} />;
    case "detail":
      return (
        <DetailZoom
          {...base}
          asset={shot.regionAsset!}
          region={shot.region!.rect}
          dim={dimFor(shot.region!.name)}
        />
      );
    case "stack":
      return <StackBleed {...base} assets={shot.assets!} />;
    case "mosaic":
      return <MosaicBleed {...base} assets={shot.assets!} />;
    default:
      return <BleedShot {...base} asset={shot.asset!} />;
  }
};

export const Film: React.FC = () => {
  const { width: W, height: H, fps } = useVideoConfig();
  const fmt = formatFor(W, H);
  const film = filmFor(W, H);
  const frame = useCurrentFrame();
  const P = fmt.portrait;
  const S = W / (P ? 2160 : 3840);

  const speechEndF = Math.round(film.speechEnd * fps);

  // Which chapter are we in — only the landscape film shows it.
  const now = frame / fps;
  const seg = film.segments.find((s) => now >= s.start && now < s.end + 0.4) ?? film.segments[0];
  const acc = ACCENT[seg.accent];

  return (
    <AbsoluteFill style={{ background: GROUND.dark }}>
      <style>{FONT_FACE_CSS}</style>

      {/* ── 1. PICTURE ───────────────────────────────────────────────── */}
      <Sequence durationInFrames={speechEndF}>
        <AbsoluteFill>
          {film.shots.map((shot, i) => {
            const from = Math.round(shot.start * fps);
            const dur = Math.max(1, Math.round(shot.end * fps) - from);
            const kind = transitionFor(shot.seed, shot.boundary, i === 0);
            return (
              <Sequence key={i} from={from} durationInFrames={dur} layout="none">
                <TransitionInWrap kind={kind} accent={ACCENT[shot.accentKey].glow}>
                  <Shot shot={shot} fps={fps} />
                </TransitionInWrap>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Sequence>

      {/* ── 2. TYPE — the entire layer at 64%, set once ──────────────── */}
      <Sequence durationInFrames={speechEndF}>
        <AbsoluteFill style={{ opacity: TYPE_OPACITY }}>
          {film.segments.map((s) =>
            s.captions.map((c) => {
              const from = Math.round(c.start * fps);
              const dur = Math.max(1, Math.round(c.end * fps) - from);
              return (
                <Sequence key={`${s.id}-${c.i}`} from={from} durationInFrames={dur}>
                  {/* A Sequence rebases useCurrentFrame() to 0, so the caption's
                      own clock starts at 0 too — passing the absolute frame here
                      drives every spring far negative and the whole lockup
                      renders at zero opacity. */}
                  <AbsoluteFill
                    style={{
                      paddingLeft: fmt.safe.left,
                      paddingRight: fmt.safe.right,
                      paddingBottom: fmt.safe.bottom,
                      paddingTop: fmt.safe.top,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "flex-start",
                    }}
                  >
                    <Caption caption={c} startFrame={0} accent={s.accent} width={fmt.safe.w} />
                  </AbsoluteFill>
                </Sequence>
              );
            }),
          )}

          {/* the chapter tag and the progress rule — landscape only, where
              there is width to spare and a five-minute film needs signposting */}
          {!P && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: fmt.safe.left,
                  top: fmt.safe.top * 0.62,
                  display: "flex",
                  alignItems: "center",
                  gap: 18 * S,
                }}
              >
                <div style={{ width: 10 * S, height: 10 * S, background: acc.glow, borderRadius: 2 }} />
                <span
                  style={{
                    fontFamily: FONT.display,
                    fontSize: fmt.type.chapter.size,
                    letterSpacing: fmt.type.chapter.track,
                    color: INK.onDark,
                    textShadow: "0 3px 0 rgba(0,0,0,0.6)",
                  }}
                >
                  {seg.chapter}
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: fmt.safe.left,
                  right: fmt.safe.right,
                  bottom: fmt.safe.bottom * 0.5,
                  height: Math.max(2, 3 * S),
                  background: "rgba(255,255,255,0.14)",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (frame / speechEndF) * 100)}%`,
                    height: "100%",
                    background: acc.glow,
                  }}
                />
              </div>
            </>
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── the end screen ───────────────────────────────────────────── */}
      <Sequence from={speechEndF} durationInFrames={Math.round(film.outroSeconds * fps)}>
        <Outro />
      </Sequence>

      {/* ── 3. SOUND — both stems at unity ───────────────────────────── */}
      <Audio src={staticFile(film.bed)} volume={1} />
      <Audio src={staticFile(film.transitions)} volume={1} />
      <Audio src={staticFile(film.vo)} volume={1} />
    </AbsoluteFill>
  );
};

/** Wraps a shot in its arrival move, reading the frame from the Sequence. */
const TransitionInWrap: React.FC<{ kind: any; accent: string; children: React.ReactNode }> = ({
  kind, accent, children,
}) => {
  const f = useCurrentFrame();
  return (
    <TransitionIn kind={kind} f={f} accent={accent}>
      {children}
    </TransitionIn>
  );
};
