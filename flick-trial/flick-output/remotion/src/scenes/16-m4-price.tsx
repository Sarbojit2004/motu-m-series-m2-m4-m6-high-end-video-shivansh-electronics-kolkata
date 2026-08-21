import React from "react";
import { Price } from "../components/Kinds";
import { PRICE } from "../lib/theme";

/** Scene 16 · 150f · m4-hero-white (reuse) */
export const M4Price: React.FC = () => (
  <Price
    dur={150}
    images={["m4-hero-white"]}
    labels={["MOTU M4"]}
    product="MOTU M4"
    price={PRICE.m4}
    hits={[{ file: "avb/avb-ping.wav", at: 14, volume: 0.42 }]}
  />
);
