import React from "react";
import { AbsoluteFill } from "remotion";
import { C, H, W } from "../theme";
import { aspect, isDark } from "../catalog";
import { fit, estWidth } from "../measure";
import type { Shot } from "../schedule";
import { Paper } from "./Paper";
import { Plate } from "./Plate";
import { GiantLine, TagLabel } from "./Type";
import { CircleNote, Star } from "./Doodle";
import { ContactStrip } from "./Brand";
import { ColorBlock } from "./Block";

type Placed = {
  size: number;
  x: number;
  y: number;
  align: "left" | "right";
};

/**
 * One held composition. Every layout is built from the same parts - a
 * screenprinted plate, giant display type, boxed tags, a hand-drawn
 * annotation - arranged so that neighbouring beats never repeat a shape.
 */
export const Scene: React.FC<{ shot: Shot; local: number; hold: number }> = ({
  shot,
  local,
  hold,
}) => {
  const lean = shot.lean;
  const ar = aspect(shot.img);
  const head = shot.head ?? [];

  // ---- plate geometry per layout -----------------------------------------
  let pw = 940;
  let px = 70;
  let py = 420;
  let prot = -2.4 * lean;
  let lines: Placed[] = [];
  let tagPos = { x: 90, y: 1560 };
  let tag2Pos = { x: 560, y: 1660 };
  let blocks: React.ReactNode = null;

  const headTop = (top: number, targetW: number, maxSize: number, gap = 0.80) => {
    const out: Placed[] = [];
    let y = top;
    head.forEach((t, i) => {
      const size = fit(t, targetW, maxSize);
      out.push({
        size,
        // alternate which edge each line hangs off, so the stack steps
        x: i % 2 === (lean > 0 ? 0 : 1) ? 54 : Math.max(-20, 1026 - estWidth(t, size)),
        y,
        align: "left",
      });
      y += size * gap;
    });
    return out;
  };

  switch (shot.layout) {
    case "hero": {
      // product-name reveal: plate high, name enormous underneath
      pw = ar > 2.4 ? 1240 : 1060;
      px = ar > 2.4 ? -80 : lean > 0 ? 26 : 0;
      py = ar > 2.4 ? 520 : 412;
      prot = -1.8 * lean;
      const h0 = fit(head[0] ?? "", 660, 240);
      const h1 = fit(head[1] ?? "", 1140, 720);
      lines = [
        { size: h0, x: 68, y: 1004, align: "left" },
        { size: h1, x: -22, y: 1004 + h0 * 0.94, align: "left" },
      ];
      tagPos = { x: 628, y: 1716 };
      break;
    }
    case "band": {
      // a cut band of photography straight across the sheet
      pw = 1250;
      px = -86;
      py = 856;
      prot = -1.4 * lean;
      lines = headTop(252, 942, 330, 0.82);
      tagPos = { x: lean > 0 ? 92 : 556, y: 1436 };
      blocks = (
        <ColorBlock
          local={local}
          delay={2}
          x={lean > 0 ? -40 : 470}
          y={1330}
          w={660}
          h={26}
          color={C.crimson}
          rotate={-1.2}
          seed={shot.key + "b"}
        />
      );
      break;
    }
    case "plateHigh": {
      pw = 1070;
      px = lean > 0 ? 34 : -26;
      py = 226;
      prot = -2.6 * lean;
      lines = headTop(1012, 942, 300, 0.80);
      tagPos = { x: lean > 0 ? 76 : 516, y: 1734 };
      break;
    }
    case "plateLow": {
      pw = 1100;
      px = lean > 0 ? 14 : -34;
      py = 846;
      prot = 2.2 * lean;
      lines = headTop(198, 942, 300, 0.80);
      tagPos = { x: lean > 0 ? 92 : 536, y: 1756 };
      break;
    }
    case "bleedType": {
      // photography bleeding both edges, type stacked hard over it
      pw = 1350;
      px = -138;
      py = 386;
      prot = 1.6 * lean;
      const top = 588;
      let y = top;
      lines = head.map((t, i) => {
        const size = fit(t, 1008, 392);
        const p: Placed = {
          size,
          x: i % 2 === (lean > 0 ? 0 : 1) ? 6 : 74,
          y,
          align: "left",
        };
        y += size * 0.80;
        return p;
      });
      tagPos = { x: lean > 0 ? 700 : 74, y: 1700 };
      break;
    }
    case "stack": {
      // technique #10: two photographs and two type layers at once
      pw = 980;
      px = lean > 0 ? 82 : 26;
      py = 286;
      prot = -3.2 * lean;
      lines = headTop(1114, 934, 262, 0.80);
      tagPos = { x: lean > 0 ? 70 : 590, y: 1668 };
      tag2Pos = { x: lean > 0 ? 598 : 92, y: 1764 };
      break;
    }
    case "quiet": {
      // technique #8: a breathing beat, photography almost alone
      pw = 1190;
      px = -55;
      py = 500;
      prot = -1.5 * lean;
      lines = [];
      tagPos = { x: lean > 0 ? 88 : 516, y: 1560 };
      break;
    }
  }

  // a beat with no headline centres its plate instead of leaving the sheet empty
  const ph = pw / ar;
  if (!head.length && shot.layout !== "quiet") {
    py = Math.round((1920 - ph) / 2) + (shot.tile ? -110 : 0);
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.paper }}>
      <Paper
        sheet={shot.paper}
        streak={shot.streak}
        local={local}
        hold={hold}
        lean={lean}
      />

      {blocks}

      <Plate
        id={shot.img}
        local={local}
        hold={hold}
        delay={0}
        width={pw}
        x={px}
        y={py}
        rotate={prot}
        drift={shot.layout === "quiet" ? 26 : 16}
        driftDir={lean}
        zoom={shot.layout === "quiet" ? 0.05 : 0.035}
        shadow={18}
        z={2}
      />

      {shot.tile ? (
        <Plate
          id={shot.tile}
          local={local}
          hold={hold}
          delay={5}
          width={aspect(shot.tile) > 2.4 ? 700 : 430}
          x={lean > 0 ? 470 : 190}
          y={py + ph - 130}
          rotate={5.4 * lean}
          drift={22}
          driftDir={-lean}
          zoom={0.05}
          shadow={14}
          z={4}
        />
      ) : null}

      {lines.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.x, top: p.y, zIndex: 6 }}>
          <GiantLine
            text={head[i]}
            size={p.size}
            local={local}
            delay={3 + i * 4}
            color={
              shot.accent === i
                ? C.crimson
                : shot.layout === "bleedType" && isDark(shot.img)
                  ? C.bone
                  : C.ink
            }
            alt={shot.layout === "hero" && i === 1}
            altColor={shot.accent === i ? C.ink : C.crimson}
            step={shot.layout === "hero" && i === 1 ? 2.6 : 1.4}
            seed={shot.key + i}
          />
        </div>
      ))}

      {shot.note && lines.length ? (
        <CircleNote
          local={local}
          delay={12}
          x={lines[lines.length - 1].x - 46}
          y={lines[lines.length - 1].y - lines[lines.length - 1].size * 0.16}
          w={Math.min(
            1040,
            estWidth(head[lines.length - 1], lines[lines.length - 1].size) + 120
          )}
          h={lines[lines.length - 1].size * 1.18}
          rotate={-3.4 * lean}
        />
      ) : null}

      {shot.tag ? (
        <div style={{ position: "absolute", left: tagPos.x, top: tagPos.y, zIndex: 8 }}>
          <TagLabel
            text={shot.tag}
            size={44}
            local={local}
            delay={10}
            from={lean > 0 ? "left" : "right"}
            rotate={-1.8 * lean}
            seed={shot.key + "t"}
          />
        </div>
      ) : null}

      {shot.tag2 ? (
        <div style={{ position: "absolute", left: tag2Pos.x, top: tag2Pos.y, zIndex: 8 }}>
          <TagLabel
            text={shot.tag2}
            size={40}
            local={local}
            delay={15}
            bg={C.crimson}
            fg={C.bone}
            from={lean > 0 ? "right" : "left"}
            rotate={2.2 * lean}
            seed={shot.key + "t2"}
          />
        </div>
      ) : null}

      {shot.star ? (
        <Star
          local={local}
          delay={14}
          x={lean > 0 ? 940 : 130}
          y={py - 58}
          size={104}
          rotate={-12}
        />
      ) : null}

      {shot.contact ? (
        <ContactStrip local={local} delay={18} x={70} y={1610} scale={0.92} />
      ) : null}
    </AbsoluteFill>
  );
};
