import React from "react";
import { TitleCard } from "../components/Kinds";

/** Scene 7 · 180f · m2-overhead-dark (first appearance) */
export const M2Introduction: React.FC = () => (
  <TitleCard
    dur={180}
    image="m2-overhead-dark"
    title="MOTU M2"
    capacity="TWO IN · TWO OUT"
    chips={["USB-C bus powered", "Two combo inputs", "Full-colour LCD"]}
    hits={[{ file: "Zoomin-OR-out.mp3", at: 4, volume: 0.4 }]}
  />
);
