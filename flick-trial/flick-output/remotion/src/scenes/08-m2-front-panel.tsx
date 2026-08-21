import React from "react";
import { Macro } from "../components/Kinds";

/** Scene 8 · 270f · m2-front-panel (reuse — macro-to-full-reveal) */
export const M2FrontPanel: React.FC = () => (
  <Macro
    dur={270}
    image="m2-front-panel"
    eyebrow="MOTU M2 · front panel"
    heading={"Two inputs,\neach its own."}
    chips={["Own preamp gain", "48V phantom", "One-touch monitor", "www.shivanshelectronics.in"]}
    fx={0.24}
    fy={0.5}
    macroScale={2.5}
    hits={[{ file: "Zoomin-OR-out.mp3", at: 8, volume: 0.4 }]}
  />
);
