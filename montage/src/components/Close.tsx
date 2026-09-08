import React from "react";
import { AbsoluteFill, Sequence, interpolate } from "remotion";
import { C } from "../theme";
import { bf } from "../beat";
import { FRAGMENTS } from "../schedule";
import { Paper } from "./Paper";
import { Fragment } from "./Fragment";
import { GiantLine, TagLabel } from "./Type";
import { ColorBlock } from "./Block";
import { Flash } from "./Flash";
import { ContactStrip, LogoTag } from "./Brand";
import { CircleNote } from "./Doodle";
import { fit, estWidth } from "../measure";

/**
 * Beats 128-139.5. A callback pulling fragments from all three products, the
 * one line that states the range's own logic, and the branding lockup - which
 * lands on the track's loudest hit at beat 138 and holds through the break.
 */
export const Close: React.FC<{ local: number; hold: number }> = ({ local, hold }) => {
  const ids = FRAGMENTS.close;
  const burst = bf(3);
  const per = Math.floor(burst / ids.length);

  const lineAt = bf(3);        // "ONE ENGINE / THREE WAYS IN"
  const brandAt = bf(7);       // logos + contacts
  const hitAt = bf(10);        // the track's climax hit

  const l0 = fit("ONE ENGINE", 1000, 300);
  const l1 = fit("THREE WAYS IN", 1000, 260);
  const lineTop = 604;

  const brandLocal = local - brandAt;
  const settle = interpolate(local - hitAt, [0, 4, 10], [1, 1.028, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, overflow: "hidden" }}>
      <Paper sheet={1} streak={2} local={local} hold={hold} lean={-1} />

      {local < burst
        ? ids.map((id, i) => (
            <Sequence key={id} from={i * per} durationInFrames={per} layout="none">
              <AbsoluteFill style={{ zIndex: 5 }}>
                <Fragment id={id} local={local - i * per} hold={per} seed={40 + i} />
              </AbsoluteFill>
            </Sequence>
          ))
        : null}

      {local >= lineAt && local < brandAt + 6 ? (
        <>
          {/* a crimson field the second line sits inside, the way the
              reference sets a word into a solid panel */}
          <ColorBlock
            local={local}
            delay={lineAt + 7}
            x={-40}
            y={lineTop + l0 * 0.80}
            w={1050}
            h={l1 * 1.06}
            color={C.crimson}
            rotate={-1.4}
            seed="close-block"
            z={4}
          />
          <div style={{ position: "absolute", left: 44, top: lineTop, zIndex: 6 }}>
            <GiantLine
              text="ONE ENGINE"
              size={l0}
              local={local}
              delay={lineAt + 1}
              step={1.9}
              color={C.ink}
              seed="close-a"
            />
          </div>
          <div style={{ position: "absolute", left: 44, top: lineTop + l0 * 0.88, zIndex: 6 }}>
            <GiantLine
              text="THREE WAYS IN"
              size={l1}
              local={local}
              delay={lineAt + 9}
              step={1.5}
              color={C.bone}
              seed="close-b"
            />
          </div>
          <CircleNote
            local={local}
            delay={lineAt + 20}
            x={2}
            y={lineTop + l0 * 0.88 - l1 * 0.16}
            w={Math.min(1046, estWidth("THREE WAYS IN", l1) + 120)}
            h={l1 * 1.2}
            rotate={-2.8}
          />
          <div style={{ position: "absolute", left: 48, top: lineTop + l0 * 0.88 + l1 * 1.34, zIndex: 8 }}>
            <TagLabel
              text="M2  ·  M4  ·  M6"
              size={46}
              local={local}
              delay={lineAt + 16}
              from="left"
              rotate={-1.5}
              seed="close-tag"
            />
          </div>
        </>
      ) : null}

      {/* the branding lockup the reel ends on */}
      {local >= brandAt ? (
        <AbsoluteFill style={{ zIndex: 11, transform: `scale(${settle})` }}>
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 330,
              fontFamily: "MontageTag, Archivo, sans-serif",
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 6,
              color: C.ink,
              opacity: interpolate(brandLocal, [4, 12], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            MOTU M-SERIES AT
          </div>
          <LogoTag
            which="shivansh"
            local={local}
            delay={brandAt + 2}
            width={900}
            x={64}
            y={410}
            rotate={-1.6}
          />
          <LogoTag
            which="motu"
            local={local}
            delay={brandAt + 8}
            width={560}
            x={92}
            y={806}
            rotate={2.1}
          />
          <ContactStrip local={local} delay={brandAt + 14} x={74} y={1156} scale={1.2} />
          <div style={{ position: "absolute", left: 78, top: 1510, zIndex: 12 }}>
            <TagLabel
              text="M2  ·  M4  ·  M6"
              size={50}
              local={local}
              delay={brandAt + 20}
              from="left"
              rotate={-1.4}
              seed="close-brand-tag"
            />
          </div>
        </AbsoluteFill>
      ) : null}

      {ids.map((_, i) => (
        <Flash key={i} local={local} at={i * per} len={5} peak={0.8} />
      ))}
      <Flash local={local} at={lineAt} len={9} />
      <Flash local={local} at={brandAt} len={8} />
      <Flash local={local} at={hitAt} len={10} peak={0.92} />
    </AbsoluteFill>
  );
};
