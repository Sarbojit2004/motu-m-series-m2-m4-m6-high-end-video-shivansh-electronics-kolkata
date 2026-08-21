import React from "react";
import { Price } from "../components/Kinds";
import { PRICE } from "../lib/theme";

/** Scene 11 · 150f · m2-producer-desk (first appearance) */
export const M2Price: React.FC = () => (
  <Price
    dur={150}
    images={["m2-producer-desk"]}
    labels={["MOTU M2"]}
    product="MOTU M2"
    price={PRICE.m2}
    hits={[{ file: "avb/avb-ping.wav", at: 14, volume: 0.42 }]}
  />
);
