import React from "react";
import { SpecPair } from "../components/Kinds";

/** Scene 5 · 240f · m4-outdoor-cable + m6-low-angle (first appearances) */
export const SharedNoiseAndLatency: React.FC = () => (
  <SpecPair
    dur={240}
    images={["m4-outdoor-cable", "m6-low-angle"]}
    eyebrow="Quiet preamps, short trip"
    heading={"Nothing added\non the way in."}
    figures={[
      { to: -129, suffix: " dBu", label: "EIN, mic preamp" },
      { to: 2.5, suffix: " ms", label: "Round-trip · 96 kHz · 32-sample", decimals: 1 },
    ]}
    hits={[{ file: "avb/data-stream.wav", at: 26, volume: 0.38 }]}
  />
);
