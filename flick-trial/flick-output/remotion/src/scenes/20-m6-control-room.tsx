import React from "react";
import { Control } from "../components/Kinds";

/** Scene 20 · 210f · m6-dark-desk (first appearance) */
export const M6ControlRoom: React.FC = () => (
  <Control
    dur={210}
    image="m6-dark-desk"
    eyebrow="MOTU M6 · control room"
    heading={"Check it on\nboth pairs."}
    chips={["A/B across two monitor pairs", "Second headphone out, its own cue mix"]}
    hits={[
      { file: "avb/talkback-click.wav", at: 22, volume: 0.36 },
      { file: "avb/talkback-click.wav", at: 66, volume: 0.36 },
      { file: "avb/talkback-click.wav", at: 110, volume: 0.36 },
    ]}
  />
);
