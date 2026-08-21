import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BRAND, COLORS, PRICE, RADII, SAFE, hexA } from "../lib/theme";
import { EASE, ramp, mapClamp } from "../lib/anim";
import { Frame, MacroReveal, PortSweep, Sequence as ImgSequence, Stack } from "./Media";
import { Chip, Counter, Eyebrow, Headline, PriceRow, Rise, Rule, Sub, micro, spec, subhead } from "./Type";
import { CloseLockup, Logo, MotuCorner, ShivanshCorner, ShivanshStrip } from "./Brand";
import { Col, CopyOverMedia, Ground, Hairlines, Scene, type Enter } from "./Shell";
import { Sfx, type Hit } from "./Sfx";

export type Base = { dur: number; enter?: Enter; hits?: Hit[] };
const Wrap: React.FC<{ flat?: boolean; seed?: number; children: React.ReactNode; hits?: Hit[] }> =
({ flat, seed = 0, children, hits }) => (
  <AbsoluteFill>
    <Ground flat={flat} seed={seed} />
    {!flat ? <Hairlines /> : null}
    {children}
    {hits ? <Sfx hits={hits} /> : null}
  </AbsoluteFill>
);

/** 1 — full-bleed image behind an editorial hook. */
export const Hook: React.FC<Base & { image: string; eyebrow: string; heading: string }> =
({ dur, enter = "dissolve", hits, image, eyebrow, heading }) => (
  <Wrap seed={1} hits={hits}>
    <AbsoluteFill><Frame name={image} duration={dur} amount={0.9} scaleTo={1.08} radius={0} /></AbsoluteFill>
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, ${hexA(COLORS.paper, 0.97)} 0%, ${hexA(COLORS.paper, 0.9)} 34%, ${hexA(COLORS.paper, 0.08)} 68%)`,
    }} />
    <Scene duration={dur} enter={enter}>
      <Col gap={16}><Eyebrow>{eyebrow}</Eyebrow><Headline size={86} serif>{heading}</Headline><Rise delay={12}><Rule /></Rise></Col>
    </Scene>
    <ShivanshCorner /><MotuCorner />
  </Wrap>
);

/** 2 — a wide context frame under two alert chips. */
export const Problem: React.FC<Base & { image: string; eyebrow: string; heading: string; chips: string[] }> =
({ dur, enter = "wipeUp", hits, image, eyebrow, heading, chips }) => (
  <Wrap seed={2} hits={hits}>
    <Scene duration={dur} enter={enter}>
      <CopyOverMedia
        copy={<Col gap={14}>
          <Eyebrow color={COLORS.alert}>{eyebrow}</Eyebrow>
          <Headline size={80} serif color={COLORS.alert}>{heading}</Headline>
        </Col>}
        media={<Col gap={18} style={{ height: "100%" }}>
          <div style={{ flex: 1, minHeight: 0 }}><Frame name={image} duration={dur} /></div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {chips.map((c, i) => <Chip key={c} delay={20 + i * 12} tone="alert">{c}</Chip>)}
          </div>
        </Col>}
      />
    </Scene>
  </Wrap>
);

/** 3 — each panel held ALONE and WHOLE, then all three assemble. */
export const Triptych: React.FC<Base & { images: string[]; labels: string[]; eyebrow: string; heading: string }> =
({ dur, enter = "scaleIn", hits, images, labels, eyebrow, heading }) => {
  const f = useCurrentFrame();
  const solo = Math.floor(dur * 0.72 / images.length);
  const soloPhase = solo * images.length;
  return (
    <Wrap seed={3} hits={hits}>
      <Scene duration={dur} enter={enter} reserveBottom={170}>
        <CopyOverMedia
          copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={84}>{heading}</Headline></Col>}
          media={f < soloPhase ? (() => {
            const i = Math.min(images.length - 1, Math.floor(f / solo));
            const local = f - i * solo;
            const o = Math.min(ramp(local, 0, 10, EASE.out), 1 - ramp(local, solo - 8, 8, EASE.inOut));
            return (
              <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center", opacity: o }}>
                <Frame name={images[i]} duration={solo} amount={0.7} label={labels[i]} hug />
              </div>
            );
          })() : (
            <div style={{ height: "100%", opacity: ramp(f - soloPhase, 0, 12, EASE.out),
              display: "grid", gridTemplateRows: "repeat(3, minmax(0,1fr))", gap: 14 }}>
              {images.map((n, i) => <div key={n} style={{ minHeight: 0, display: "flex" }}><Frame name={n} duration={dur} amount={0.4} label={labels[i]} hug /></div>)}
            </div>
          )}
        />
      </Scene>
      <ShivanshCorner /><MotuCorner />
    </Wrap>
  );
};

/** 4 — two complete heroes with a spec counter between them. */
export const HeroCounter: React.FC<Base & {
  images: string[]; eyebrow: string; heading: string;
  to: number; suffix: string; label: string; decimals?: number;
}> = ({ dur, enter = "rise", hits, images, eyebrow, heading, to, suffix, label, decimals }) => (
  <Wrap seed={4} hits={hits}>
    <Scene duration={dur} enter={enter} reserveBottom={170}>
      <CopyOverMedia
        copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={70}>{heading}</Headline></Col>}
        media={<div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr auto 1fr", gap: 12 }}>
          <div style={{ minHeight: 0 }}><Frame name={images[0]} duration={dur} amount={0.5} /></div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Counter to={to} suffix={suffix} label={label} decimals={decimals} delay={14} size={104} />
          </div>
          <div style={{ minHeight: 0 }}><Frame name={images[1]} duration={dur} amount={0.5} /></div>
        </div>}
      />
    </Scene>
    <ShivanshCorner />
  </Wrap>
);

/** 5 — two frames cross-dissolving under two spec figures. */
export const SpecPair: React.FC<Base & {
  images: string[]; eyebrow: string; heading: string;
  figures: { to: number; suffix: string; label: string; decimals?: number }[];
}> = ({ dur, enter = "dissolve", hits, images, eyebrow, heading, figures }) => (
  <Wrap seed={5} hits={hits}>
    <Scene duration={dur} enter={enter} reserveBottom={170}>
      <CopyOverMedia
        copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={68}>{heading}</Headline></Col>}
        media={<div style={{ height: "100%", display: "grid", gridTemplateRows: "1.25fr auto", gap: 18 }}>
          <div style={{ minHeight: 0 }}><ImgSequence items={images.map((n) => ({ name: n }))} duration={Math.round(dur * 0.95)} /></div>
          <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
            {figures.map((g, i) => <Counter key={g.label} {...g} delay={14 + i * 14} size={70} />)}
          </div>
        </div>}
      />
    </Scene>
    <ShivanshCorner />
  </Wrap>
);

/** 6 — Interface Sequence: slow dolly-push toward the LCD. */
export const LcdPush: React.FC<Base & { image: string; eyebrow: string; heading: string }> =
({ dur, enter = "sweep", hits, image, eyebrow, heading }) => {
  const f = useCurrentFrame();
  const z = mapClamp(f, [0, dur], [1.0, 1.16], EASE.soft);
  return (
    <Wrap seed={6} hits={hits}>
      <Scene duration={dur} enter={enter} reserveBottom={170}>
        <CopyOverMedia
          copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={70}>{heading}</Headline></Col>}
          media={<div style={{ height: "100%", overflow: "hidden", borderRadius: RADII.card }}>
            <div style={{ height: "100%", transform: `scale(${z})`, willChange: "transform" }}>
              <Frame name={image} duration={dur} amount={0.35} scaleTo={1} />
            </div>
          </div>}
        />
      </Scene>
      <ShivanshCorner />
    </Wrap>
  );
};

/** 7 — product title over a context frame. */
export const TitleCard: React.FC<Base & { image: string; title: string; capacity: string; chips: string[] }> =
({ dur, enter = "cut", hits, image, title, capacity, chips }) => (
  <Wrap seed={7} hits={hits}>
    <Scene duration={dur} enter={enter} reserveBottom={112}>
      <div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr auto", gap: 26 }}>
        <div style={{ minHeight: 0 }}><Frame name={image} duration={dur} amount={0.55} /></div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <Headline size={104} delay={2}>{title}</Headline>
          <Rise delay={12}><div style={{ ...micro(28, 800, "0.18em"), color: COLORS.motuBlue }}>{capacity}</div></Rise>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {chips.map((c, i) => <Chip key={c} delay={20 + i * 8} size={20}>{c}</Chip>)}
          </div>
        </div>
      </div>
    </Scene>
    <MotuCorner />
  </Wrap>
);

/** 8 — Macro-to-Full-Reveal with callout chips arriving as it resolves. */
export const Macro: React.FC<Base & {
  image: string; eyebrow: string; heading: string; chips: string[]; fx?: number; fy?: number; macroScale?: number;
}> = ({ dur, enter = "scaleIn", hits, image, eyebrow, heading, chips, fx, fy, macroScale }) => (
  <Wrap seed={8} hits={hits}>
    <Scene duration={dur} enter={enter} reserveBottom={170}>
      <CopyOverMedia
        copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={70}>{heading}</Headline></Col>}
        media={<div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr auto", gap: 16 }}>
          <div style={{ minHeight: 0 }}><MacroReveal name={image} duration={dur} fx={fx} fy={fy} macroScale={macroScale} /></div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {chips.map((c, i) => <Chip key={c} delay={Math.round(dur * 0.42) + i * 10} size={20}>{c}</Chip>)}
          </div>
        </div>}
      />
    </Scene>
    <ShivanshCorner />
  </Wrap>
);

/** 9 — Port Density Sweep, resolving to the complete unit. */
export const Sweep: React.FC<Base & { image: string; eyebrow: string; heading: string; chips: string[] }> =
({ dur, enter = "slide", hits, image, eyebrow, heading, chips }) => (
  <Wrap seed={9} hits={hits}>
    <Scene duration={dur} enter={enter} reserveBottom={160}>
      <CopyOverMedia
        copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={66}>{heading}</Headline></Col>}
        media={<div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr auto", gap: 16 }}>
          <div style={{ minHeight: 0 }}><PortSweep name={image} duration={dur} /></div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {chips.map((c, i) => <Chip key={c} delay={16 + i * 9} size={19} tone="neutral">{c}</Chip>)}
          </div>
        </div>}
      />
    </Scene>
    <ShivanshStrip />
  </Wrap>
);

/** 10 — several complete frames in rapid sequence, one point. */
export const Montage: React.FC<Base & { images: string[]; labels: string[]; eyebrow: string; heading: string }> =
({ dur, enter = "wipeUp", hits, images, labels, eyebrow, heading }) => (
  <Wrap seed={10} hits={hits}>
    <Scene duration={dur} enter={enter} reserveBottom={170}>
      <CopyOverMedia
        copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={70}>{heading}</Headline></Col>}
        media={<ImgSequence items={images.map((n, i) => ({ name: n, label: labels[i] }))} duration={dur} />}
      />
    </Scene>
    <ShivanshCorner />
  </Wrap>
);

/** 11 — a complete frame under one product's distinct price. */
export const Price: React.FC<Base & { images: string[]; labels?: string[]; product: string; price: string }> =
({ dur, enter = "dissolve", hits, images, labels, product, price }) => (
  <Wrap seed={11} hits={hits}>
    <Scene duration={dur} enter={enter} reserveBottom={170}>
      <CopyOverMedia
        copy={<Col gap={12}><Eyebrow>Market Operating Price</Eyebrow></Col>}
        media={<div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr auto", gap: 18 }}>
          <div style={{ minHeight: 0 }}>
            {images.length > 1
              ? <ImgSequence items={images.map((n, i) => ({ name: n, label: labels?.[i] }))} duration={dur} />
              : <div style={{ height: "100%", display: "flex", alignItems: "center" }}><Frame name={images[0]} duration={dur} label={labels?.[0]} hug /></div>}
          </div>
          <PriceRow product={product} price={price} note={PRICE.note} delay={12} />
        </div>}
      />
    </Scene>
    <ShivanshCorner />
  </Wrap>
);

/** 12 — control-room features, with an A/B indicator toggling. */
export const Control: React.FC<Base & { image: string; eyebrow: string; heading: string; chips: string[] }> =
({ dur, enter = "sweep", hits, image, eyebrow, heading, chips }) => {
  const f = useCurrentFrame();
  const on = Math.floor(f / 22) % 2 === 0;
  return (
    <Wrap seed={12} hits={hits}>
      <Scene duration={dur} enter={enter} reserveBottom={186}>
        <CopyOverMedia
          copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={66}>{heading}</Headline></Col>}
          media={<div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr auto auto", gap: 14 }}>
            <div style={{ minHeight: 0 }}><Frame name={image} duration={dur} amount={0.55} /></div>
            <div style={{ display: "flex", gap: 14, justifyContent: "center" }}>
              {["A", "B"].map((k) => {
                const live = (k === "A") === on;
                return (
                  <div key={k} style={{
                    ...spec(40, 800), color: live ? COLORS.paperLift : COLORS.slate,
                    background: live ? COLORS.motuBlue : hexA(COLORS.ink, 0.06),
                    border: `2px solid ${live ? COLORS.motuBlue : COLORS.line}`,
                    borderRadius: 14, padding: "10px 34px", transition: "none",
                  }}>{k}</div>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {chips.map((c, i) => <Chip key={c} delay={18 + i * 10} size={19} tone="neutral">{c}</Chip>)}
            </div>
          </div>}
        />
      </Scene>
      <ShivanshCorner />
    </Wrap>
  );
};

/** 13 — the software bundle under three capability chips. */
export const Software: React.FC<Base & { image: string; eyebrow: string; heading: string; chips: string[] }> =
({ dur, enter = "dissolve", hits, image, eyebrow, heading, chips }) => (
  <Wrap seed={13} hits={hits}>
    <Scene duration={dur} enter={enter} reserveBottom={170}>
      <CopyOverMedia
        copy={<Col gap={12}><Eyebrow>{eyebrow}</Eyebrow><Headline size={70}>{heading}</Headline></Col>}
        media={<div style={{ height: "100%", display: "grid", gridTemplateRows: "1fr auto", gap: 16 }}>
          <div style={{ minHeight: 0 }}><Frame name={image} duration={dur} amount={0.45} /></div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {chips.map((c, i) => <Chip key={c} delay={10 + i * 9} size={20} tone="green">{c}</Chip>)}
          </div>
        </div>}
      />
    </Scene>
    <ShivanshCorner />
  </Wrap>
);

/** 14 — the price wall: three panels, three distinct figures, one URL. */
export const PriceWall: React.FC<Base & { images: string[] }> = ({ dur, enter = "wipeUp", hits, images }) => {
  const rows = [
    { p: "MOTU M2", v: PRICE.m2, io: "2 in / 2 out" },
    { p: "MOTU M4", v: PRICE.m4, io: "4 in / 4 out" },
    { p: "MOTU M6", v: PRICE.m6, io: "6 in / 4 out" },
  ];
  return (
    <Wrap seed={14} hits={hits}>
      <Scene duration={dur} enter={enter}>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
          <Rise><div style={{ ...headingStyle }}>THREE SIZES.{"\n"}THREE PRICES.</div></Rise>
          {rows.map((r, i) => (
            <Rise key={r.p} delay={10 + i * 8} y={14}>
              <div style={{
                display: "grid", gridTemplateColumns: "1.15fr 1fr", alignItems: "center", gap: 14,
                background: COLORS.paperLift, border: `1px solid ${COLORS.line}`, borderRadius: 20,
                padding: "12px 18px", boxShadow: `0 8px 24px ${COLORS.shadow}`,
              }}>
                <div style={{ height: 132 }}><Frame name={images[i]} duration={dur} amount={0.3} radius={12} /></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ ...micro(22, 800, "0.13em"), color: COLORS.ink }}>{r.p}</span>
                  <span style={{ ...micro(16, 700, "0.1em"), color: COLORS.slateDim }}>{r.io}</span>
                  <span style={{ ...spec(52, 800), color: COLORS.motuBlue, lineHeight: 1.1 }}>{r.v}</span>
                </div>
              </div>
            </Rise>
          ))}
          <Rise delay={36} y={12}>
            <div style={{ textAlign: "center" }}>
              <div style={{ ...micro(19, 700, "0.12em"), color: COLORS.slate }}>{PRICE.note}</div>
              <div style={{ ...spec(31, 800, "0.015em"), color: COLORS.ink, marginTop: 8 }}>
                Visit <span style={{ color: COLORS.motuBlue }}>{BRAND.website}</span> to check the best price
              </div>
            </div>
          </Rise>
        </div>
      </Scene>
    </Wrap>
  );
};
const headingStyle: React.CSSProperties = {
  fontFamily: "Archivo, system-ui, sans-serif", fontWeight: 900, fontSize: 62, lineHeight: 1.03,
  letterSpacing: "-0.015em", textTransform: "uppercase", color: COLORS.ink, whiteSpace: "pre-line", textAlign: "center",
};

/** 15 — the close: both logos plain, full designation, URL. */
export const Close: React.FC<Base> = ({ dur, enter = "dissolve", hits }) => (
  <Wrap flat seed={15} hits={hits}>
    <Scene duration={dur} enter={enter} pad={false}><CloseLockup /></Scene>
  </Wrap>
);
