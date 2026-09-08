/**
 * The montage reel's visual identity.
 *
 * Built from the Pinterest motion-graphics reference's own vocabulary: bone
 * paper, ink black, a single crimson, and a teal-blue reserved for the
 * hand-drawn annotation. Deliberately no yellow, and no relationship to any
 * earlier MOTU deliverable in this repository.
 */

export const FPS = 30;

/** The composition is authored at 1080x1920 and rendered at --scale=2. */
export const W = 1080;
export const H = 1920;

export const C = {
  paper: "#E9E0D3",
  paperLift: "#F4EEE4",
  ink: "#141416",
  inkSoft: "#2A2A2C",
  crimson: "#D42A31",
  crimsonDeep: "#8C2026",
  bone: "#EEE7DA",
  annotate: "#3F93B4",
} as const;

export const FONT = {
  display: '"MontageDisplay", "Anton", Impact, sans-serif',
  tag: '"MontageTag", "Archivo", "Helvetica Neue", sans-serif',
} as const;

/** Anton sits high in its em box; this nudges optical centring. */
export const DISPLAY_TRIM = 0.1;

export type Tone = "ink" | "crimson" | "deep";

/** Drop shadow used on every physical object in the frame. */
export const objectShadow = (px: number, opacity = 0.34) =>
  `drop-shadow(${px * 0.45}px ${px}px ${px * 1.5}px rgba(20,16,14,${opacity}))`;
