import React from "react";
import { Triptych } from "../components/Kinds";

/** Scene 3 · 270f · m2/m4/m6-front-panel (first appearances) */
export const OneEngineThreeSizes: React.FC = () => (
  <Triptych
    dur={270}
    images={["m2-front-panel", "m4-front-panel", "m6-front-panel"]}
    labels={["MOTU M2 · 2 in / 2 out", "MOTU M4 · 4 in / 4 out", "MOTU M6 · 6 in / 4 out"]}
    eyebrow="The MOTU M-Series"
    heading={"One engine.\nThree sizes."}
    hits={[
      { file: "avb/rj45-snap.wav", at: 10, volume: 0.42 },
      { file: "avb/rj45-snap.wav", at: 58, volume: 0.42 },
      { file: "avb/rj45-snap.wav", at: 106, volume: 0.42 },
    ]}
  />
);
