import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { C } from "./theme";
import { bf, DURATION } from "./beat";
import { CLOSE, COLD_OPEN, SHOTS } from "./schedule";
import { FontGate } from "./fonts";
import { Scene } from "./components/Scene";
import { ColdOpen } from "./components/ColdOpen";
import { Close } from "./components/Close";
import { Flash } from "./components/Flash";


/**
 * MOTU M-Series raw-asset portrait montage - 90s, 2160x3840, no voiceover.
 *
 * Authored at 1080x1920 and rendered with --scale=2 so type and vector work
 * rasterise at true 4K while the layout maths stays in one clean grid.
 */
export const Montage: React.FC = () => {
  const frame = useCurrentFrame();

  const openFrom = bf(COLD_OPEN[0]);
  const openTo = bf(COLD_OPEN[1]);
  const closeFrom = bf(CLOSE[0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <FontGate />

      <Sequence from={openFrom} durationInFrames={openTo - openFrom} layout="none">
        <ColdOpen local={frame - openFrom} hold={openTo - openFrom} />
      </Sequence>

      {SHOTS.map((shot) => {
        const from = bf(shot.from);
        const to = bf(shot.to);
        return (
          <Sequence key={shot.key} from={from} durationInFrames={to - from} layout="none">
            <Scene shot={shot} local={frame - from} hold={to - from} />
            {shot.flash ? <Flash local={frame - from} at={0} len={9} /> : null}
          </Sequence>
        );
      })}

      <Sequence from={closeFrom} durationInFrames={DURATION - closeFrom} layout="none">
        <Close local={frame - closeFrom} hold={DURATION - closeFrom} />
      </Sequence>

      <Audio src={staticFile("audio/montage-bed.mp3")} volume={1} />
    </AbsoluteFill>
  );
};
