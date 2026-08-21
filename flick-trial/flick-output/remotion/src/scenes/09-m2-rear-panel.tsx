import React from "react";
import { Sweep } from "../components/Kinds";

/** Scene 9 · 210f · m2-rear-panel (first appearance) */
export const M2RearPanel: React.FC = () => (
  <Sweep
    dur={210}
    image="m2-rear-panel"
    eyebrow="MOTU M2 · rear panel"
    heading={"Everything else\nlives back here."}
    chips={["DC-coupled TRS out", "Mirrored RCA", "5-pin MIDI in / out", "USB-C bus power"]}
    hits={[{ file: "avb/encoder-click.wav", at: 12, volume: 0.4 }]}
  />
);
