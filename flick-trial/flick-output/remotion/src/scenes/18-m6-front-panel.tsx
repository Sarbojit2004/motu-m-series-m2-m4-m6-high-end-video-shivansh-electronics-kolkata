import React from "react";
import { Macro } from "../components/Kinds";

/** Scene 18 · 270f · m6-front-panel (reuse — macro-to-full-reveal across the gain row) */
export const M6FrontPanel: React.FC = () => (
  <Macro
    dur={270}
    image="m6-front-panel"
    eyebrow="MOTU M6 · front panel"
    heading={"Four channels,\nfour of everything."}
    chips={["4 × gain", "4 × 48V", "4 × monitor", "Two headphone outs", "www.shivanshelectronics.in"]}
    fx={0.38}
    fy={0.5}
    macroScale={2.3}
    hits={[{ file: "avb/rj45-snap.wav", at: 8, volume: 0.4 }]}
  />
);
