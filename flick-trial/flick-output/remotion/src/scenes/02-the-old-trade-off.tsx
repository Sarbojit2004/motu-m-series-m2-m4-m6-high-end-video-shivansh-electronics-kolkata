import React from "react";
import { Problem } from "../components/Kinds";

/** Scene 2 · 210f · shared-podcast-room (first appearance) */
export const TheOldTradeOff: React.FC = () => (
  <Problem
    dur={210}
    image="shared-podcast-room"
    eyebrow="For years, two bad options"
    heading={"The old\ntrade-off."}
    chips={["Adds hiss to everything", "Or priced out of reach"]}
    hits={[{ file: "Impact.mp3", at: 18, volume: 0.5 }]}
  />
);
