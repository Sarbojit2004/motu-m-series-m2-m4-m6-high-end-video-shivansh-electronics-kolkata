import React from "react";
import { LcdPush } from "../components/Kinds";

/** Scene 6 · 150f · m6-lcd-macro (first appearance) */
export const SharedMetering: React.FC = () => (
  <LcdPush
    dur={150}
    image="m6-lcd-macro"
    eyebrow="Full-colour LCD, on every model"
    heading={"Every input.\nEvery output."}
    hits={[{ file: "avb/encoder-click.wav", at: 14, volume: 0.4 }]}
  />
);
