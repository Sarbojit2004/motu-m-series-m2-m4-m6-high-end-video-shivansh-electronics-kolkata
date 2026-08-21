import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./lib/theme";
import { TOTAL_FRAMES } from "./audio/master";
import { MusicBedOnly, SfxTimelineOnly } from "./audio/MasterAudio";
import { Thumbnail } from "./Thumbnail";

import { HookTheDifference } from "./scenes/01-hook-the-difference";
import { TheOldTradeOff } from "./scenes/02-the-old-trade-off";
import { OneEngineThreeSizes } from "./scenes/03-one-engine-three-sizes";
import { SharedConverter } from "./scenes/04-shared-converter";
import { SharedNoiseAndLatency } from "./scenes/05-shared-noise-and-latency";
import { SharedMetering } from "./scenes/06-shared-metering";
import { M2Introduction } from "./scenes/07-m2-introduction";
import { M2FrontPanel } from "./scenes/08-m2-front-panel";
import { M2RearPanel } from "./scenes/09-m2-rear-panel";
import { M2InTheRoom } from "./scenes/10-m2-in-the-room";
import { M2Price } from "./scenes/11-m2-price";
import { M4Introduction } from "./scenes/12-m4-introduction";
import { M4FrontPanel } from "./scenes/13-m4-front-panel";
import { M4RearPanel } from "./scenes/14-m4-rear-panel";
import { M4InTheRoom } from "./scenes/15-m4-in-the-room";
import { M4Price } from "./scenes/16-m4-price";
import { M6Introduction } from "./scenes/17-m6-introduction";
import { M6FrontPanel } from "./scenes/18-m6-front-panel";
import { M6RearPanel } from "./scenes/19-m6-rear-panel";
import { M6ControlRoom } from "./scenes/20-m6-control-room";
import { M6FullEnsemble } from "./scenes/21-m6-full-ensemble";
import { M6Price } from "./scenes/22-m6-price";
import { SharedExtras } from "./scenes/23-shared-extras";
import { AllThreePricesAndCta } from "./scenes/24-all-three-prices-and-cta";
import { DistributorClose } from "./scenes/25-distributor-close";

/**
 * One dedicated composition per approved scene, registered independently.
 * There is deliberately NO all-scenes composition here — Flick renders each
 * scene on its own; the 5,340-frame master is assembled from those renders.
 *
 * Durations mirror scene-spec.json exactly (25 scenes, 5,340 frames, 178.000s).
 */
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="hook-the-difference"
        component={HookTheDifference}
        durationInFrames={240}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="the-old-trade-off"
        component={TheOldTradeOff}
        durationInFrames={210}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="one-engine-three-sizes"
        component={OneEngineThreeSizes}
        durationInFrames={270}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="shared-converter"
        component={SharedConverter}
        durationInFrames={240}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="shared-noise-and-latency"
        component={SharedNoiseAndLatency}
        durationInFrames={240}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="shared-metering"
        component={SharedMetering}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m2-introduction"
        component={M2Introduction}
        durationInFrames={180}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m2-front-panel"
        component={M2FrontPanel}
        durationInFrames={270}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m2-rear-panel"
        component={M2RearPanel}
        durationInFrames={210}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m2-in-the-room"
        component={M2InTheRoom}
        durationInFrames={270}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m2-price"
        component={M2Price}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m4-introduction"
        component={M4Introduction}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m4-front-panel"
        component={M4FrontPanel}
        durationInFrames={270}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m4-rear-panel"
        component={M4RearPanel}
        durationInFrames={210}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m4-in-the-room"
        component={M4InTheRoom}
        durationInFrames={270}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m4-price"
        component={M4Price}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m6-introduction"
        component={M6Introduction}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m6-front-panel"
        component={M6FrontPanel}
        durationInFrames={270}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m6-rear-panel"
        component={M6RearPanel}
        durationInFrames={210}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m6-control-room"
        component={M6ControlRoom}
        durationInFrames={210}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m6-full-ensemble"
        component={M6FullEnsemble}
        durationInFrames={270}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="m6-price"
        component={M6Price}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="shared-extras"
        component={SharedExtras}
        durationInFrames={210}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="all-three-prices-and-cta"
        component={AllThreePricesAndCta}
        durationInFrames={240}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="distributor-close"
        component={DistributorClose}
        durationInFrames={150}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/*
        The two standalone audio deliverables. These are NOT scenes — they carry
        no picture of their own. They exist because a music bed and a foley
        timeline have to be continuous across the whole 178 s, which per-scene
        compositions cannot express, and because the client receives both layers
        as separate WAVs that drop onto the timeline already in sync.
      */}
      <Composition
        id="MusicBedOnly"
        component={MusicBedOnly}
        durationInFrames={TOTAL_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="SfxTimelineOnly"
        component={SfxTimelineOnly}
        durationInFrames={TOTAL_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />

      {/* 1080x1920 cover frame — a still, not a scene. */}
      <Composition
        id="Thumbnail"
        component={Thumbnail}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
