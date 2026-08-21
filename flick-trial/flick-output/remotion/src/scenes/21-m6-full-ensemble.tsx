import React from "react";
import { Montage } from "../components/Kinds";

/** Scene 21 · 270f · m6-podcast-panel + m6-drum-kit-room + m6-full-setup (first appearances) */
export const M6FullEnsemble: React.FC = () => (
  <Montage
    dur={270}
    images={["m6-podcast-panel", "m6-drum-kit-room", "m6-full-setup"]}
    labels={["A four-person panel", "A kit in one pass", "The whole setup"]}
    eyebrow="MOTU M6 · in the room"
    heading={"Everyone tracked\nat once."}
    hits={[
      { file: "transitions.mp3", at: 84, volume: 0.34 },
      { file: "transitions.mp3", at: 174, volume: 0.34 },
    ]}
  />
);
