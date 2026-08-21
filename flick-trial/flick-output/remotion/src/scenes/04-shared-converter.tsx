import React from "react";
import { HeroCounter } from "../components/Kinds";

/** Scene 4 · 240f · m2-hero-white + m4-hero-white (first appearances) */
export const SharedConverter: React.FC = () => (
  <HeroCounter
    dur={240}
    images={["m2-hero-white", "m4-hero-white"]}
    eyebrow="ESS Sabre32 Ultra · identical in all three"
    heading={"The same converter,\nwhichever you buy."}
    to={120}
    suffix=" dB"
    label="Dynamic range, main outputs"
    hits={[{ file: "avb/avb-ping.wav", at: 42, volume: 0.4 }]}
  />
);
