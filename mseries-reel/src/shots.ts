import { ASSETS, type Asset, type ProductKey } from "./assets.ts";
import { buildTimeline, type SegmentId, type TimedCaption, type TimedSegment } from "./script.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE SHOT PLAN — 30 images across 90 seconds.
//
// Twice the density of the AVB reel (which had 119 images but 180 seconds and a
// slower, explanatory register). Here the arithmetic is 3 s per image if they
// simply queue — which is actually a comfortable hold, so unlike the AVB build
// this reel does NOT need a coverage tier working overtime. It can afford to
// give most images their own moment.
//
// FOUR SHOT KINDS, all full-bleed:
//
//   bleed    one photograph filling the frame under a camera move. The default.
//   panel    a transparent ultra-wide panel plan, tracked laterally.
//   split    two photographs on a diagonal — used where a line compares things.
//   mosaic   three to six as a drifting plane. The only compression tier, and
//            it exists so the hook and the engine section can show all three
//            products at once rather than picking one.
//
// The hook and the engine section belong to no single product, so they draw
// across all three pools — which is also exactly what those sections are ABOUT
// ("three interfaces, one engine"), so the shot kind carries the argument.
// ─────────────────────────────────────────────────────────────────────────────

export type ShotKind = "bleed" | "panel" | "split" | "mosaic";

export type Shot = {
  segment: SegmentId;
  product: ProductKey;
  env: "light" | "dark";
  kind: ShotKind;
  start: number;
  end: number;
  assets: Asset[];
  captions: TimedCaption[];
  seed: number;
  /** Re-shown material that is covered properly elsewhere. */
  reprise?: boolean;
};

/** Which pool each segment draws from. */
const POOL: Record<SegmentId, ProductKey> = {
  hook: "shared",
  engine: "shared",
  m2: "pm2",
  m4: "pm4",
  m6: "pm6",
  close: "shared",
};

/** Captions per shot. Lower in the hook so it cuts faster and holds attention. */
const GROUP: Record<SegmentId, number> = {
  hook: 2,
  engine: 2,
  m2: 1,
  m4: 1,
  m6: 1,
  close: 2,
};

const rank = (a: Asset): number => {
  if (a.subject === "hardware") return a.kind === "photo" ? 0 : 1;
  if (a.subject === "panel") return 2;
  if (a.subject === "context") return 3;
  if (a.subject === "detail") return 4;
  return 5; // bundle
};

const pool = (p: ProductKey): Asset[] =>
  ASSETS.filter((a) => a.product === p).slice().sort((x, y) => rank(x) - rank(y) || x.slug.localeCompare(y.slug));

/**
 * PINNED SHOTS — the edit decisions, stated rather than derived.
 *
 * A rule can distribute images fairly; it cannot know that "Four microphone
 * preamps" has exactly one right picture. These are matched on a distinctive
 * caption fragment and pulled out of the pool before anything else is placed.
 */
const PINS: { seg: SegmentId; find: string; slug: string; why: string }[] = [
  // ── M2: portable, bus-powered, two in ──────────────────────────────────
  { seg: "m2", find: "Start with the M2", slug: "motu-m2-8-jpg",
    why: "the clean studio shot — the section opens on the product itself" },
  { seg: "m2", find: "Two combo inputs", slug: "motu-m2-2-png",
    why: "front panel plan — the two combo inputs being counted" },
  { seg: "m2", find: "runs entirely off the USB-C", slug: "motu-m2-9-png",
    why: "rear panel plan — the USB-C socket the power claim rests on" },
  { seg: "m2", find: "The whole studio fits in a bag", slug: "motu-m2-6-jpg",
    why: "the unit in a real room — the payoff line needs a place, not a spec" },

  // ── M4: line inputs at the back, Mix knob at the front ──────────────────
  { seg: "m4", find: "adds two line inputs", slug: "motu-m4-2-png",
    why: "rear panel plan — the added line inputs are the sentence" },
  { seg: "m4", find: "Mix knob at the front", slug: "motu-m4-1-png",
    why: "front panel plan — the Mix knob among the controls" },
  { seg: "m4", find: "Two mics stay patched", slug: "motu-m4-2-jpg",
    why: "a microphone actually patched in, on location" },
  { seg: "m4", find: "synth records through the rear", slug: "motu-m4-6-jpg",
    why: "hands on a keyboard — the rear inputs doing the thing described" },

  // ── M6: four preamps at the rear, two headphones, A/B ──────────────────
  //
  // The README and the supplied photography both put the M6's four combo
  // preamps on the REAR panel, so the line about four preamps takes the rear
  // plan and the line about four gain controls takes the front. Swapping those
  // two — which the first cut did — puts the wrong panel under both sentences.
  { seg: "m6", find: "Four microphone preamps", slug: "motu-m6-2-png",
    why: "rear panel plan — where the four combo preamps actually are" },
  { seg: "m6", find: "Four gain controls", slug: "motu-m6-1-png",
    why: "front panel plan — four gain controls and four phantom switches in a row" },
  { seg: "m6", find: "A-B switch", slug: "motu-m6-1-jpg",
    why: "the A/B button and the monitor selector, in close-up — the control itself" },
  { seg: "m6", find: "A drum kit", slug: "motu-m6-4-jpg",
    why: "a miked drum kit — the example, shown rather than described" },
  { seg: "m6", find: "in one pass", slug: "motu-m6-5-jpg",
    why: "a multi-position podcast table — the four-person panel, set up" },
];

export const buildShots = (): { shots: Shot[]; total: number } => {
  const { segments, total } = buildTimeline();
  const shots: Shot[] = [];
  let seed = 1;

  // ── The lineup ───────────────────────────────────────────────────────────
  //
  // The hook, the engine section and the close all show the three products
  // together, and the hook's whole argument is that they LOOK THE SAME. That
  // only works if the three images are directly comparable, so the lineup is
  // stated by hand rather than picked by a rule: two studio shots on white and
  // the M6's front-panel plan, which is also on white. Choosing "the highest
  // ranked hardware photo" instead — which is what the first cut did — gave a
  // desk photograph, a room photograph and a crop of a meter, three pictures
  // with nothing in common, and the comparison the script is making simply did
  // not read.
  //
  // These are covered properly inside their own product segments, so they are
  // marked as reprises and do not consume coverage here.
  const LINEUP = ["motu-m2-8-jpg", "motu-m4-4-jpg", "motu-m6-1-png"];
  const trio = LINEUP.map((slug) => ASSETS.find((a) => a.slug === slug)).filter(Boolean) as Asset[];

  for (const seg of segments as TimedSegment[]) {
    const groups: TimedCaption[][] = [];
    const per = GROUP[seg.id];
    for (let i = 0; i < seg.captions.length; i += per) groups.push(seg.captions.slice(i, i + per));
    const n = groups.length;

    // Resolve this segment's pins to the group each lands in.
    const segPins = PINS.filter((x) => x.seg === seg.id);
    const pinnedAt = new Map<number, Asset>();
    const pinnedSlugs = new Set<string>();
    for (const pin of segPins) {
      const gi = groups.findIndex((g) => g.some((c) => c.t.includes(pin.find)));
      const asset = ASSETS.find((a) => a.slug === pin.slug || a.file === pin.slug);
      if (gi < 0 || !asset) {
        console.warn(`[shots] unresolved pin: ${seg.id} "${pin.find}" -> ${pin.slug}`);
        continue;
      }
      if (!pinnedAt.has(gi)) { pinnedAt.set(gi, asset); pinnedSlugs.add(asset.slug); }
    }

    const isShared = POOL[seg.id] === "shared";
    const queue = isShared ? [] : pool(POOL[seg.id]).filter((a) => !pinnedSlugs.has(a.slug));

    /** How long group `k` holds the frame. */
    const span = (k: number) =>
      (k === n - 1 ? seg.end : groups[k + 1][0].start) - groups[k][0].start;

    groups.forEach((caps, gi) => {
      const start = caps[0].start;
      const end = gi === n - 1 ? seg.end : groups[gi + 1][0].start;
      const pinned = pinnedAt.get(gi);

      let assets: Asset[];
      let kind: ShotKind;

      if (pinned) {
        assets = [pinned];
        kind = pinned.kind === "panel" ? "panel" : "bleed";
      } else if (isShared) {
        // Alternate: the trio mosaic states the "three interfaces, one engine"
        // claim; a single product bleed between them gives the eye a rest and
        // stops the section reading as one long held graphic.
        if (gi % 2 === 0) {
          assets = trio;
          kind = "mosaic";
        } else {
          const k = (["pm2", "pm4", "pm6"] as ProductKey[])[Math.floor(gi / 2) % 3];
          const p = pool(k).filter((a) => a.subject === "hardware" && a.kind === "photo");
          assets = [p[(gi * 3) % Math.max(1, p.length)] ?? pool(k)[0]];
          kind = assets[0].kind === "panel" ? "panel" : "bleed";
        }
      } else {
        // Spread what is left over the shots that are left, weighted by how
        // long each of those shots is actually on screen.
        //
        // An even split is not good enough here. The pinned shots are not
        // evenly distributed, so the free shots that remain can be a 3.5 s hold
        // and a 1.1 s flash — and an even split hands both of them three
        // images, which is a comfortable board in one and an unreadable blink
        // in the other. Weighting by duration puts the images where there is
        // time to look at them.
        const freeIdx: number[] = [];
        for (let k = gi; k < n; k++) if (!pinnedAt.has(k)) freeIdx.push(k);
        const ahead = freeIdx.reduce((sum, k) => sum + span(k), 0);
        const share = ahead > 0 ? span(gi) / ahead : 1;
        const take = Math.max(1, Math.round(queue.length * share));
        assets = queue.splice(0, take);
        if (assets.length === 0) { assets = [pool(POOL[seg.id])[0]]; kind = "bleed"; }
        else if (assets.length === 1) kind = assets[0].kind === "panel" ? "panel" : "bleed";
        else if (assets.length === 2) kind = "split";
        else kind = "mosaic";
      }

      shots.push({
        segment: seg.id, product: POOL[seg.id], env: seg.env, kind,
        start, end, assets, captions: caps, seed: seed++,
        reprise: isShared || undefined,
      });
    });

    // Anything the distribution did not place joins the segment's last
    // multi-image shot rather than being dropped.
    if (queue.length) {
      const segShots = [...shots].reverse().filter((s) => s.segment === seg.id);
      const host = segShots.find((s) => s.kind === "mosaic" || s.kind === "split") ?? segShots[0];
      if (host) {
        host.assets.push(...queue);
        host.kind = host.assets.length > 2 ? "mosaic" : "split";
      }
    }
  }

  return { shots, total };
};
