import React from "react";
import { Software } from "../components/Kinds";

/** Scene 23 · 210f · shared-software-bundle (first appearance) */
export const SharedExtras: React.FC = () => (
  <Software
    dur={210}
    image="shared-software-bundle"
    eyebrow="On all three, in the box"
    heading={"What comes\nwith it."}
    chips={["Loopback for streaming", "DC-coupled outputs for CV", "Software bundle included"]}
    hits={[{ file: "Popups.mp3", at: 10, volume: 0.4 }]}
  />
);
