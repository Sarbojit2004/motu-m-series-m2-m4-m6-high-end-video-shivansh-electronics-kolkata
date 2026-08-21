import React from "react";
import { Hook } from "../components/Kinds";

/** Scene 1 · 240f · shared-live-duo (first appearance) */
export const HookTheDifference: React.FC = () => (
  <Hook
    dur={240}
    image="shared-live-duo"
    eyebrow="www.shivanshelectronics.in"
    heading={"Everyone can hear\nthe difference."}
    hits={[{ file: "riser.mp3", at: 6, volume: 0.42 }]}
  />
);
