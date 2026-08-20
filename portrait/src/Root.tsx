import React from "react";
import { Composition, Still } from "remotion";
import { PortraitShort, MusicBedOnly, SfxTimelineOnly } from "./PortraitShort";
import { Thumbnail } from "./Thumbnail";
import { VIDEO } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="PortraitShort"
      component={PortraitShort}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="MusicBedOnly"
      component={MusicBedOnly}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="SfxTimelineOnly"
      component={SfxTimelineOnly}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Still id="Thumbnail" component={Thumbnail} width={VIDEO.width} height={VIDEO.height} />
  </>
);
