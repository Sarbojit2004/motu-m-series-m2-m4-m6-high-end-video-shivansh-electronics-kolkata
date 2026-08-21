import React from "react";
import { TitleCard } from "../components/Kinds";

/** Scene 17 · 150f · m6-desktop-studio (first appearance) */
export const M6Introduction: React.FC = () => (
  <TitleCard
    dur={150}
    image="m6-desktop-studio"
    title="MOTU M6"
    capacity="SIX IN · FOUR OUT"
    chips={["Four mic preamps", "Two headphone outs", "Two monitor pairs"]}
    hits={[{ file: "Zoomin-OR-out.mp3", at: 4, volume: 0.4 }]}
  />
);
