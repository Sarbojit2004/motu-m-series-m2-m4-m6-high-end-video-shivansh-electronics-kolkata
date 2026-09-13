import React from "react";
import { Img, interpolate, random, staticFile } from "remotion";
import { ACCENT, FONT, GROUND, VIDEO, type ProductKey } from "../theme.ts";
import type { Asset } from "../assets.ts";

// ─────────────────────────────────────────────────────────────────────────────
// FULL-BLEED STAGING WITH CAMERA MOVE
//
// The AVB explainer composed inside a band with ground showing around it. Here
// the picture fills all 2160 x 3840 and runs off every edge, so the staging
// problem changes completely: there is no ground to place an object on, and
// every shot is a camera looking at a subject rather than an object sitting in
// a room.
//
// THE MOVE IS THE POINT. A still photograph bled to a 4K frame and held for
// four seconds is dead on screen. Every shot therefore carries a real camera
// move — a push, a pull, a lateral track, a slow orbit — eased rather than
// linear, so it reads as a dolly on a slider rather than a CSS transition.
//
// HOW THE MOVE AVOIDS CROPPING THE SUBJECT. The plate is oversized past the
// frame by `bleed` BEFORE any move is applied, and the move travels inside that
// overscan. So the visible 2160 x 3840 window is always filled, the subject
// never slides out of frame, and no edge is ever exposed.
// ─────────────────────────────────────────────────────────────────────────────

export type MoveKind = "push" | "pull" | "trackLeft" | "trackRight" | "tiltUp" | "tiltDown" | "orbit";

const MOVES: MoveKind[] = ["push", "pull", "trackLeft", "trackRight", "tiltUp", "tiltDown", "orbit"];

/** Deterministically varies the move per shot so no two neighbours repeat. */
export const moveFor = (seed: number): MoveKind => MOVES[seed % MOVES.length];

/** Ease-in-out — a dolly accelerates and settles, it does not start at speed. */
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

type Camera = { scale: number; x: number; y: number; rot: number };

/**
 * Solves the camera for a move at progress p.
 *
 * `bleed` is the overscan the plate already carries. Travel is expressed as a
 * fraction of that overscan so a move can never expose an edge: at the extreme
 * of any move the plate still covers the frame.
 */
export const cameraFor = (kind: MoveKind, p: number, bleed: number): Camera => {
  const e = ease(Math.min(1, Math.max(0, p)));
  // Room available to travel, in px, before an edge would show.
  const roomX = (VIDEO.width * (bleed - 1)) / 2;
  const roomY = (VIDEO.height * (bleed - 1)) / 2;
  const t = (a: number, b: number) => interpolate(e, [0, 1], [a, b]);

  switch (kind) {
    case "push":
      return { scale: t(1, 1.10), x: 0, y: t(roomY * 0.10, -roomY * 0.10), rot: 0 };
    case "pull":
      return { scale: t(1.12, 1.0), x: 0, y: t(-roomY * 0.10, roomY * 0.08), rot: 0 };
    case "trackLeft":
      return { scale: 1.05, x: t(roomX * 0.72, -roomX * 0.72), y: 0, rot: 0 };
    case "trackRight":
      return { scale: 1.05, x: t(-roomX * 0.72, roomX * 0.72), y: 0, rot: 0 };
    case "tiltUp":
      return { scale: 1.06, x: 0, y: t(roomY * 0.70, -roomY * 0.70), rot: 0 };
    case "tiltDown":
      return { scale: 1.06, x: 0, y: t(-roomY * 0.70, roomY * 0.70), rot: 0 };
    case "orbit":
    default:
      return { scale: t(1.02, 1.12), x: t(roomX * 0.30, -roomX * 0.30), y: t(-roomY * 0.14, roomY * 0.10), rot: t(-0.9, 0.9) };
  }
};

/**
 * The camera solved for a plate that is wider than the frame but not taller.
 *
 * `cameraFor` above assumes the subject covers the frame in both axes and
 * bounds every move by the overscan. This one is for the full-bleed shot, where
 * the photograph occupies a band: lateral travel is still bounded by the side
 * room, but vertical travel is free, because there is a wash behind it rather
 * than an edge waiting to be exposed.
 */
export const plateCamera = (kind: MoveKind, p: number, roomX: number): Camera => {
  const e = ease(Math.min(1, Math.max(0, p)));
  const t = (a: number, b: number) => interpolate(e, [0, 1], [a, b]);
  const dy = VIDEO.height * 0.035;

  switch (kind) {
    case "push":
      return { scale: t(1.0, 1.09), x: 0, y: t(dy * 0.5, -dy * 0.5), rot: 0 };
    case "pull":
      return { scale: t(1.10, 1.0), x: 0, y: t(-dy * 0.5, dy * 0.4), rot: 0 };
    case "trackLeft":
      return { scale: 1.04, x: t(roomX * 0.92, -roomX * 0.92), y: 0, rot: 0 };
    case "trackRight":
      return { scale: 1.04, x: t(-roomX * 0.92, roomX * 0.92), y: 0, rot: 0 };
    case "tiltUp":
      return { scale: 1.05, x: 0, y: t(dy * 1.5, -dy * 1.5), rot: 0 };
    case "tiltDown":
      return { scale: 1.05, x: 0, y: t(-dy * 1.5, dy * 1.5), rot: 0 };
    case "orbit":
    default:
      return { scale: t(1.01, 1.10), x: t(roomX * 0.55, -roomX * 0.55), y: t(-dy * 0.6, dy * 0.5), rot: t(-0.8, 0.8) };
  }
};

type Props = {
  asset: Asset;
  env: "light" | "dark";
  product: ProductKey;
  /** 0..1 through the shot. */
  p: number;
  /** frames since the shot began. */
  f: number;
  seed: number;
  move?: MoveKind;
};

const src = (a: Asset) => staticFile(`images/${a.file}`);

/**
 * One photograph filling the whole frame, under a moving camera.
 *
 * The grade on top is doing real work, not decoration: the supplied product
 * photography is shot on white and on grey seamless, and bled to a full 9:16
 * frame that reads as a blown-out rectangle. A vignette plus a top-and-bottom
 * falloff pulls the corners down so the unit sits in a lit space, and gives the
 * caption lockup somewhere with tonal room to live.
 */
export const BleedShot: React.FC<Props> = ({ asset, env, product, p, f, seed, move }) => {
  const accent = ACCENT[product];
  const kind = move ?? moveFor(seed);

  // ── the plate ────────────────────────────────────────────────────────────
  //
  // The photograph is shown COMPLETE, at its own aspect ratio, slightly wider
  // than the frame so it runs off both side edges. It is not cropped.
  //
  // The first cut did the obvious thing — one Img at objectFit: cover filling
  // 2160 x 3840 — and it was wrong in a way that only shows up on this
  // material. Covering a 0.5625:1 frame with a 1.65:1 photograph scales it by
  // HEIGHT, which makes it three times the frame width, so two thirds of every
  // product shot was outside the frame. What was left on screen, repeatedly,
  // was a crop of a level meter: the M2 section's opening shot contained no
  // visible M2.
  //
  // So the photograph gets the middle band at full width and the rest of the
  // frame is a wash derived from the image itself. Nothing is letterboxed,
  // nothing is cropped, the screen is filled edge to edge, and the two thirds
  // of the frame the caption and the spec block already occupy are exactly the
  // parts the photograph was never going to use.
  const overhang = 1.14;
  const plateW = VIDEO.width * overhang;
  const plateH = plateW / asset.ar;
  const roomX = (plateW - VIDEO.width) / 2;

  const cam = plateCamera(kind, p, roomX);
  const breath = Math.sin((f + seed * 31) / 150) * 7;

  // The wash moves a fraction of what the plate moves. That difference is the
  // whole reason this reads as a camera in a space rather than a picture on a
  // slide: near things travel further than far ones.
  const washScale = 1.24 + (cam.scale - 1) * 0.35;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: env === "light" ? GROUND.lightSink : GROUND.darkSink }}>
      {/* the wash — the image's own colour, pushed back */}
      <Img
        src={staticFile(`images/${asset.bg}`)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${cam.x * 0.28}px, ${cam.y * 0.28}px) scale(${washScale})`,
          filter: env === "dark"
            ? "brightness(0.26) saturate(0.55) contrast(1.05)"
            : "brightness(0.40) saturate(0.5) contrast(1.02)",
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 76% 42% at 50% 46%, ${accent.glow}12 0%, rgba(0,0,0,0) 72%)`,
        }}
      />

      {/* the photograph, complete */}
      <div
        style={{
          position: "absolute",
          left: (VIDEO.width - plateW) / 2,
          top: VIDEO.height * 0.46 - plateH / 2,
          width: plateW,
          height: plateH,
          transform: `translate(${cam.x}px, ${cam.y + breath}px) scale(${cam.scale}) rotate(${cam.rot}deg)`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        <Img
          src={src(asset)}
          style={{
            width: "100%",
            height: "100%",
            // The box already carries the image's exact aspect ratio, so cover
            // and contain are the same thing here — and neither crops.
            objectFit: "cover",
            filter: env === "dark" ? "brightness(0.98) contrast(1.06) saturate(1.05)" : "contrast(1.05) saturate(1.03)",
          }}
        />
      </div>

      {/* Grade: corner falloff, then a tonal floor under the caption band. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 86% 64% at 50% 44%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 64%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            env === "dark"
              ? "linear-gradient(180deg, rgba(6,6,9,0.62) 0%, rgba(6,6,9,0.14) 24%, rgba(6,6,9,0.18) 56%, rgba(6,6,9,0.80) 100%)"
              : "linear-gradient(180deg, rgba(6,6,9,0.68) 0%, rgba(6,6,9,0.12) 24%, rgba(6,6,9,0.18) 56%, rgba(6,6,9,0.80) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 40% at 50% 78%, ${accent.glow}1A 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
    </div>
  );
};

/**
 * A transparent ultra-wide panel plan, shown full width.
 *
 * These are the front and rear panel drawings — aspect ratios between 3.2 and
 * 4.5. Bleeding one to a 9:16 frame would crop it to a sliver and destroy the
 * only thing it is for: reading the whole connector row end to end. So it is
 * laid across the frame at full width on a lit ground, and the camera tracks
 * along it rather than into it.
 */
export const PanelBleed: React.FC<Props> = ({ asset, product, p, f, seed }) => {
  const accent = ACCENT[product];
  // Solve the size from the plan's own aspect ratio rather than fixing a scale.
  //
  // These plans run from 3.26:1 to 4.41:1, and a single multiplier gives the
  // widest of them a strip 870 px tall in a 3,840 px frame — a sliver floating
  // in a mostly empty rectangle. Targeting a HEIGHT instead makes every plan
  // occupy the same band whatever its ratio, and the wider ones simply get more
  // lateral travel, which is the move this staging is built around anyway.
  const h = VIDEO.height * 0.30;
  const w = Math.max(h * asset.ar, VIDEO.width * 1.25);
  const room = (w - VIDEO.width) / 2;
  const dir = seed % 2 === 0 ? 1 : -1;
  const x = interpolate(ease(p), [0, 1], [room * 0.82 * dir, -room * 0.82 * dir]);
  const lift = Math.sin(f / 120) * 10;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* A lit studio void behind the plan — the panel has no ground of its own.
          ALWAYS DARK, whatever the segment's environment. These plans are pale
          artwork of a black chassis, and on the light ground the segment would
          otherwise call for they sit on near-white — which is fine for the plan
          itself and fatal for the overlay, because the spec block above it is
          white type. A light-environment panel shot put an unreadable input
          ladder on screen for three full seconds in the first cut. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 78% 46% at 50% 46%, ${accent.key}2E 0%, #0E0E13 52%, #060608 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (VIDEO.width - w) / 2 + x,
          top: VIDEO.height * 0.44 - h / 2 + lift,
          width: w,
          height: h,
          // brightness/contrast are per-pixel and effectively free; a
          // drop-shadow would be another full-surface convolution on a
          // 3,499 px-wide plate, so the plan's lift off the ground is painted
          // by the radial gradient behind it instead.
          filter: "brightness(1.2) contrast(1.06)",
          willChange: "transform",
        }}
      >
        <Img src={src(asset)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,6,9,0.5) 0%, rgba(6,6,9,0) 30%, rgba(6,6,9,0.28) 60%, rgba(6,6,9,0.8) 100%)",
        }}
      />
    </div>
  );
};

/**
 * Two photographs splitting the frame on a diagonal, each with its own drift.
 *
 * Used where a sentence compares two things — front and back, two rooms, two
 * configurations. The diagonal rather than a straight horizontal split is the
 * reference video's angled-motion signature applied to layout.
 */
export const SplitBleed: React.FC<Props & { second: Asset }> = ({
  asset, second, env, product, p, f, seed,
}) => {
  const accent = ACCENT[product];
  const e = ease(p);
  const slide = interpolate(e, [0, 1], [0, 1]);

  const half = (a: Asset, i: number) => {
    const dx = (i === 0 ? -1 : 1) * interpolate(slide, [0, 1], [26, -26]);
    const sc = interpolate(slide, [0, 1], i === 0 ? [1.08, 1.02] : [1.02, 1.08]);
    return (
      <div
        key={a.slug}
        style={{
          position: "absolute",
          inset: 0,
          clipPath:
            i === 0
              ? "polygon(0 0, 100% 0, 0 100%)"
              : "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-6%",
            transform: `translateX(${dx}px) scale(${sc})`,
            willChange: "transform",
          }}
        >
          <Img
            src={src(a)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              filter: env === "dark" ? "brightness(0.9) contrast(1.1)" : "contrast(1.07)",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: env === "light" ? GROUND.light : GROUND.dark }}>
      {half(asset, 0)}
      {half(second, 1)}
      {/* The seam, lit in the product's accent — the split reads as deliberate.
          The glow is a gradient band rather than a box-shadow. A 46 px shadow
          blur on a 3,456 px-wide rotated element is a convolution the length of
          the frame diagonal, and it measured as the single most expensive thing
          in this reel: split shots were costing roughly nine times a panel shot
          until it came out. A three-stop gradient behind the line is visually
          indistinguishable and free. */}
      <div
        style={{
          position: "absolute",
          left: -VIDEO.width * 0.55,
          top: VIDEO.height * 0.5 - 46,
          width: VIDEO.width * 2.1,
          height: 92,
          // NEGATIVE. The clip paths split the frame on the diagonal from the
          // top-right corner to the bottom-left one, which rises to the right;
          // in CSS a positive rotation falls to the right. The first cut used
          // the positive angle and the seam crossed the picture at a different
          // slope from the actual join, which read as a scratch on the frame
          // rather than as an edge. The width is 2.1x the frame because the
          // diagonal of a 9:16 rectangle is longer than its width — at 1.6x the
          // line stopped short of both corners.
          transform: `rotate(${(-Math.atan2(VIDEO.height, VIDEO.width) * 180) / Math.PI}deg)`,
          transformOrigin: "50% 50%",
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(180deg, ${accent.glow}00 0%, ${accent.glow}3D 38%, ${accent.glow}5C 50%, ${accent.glow}3D 62%, ${accent.glow}00 100%)`,
        }}
      >
        <div style={{ width: "100%", height: 8, background: accent.glow, opacity: 0.92 }} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,6,9,0.66) 0%, rgba(6,6,9,0.08) 28%, rgba(6,6,9,0.26) 60%, rgba(6,6,9,0.82) 100%)",
        }}
      />
    </div>
  );
};

/**
 * Three or more photographs as a moving mosaic that fills the frame.
 *
 * The coverage tier. Ninety seconds has to carry thirty images, and a mosaic
 * that drifts as one plane shows four of them at a legible size in the time a
 * single hero would take — without ever becoming a burst of cuts.
 */
export const MosaicBleed: React.FC<Props & { assets: Asset[]; lineup?: boolean }> = ({
  assets, env, product, p, f, seed, lineup,
}) => {
  const accent = ACCENT[product];
  const n = Math.min(assets.length, 6);
  const list = assets.slice(0, n);
  // ONE COLUMN UP TO THREE. A 9:16 frame split into three full-width rows gives
  // each cell an aspect of about 1.69, and the supplied photography is 1.65 —
  // so the images land almost exactly, with barely any crop. The obvious 2x2
  // grid does the opposite: it crops every landscape photograph hard, and for
  // three images it leaves a visibly empty quarter of the frame, which is what
  // the first cut of this reel actually looked like.
  const cols = n <= 3 ? 1 : 2;
  const rows = Math.ceil(n / cols);
  const e = ease(p);
  // The whole plane drifts and pushes as one — a camera over a table, not
  // six independent animations. Kept small on purpose: the cells already have
  // almost exactly the source photographs' aspect ratio, so every extra
  // percent of zoom is a percent of the product cropped off for nothing.
  const planeScale = interpolate(e, [0, 1], [1.045, 1.0]);
  const planeX = interpolate(e, [0, 1], [-18, 18]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: env === "light" ? GROUND.lightSink : GROUND.darkSink }}>
      <div
        style={{
          position: "absolute",
          inset: "-2.5%",
          transform: `translateX(${planeX}px) scale(${planeScale})`,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: 10,
          willChange: "transform",
        }}
      >
        {list.map((a, i) => {
          const r = random(`${seed}-${i}`);
          const zoom = 1.0 + r * 0.03;
          const drift = Math.sin((f + i * 37) / 110) * 8;
          const acc = ACCENT[a.product];
          return (
            <div key={a.slug} style={{ position: "relative", overflow: "hidden" }}>
              <Img
                src={src(a)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: a.ar > 3.0 ? "contain" : "cover",
                  // A transparent plan dropped into a mosaic beside two photographs shot
                  // on white needs the same ground they have, or the lineup reads as
                  // two products and a hole.
                  background: a.alpha ? GROUND.lightSink : "transparent",
                  transform: `translateY(${drift}px) scale(${zoom})`,
                  // Graded down hard. The lineup is three studio shots on
                  // white, and three white cells stacked fill a 4K frame with a
                  // pale grey wall that 64%-opacity type cannot hold against.
                  filter: env === "dark" ? "brightness(0.74) contrast(1.14)" : "brightness(0.80) contrast(1.10)",
                  willChange: "transform",
                }}
              />
              {/* THE LINEUP IS A COMPARISON, so it is labelled.
                  The hook's whole argument is that the three products look the
                  same — which means three unlabelled photographs of them stacked
                  up read as one photograph repeated by mistake. An accent rule
                  and the model name turn the repetition into the point. */}
              {lineup ? (
                <>
                  <div
                    style={{
                      position: "absolute",
                      left: 110,
                      top: 0,
                      bottom: 0,
                      width: 14,
                      background: acc.glow,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      // Inside the frame, not inside the cell: the whole plane
                      // is inset past the edges so it can drift, so a label
                      // measured from the cell would sit half off-screen.
                      left: 170,
                      top: 66,
                      fontFamily: FONT.display,
                      fontSize: 92,
                      letterSpacing: 7,
                      color: acc.glow,
                      textShadow: "0 6px 14px rgba(0,0,0,0.94), 0 0 8px rgba(0,0,0,0.85)",
                    }}
                  >
                    {acc.short}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 76% 54% at 50% 44%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.36) 70%, rgba(0,0,0,0.66) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(6,6,9,0.55) 0%, rgba(6,6,9,0.08) 26%, rgba(6,6,9,0.26) 58%, rgba(6,6,9,0.8) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 70% 38% at 50% 80%, ${accent.glow}18 0%, rgba(0,0,0,0) 70%)`,
        }}
      />
    </div>
  );
};
