import React from "react";
import { Price } from "../components/Kinds";
import { PRICE } from "../lib/theme";

/** Scene 22 · 150f · m6-couch-songwriting + m6-bright-studio (first appearances) */
export const M6Price: React.FC = () => (
  <Price
    dur={150}
    images={["m6-couch-songwriting", "m6-bright-studio"]}
    labels={["MOTU M6", "MOTU M6"]}
    product="MOTU M6"
    price={PRICE.m6}
    hits={[{ file: "avb/avb-ping.wav", at: 14, volume: 0.42 }]}
  />
);
