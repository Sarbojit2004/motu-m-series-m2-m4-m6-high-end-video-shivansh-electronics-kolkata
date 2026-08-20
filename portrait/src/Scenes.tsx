import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, SAFE, hexA } from "./theme";
import type { Beat } from "./beat";
import { frames } from "./beat";
import { Drift, EcosystemMontage, Gimbal, MacroReveal, Montage, Plate, PortSweep } from "./components/Media";
import { Counter, Eyebrow, Headline, Pill, Rise, Rule, SpecChip, Sub } from "./components/Type";
import { CopyOverMedia, Ground, Hairlines, Scene, Stack } from "./components/Shell";
import { BrandBeat, BrandLayer, ContactPanel, Outro, PriceLockup } from "./components/Brand";
import { CapacityBars, CvDiagram, DacChip, LcdMeter, LoopbackDiagram } from "./components/Graphics";

/**
 * One beat, rendered for the PORTRAIT canvas.
 *
 * Where the landscape build reaches for a two-column Split, this stacks: copy
 * above, media below. Everything sits inside the caption-safe zone (top 180,
 * bottom 220, sides 64), and every image still goes through Plate, which is
 * `object-fit: contain` — the complete unit, always.
 *
 * Type is sized against the "readable at a glance on a phone" bar rather than
 * the landscape bar: the headline floor here is 62px on a 1080-wide canvas,
 * which is proportionally larger than the landscape build's 64px on 1920.
 */

const Copy: React.FC<{ b: Beat; headSize?: number; subSize?: number }> = ({
  b,
  headSize = 74,
  subSize = 30,
}) => (
  <Stack gap={14} style={{ height: "auto" }}>
    {b.eyebrow ? <Eyebrow color={b.alert ? COLORS.alert : COLORS.motuBlue}>{b.eyebrow}</Eyebrow> : null}
    {b.heading ? (
      <Headline size={headSize} serif={b.serif} color={b.alert ? COLORS.alert : COLORS.ink}>
        {b.heading}
      </Headline>
    ) : null}
    {b.heading ? (
      <Rise delay={10}>
        <Rule color={b.alert ? COLORS.alert : COLORS.motuBlue} width={130} />
      </Rise>
    ) : null}
    {b.sub ? <Sub size={subSize} max={SAFE.contentW}>{b.sub}</Sub> : null}
  </Stack>
);

const SpecColumn: React.FC<{ b: Beat; delay?: number }> = ({ b, delay = 18 }) =>
  b.specs && b.specs.length ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {b.specs.map((s, i) => (
        <SpecChip key={s.label} label={s.label} value={s.value} delay={delay + i * 6} size={44} />
      ))}
    </div>
  ) : null;

const PillColumn: React.FC<{ b: Beat; delay?: number }> = ({ b, delay = 16 }) =>
  b.pills && b.pills.length ? (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
      {b.pills.map((p, i) => (
        <Pill key={p} delay={delay + i * 6} size={21}>
          {p}
        </Pill>
      ))}
    </div>
  ) : null;

export const BeatScene: React.FC<{ b: Beat }> = ({ b }) => {
  const dur = frames(b.sec);
  const flat = b.kind === "brandBeat" || b.kind === "contact" || b.kind === "outro";
  // Both branding forms now live in the bottom band (see Brand.tsx), so both
  // need their own reserved space or they land on top of the media.
  const reserve = b.brand === "lowerThird" ? 108 : b.brand === "cornerLogo" ? 104 : 0;

  const body = (() => {
    switch (b.kind) {
      // Media fills the frame and bleeds into the safe bands; copy stays inside.
      case "coldOpen":
        return (
          <>
            <AbsoluteFill style={{ padding: 0 }}>
              <Drift idx={b.images[0]} duration={dur} scaleFrom={1.04} scaleTo={1.1} panY={-22} />
            </AbsoluteFill>
            <AbsoluteFill
              style={{
                background: `linear-gradient(180deg, ${hexA(COLORS.paper, 0.97)} 0%, ${hexA(
                  COLORS.paper,
                  0.9
                )} 38%, ${hexA(COLORS.paper, 0.12)} 72%)`,
              }}
            />
            <Scene duration={dur} reserveBottom={reserve}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", height: "100%" }}>
                <Copy b={b} headSize={86} subSize={32} />
              </div>
            </Scene>
          </>
        );

      case "editorial":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={80} subSize={30} />}
              media={
                <Gimbal seed={7} amount={0.7}>
                  <Plate idx={b.images[0]} style={{ width: "100%", height: "100%" }} />
                </Gimbal>
              }
            />
          </Scene>
        );

      case "heroSplit":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={
                <Stack gap={16} style={{ height: "auto" }}>
                  <Copy b={b} headSize={b.specs ? 66 : 74} subSize={28} />
                  <SpecColumn b={b} delay={22} />
                </Stack>
              }
              media={
                <Gimbal seed={b.images[0] ?? 3} amount={0.6}>
                  <Plate idx={b.images[0]} style={{ width: "100%", height: "100%" }} />
                </Gimbal>
              }
            />
          </Scene>
        );

      case "macroReveal":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={70} subSize={28} />}
              media={
                <MacroReveal
                  idx={b.images[0]}
                  duration={dur}
                  fx={b.focal?.[0] ?? 0.5}
                  fy={b.focal?.[1] ?? 0.5}
                  macroScale={b.macroScale ?? 3.1}
                />
              }
            />
          </Scene>
        );

      case "portSweep":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={68} subSize={27} />}
              media={<PortSweep idx={b.images[0]} duration={dur} zoom={2.0} />}
            />
          </Scene>
        );

      // The macro detail is ALWAYS paired with the whole unit in the same beat.
      // `m6Macro` is natively a crop of the LCD cluster, so it never runs alone.
      case "macroPair":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={66} subSize={27} />}
              media={
                <div
                  style={{
                    height: "100%",
                    display: "grid",
                    gridTemplateRows: "1.1fr 0.9fr",
                    gridTemplateColumns: "minmax(0, 1fr)",
                    gap: 22,
                  }}
                >
                  <Gimbal seed={11} amount={0.8}>
                    <Plate idx={b.images[0]} style={{ width: "100%", height: "100%" }} />
                  </Gimbal>
                  <Gimbal seed={4} amount={0.5}>
                    <Plate idx={b.images[1]} style={{ width: "100%", height: "100%" }} />
                  </Gimbal>
                </div>
              }
            />
          </Scene>
        );

      case "montage":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={
                <Stack gap={12} style={{ height: "auto" }}>
                  {b.eyebrow ? <Eyebrow>{b.eyebrow}</Eyebrow> : null}
                  {b.heading ? <Headline size={70}>{b.heading}</Headline> : null}
                </Stack>
              }
              media={
                <Montage
                  items={b.images.map((idx, i) => ({ idx, label: b.labels?.[i] }))}
                  duration={dur}
                  cols={b.cols ?? 1}
                  gap={18}
                />
              }
            />
          </Scene>
        );

      case "ecosystemMontage":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={
                <Stack gap={12} style={{ height: "auto" }}>
                  {b.eyebrow ? <Eyebrow>{b.eyebrow}</Eyebrow> : null}
                  {b.heading ? <Headline size={82}>{b.heading}</Headline> : null}
                </Stack>
              }
              media={
                <EcosystemMontage
                  items={b.images.map((idx, i) => ({ idx, label: b.labels?.[i] }))}
                  duration={dur}
                  soloHold={b.soloHold ?? 62}
                  cols={1}
                />
              }
            />
          </Scene>
        );

      case "titleCard":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 26,
                textAlign: "center",
              }}
            >
              {b.eyebrow ? <Eyebrow>{b.eyebrow}</Eyebrow> : null}
              <Headline size={b.product ? 116 : 78} delay={5}>
                {b.heading}
              </Headline>
              {b.product ? (
                <Rise delay={12}>
                  <DacChip delay={14} size={168} label="Shared ESS Sabre32 Ultra engine" />
                </Rise>
              ) : null}
              {b.sub ? (
                <Sub size={36} delay={18} max={SAFE.contentW}>
                  {b.sub}
                </Sub>
              ) : null}
              <PillColumn b={b} delay={24} />
            </div>
          </Scene>
        );

      case "capacity":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={78} subSize={29} />}
              media={
                <div style={{ display: "flex", alignItems: "center", height: "100%", width: "100%" }}>
                  <CapacityBars delay={12} />
                </div>
              }
              mediaFlex={1}
            />
          </Scene>
        );

      case "counters":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={72} subSize={29} />}
              media={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 30,
                    height: "100%",
                  }}
                >
                  {(b.counters ?? []).map((c, i) => (
                    <Counter
                      key={c.label}
                      to={c.to}
                      suffix={c.suffix}
                      prefix={c.prefix}
                      label={c.label}
                      decimals={c.decimals}
                      delay={14 + i * 10}
                      size={(b.counters ?? []).length > 1 ? 84 : 132}
                    />
                  ))}
                </div>
              }
            />
          </Scene>
        );

      case "specGrid":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={72} subSize={29} />}
              media={
                <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
                  <div style={{ width: "100%" }}>
                    <SpecColumn b={b} delay={16} />
                  </div>
                </div>
              }
            />
          </Scene>
        );

      case "lcd":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={72} subSize={29} />}
              media={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Gimbal seed={21} amount={0.5} style={{ width: "auto", height: "auto" }}>
                    <LcdMeter delay={10} channels={6} width={880} height={470} />
                  </Gimbal>
                </div>
              }
            />
          </Scene>
        );

      case "loopback":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={70} subSize={28} />}
              media={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <LoopbackDiagram delay={12} width={SAFE.contentW} />
                </div>
              }
            />
          </Scene>
        );

      case "cv":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={70} subSize={28} />}
              media={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <CvDiagram delay={12} width={SAFE.contentW} />
                </div>
              }
            />
          </Scene>
        );

      case "software":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <CopyOverMedia
              copy={<Copy b={b} headSize={70} subSize={28} />}
              media={<Drift idx={b.images[0]} duration={dur} scaleFrom={1.0} scaleTo={1.04} />}
            />
          </Scene>
        );

      case "brandBeat":
        return <BrandBeat />;

      case "contact":
        return <ContactPanel />;

      case "outro":
        return <Outro />;

      case "price":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 30,
              }}
            >
              <Rise y={10}>
                <div style={{ textAlign: "center" }}>
                  <Headline size={64} delay={0}>
                    Three sizes.{"\n"}Three prices.
                  </Headline>
                </div>
              </Rise>
              <PriceLockup delay={8} />
            </div>
          </Scene>
        );

      default:
        return null;
    }
  })();

  return (
    <AbsoluteFill>
      <Ground flat={flat} seed={b.id.length} />
      {!flat ? <Hairlines opacity={0.7} /> : null}
      {body}
      <BrandLayer mode={b.brand} motu={b.motu} detail={b.detail} />
    </AbsoluteFill>
  );
};
