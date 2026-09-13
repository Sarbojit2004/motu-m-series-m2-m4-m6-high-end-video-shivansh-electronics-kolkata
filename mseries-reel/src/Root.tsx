import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme.ts";
import { Reel } from "./Reel.tsx";
import { Thumbnail } from "./Thumbnail.tsx";
import { FONT_FACE_CSS } from "./fonts.ts";

const style = document.createElement("style");
style.textContent = FONT_FACE_CSS;
document.head.appendChild(style);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MSeriesReel"
      component={Reel}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  </>
);
