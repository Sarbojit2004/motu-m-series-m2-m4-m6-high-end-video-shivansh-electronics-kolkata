import React from "react";
import { Sweep } from "../components/Kinds";

/** Scene 14 · 210f · m4-rear-panel (first appearance) */
export const M4RearPanel: React.FC = () => (
  <Sweep
    dur={210}
    image="m4-rear-panel"
    eyebrow="MOTU M4 · rear panel"
    heading={"Two more in.\nTwo more out."}
    chips={["2 × dedicated line in", "4 × DC-coupled out", "4 × RCA", "5-pin MIDI"]}
    hits={[{ file: "avb/encoder-click.wav", at: 12, volume: 0.4 }]}
  />
);
