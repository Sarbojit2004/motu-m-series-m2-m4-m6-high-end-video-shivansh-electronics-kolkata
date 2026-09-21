import React from "react";
import { Composition } from "remotion";
import { FORMATS } from "./theme.ts";
import { REEL, VIDEO } from "./films.ts";
import { Film } from "./Film.tsx";
import { Thumbnail } from "./Thumbnail.tsx";

// Durations are taken from the assembled films, which take them from the
// script. There is no frame count typed in this file.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Reel"
      component={Film}
      durationInFrames={REEL.durationInFrames}
      fps={FORMATS.reel.fps}
      width={FORMATS.reel.width}
      height={FORMATS.reel.height}
    />
    <Composition
      id="Explainer"
      component={Film}
      durationInFrames={VIDEO.durationInFrames}
      fps={FORMATS.video.fps}
      width={FORMATS.video.width}
      height={FORMATS.video.height}
    />
    <Composition
      id="ThumbnailReel"
      component={Thumbnail}
      durationInFrames={1}
      fps={30}
      width={FORMATS.reel.width}
      height={FORMATS.reel.height}
    />
    <Composition
      id="ThumbnailVideo"
      component={Thumbnail}
      durationInFrames={1}
      fps={30}
      width={FORMATS.video.width}
      height={FORMATS.video.height}
    />
  </>
);
