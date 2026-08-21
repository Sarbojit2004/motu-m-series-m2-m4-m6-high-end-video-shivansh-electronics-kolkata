import React from "react";
import { Montage } from "../components/Kinds";

/** Scene 15 · 270f · m4-synth-top + m4-desk-daw + m4-drum-overhead (first appearances) */
export const M4InTheRoom: React.FC = () => (
  <Montage
    dur={270}
    images={["m4-synth-top", "m4-desk-daw", "m4-drum-overhead"]}
    labels={["On the synth", "At the desk", "Tracking a kit"]}
    eyebrow="MOTU M4 · in the room"
    heading={"Four channels\nchanges the plan."}
    hits={[
      { file: "transitions.mp3", at: 84, volume: 0.34 },
      { file: "transitions.mp3", at: 174, volume: 0.34 },
    ]}
  />
);
