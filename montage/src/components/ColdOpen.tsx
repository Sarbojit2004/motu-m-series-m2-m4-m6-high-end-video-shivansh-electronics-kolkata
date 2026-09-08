import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { C } from "../theme";
import { bf } from "../beat";
import { FRAGMENTS } from "../schedule";
import { Paper } from "./Paper";
import { Fragment } from "./Fragment";
import { GiantLine, TagLabel } from "./Type";
import { ColorBlock } from "./Block";
import { Flash } from "./Flash";
import { LogoTag } from "./Brand";
import { CircleNote } from "./Doodle";
import { fit, estWidth } from "../measure";

/**
 * Beats 0-10. Establishes the M-Series before any one product is named:
 * fragment crops pulled from all three, then the giant type lands.
 */
export const ColdOpen: React.FC<{ local: number; hold: number }> = ({ local, hold }) => {
  const ids = FRAGMENTS.open;
  const burst = bf(3);                    // fragments run for the first 3 beats
  const per = Math.floor(burst / ids.length);

  const nameAt = bf(3);
  const seriesAt = bf(6.5);

  const mSize = fit("MOTU", 980, 500);
  const sSize = fit("M-SERIES", 970, 300);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <Paper sheet={2} streak={1} local={local} hold={hold} lean={1} />

      {/* fragment flash-intro across all three products */}
      {local < burst
        ? ids.map((id, i) => (
            <Sequence key={id} from={i * per} durationInFrames={per} layout="none">
              <FragmentCell id={id} local={local - i * per} hold={per} i={i} />
            </Sequence>
          ))
        : null}

      {/* MOTU */}
      {local >= nameAt ? (
        <>
          <ColorBlock
            local={local}
            delay={nameAt + 2}
            x={-40}
            y={560 + mSize * 0.44}
            w={950}
            h={mSize * 0.30}
            color={C.crimson}
            rotate={-1.6}
            seed="open-block"
            z={3}
          />
          <div style={{ position: "absolute", left: 50, top: 560, zIndex: 6 }}>
            <GiantLine
              text="MOTU"
              size={mSize}
              local={local}
              delay={nameAt + 1}
              step={3.2}
              color={C.ink}
              seed="open-motu"
            />
          </div>
        </>
      ) : null}

      {/* M-SERIES */}
      {local >= seriesAt ? (
        <>
          <div style={{ position: "absolute", left: 50, top: 560 + mSize * 0.94, zIndex: 6 }}>
            <GiantLine
              text="M-SERIES"
              size={sSize}
              local={local}
              delay={seriesAt + 1}
              step={1.8}
              alt
              color={C.ink}
              altColor={C.crimson}
              seed="open-series"
            />
          </div>
          <CircleNote
            local={local}
            delay={seriesAt + 12}
            x={4}
            y={560 + mSize * 0.94 - sSize * 0.18}
            w={Math.min(1044, estWidth("M-SERIES", sSize) + 130)}
            h={sSize * 1.22}
            rotate={-3.2}
          />
          <div style={{ position: "absolute", left: 54, top: 1352, zIndex: 8 }}>
            <TagLabel
              text="M2  ·  M4  ·  M6"
              size={46}
              local={local}
              delay={seriesAt + 8}
              from="left"
              rotate={-1.6}
              seed="open-tag"
            />
          </div>
          <LogoTag
            which="motu"
            local={local}
            delay={seriesAt + 14}
            width={470}
            x={56}
            y={1520}
            rotate={-2.2}
          />
          <LogoTag
            which="shivansh"
            local={local}
            delay={seriesAt + 20}
            width={560}
            x={472}
            y={1616}
            rotate={1.7}
          />
        </>
      ) : null}

      {/* strobe hits on the fragment cuts, then out into the M2 reveal */}
      {ids.map((_, i) => (
        <Flash key={i} local={local} at={i * per} len={i === 0 ? 9 : 5} peak={i === 0 ? 1 : 0.75} />
      ))}
      <Flash local={local} at={nameAt} len={8} />
      <Flash local={local} at={hold - 3} len={9} />
    </AbsoluteFill>
  );
};

const FragmentCell: React.FC<{ id: string; local: number; hold: number; i: number }> = ({
  id,
  local,
  hold,
  i,
}) => (
  <AbsoluteFill style={{ zIndex: 5 }}>
    <Fragment id={id} local={local} hold={hold} seed={i} />
  </AbsoluteFill>
);
