import React from "react";
import { Macro } from "../components/Kinds";

/** Scene 13 · 270f · m4-front-panel (reuse — macro-to-full-reveal on the Mix knob) */
export const M4FrontPanel: React.FC = () => (
  <Macro
    dur={270}
    image="m4-front-panel"
    eyebrow="MOTU M4 · front panel"
    heading={"The knob the M2\ndoesn't have."}
    chips={["Input monitor mix", "Blend live input against playback", "By hand, no software", "www.shivanshelectronics.in"]}
    fx={0.66}
    fy={0.5}
    macroScale={2.6}
    hits={[{ file: "avb/encoder-click.wav", at: 8, volume: 0.4 }]}
  />
);
