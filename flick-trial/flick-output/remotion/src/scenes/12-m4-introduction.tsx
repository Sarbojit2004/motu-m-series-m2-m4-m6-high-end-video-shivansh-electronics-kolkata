import React from "react";
import { TitleCard } from "../components/Kinds";

/** Scene 12 · 150f · m4-studio-desk (first appearance) */
export const M4Introduction: React.FC = () => (
  <TitleCard
    dur={150}
    image="m4-studio-desk"
    title="MOTU M4"
    capacity="FOUR IN · FOUR OUT"
    chips={["Two combo + two line in", "Input monitor mix", "Four DC-coupled outs"]}
    hits={[{ file: "Zoomin-OR-out.mp3", at: 4, volume: 0.4 }]}
  />
);
