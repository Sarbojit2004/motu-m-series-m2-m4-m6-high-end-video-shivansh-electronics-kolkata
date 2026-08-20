import React from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender } from "remotion";
import { BEATS, BEAT_STARTS } from "./schedule";
import { frames } from "./beat";
import { BeatScene } from "./Scenes";
import { FullAudio, MusicBed, SfxTimeline } from "./Audio";
import { Fonts } from "./components/Shell";
import { COLORS } from "./theme";
import { loadFonts } from "./fonts";

/** Blocks the first frame until both faces are actually rasterised. */
const useFonts = () => {
  const [handle] = React.useState(() => delayRender("Loading Archivo + Fraunces"));
  React.useEffect(() => {
    loadFonts()
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
};

export const Picture: React.FC = () => (
  <>
    {BEATS.map((b, i) => (
      <Sequence key={b.id} from={BEAT_STARTS[i]} durationInFrames={frames(b.sec)} name={`${b.ch}·${b.id}`}>
        <BeatScene b={b} />
      </Sequence>
    ))}
  </>
);

export const LongForm: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <Fonts />
      <Picture />
      <FullAudio />
    </AbsoluteFill>
  );
};

/**
 * STANDALONE AUDIO DELIVERABLES (Section 12).
 *
 * These render the exact same layers, from the exact same schedule, with the
 * picture omitted — which is what makes the delivered WAVs drop onto the
 * timeline already in sync with the MP4 rather than needing to be re-aligned.
 */
export const MusicBedOnly: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.paper }}>
    <MusicBed />
  </AbsoluteFill>
);

export const SfxTimelineOnly: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.paper }}>
    <SfxTimeline />
  </AbsoluteFill>
);
