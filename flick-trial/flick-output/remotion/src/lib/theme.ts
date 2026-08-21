// Values pulled from BRAND-GUIDE.md, which carries this project's approved
// AVB-sourced design system. Nothing here is invented for this build.

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

/** Caption-safe zone. Text, logos and callouts stay inside; imagery may bleed. */
export const SAFE = {
  top: 180,
  bottom: 220,
  marginX: 64,
  get contentW() { return VIDEO.width - this.marginX * 2; },   // 952
  get contentH() { return VIDEO.height - this.top - this.bottom; }, // 1520
} as const;

export const COLORS = {
  paper: "#F6F8FA",
  paperLift: "#FDFEFE",
  paperEdge: "#EFF2F6",
  ink: "#0E1116",
  inkSoft: "#20272F",
  slate: "#48525F",
  slateDim: "#6B7684",
  motuBlue: "#0B5FD0",
  signal: "#00845F",
  amber: "#B4610A",
  alert: "#B32218",
  line: "rgba(14,17,22,0.12)",
  shadow: "rgba(14,17,22,0.10)",
} as const;

export const RADII = { card: 26, plate: 18, chip: 999 } as const;

export const BRAND = {
  name: "Shivansh Electronics",
  role: "Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces",
  region: "East and North East India",
  website: "www.shivanshelectronics.in",
} as const;

/** Three distinct MOPs. Never rounded, never blended into one figure or range. */
export const PRICE = {
  m2: "Rs. 26,900",
  m4: "Rs. 32,900",
  m6: "Rs. 55,900",
  note: "per unit · MOP, inclusive of GST",
} as const;

export function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
