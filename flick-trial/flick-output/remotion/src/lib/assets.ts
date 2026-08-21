import { staticFile } from "remotion";

/**
 * The 30 unique images supplied in brand-assets/, plus both logos.
 *
 * `ar` drives the fit decision in components/Media.tsx: anything at or above
 * 1.40 is landscape-oriented in a 1080x1920 frame and must be scaled COMPLETE
 * to the frame width with a deliberate fill behind it, never cropped.
 * `bg` tunes that fill so a white-ground product hero stays clean white-on-white
 * while a dark room shot gets a real colour field from its own palette.
 */
export type Asset = { src: string; w: number; h: number; ar: number; bg: string };

export const ASSETS: Record<string, Asset> = {
  "m2-front-panel": { src: "m2-front-panel.png", w: 1212, h: 301, ar: 4.027, bg: "light" },
  "m2-rear-panel": { src: "m2-rear-panel.png", w: 2013, h: 500, ar: 4.026, bg: "light" },
  "m2-hero-white": { src: "m2-hero-white.jpg", w: 1879, h: 948, ar: 1.982, bg: "light" },
  "m2-desk-macbook": { src: "m2-desk-macbook.jpg", w: 2880, h: 1396, ar: 2.063, bg: "mixed" },
  "m2-couch-guitar": { src: "m2-couch-guitar.jpg", w: 1442, h: 873, ar: 1.652, bg: "mixed" },
  "m2-glass-table": { src: "m2-glass-table.jpg", w: 1442, h: 873, ar: 1.652, bg: "dark" },
  "m2-producer-desk": { src: "m2-producer-desk.jpg", w: 1000, h: 873, ar: 1.145, bg: "dark" },
  "m2-overhead-dark": { src: "m2-overhead-dark.jpg", w: 2880, h: 1516, ar: 1.9, bg: "dark" },
  "shared-podcast-room": { src: "shared-podcast-room.jpg", w: 1442, h: 873, ar: 1.652, bg: "dark" },
  "m4-front-panel": { src: "m4-front-panel.png", w: 1212, h: 301, ar: 4.027, bg: "light" },
  "m4-rear-panel": { src: "m4-rear-panel.png", w: 1212, h: 301, ar: 4.027, bg: "light" },
  "m4-hero-white": { src: "m4-hero-white.jpg", w: 2102, h: 1061, ar: 1.981, bg: "light" },
  "m4-synth-top": { src: "m4-synth-top.jpg", w: 1000, h: 873, ar: 1.145, bg: "dark" },
  "m4-desk-daw": { src: "m4-desk-daw.jpg", w: 2880, h: 1516, ar: 1.9, bg: "dark" },
  "m4-drum-overhead": { src: "m4-drum-overhead.jpg", w: 2880, h: 1396, ar: 2.063, bg: "dark" },
  "m4-outdoor-cable": { src: "m4-outdoor-cable.jpg", w: 1442, h: 873, ar: 1.652, bg: "dark" },
  "m4-studio-desk": { src: "m4-studio-desk.jpg", w: 1442, h: 873, ar: 1.652, bg: "dark" },
  "shared-software-bundle": { src: "shared-software-bundle.jpg", w: 2880, h: 834, ar: 3.453, bg: "light" },
  "m6-front-panel": { src: "m6-front-panel.png", w: 2442, h: 749, ar: 3.26, bg: "light" },
  "m6-rear-panel": { src: "m6-rear-panel.png", w: 3530, h: 800, ar: 4.412, bg: "light" },
  "m6-lcd-macro": { src: "m6-lcd-macro.jpg", w: 911, h: 591, ar: 1.541, bg: "dark" },
  "m6-dark-desk": { src: "m6-dark-desk.jpg", w: 3000, h: 2085, ar: 1.439, bg: "dark" },
  "m6-podcast-panel": { src: "m6-podcast-panel.jpg", w: 3000, h: 2223, ar: 1.35, bg: "dark" },
  "m6-drum-kit-room": { src: "m6-drum-kit-room.jpg", w: 2830, h: 2737, ar: 1.034, bg: "light" },
  "m6-low-angle": { src: "m6-low-angle.jpg", w: 3000, h: 2000, ar: 1.5, bg: "dark" },
  "m6-couch-songwriting": { src: "m6-couch-songwriting.jpg", w: 2830, h: 2737, ar: 1.034, bg: "mixed" },
  "m6-bright-studio": { src: "m6-bright-studio.jpg", w: 3000, h: 2101, ar: 1.428, bg: "dark" },
  "m6-full-setup": { src: "m6-full-setup.jpg", w: 2777, h: 1947, ar: 1.426, bg: "dark" },
  "m6-desktop-studio": { src: "m6-desktop-studio.jpg", w: 2821, h: 1529, ar: 1.845, bg: "dark" },
  "shared-live-duo": { src: "shared-live-duo.jpg", w: 3000, h: 1740, ar: 1.724, bg: "dark" }
};

export const asset = (name: string): Asset => {
  const a = ASSETS[name];
  if (!a) throw new Error(`Unknown brand asset: ${name}`);
  return a;
};

export const img = (name: string): string => staticFile(`brand-assets/${asset(name).src}`);

export const LOGO = {
  motu: () => staticFile("brand-assets/motu-logo.png"),
  shivansh: () => staticFile("brand-assets/shivansh-electronics-logo.png"),
};

export const sound = (file: string): string => staticFile(`sounds/${file}`);

/** AR at or above this is treated as wide and gets the scale-and-fill treatment. */
export const WIDE = 1.4;
