import React from "react";
import { PriceWall } from "../components/Kinds";

/** Scene 24 · 240f · m2/m4/m6-front-panel (reuse — three distinct MOPs, never blended) */
export const AllThreePricesAndCta: React.FC = () => (
  <PriceWall
    dur={240}
    images={["m2-front-panel", "m4-front-panel", "m6-front-panel"]}
    hits={[
      { file: "avb/avb-ping.wav", at: 12, volume: 0.4 },
      { file: "aha-moment.MP3", at: 118, volume: 0.38 },
    ]}
  />
);
