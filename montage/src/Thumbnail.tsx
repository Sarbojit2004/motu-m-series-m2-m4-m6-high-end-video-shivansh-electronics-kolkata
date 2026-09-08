import React from "react";
import { AbsoluteFill } from "remotion";
import { C } from "./theme";
import { Paper } from "./components/Paper";
import { Plate } from "./components/Plate";
import { GiantLine, TagLabel } from "./components/Type";
import { CircleNote } from "./components/Doodle";
import { LogoTag } from "./components/Brand";
import { ColorBlock } from "./components/Block";
import { fit, estWidth } from "./measure";
import { FontGate } from "./fonts";


/** Cover frame for the reel, built from the same parts as the reel itself. */
export const Thumbnail: React.FC = () => {
  const local = 60;
  const s = fit("M-SERIES", 1150, 250);
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <FontGate />
      <Paper sheet={0} streak={0} local={0} hold={1} lean={1} />
      <Plate id="m6-front" local={local} hold={90} width={1200} x={-60} y={300} rotate={-1.6} />
      <Plate id="m2-hero" local={local} hold={90} width={760} x={60} y={700} rotate={-3.2} z={4} />
      <Plate id="m4-hero" local={local} hold={90} width={700} x={420} y={980} rotate={4.1} z={5} />
      <ColorBlock local={local} delay={0} x={-40} y={1418} w={940} h={70} color={C.crimson} rotate={-1.5} seed="thumb" z={5} />
      <div style={{ position: "absolute", left: 58, top: 1250, zIndex: 6 }}>
        <GiantLine text="MOTU" size={fit("MOTU", 900, 330)} local={local} delay={0} seed="th1" />
      </div>
      <div style={{ position: "absolute", left: 62, top: 1250 + 330 * 0.9, zIndex: 6 }}>
        <GiantLine text="M-SERIES" size={s} local={local} delay={0} alt altColor={C.crimson} seed="th2" />
      </div>
      <CircleNote local={local} delay={0} x={18} y={1250 + 330 * 0.9 - s * 0.18}
        w={Math.min(1044, estWidth("M-SERIES", s) + 130)} h={s * 1.22} rotate={-3} />
      <div style={{ position: "absolute", left: 62, top: 1690, zIndex: 8 }}>
        <TagLabel text="M2  ·  M4  ·  M6" size={44} local={local} delay={0} seed="th3" />
      </div>
      <LogoTag which="shivansh" local={local} delay={0} width={470} x={560} y={1700} rotate={1.8} />
    </AbsoluteFill>
  );
};
