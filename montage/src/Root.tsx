import React from "react";
import { Composition } from "remotion";
import { DURATION } from "./beat";
import { FPS, H, W } from "./theme";
import { Montage } from "./Montage";
import { Thumbnail } from "./Thumbnail";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Montage"
      component={Montage}
      durationInFrames={DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
