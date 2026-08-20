import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, SPACE, PRODUCT_NAME, SPEC, hexA } from "./theme";
import type { Beat } from "./beat";
import { frames } from "./beat";
import { EASE, ramp } from "./lib/anim";
import { Drift, EcosystemMontage, Gimbal, MacroReveal, Montage, Plate, PortSweep } from "./components/Media";
import { Counter, Eyebrow, Headline, Pill, Rise, Rule, SpecChip, Sub } from "./components/Type";
import { Ground, Hairlines, Scene, Split, Stack } from "./components/Shell";
import {
  BrandBeat,
  BrandLayer,
  ContactPanel,
  Outro,
  PriceLockup,
} from "./components/Brand";
import { CapacityBars, CvDiagram, DacChip, LcdMeter, LoopbackDiagram } from "./components/Graphics";

/**
 * One beat, rendered. Every layout below keeps its media inside a padded box
 * (SPACE.marginX 56 / marginY 52, the AVB long-form's own proven figures) so no
 * critical text or callout can reach the true frame edge, and every image goes
 * through Plate, which is `object-fit: contain` — the complete unit, always.
 */

const Copy: React.FC<{ b: Beat; headSize?: number; subSize?: number }> = ({
  b,
  headSize = 78,
  subSize = 31,
}) => (
  <Stack gap={18}>
    {b.eyebrow ? <Eyebrow color={b.alert ? COLORS.alert : COLORS.motuBlue}>{b.eyebrow}</Eyebrow> : null}
    {b.heading ? (
      <Headline size={headSize} serif={b.serif} color={b.alert ? COLORS.alert : COLORS.ink}>
        {b.heading}
      </Headline>
    ) : null}
    {b.heading ? <Rise delay={12}><Rule color={b.alert ? COLORS.alert : COLORS.motuBlue} /></Rise> : null}
    {b.sub ? <Sub size={subSize}>{b.sub}</Sub> : null}
  </Stack>
);

const SpecRow: React.FC<{ b: Beat; delay?: number; size?: number }> = ({ b, delay = 22, size = 40 }) =>
  b.specs && b.specs.length ? (
    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
      {b.specs.map((s, i) => (
        <SpecChip key={s.label} label={s.label} value={s.value} delay={delay + i * 6} size={size} />
      ))}
    </div>
  ) : null;

const PillRow: React.FC<{ b: Beat; delay?: number }> = ({ b, delay = 18 }) =>
  b.pills && b.pills.length ? (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
      {b.pills.map((p, i) => (
        <Pill key={p} delay={delay + i * 6}>
          {p}
        </Pill>
      ))}
    </div>
  ) : null;

export const BeatScene: React.FC<{ b: Beat }> = ({ b }) => {
  const dur = frames(b.sec);
  const flat = b.kind === "brandBeat" || b.kind === "contact" || b.kind === "outro";
  // The bottom-left lower-third needs its own band (see Shell.Scene).
  const reserve = b.brand === "lowerThird" ? 116 : 0;

  const body = (() => {
    switch (b.kind) {
      // ── Cold open: media fills the frame, copy sits over the padded box.
      case "coldOpen":
        return (
          <>
            <AbsoluteFill style={{ padding: 0 }}>
              <Drift idx={b.images[0]} duration={dur} scaleFrom={1.03} scaleTo={1.09} panX={-26} />
            </AbsoluteFill>
            <AbsoluteFill
              style={{
                background: `linear-gradient(90deg, ${hexA(COLORS.paper, 0.97)} 0%, ${hexA(
                  COLORS.paper,
                  0.9
                )} 42%, ${hexA(COLORS.paper, 0.1)} 78%)`,
              }}
            />
            <Scene duration={dur} reserveBottom={reserve}>
              <div style={{ display: "flex", alignItems: "center", height: "100%", maxWidth: 1080 }}>
                <Copy b={b} headSize={96} subSize={35} />
              </div>
            </Scene>
          </>
        );

      case "editorial":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Split
              ratio="1fr 1.02fr"
              left={
                <Gimbal seed={7} amount={0.7}>
                  <Plate idx={b.images[0]} style={{ width: "100%", height: "100%" }} />
                </Gimbal>
              }
              right={<Copy b={b} headSize={82} subSize={32} />}
            />
          </Scene>
        );

      case "heroSplit":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Split
              ratio="1.1fr 1fr"
              left={
                <Gimbal seed={b.images[0] ?? 3} amount={0.65}>
                  <Plate idx={b.images[0]} style={{ width: "100%", height: "100%" }} />
                </Gimbal>
              }
              right={
                <Stack gap={22}>
                  <Copy b={b} headSize={b.specs ? 66 : 76} subSize={29} />
                  <SpecRow b={b} delay={26} size={34} />
                </Stack>
              }
            />
          </Scene>
        );

      case "macroReveal":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Stack gap={26} style={{ height: "100%" }}>
              <Copy b={b} headSize={66} subSize={28} />
              <div style={{ flex: 1, minHeight: 0 }}>
                <MacroReveal
                  idx={b.images[0]}
                  duration={dur}
                  fx={b.focal?.[0] ?? 0.5}
                  fy={b.focal?.[1] ?? 0.5}
                  macroScale={b.macroScale ?? 3.1}
                />
              </div>
            </Stack>
          </Scene>
        );

      case "portSweep":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Stack gap={24} style={{ height: "100%" }}>
              <Copy b={b} headSize={64} subSize={28} />
              <div style={{ flex: 1, minHeight: 0 }}>
                <PortSweep idx={b.images[0]} duration={dur} zoom={2.1} />
              </div>
            </Stack>
          </Scene>
        );

      // ── Macro detail ALWAYS paired with the whole unit, in the same beat.
      //    `m6Macro` is natively a crop of the LCD cluster — there is no whole
      //    unit inside that file to reveal — so it is never shown alone.
      case "macroPair":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Stack gap={22} style={{ height: "100%" }}>
              <Copy b={b} headSize={62} subSize={27} />
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "grid",
                  gridTemplateColumns: "0.82fr 1.18fr",
                  gridTemplateRows: "minmax(0, 1fr)",
                  gap: 30,
                }}
              >
                <Gimbal seed={11} amount={0.8}>
                  <Plate idx={b.images[0]} style={{ width: "100%", height: "100%" }} />
                </Gimbal>
                <Gimbal seed={4} amount={0.5}>
                  <Plate idx={b.images[1]} style={{ width: "100%", height: "100%" }} />
                </Gimbal>
              </div>
            </Stack>
          </Scene>
        );

      case "montage":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Stack gap={22} style={{ height: "100%" }}>
              <Stack gap={14}>
                {b.eyebrow ? <Eyebrow>{b.eyebrow}</Eyebrow> : null}
                {b.heading ? <Headline size={62}>{b.heading}</Headline> : null}
              </Stack>
              <div style={{ flex: 1, minHeight: 0 }}>
                <Montage
                  items={b.images.map((idx, i) => ({ idx, label: b.labels?.[i] }))}
                  duration={dur}
                  cols={b.cols}
                />
              </div>
            </Stack>
          </Scene>
        );

      case "ecosystemMontage":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Stack gap={22} style={{ height: "100%" }}>
              <Stack gap={14}>
                {b.eyebrow ? <Eyebrow>{b.eyebrow}</Eyebrow> : null}
                {b.heading ? <Headline size={70}>{b.heading}</Headline> : null}
              </Stack>
              <div style={{ flex: 1, minHeight: 0 }}>
                <EcosystemMontage
                  items={b.images.map((idx, i) => ({ idx, label: b.labels?.[i] }))}
                  duration={dur}
                  soloHold={b.soloHold ?? 48}
                  cols={3}
                />
              </div>
            </Stack>
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
                gap: 30,
                textAlign: "center",
              }}
            >
              {b.eyebrow ? <Eyebrow>{b.eyebrow}</Eyebrow> : null}
              <Headline size={b.product ? 132 : 92} delay={6}>
                {b.heading}
              </Headline>
              {b.product ? (
                <Rise delay={14}>
                  <DacChip delay={16} size={150} label="Shared ESS Sabre32 Ultra engine" />
                </Rise>
              ) : null}
              {b.sub ? <Sub size={38} delay={20} max={1300}>{b.sub}</Sub> : null}
              <PillRow b={b} delay={26} />
            </div>
          </Scene>
        );

      case "capacity":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Split
              ratio="1fr 1.15fr"
              left={<Stack gap={18}><Copy b={b} headSize={66} subSize={28} /></Stack>}
              right={
                <div style={{ width: "100%" }}>
                  <CapacityBars delay={14} />
                </div>
              }
            />
          </Scene>
        );

      case "counters":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Split
              ratio="1.02fr 1fr"
              left={<Copy b={b} headSize={70} subSize={29} />}
              right={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 34,
                    alignItems: "flex-start",
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
                      delay={16 + i * 12}
                      size={(b.counters ?? []).length > 1 ? 76 : 128}
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
            <Stack gap={30} style={{ height: "100%", justifyContent: "center" }}>
              <Copy b={b} headSize={78} subSize={31} />
              <SpecRow b={b} delay={24} size={42} />
            </Stack>
          </Scene>
        );

      case "lcd":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Split
              ratio="1fr 0.86fr"
              left={<Copy b={b} headSize={68} subSize={29} />}
              right={
                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                  <Gimbal seed={21} amount={0.5} style={{ width: "auto", height: "auto" }}>
                    <LcdMeter delay={12} channels={6} width={560} height={320} />
                  </Gimbal>
                </div>
              }
            />
          </Scene>
        );

      case "loopback":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Stack gap={30} style={{ height: "100%", justifyContent: "center" }}>
              <Copy b={b} headSize={70} subSize={30} />
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <LoopbackDiagram delay={16} width={1560} />
              </div>
            </Stack>
          </Scene>
        );

      case "cv":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Stack gap={30} style={{ height: "100%", justifyContent: "center" }}>
              <Copy b={b} headSize={70} subSize={30} />
              <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <CvDiagram delay={16} width={1420} />
              </div>
            </Stack>
          </Scene>
        );

      case "software":
        return (
          <Scene duration={dur} reserveBottom={reserve}>
            <Stack gap={26} style={{ height: "100%" }}>
              <Copy b={b} headSize={66} subSize={29} />
              <div style={{ flex: 1, minHeight: 0 }}>
                <Drift idx={b.images[0]} duration={dur} scaleFrom={1.0} scaleTo={1.04} />
              </div>
            </Stack>
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
                gap: 34,
              }}
            >
              <Rise y={12}>
                <div style={{ textAlign: "center" }}>
                  <Headline size={72} delay={0}>
                    Three sizes. Three prices.
                  </Headline>
                </div>
              </Rise>
              <PriceLockup delay={10} />
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
