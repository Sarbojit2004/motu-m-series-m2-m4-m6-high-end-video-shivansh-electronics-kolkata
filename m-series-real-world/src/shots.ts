// ─────────────────────────────────────────────────────────────────────────────
// THE SHOT PLAN
//
// Every shot is pinned to a CAPTION INDEX, never to a timestamp. The picture
// changes on the word it belongs to, and a re-written line moves the picture
// with it instead of leaving it behind. There is not one hand-typed frame
// number in either film.
//
// THE TEN DEPLOYMENT CLIPS arrive through the repository, because the build
// session's egress policy blocks the host they are served from. So every shot
// that wants one also names a still, and `clip()` returning null is what picks
// between them. Both films render today on the product photography and get
// better the moment the clips land — nothing is ever a black hole waiting for
// an asset, and no shot has to be re-planned when they arrive.
//
// HOW EACH KIND IS USED:
//
//   bleed    a photograph filling the frame, with a gimbal move inside overscan
//   plate    an isolated unit floating on the ground, positioned by its own
//            content box rather than by its canvas
//   panel    a front or rear render held flat, for the range comparisons
//   detail   a push into one named control on a panel render — the only shots
//            allowed to crop, and they crop a 1212-2442 px file into a frame
//            narrower than it is, so nothing is ever upscaled
//   stack    two COMPLETE plates, stacked in the reel, side by side in the
//            explainer. This replaces the diagonal split entirely: nothing in
//            either film is sliced, clipped or shown in part.
//   mosaic   three or four complete plates at once, for the lineup
//   clip     a deployment clip, full-bleed
// ─────────────────────────────────────────────────────────────────────────────

import { clip, img, type Asset, type Clip, type Region } from "./assets.ts";
import { REGIONS } from "./assets.ts";
import type { TimedSegment } from "./script.ts";
import type { AccentKey } from "./theme.ts";
import type { GraphicKind } from "./components/Graphics.tsx";

export type ShotKind = "bleed" | "plate" | "panel" | "detail" | "stack" | "mosaic" | "clip";

export type ShotSpec = {
  /** Caption index inside its chapter that this shot comes up on. */
  at: number;
  kind: ShotKind;
  /** One asset — bleed, plate, panel. */
  asset?: string;
  /** Several — stack, mosaic. */
  assets?: string[];
  /** A named entry in REGIONS — detail. */
  region?: string;
  /** A deployment clip. Falls back to `asset` when the clip is not present. */
  clipSlug?: string;
  /** Seconds into the clip to start — used to take the main section for the reel. */
  from?: number;
  /**
   * An animated demonstrative over the picture for the length of this shot.
   * Pinned to the caption that makes the claim, so the graphic draws itself
   * while the voice is saying the number rather than beside it.
   */
  graphic?: GraphicKind;
};

export type ResolvedShot = {
  kind: ShotKind;
  start: number;
  end: number;
  /** The accent of the chapter this shot belongs to. */
  accentKey: AccentKey;
  asset?: Asset;
  assets?: Asset[];
  region?: { slug: string; rect: Region; name: string };
  /** The panel render a detail pushes into — resolved from region.slug. */
  regionAsset?: Asset;
  clip?: Clip;
  graphic?: GraphicKind;
  /**
   * Where this shot's CHAPTER ends. A demonstrative needs two or three seconds
   * to draw itself, and some are pinned to captions only three-quarters of a
   * second long — "Three interfaces." is 22 frames. The graphic runs past its
   * own shot to here rather than flashing.
   */
  chapterEnd: number;
  from: number;
  seed: number;
  /** True when this is the first shot of its chapter — the transition is harder. */
  boundary: boolean;
};

// ═════════════════════════════════════════════════════════════════════════════
// THE VERTICAL REEL
//
// Ten deployments in ninety seconds means each one gets its MAIN SECTION, not
// its whole five seconds — which is why every clip here carries `from`. The
// clips were composed centre-weighted so the 16:9 source survives a 9:16 frame
// without the subject leaving it.
// ═════════════════════════════════════════════════════════════════════════════

export const REEL_SHOTS: Record<string, ShotSpec[]> = {
  hook: [
    { at: 0, kind: "bleed", clipSlug: "broll-01-home-studio", from: 1.4, asset: "m2-06" },
    { at: 1, kind: "bleed", asset: "m6-04" },
    { at: 2, kind: "detail", region: "m6.meter" },
    { at: 3, kind: "bleed", clipSlug: "broll-08-listening-room", from: 1.2, asset: "m6-03" },
  ],
  range: [
    { at: 0, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"], graphic: "ioMatrix" },
    { at: 1, kind: "panel", asset: "m6-front" },
    { at: 2, kind: "bleed", clipSlug: "broll-05-location-kit", from: 1.6, asset: "m2-01" },
    { at: 3, kind: "bleed", clipSlug: "broll-02-podcast-table", from: 1.5, asset: "m6-05" },
    { at: 4, kind: "stack", assets: ["m2-3q", "m4-3q"] },
  ],
  signal: [
    { at: 0, kind: "panel", asset: "m4-front" },
    { at: 1, kind: "detail", region: "m4.meter" },
    { at: 2, kind: "detail", region: "m6.meter", graphic: "dynamicRange" },
    { at: 3, kind: "bleed", clipSlug: "broll-10-producers", from: 1.5, asset: "m4-07" },
    { at: 4, kind: "bleed", clipSlug: "broll-04-rehearsal", from: 1.8, asset: "m6-08" },
  ],
  gain: [
    { at: 0, kind: "detail", region: "m6.gains" },
    { at: 1, kind: "detail", region: "m2.inputs", graphic: "noiseFloor" },
    { at: 2, kind: "bleed", clipSlug: "broll-02-podcast-table", from: 3.0, asset: "m6-02" },
    { at: 3, kind: "detail", region: "m4.inputs" },
  ],
  latency: [
    { at: 0, kind: "detail", region: "m4.mix", graphic: "roundTrip" },
    { at: 1, kind: "bleed", clipSlug: "broll-01-home-studio", from: 3.0, asset: "m2-04" },
    { at: 2, kind: "detail", region: "m2.monitor" },
    { at: 3, kind: "bleed", clipSlug: "broll-10-producers", from: 3.2, asset: "m6-07" },
  ],
  room: [
    { at: 0, kind: "bleed", clipSlug: "broll-01-home-studio", from: 2.2, asset: "m2-10" },
    { at: 1, kind: "bleed", clipSlug: "broll-02-podcast-table", from: 2.2, asset: "m6-05" },
    { at: 2, kind: "bleed", clipSlug: "broll-04-rehearsal", from: 2.4, asset: "m6-08" },
    { at: 3, kind: "bleed", clipSlug: "broll-09-live-event", from: 2.0, asset: "m6-06" },
    { at: 4, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"], graphic: "rangeLadder" },
  ],
  close: [
    { at: 0, kind: "bleed", clipSlug: "broll-07-dealer-counter", from: 1.5, asset: "m6-10" },
    { at: 1, kind: "stack", assets: ["m2-3q", "m4-3q"] },
    { at: 2, kind: "bleed", clipSlug: "broll-03-teaching-lab", from: 1.8, asset: "m6-09" },
    { at: 3, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"] },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
// THE LANDSCAPE EXPLAINER
//
// Here every clip plays COMPLETE, at native speed, from its first frame — the
// long film is where the deployments get their full length. Between them the
// panel details carry the specification, because a 2442 px render pushed into a
// 3840 px frame is sharper than any photograph of the same control.
// ═════════════════════════════════════════════════════════════════════════════

export const VIDEO_SHOTS: Record<string, ShotSpec[]> = {
  open: [
    { at: 0, kind: "bleed", clipSlug: "broll-01-home-studio", asset: "m2-06" },
    { at: 2, kind: "bleed", asset: "m4-07" },
    { at: 4, kind: "bleed", clipSlug: "broll-08-listening-room", asset: "m6-03" },
    { at: 6, kind: "detail", region: "m6.meter" },
    { at: 7, kind: "bleed", asset: "m6-04" },
    { at: 8, kind: "plate", asset: "m4-3q" },
    { at: 9, kind: "detail", region: "m4.inputs" },
  ],
  range: [
    { at: 0, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"], graphic: "ioMatrix" },
    { at: 1, kind: "panel", asset: "m2-front" },
    { at: 2, kind: "panel", asset: "m4-front" },
    { at: 3, kind: "panel", asset: "m6-front" },
    { at: 4, kind: "bleed", clipSlug: "broll-01-home-studio", asset: "m2-04" },
    { at: 5, kind: "detail", region: "m2.usbc" },
    { at: 6, kind: "detail", region: "m6.gains" },
    { at: 7, kind: "detail", region: "m6.phones" },
    { at: 8, kind: "stack", assets: ["m2-3q", "m4-3q"] },
  ],
  signal: [
    { at: 0, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"] },
    { at: 1, kind: "detail", region: "m4.meter", graphic: "dynamicRange" },
    { at: 2, kind: "detail", region: "m6.meter" },
    { at: 3, kind: "bleed", clipSlug: "broll-08-listening-room", asset: "m6-05" },
    { at: 4, kind: "bleed", asset: "m6-02" },
    { at: 5, kind: "detail", region: "m2.meter" },
    { at: 6, kind: "bleed", clipSlug: "broll-04-rehearsal", asset: "m6-08" },
    { at: 8, kind: "bleed", asset: "m4-05" },
    { at: 9, kind: "detail", region: "m6.meter" },
    { at: 10, kind: "bleed", clipSlug: "broll-10-producers", asset: "m4-07" },
  ],
  gain: [
    { at: 0, kind: "detail", region: "m6.gains" },
    { at: 1, kind: "detail", region: "m2.inputs", graphic: "noiseFloor" },
    { at: 2, kind: "detail", region: "m4.inputs" },
    { at: 3, kind: "bleed", clipSlug: "broll-02-podcast-table", asset: "m6-05" },
    { at: 4, kind: "panel", asset: "m6-rear" },
    { at: 5, kind: "detail", region: "m6.rearmic" },
    { at: 6, kind: "bleed", asset: "m6-07" },
    { at: 7, kind: "bleed", clipSlug: "broll-04-rehearsal", asset: "m6-04" },
    { at: 9, kind: "detail", region: "m6.gains" },
    { at: 10, kind: "bleed", asset: "m2-05" },
  ],
  latency: [
    { at: 0, kind: "detail", region: "m4.mix" },
    { at: 1, kind: "bleed", clipSlug: "broll-10-producers", asset: "m4-07" },
    { at: 2, kind: "detail", region: "m6.meter", graphic: "roundTrip" },
    { at: 3, kind: "detail", region: "m2.usbc" },
    { at: 4, kind: "bleed", asset: "m4-01" },
    { at: 5, kind: "bleed", clipSlug: "broll-06-streaming-desk", asset: "m4-03" },
    { at: 7, kind: "bleed", asset: "m2-04" },
    { at: 8, kind: "bleed", clipSlug: "broll-01-home-studio", asset: "m2-10" },
  ],
  monitor: [
    { at: 0, kind: "bleed", clipSlug: "broll-08-listening-room", asset: "m6-03" },
    { at: 1, kind: "detail", region: "m2.inputs" },
    { at: 2, kind: "detail", region: "m2.monitor", graphic: "monitorPath" },
    { at: 3, kind: "panel", asset: "m2-front" },
    { at: 4, kind: "bleed", asset: "m2-06" },
    { at: 5, kind: "detail", region: "m4.monitor" },
    { at: 6, kind: "detail", region: "m4.mix" },
    { at: 7, kind: "detail", region: "m6.mix" },
    { at: 8, kind: "bleed", clipSlug: "broll-06-streaming-desk", asset: "m4-05" },
    { at: 10, kind: "panel", asset: "m6-front" },
    { at: 11, kind: "detail", region: "m6.meter" },
    { at: 12, kind: "detail", region: "m4.meter" },
  ],
  m2: [
    { at: 0, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"] },
    { at: 1, kind: "plate", asset: "m2-3q" },
    { at: 2, kind: "bleed", clipSlug: "broll-01-home-studio", asset: "m2-06" },
    { at: 3, kind: "bleed", clipSlug: "broll-05-location-kit", asset: "m2-01" },
    { at: 5, kind: "detail", region: "m2.usbc" },
    { at: 6, kind: "bleed", asset: "m2-10" },
    { at: 7, kind: "panel", asset: "m2-rear" },
  ],
  m4: [
    { at: 0, kind: "plate", asset: "m4-3q" },
    { at: 1, kind: "detail", region: "m4.inputs" },
    { at: 2, kind: "detail", region: "m4.rearline" },
    { at: 3, kind: "bleed", clipSlug: "broll-10-producers", asset: "m4-07" },
    { at: 4, kind: "panel", asset: "m4-rear" },
    { at: 5, kind: "bleed", clipSlug: "broll-06-streaming-desk", asset: "m4-05" },
    { at: 6, kind: "bleed", asset: "m4-01" },
    { at: 7, kind: "detail", region: "m4.monitor" },
  ],
  m6: [
    { at: 0, kind: "panel", asset: "m6-front" },
    { at: 1, kind: "detail", region: "m6.gains" },
    { at: 2, kind: "detail", region: "m6.rearmic" },
    { at: 3, kind: "bleed", clipSlug: "broll-02-podcast-table", asset: "m6-05" },
    { at: 4, kind: "bleed", asset: "m6-02" },
    { at: 5, kind: "bleed", clipSlug: "broll-04-rehearsal", asset: "m6-08" },
    { at: 6, kind: "bleed", asset: "m6-06" },
    { at: 7, kind: "bleed", clipSlug: "broll-09-live-event", asset: "m6-07" },
    { at: 8, kind: "detail", region: "m6.phones" },
    { at: 9, kind: "bleed", asset: "m6-04" },
  ],
  choose: [
    { at: 0, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"], graphic: "rangeLadder" },
    { at: 1, kind: "bleed", clipSlug: "broll-07-dealer-counter", asset: "m6-10" },
    { at: 2, kind: "stack", assets: ["m2-3q", "m4-3q"] },
    { at: 3, kind: "bleed", clipSlug: "broll-03-teaching-lab", asset: "m6-09" },
    { at: 5, kind: "panel", asset: "m6-front" },
    { at: 6, kind: "bleed", asset: "m4-05" },
    { at: 7, kind: "detail", region: "m6.meter" },
    { at: 8, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"] },
  ],
  close: [
    { at: 0, kind: "bleed", clipSlug: "broll-08-listening-room", asset: "m6-03" },
    { at: 1, kind: "stack", assets: ["m2-3q", "m4-3q"] },
    { at: 2, kind: "mosaic", assets: ["m2-front", "m4-front", "m6-front"] },
  ],
};

// ── resolving ────────────────────────────────────────────────────────────────

/**
 * Lay the shot plan onto a timed script.
 *
 * A shot runs from the caption it is pinned to until the next shot in its
 * chapter, or until the chapter ends. `from` is only honoured for the reel;
 * the explainer plays every clip from its first frame.
 */
export const placeShots = (
  segments: TimedSegment[],
  plan: Record<string, ShotSpec[]>,
  useFrom: boolean,
): ResolvedShot[] => {
  const out: ResolvedShot[] = [];
  let seed = 0;
  segments.forEach((seg, si) => {
    const specs = (plan[seg.id] ?? []).slice().sort((a, b) => a.at - b.at);
    if (specs.length === 0) return;
    // A chapter ENDS on its last word, but the next one does not begin until
    // SEGMENT_GAP later — so a chapter's last shot has to carry through that
    // breath or the film cuts to nothing for twelve frames at every boundary.
    const chapterEnd = segments[si + 1]?.start ?? seg.end;
    specs.forEach((spec, n) => {
      const cap = seg.captions[Math.min(spec.at, seg.captions.length - 1)];
      const nextSpec = specs[n + 1];
      const start = cap.start;
      const end = nextSpec
        ? seg.captions[Math.min(nextSpec.at, seg.captions.length - 1)].start
        : chapterEnd;
      if (end <= start) return;

      const c = spec.clipSlug ? clip(spec.clipSlug) : null;
      const region = spec.region
        ? { ...REGIONS[spec.region], name: spec.region }
        : undefined;

      // A clip shot with no clip present falls back to its still, as a bleed.
      const kind: ShotKind = spec.kind === "clip" && !c ? "bleed" : spec.kind;

      out.push({
        kind: c && (spec.kind === "bleed" || spec.kind === "clip") ? "clip" : kind,
        start,
        end,
        accentKey: seg.accent,
        regionAsset: region ? img(region.slug) : undefined,
        asset: spec.asset ? img(spec.asset) : undefined,
        assets: spec.assets ? spec.assets.map(img) : undefined,
        region,
        clip: c ?? undefined,
        graphic: spec.graphic,
        chapterEnd,
        from: useFrom ? (spec.from ?? 0) : 0,
        seed: seed++,
        boundary: n === 0,
      });
    });
  });
  return out;
};
