import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { VIDEO } from "../lib/theme";
import { MOVEMENTS, SCENES, STEM_SECONDS, TOTAL_FRAMES } from "./master";
import { HITS } from "./hits";
import { hitFrames } from "../components/Sfx";
import { sound } from "../lib/assets";

const XFADE = 60; // 2 s crossfade at movement seams

const music = (slug: string) => staticFile(`audio/music/${slug}.mp3`);

/**
 * Tiles one stem across `span` frames, relaying from a musical point 20 s in
 * rather than from the top when a movement outlasts the stem.
 */
function tiles(span: number, from: number) {
  const stemFrames = Math.floor(STEM_SECONDS * VIDEO.fps) - 2;
  const startOffset = Math.round(from * VIDEO.fps);
  const first = Math.min(span, stemFrames - startOffset);
  const out = [{ at: 0, len: first, trim: startOffset }];
  let filled = first;
  let guard = 0;
  while (filled < span && guard++ < 8) {
    const relayTrim = Math.round(20 * VIDEO.fps);
    const len = Math.min(span - filled + XFADE, stemFrames - relayTrim);
    out.push({ at: filled - XFADE, len: len + XFADE, trim: relayTrim });
    filled += len;
  }
  return out;
}

/**
 * BED LEVEL — carried over from the approved portrait build, where it was
 * MEASURED rather than inherited. 0.34 puts the fullest movements near
 * -19 dBFS RMS / -5 dBFS peak, which a voice tracked around -16 dBFS sits
 * cleanly above without further ducking.
 *
 * Applied as the DEFAULT, so the standalone MusicBedOnly deliverable and the
 * bed mixed into the master MP4 are the same mix at the same level.
 */
const BED_TRIM = 0.34;

export const MusicBed: React.FC<{ gain?: number }> = ({ gain = BED_TRIM }) => (
  <>
    {MOVEMENTS.map((m) => {
      const span = m.end - m.start;
      return (
        <Sequence key={m.id} from={m.start} durationInFrames={span} name={`music-${m.id}`}>
          {m.stems.map((s) =>
            tiles(span, s.from ?? 0).map((t, i) => (
              <Sequence
                key={`${s.slug}-${i}`}
                from={Math.max(0, t.at)}
                durationInFrames={Math.min(t.len, span - Math.max(0, t.at))}
                name={`${s.slug}${i ? `-relay${i}` : ""}`}
              >
                <Audio
                  src={music(s.slug)}
                  volume={s.gain * gain}
                  trimBefore={t.trim}
                  trimAfter={t.trim + t.len}
                />
              </Sequence>
            ))
          )}
        </Sequence>
      );
    })}
  </>
);

/**
 * The transition/foley layer at MASTER timecode. Every hit is the same file,
 * offset and level the scene component fires — lifted straight out of the scene
 * sources by `scripts/extract-hits.mjs`, then shifted by that scene's absolute
 * start. The standalone SFX WAV is therefore identical to what is embedded in
 * the concatenated picture, not a hand-rebuilt approximation of it.
 */
export const SfxTimeline: React.FC = () => (
  <>
    {HITS.map((h, i) => (
      <Sequence
        key={`${h.scene}-${h.file}-${h.at}-${i}`}
        from={h.at}
        durationInFrames={hitFrames(h.file)}
        name={`${h.scene}/${h.file}`}
      >
        <Audio src={sound(h.file)} volume={h.volume} />
      </Sequence>
    ))}
  </>
);

/** Silent picture — the audio-only compositions still need a surface. */
const Slate: React.FC<{ label: string }> = ({ label }) => (
  <AbsoluteFill style={{
    background: "#F6F8FA", color: "#48525F", alignItems: "center", justifyContent: "center",
    fontFamily: "system-ui, sans-serif", fontSize: 44, letterSpacing: "0.1em",
  }}>
    {label} · {(TOTAL_FRAMES / VIDEO.fps).toFixed(3)}s · {SCENES.length} scenes
  </AbsoluteFill>
);

export const MusicBedOnly: React.FC = () => (
  <AbsoluteFill><Slate label="MUSIC BED" /><MusicBed /></AbsoluteFill>
);

export const SfxTimelineOnly: React.FC = () => (
  <AbsoluteFill><Slate label="TRANSITION SFX" /><SfxTimeline /></AbsoluteFill>
);
