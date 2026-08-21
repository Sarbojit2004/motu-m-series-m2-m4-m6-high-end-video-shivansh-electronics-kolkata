import React from "react";
import { Sweep } from "../components/Kinds";

/** Scene 19 · 210f · m6-rear-panel (first appearance) */
export const M6RearPanel: React.FC = () => (
  <Sweep
    dur={210}
    image="m6-rear-panel"
    eyebrow="MOTU M6 · rear panel"
    heading={"Six inputs,\nplugged in behind."}
    chips={["4 × mic / line / guitar", "Line in 5–6", "5-pin MIDI", "15V DC supply"]}
    hits={[{ file: "avb/encoder-click.wav", at: 12, volume: 0.4 }]}
  />
);
