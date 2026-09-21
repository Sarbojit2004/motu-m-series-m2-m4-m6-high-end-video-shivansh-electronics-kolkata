import React from "react";
import { Img, OffthreadVideo, interpolate, random, staticFile, useVideoConfig } from "remotion";
import { ACCENT, GROUND, formatFor, type AccentKey } from "../theme.ts";
import type { Asset, Clip, Region } from "../assets.ts";

// ─────────────────────────────────────────────────────────────────────────────
// STAGING
//
// Every shot in both films is a camera looking at a subject, never a picture
// sitting on a slide. A still bled to a 4K frame and held for four seconds is
// dead on screen, so each one carries a real move — a push, a pull, a lateral
// track, a slow orbit — eased rather than linear, so it reads as a dolly on a
// slider rather than as a CSS transition.
//
// THE ONE RULE EVERY STAGING BELOW OBEYS: a picture is shown COMPLETE. The
// plate carries the image's own aspect ratio and the move travels inside
// overscan that was added before the move was applied, so a subject can never
// slide out of frame, an edge can never be exposed, and nothing is ever
// stretched, squeezed or cut in half.
//
// WHAT WAS REMOVED SINCE THE M-SERIES REEL, and why:
//
//   The diagonal SPLIT. That staging clipped two photographs to opposing
//   triangles so they met on a diagonal seam. On paper it was a comparison
//   layout; in practice each photograph was first cropped to a 9:16 sliver by
//   objectFit: cover and then had half of that sliver clipped away, so NEITHER
//   subject was ever fully visible and both read as damaged. It is replaced by
//   StackBleed, which shows two complete plates — stacked in the vertical film,
//   side by side in the landscape one — with nothing clipped and nothing cut.
//   No picture in either film is ever sliced.
//
// WHAT WAS ADDED: DetailZoom. The top-down plans are 4096 px wide, so a crop of
// a single row of knobs is still sharper than the frame it lands in. That is
// what lets a shot push into the actual control the narration is naming — the
// gain row while the voice says "six to sixty-five", the magenta compressor row
// while it says "on every one of them" — instead of showing a whole desk and
// hoping the viewer finds it.
// ─────────────────────────────────────────────────────────────────────────────

export type MoveKind = "push" | "pull" | "trackLeft" | "trackRight" | "tiltUp" | "tiltDown" | "orbit";

const MOVES: MoveKind[] = ["push", "pull", "trackLeft", "trackRight", "tiltUp", "tiltDown", "orbit"];

/** Deterministically varies the move per shot so no two neighbours repeat. */
export const moveFor = (seed: number): MoveKind => MOVES[seed % MOVES.length];

/** Ease-in-out — a dolly accelerates and settles, it does not start at speed. */
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

export type Camera = { scale: number; x: number; y: number; rot: number };

/**
 * The camera for a plate that covers the frame in both axes.
 *
 * Travel is expressed as a fraction of the overscan the plate already carries,
 * so at the extreme of any move the plate still covers the frame.
 */
export const fullCamera = (kind: MoveKind, p: number, roomX: number, roomY: number): Camera => {
  const e = ease(clamp01(p));
  const t = (a: number, b: number) => interpolate(e, [0, 1], [a, b]);
  switch (kind) {
    case "push":       return { scale: t(1, 1.10),    x: 0,                              y: t(roomY * 0.10, -roomY * 0.10), rot: 0 };
    case "pull":       return { scale: t(1.12, 1.0),  x: 0,                              y: t(-roomY * 0.10, roomY * 0.08), rot: 0 };
    case "trackLeft":  return { scale: 1.05,          x: t(roomX * 0.72, -roomX * 0.72), y: 0,                              rot: 0 };
    case "trackRight": return { scale: 1.05,          x: t(-roomX * 0.72, roomX * 0.72), y: 0,                              rot: 0 };
    case "tiltUp":     return { scale: 1.06,          x: 0,                              y: t(roomY * 0.70, -roomY * 0.70), rot: 0 };
    case "tiltDown":   return { scale: 1.06,          x: 0,                              y: t(-roomY * 0.70, roomY * 0.70), rot: 0 };
    case "orbit":
    default:           return { scale: t(1.02, 1.12), x: t(roomX * 0.30, -roomX * 0.30), y: t(-roomY * 0.14, roomY * 0.10), rot: t(-0.9, 0.9) };
  }
};

/**
 * The camera for a plate that is wider than the frame but not as tall.
 *
 * Lateral travel is still bounded by the side room, but vertical travel is
 * free: behind this plate there is a wash or a lit void, not an edge waiting
 * to be exposed.
 */
export const plateCamera = (kind: MoveKind, p: number, roomX: number, dy: number): Camera => {
  const e = ease(clamp01(p));
  const t = (a: number, b: number) => interpolate(e, [0, 1], [a, b]);
  switch (kind) {
    case "push":       return { scale: t(1.0, 1.09),  x: 0,                              y: t(dy * 0.5, -dy * 0.5), rot: 0 };
    case "pull":       return { scale: t(1.10, 1.0),  x: 0,                              y: t(-dy * 0.5, dy * 0.4), rot: 0 };
    case "trackLeft":  return { scale: 1.04,          x: t(roomX * 0.92, -roomX * 0.92), y: 0,                      rot: 0 };
    case "trackRight": return { scale: 1.04,          x: t(-roomX * 0.92, roomX * 0.92), y: 0,                      rot: 0 };
    case "tiltUp":     return { scale: 1.05,          x: 0,                              y: t(dy * 1.5, -dy * 1.5), rot: 0 };
    case "tiltDown":   return { scale: 1.05,          x: 0,                              y: t(-dy * 1.5, dy * 1.5), rot: 0 };
    case "orbit":
    default:           return { scale: t(1.01, 1.10), x: t(roomX * 0.55, -roomX * 0.55), y: t(-dy * 0.6, dy * 0.5), rot: t(-0.8, 0.8) };
  }
};

const url = (a: Asset) => staticFile(a.file);

type Base = {
  accent: AccentKey;
  /** 0..1 through the shot. */
  p: number;
  /** Frames since the shot began. */
  f: number;
  seed: number;
  move?: MoveKind;
};

// ── shared furniture ─────────────────────────────────────────────────────────

/** The corner falloff and tonal floor every staging finishes with. */
const Grade: React.FC<{ glow: string; portrait: boolean }> = ({ glow, portrait }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(ellipse 86% 64% at 50% 44%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.14) 64%, rgba(0,0,0,0.44) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: portrait
          ? "linear-gradient(180deg, rgba(5,6,8,0.62) 0%, rgba(5,6,8,0.12) 24%, rgba(5,6,8,0.18) 56%, rgba(5,6,8,0.82) 100%)"
          : "linear-gradient(180deg, rgba(5,6,8,0.52) 0%, rgba(5,6,8,0.06) 26%, rgba(5,6,8,0.22) 58%, rgba(5,6,8,0.80) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 70% 40% at 50% ${portrait ? 78 : 82}%, ${glow}1A 0%, rgba(0,0,0,0) 70%)`,
      }}
    />
  </>
);

/**
 * The lit studio void the transparent renders and the plans sit in.
 *
 * These files have no background of their own — dropping one on the frame's
 * ground would put a console in a flat rectangle. A void with a warm pool
 * behind the subject and a darker floor beneath it gives the desk somewhere to
 * be, and gives 64%-opacity type somewhere with tonal room to live.
 */
const Void: React.FC<{ key1: string; glow: string }> = ({ key1, glow }) => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 82% 48% at 50% 42%, ${key1}3A 0%, #101218 46%, #06070A 100%)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 54% 22% at 50% 44%, ${glow}1F 0%, rgba(0,0,0,0) 72%)`,
      }}
    />
  </>
);

/**
 * Places a picture by its CONTENT rather than by its canvas.
 *
 * The product renders are 4096 px canvases in which the console occupies the
 * middle 80% and the rest is transparent padding. Positioning by the canvas
 * therefore puts a small desk in a large empty rectangle, and the padding
 * differs from file to file, so consecutive shots would jump. This solves the
 * full image's box such that the opaque content ends up the requested width,
 * centred where it was asked for.
 */
const placeByContent = (a: Asset, contentW: number, cx: number, cy: number) => {
  const [x0, y0, x1, y1] = a.bbox as number[];
  const fullW = contentW / Math.max(1e-6, x1 - x0);
  const fullH = (fullW * a.h) / a.w;
  return {
    left: cx - ((x0 + x1) / 2) * fullW,
    top: cy - ((y0 + y1) / 2) * fullH,
    width: fullW,
    height: fullH,
  };
};

/**
 * An image sized so its opaque CONTENT fills the box, not its canvas.
 *
 * objectFit: contain fits the CANVAS, and these renders are canvases in which
 * the desk occupies between 38% and 90% of the width depending on the file. A
 * lineup laid out with contain therefore shows four desks at four different
 * sizes, none of them filling its cell — which is what the first cut of both
 * the stack and the mosaic looked like.
 */
const ContentFit: React.FC<{ asset: Asset; w: number; h: number; style?: React.CSSProperties }> = ({
  asset, w, h, style,
}) => {
  if (!asset.transparent) {
    return <Img src={url(asset)} style={{ width: w, height: h, objectFit: "cover", ...style }} />;
  }
  const contentW = Math.min(w, h * asset.ar);
  const box = placeByContent(asset, contentW, w / 2, h / 2);
  return (
    <div style={{ position: "absolute", inset: 0, width: w, height: h, overflow: "hidden" }}>
      <Img src={url(asset)} style={{ position: "absolute", ...box, objectFit: "fill", ...style }} />
    </div>
  );
};

// ── 1. the transparent product render ────────────────────────────────────────

/**
 * One console, complete, floating in a lit void with a floor reflection.
 *
 * The reflection is a second copy flipped in Y under a gradient that fades it
 * out, not a filter: a drop-shadow or a blur on a 2,500 px-wide plate is a
 * full-surface convolution on every frame, and it is the single most expensive
 * thing a staging like this can do.
 */
export const ProductPlate: React.FC<Base & { asset: Asset }> = ({ asset, accent, p, f, seed, move }) => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const acc = ACCENT[accent];
  const kind = move ?? moveFor(seed);

  // A wide desk gets less of the frame than a compact one, so the SUBJECT ends
  // up roughly the same size on screen whichever model is on.
  const fill = fmt.portrait ? 1.04 : 0.86;
  const contentW = W * fill * Math.min(1, 2.1 / Math.max(1.2, asset.ar));
  const cy = H * (fmt.portrait ? 0.45 : 0.47);
  const box = placeByContent(asset, contentW, W / 2, cy);
  const roomX = Math.max(60, (box.width - W) / 2 + W * 0.06);
  const cam = plateCamera(kind, p, roomX, H * 0.03);
  const breath = Math.sin((f + seed * 31) / 150) * (H / 520);

  const reflectH = box.height * 0.42;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
      <Void key1={acc.key} glow={acc.glow} />

      <div
        style={{
          position: "absolute",
          ...box,
          transform: `translate(${cam.x}px, ${cam.y + breath}px) scale(${cam.scale}) rotate(${cam.rot}deg)`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        {/* the reflection, under the desk */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: box.height,
            width: box.width,
            height: reflectH,
            overflow: "hidden",
            opacity: 0.3,
          }}
        >
          <Img
            src={url(asset)}
            style={{
              position: "absolute",
              left: 0,
              top: -box.height + reflectH,
              width: box.width,
              height: box.height,
              transform: "scaleY(-1)",
              transformOrigin: "50% 50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(8,9,12,0.45) 0%, rgba(8,9,12,0.92) 46%, #06070A 100%)",
            }}
          />
        </div>

        <Img
          src={url(asset)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "contrast(1.05) saturate(1.04) brightness(1.02)",
          }}
        />
      </div>

      <Grade glow={acc.glow} portrait={fmt.portrait} />
    </div>
  );
};

// ── 2. the opaque photograph ─────────────────────────────────────────────────

/**
 * One photograph filling the frame, under a moving camera.
 *
 * In the landscape film the picture is 16:9 like the frame, so it is simply
 * bled with overscan for the move to travel in. In the vertical film a 16:9
 * photograph cannot fill a 9:16 frame without throwing two thirds of it away —
 * covering a 0.5625:1 frame with a 1.78:1 picture scales it by HEIGHT — so the
 * complete photograph takes a band across the middle and the rest of the frame
 * is a wash derived from the picture itself. Nothing is letterboxed, nothing is
 * cropped, and the parts of the frame the caption already occupies are exactly
 * the parts the photograph was never going to use.
 */
export const BleedShot: React.FC<Base & { asset: Asset }> = ({ asset, accent, p, f, seed, move }) => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const acc = ACCENT[accent];
  const kind = move ?? moveFor(seed);
  const frameAr = W / H;

  // Bleed whenever the picture is at least as wide as the frame; otherwise
  // plate it, because bleeding would crop the subject away.
  const canBleed = asset.ar >= frameAr * 0.94;

  if (canBleed) {
    const over = fmt.overhang;
    const roomX = (W * (over - 1)) / 2;
    const roomY = (H * (over - 1)) / 2;
    const cam = fullCamera(kind, p, roomX, roomY);
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
        <Img
          src={url(asset)}
          style={{
            position: "absolute",
            left: -roomX,
            top: -roomY,
            width: W * over,
            height: H * over,
            objectFit: "cover",
            transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale}) rotate(${cam.rot}deg)`,
            transformOrigin: "50% 50%",
            filter: "contrast(1.05) saturate(1.04)",
            willChange: "transform",
          }}
        />
        <Grade glow={acc.glow} portrait={fmt.portrait} />
      </div>
    );
  }

  const plateW = W * fmt.overhang;
  const plateH = plateW / asset.ar;
  const roomX = (plateW - W) / 2;
  const cam = plateCamera(kind, p, roomX, H * 0.035);
  const breath = Math.sin((f + seed * 31) / 150) * (H / 520);
  const washScale = 1.24 + (cam.scale - 1) * 0.35;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
      {/* the wash — the picture's own colour, pushed back. It travels a
          fraction of what the plate travels, which is the whole reason this
          reads as a camera in a space: near things move further than far ones. */}
      <Img
        src={url(asset)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${cam.x * 0.28}px, ${cam.y * 0.28}px) scale(${washScale})`,
          filter: "brightness(0.24) saturate(0.55) contrast(1.05)",
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 76% 42% at 50% 46%, ${acc.glow}12 0%, rgba(0,0,0,0) 72%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (W - plateW) / 2,
          top: H * fmt.plateY - plateH / 2,
          width: plateW,
          height: plateH,
          transform: `translate(${cam.x}px, ${cam.y + breath}px) scale(${cam.scale}) rotate(${cam.rot}deg)`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        <Img
          src={url(asset)}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) saturate(1.03)" }}
        />
      </div>
      <Grade glow={acc.glow} portrait={fmt.portrait} />
    </div>
  );
};

// ── 3. the b-roll clip ───────────────────────────────────────────────────────

/**
 * A moving shot, staged exactly like a photograph of the same shape.
 *
 * The clips are 2560 x 1440, which is wider than the vertical frame and 1.5x
 * the landscape frame's own long edge, so the landscape film bleeds them and
 * the vertical film plates them. `startFrom` is in SOURCE frames: each clip
 * holds eight seconds and a shot rarely needs all of it, so different shots can
 * take different passes of the same move without repeating.
 */
export const ClipBleed: React.FC<Base & { clip: Clip; startFrom?: number }> = ({
  clip, accent, p, f, seed, move, startFrom = 0,
}) => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const acc = ACCENT[accent];
  const kind = move ?? moveFor(seed);
  const src = staticFile(clip.file);

  // The clip already carries its own camera move. Ours is deliberately gentler
  // than the one used on a still — two moves fighting reads as a wobble.
  const soft = (c: Camera): Camera => ({
    scale: 1 + (c.scale - 1) * 0.45,
    x: c.x * 0.5,
    y: c.y * 0.5,
    rot: c.rot * 0.35,
  });

  if (clip.ar >= (W / H) * 0.94) {
    const over = 1.07;
    const roomX = (W * (over - 1)) / 2;
    const roomY = (H * (over - 1)) / 2;
    const cam = soft(fullCamera(kind, p, roomX, roomY));
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
        <OffthreadVideo
          src={src}
          muted
          startFrom={startFrom}
          style={{
            position: "absolute",
            left: -roomX,
            top: -roomY,
            width: W * over,
            height: H * over,
            objectFit: "cover",
            transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
            transformOrigin: "50% 50%",
            willChange: "transform",
          }}
        />
        <Grade glow={acc.glow} portrait={fmt.portrait} />
      </div>
    );
  }

  const plateW = W * fmt.overhang;
  const plateH = plateW / clip.ar;
  const roomX = (plateW - W) / 2;
  const cam = soft(plateCamera(kind, p, roomX, H * 0.03));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
      {/* The wash is the same clip, pushed back and graded down — one decode
          serves both layers, so the second copy is close to free. */}
      <OffthreadVideo
        src={src}
        muted
        startFrom={startFrom}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(${cam.x * 0.28}px, ${cam.y * 0.28}px) scale(1.26)`,
          filter: "brightness(0.22) saturate(0.5) contrast(1.05)",
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (W - plateW) / 2,
          top: H * fmt.plateY - plateH / 2,
          width: plateW,
          height: plateH,
          transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        <OffthreadVideo
          src={src}
          muted
          startFrom={startFrom}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.04) saturate(1.03)" }}
        />
      </div>
      <Grade glow={acc.glow} portrait={fmt.portrait} />
    </div>
  );
};

// ── 4. the wide panel or plan ────────────────────────────────────────────────

/**
 * An ultra-wide drawing laid across the frame, with the camera tracking ALONG
 * it rather than into it.
 *
 * The rear panels run from 3.3:1 to 7.5:1. Bleeding one into either frame would
 * crop it to a sliver and destroy the only thing it is for — reading the whole
 * connector row end to end. So it is given a fixed band and the wider ones
 * simply get more lateral travel.
 */
export const PanelPlate: React.FC<Base & { asset: Asset }> = ({ asset, accent, p, f, seed }) => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const acc = ACCENT[accent];

  const bandH = H * (fmt.portrait ? 0.26 : 0.42);
  const contentW = Math.max(bandH * asset.ar, W * 1.2);
  const box = placeByContent(asset, contentW, W / 2, H * (fmt.portrait ? 0.44 : 0.5));
  const room = (contentW - W) / 2;
  const dir = seed % 2 === 0 ? 1 : -1;
  const x = interpolate(ease(clamp01(p)), [0, 1], [room * 0.86 * dir, -room * 0.86 * dir]);
  const lift = Math.sin(f / 120) * (H / 380);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
      <Void key1={acc.key} glow={acc.glow} />
      <div
        style={{
          position: "absolute",
          ...box,
          transform: `translate(${x}px, ${lift}px)`,
          filter: "brightness(0.98) contrast(1.08)",
          willChange: "transform",
        }}
      >
        <Img src={url(asset)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <Grade glow={acc.glow} portrait={fmt.portrait} />
    </div>
  );
};

// ── 5. the detail push ───────────────────────────────────────────────────────

/**
 * A named region of a 4096 px plan, filling the frame under a slow push.
 *
 * This is the shot that makes a spec claim checkable: the voice says the gain
 * runs from six to sixty-five and the frame is the actual gain row with +6 and
 * +65 printed beside the knob. The region is expressed as a rectangle of the
 * source image, so the crop is a CAMERA on the plan, not a distortion of it —
 * the aspect ratio of what is shown is set by the frame, and the region is
 * grown, never squeezed, to reach it.
 */
export const DetailZoom: React.FC<Base & { asset: Asset; region: Region; zoom?: number; dim?: number }> = ({
  asset, region, accent, p, f, seed, zoom = 1.0, dim = 0.92,
}) => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const acc = ACCENT[accent];

  // Grow the requested region to the frame's aspect ratio. Growing keeps every
  // control the region named inside the shot; shrinking would cut one off.
  const frameAr = W / H;
  const srcW = region.w * asset.w;
  const srcH = region.h * asset.h;
  let rw = region.w;
  let rh = region.h;
  if (srcW / srcH > frameAr) rh = (srcW / frameAr) / asset.h;
  else rw = (srcH * frameAr) / asset.w;
  rw = Math.min(1, rw * zoom);
  rh = Math.min(1, rh * zoom);

  // RESOLUTION GUARD. `zoom` tightens the crop, and on a small control — the QR
  // code is 307 px wide on the plan — tightening it far enough to fill the
  // frame asks for a twentyfold upscale, which arrives as mush. The crop is
  // therefore never allowed to take the source below a third of the frame's own
  // width. A wider shot that is sharp beats a tighter one that is not, and the
  // camera move inside it still reads as a push.
  const MAX_UPSCALE = 3.0;
  const minRw = W / (MAX_UPSCALE * asset.w);
  const widened = rw < minRw;
  if (widened) {
    const k = minRw / rw;
    rw = Math.min(1, rw * k);
    rh = Math.min(1, rh * k);
  }
  const cx = region.x + region.w / 2;
  const cy = region.y + region.h / 2;

  // A slow push with a touch of lateral drift, both bounded so the named
  // region is inside the frame at every moment of the move.
  const e = ease(clamp01(p));
  const dir = seed % 2 === 0 ? 1 : -1;
  // A shot the guard widened starts at the sharp limit and travels further in
  // over its own length, so it still arrives at the control the narration is
  // naming — and the softest part of the move is the part the motion covers.
  const s = interpolate(e, [0, 1], [1.0, widened ? 1.34 : 1.085]);
  const dx = interpolate(e, [0, 1], [-0.012 * dir, 0.012 * dir]);
  const dy = Math.sin((f + seed * 17) / 170) * 0.004;

  const fullW = W / (rw * s);
  const fullH = (fullW * asset.h) / asset.w;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
      <Void key1={acc.key} glow={acc.glow} />
      <div
        style={{
          position: "absolute",
          left: W / 2 - (cx + dx) * fullW,
          top: H / 2 - (cy + dy) * fullH,
          width: fullW,
          height: fullH,
          willChange: "transform",
        }}
      >
        <Img
          src={url(asset)}
          // `dim` is solved per region from its measured luminance (see
          // dimFor), so a push into the pale master section and a push into the
          // dark channel strip both land on a ground the overlay can hold
          // against, instead of one fixed multiplier suiting neither.
          style={{ width: "100%", height: "100%", objectFit: "fill", filter: `brightness(${dim.toFixed(3)}) contrast(1.12) saturate(1.08)` }}
        />
      </div>
      <Grade glow={acc.glow} portrait={fmt.portrait} />
    </div>
  );
};

// ── 6. two pictures, both complete ───────────────────────────────────────────

/**
 * The comparison staging, and the replacement for the diagonal split.
 *
 * Two pictures, each shown WHOLE at its own aspect ratio: stacked one above the
 * other in the vertical frame, side by side in the landscape one. They are
 * separated by a lit accent rule so the pairing reads as deliberate. Each drifts
 * slightly, and in opposite directions, so the frame is alive without either
 * picture being cropped, clipped, rotated or cut.
 */
export const StackBleed: React.FC<Base & { assets: Asset[] }> = ({ assets, accent, p, f, seed }) => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const acc = ACCENT[accent];
  const [a, b] = [assets[0], assets[1] ?? assets[0]];
  const e = ease(clamp01(p));

  const gap = fmt.portrait ? H * 0.012 : W * 0.010;

  const cell = (asset: Asset, i: number) => {
    const drift = interpolate(e, [0, 1], [i === 0 ? -1 : 1, i === 0 ? 1 : -1]) * (fmt.portrait ? W * 0.012 : H * 0.012);
    const sc = interpolate(e, [0, 1], i === 0 ? [1.03, 1.0] : [1.0, 1.03]);

    // The plate is solved to the cell's own width (portrait) or height
    // (landscape) from the picture's aspect ratio, so it is complete inside its
    // half with room around it rather than cropped to fill the half.
    const cellW = fmt.portrait ? W : (W - gap) / 2;
    const cellH = fmt.portrait ? (H - gap) / 2 : H;
    const plateW = Math.min(cellW * 0.99, cellH * 0.96 * asset.ar);
    const plateH = plateW / asset.ar;
    const inner = { width: plateW, height: plateH };

    return (
      <div
        key={`${asset.slug}-${i}`}
        style={{
          position: "absolute",
          left: fmt.portrait ? 0 : i * (cellW + gap),
          top: fmt.portrait ? i * (cellH + gap) : 0,
          width: cellW,
          height: cellH,
          overflow: "hidden",
        }}
      >
        {/* A photograph gets a darkened copy of itself as its ground; a
            transparent render has no colour to derive one from, so it gets the
            same lit void the single-product staging puts a desk in. Covering a
            cell with a transparent image just paints nothing, which is what
            made the first cut of this shot two desks floating in flat black. */}
        {asset.transparent ? (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 76% 60% at 50% 48%, ${acc.key}44 0%, #0F1116 52%, #06070A 100%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse 52% 30% at 50% 48%, ${acc.glow}1C 0%, rgba(0,0,0,0) 74%)`,
              }}
            />
          </>
        ) : (
          <Img
            src={url(asset)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scale(1.3)",
              filter: "brightness(0.2) saturate(0.5)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            left: (cellW - plateW) / 2,
            top: (cellH - plateH) / 2,
            width: plateW,
            height: plateH,
            transform: fmt.portrait
              ? `translateX(${drift}px) scale(${sc})`
              : `translateY(${drift}px) scale(${sc})`,
            transformOrigin: "50% 50%",
            willChange: "transform",
          }}
        >
          <ContentFit
            asset={asset}
            w={inner.width}
            h={inner.height}
            style={{ filter: asset.transparent ? "contrast(1.04) saturate(1.04) brightness(1.04)" : "contrast(1.05)" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
      {cell(a, 0)}
      {cell(b, 1)}
      {/* the rule between them — a straight line along the actual join */}
      <div
        style={{
          position: "absolute",
          left: fmt.portrait ? 0 : (W - gap) / 2,
          top: fmt.portrait ? (H - gap) / 2 : 0,
          width: fmt.portrait ? W : gap,
          height: fmt.portrait ? gap : H,
          background: fmt.portrait
            ? `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${acc.glow}9E 46%, ${acc.glow}9E 54%, rgba(0,0,0,0) 100%)`
            : `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${acc.glow}9E 46%, ${acc.glow}9E 54%, rgba(0,0,0,0) 100%)`,
        }}
      />
      <Grade glow={acc.glow} portrait={fmt.portrait} />
    </div>
  );
};

// ── 7. the mosaic ────────────────────────────────────────────────────────────

/**
 * Three or more pictures as one drifting plane — the coverage tier.
 *
 * Cells are laid out so each one is close to the pictures' own aspect ratio:
 * a vertical frame stacks them in a single column, a landscape frame puts them
 * in a row. Getting that wrong is what makes a mosaic crop every photograph
 * hard, and it is why a 2x2 grid is never used for three pictures.
 */
export const MosaicBleed: React.FC<Base & { assets: Asset[]; labels?: string[] }> = ({
  assets, accent, p, f, seed, labels,
}) => {
  const { width: W, height: H } = useVideoConfig();
  const fmt = formatFor(W, H);
  const acc = ACCENT[accent];
  const n = Math.min(assets.length, 6);
  const list = assets.slice(0, n);
  // A single column up to four in a vertical frame. The obvious 2x2 grid gives
  // each cell an aspect of 0.56 while the pictures run from 1.4 to 2.4, so every
  // one of them ends up contained to a third of its cell — four small consoles
  // in a mostly empty rectangle, which is the opposite of a lineup.
  const cols = fmt.portrait ? (n <= 4 ? 1 : 2) : n <= 4 ? n : 3;
  const rows = Math.ceil(n / cols);
  const e = ease(clamp01(p));
  const planeScale = interpolate(e, [0, 1], [1.045, 1.0]);
  const planeX = interpolate(e, [0, 1], [-W / 120, W / 120]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: GROUND.darkSink }}>
      <Void key1={acc.key} glow={acc.glow} />
      <div
        style={{
          position: "absolute",
          inset: "-2.5%",
          transform: `translateX(${planeX}px) scale(${planeScale})`,
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: Math.round(W / 200),
          willChange: "transform",
        }}
      >
        {list.map((a, i) => {
          const r = random(`${seed}-${i}`);
          const drift = Math.sin((f + i * 37) / 110) * (H / 420);
          const cw = W / cols;
          const ch = H / rows;
          return (
            <div key={a.slug} style={{ position: "relative", overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translateY(${drift}px) scale(${a.transparent ? 0.94 : 1 + r * 0.03})`,
                  willChange: "transform",
                }}
              >
                <ContentFit asset={a} w={cw} h={ch} style={{ filter: "brightness(0.80) contrast(1.12)" }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* A lineup is a comparison, so it is labelled: four unlabelled
          photographs of four near-identical desks read as one picture repeated
          by mistake, which is the opposite of the point being made. */}
      {labels
        ? list.map((a, i) => {
            const c = i % cols;
            const rI = Math.floor(i / cols);
            const cw = W / cols;
            const ch = H / rows;
            return (
              <div
                key={`l-${a.slug}`}
                style={{
                  position: "absolute",
                  left: fmt.portrait ? c * cw + cw * 0.62 : c * cw + W * 0.035,
                  top: rI * ch + H * (fmt.portrait ? 0.035 : 0.045),
                  display: "flex",
                  alignItems: "center",
                  gap: W * 0.012,
                }}
              >
                <div style={{ width: Math.round(W / 190), height: H * 0.055, background: acc.glow }} />
                <div
                  style={{
                    fontSize: fmt.portrait ? 104 : 86,
                    letterSpacing: 7,
                    color: acc.glow,
                    textShadow: "0 6px 14px rgba(0,0,0,0.94), 0 0 8px rgba(0,0,0,0.85)",
                  }}
                >
                  {labels[i] ?? ""}
                </div>
              </div>
            );
          })
        : null}
      <Grade glow={acc.glow} portrait={fmt.portrait} />
    </div>
  );
};
