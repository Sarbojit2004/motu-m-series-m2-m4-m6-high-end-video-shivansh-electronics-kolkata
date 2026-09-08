import raw from "../catalog.json";

export type Entry = {
  id: string;
  file: string;
  product: "M2" | "M4" | "M6";
  kind: string;
  role: "plate" | "strip" | "tile";
  focus: [number, number];
  zoom?: number;
  source: [number, number];
  out: [number, number];
  /** mean luminance 0..1 of the generated crop, refreshed by the art build */
  lum: number;
};

export const CATALOG = raw.images as Entry[];
export const DUPLICATE_PAIRS = raw.duplicatePairs as [string, string][];

const byId = new Map(CATALOG.map((e) => [e.id, e]));

export const entry = (id: string): Entry => {
  const e = byId.get(id);
  if (!e) throw new Error(`catalog: unknown image id "${id}"`);
  return e;
};

/** True when a headline laid over this plate needs to be set in bone, not ink. */
export const isDark = (id: string) => entry(id).lum < 0.42;

/** Width / height of the generated art for an id. */
export const aspect = (id: string) => {
  const [w, h] = entry(id).out;
  return w / h;
};
