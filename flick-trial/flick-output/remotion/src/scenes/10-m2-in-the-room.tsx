import React from "react";
import { Montage } from "../components/Kinds";

/** Scene 10 · 270f · m2-desk-macbook + m2-couch-guitar + m2-glass-table (first appearances) */
export const M2InTheRoom: React.FC = () => (
  <Montage
    dur={270}
    images={["m2-desk-macbook", "m2-couch-guitar", "m2-glass-table"]}
    labels={["At the desk", "On the couch", "Wherever the song starts"]}
    eyebrow="MOTU M2 · in the room"
    heading={"Small enough\nto follow you."}
    hits={[
      { file: "transitions.mp3", at: 84, volume: 0.34 },
      { file: "transitions.mp3", at: 174, volume: 0.34 },
    ]}
  />
);
