#!/usr/bin/env node
// Copies every M-Series product image out of the repository root into
// public/images/, downscaled for a 2160x3840 render, and writes src/assets.ts.
//
// Content-hash deduplication, same as the AVB build: the repository's 32
// product filenames are only 30 distinct photographs. Two pairs are
// byte-identical across products, and showing one photograph twice under two
// different product labels would break the product-identification discipline
// the whole reel depends on.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const ROOT = "..";
const OUT = "public/images";
const FFMPEG = process.env.FFMPEG || "ffmpeg";
mkdirSync(OUT, { recursive: true });

// ── What each image actually SHOWS ───────────────────────────────────────────
// Recorded explicitly rather than inferred, because the alpha channel says how
// an image can be staged and nothing about its subject. Hero slots are drawn
// from hardware; everything else is still used, in the multi-image tiers.
//
//   hardware  the unit itself — chassis, panels, connectors, controls
//   panel     a transparent ultra-wide front/rear panel plan (aspect 3.2-4.5)
//   context   a room or a rig the unit is working in
//   detail    a crop of one control or readout, not the whole unit
//   bundle    artwork for the included software
//
// DECLARED, NOT INFERRED, and the reason is visible in the first cut: an image
// classified by its alpha channel and aspect ratio alone put `motu-m6-1.jpg` —
// a tight crop of the A/B button and the level meters — into the "three
// interfaces" mosaic, where it filled half the frame with abstract colour bars
// and showed no product at all. A crop of a control is not a picture of the
// product, and no rule can tell the difference from the file alone.
//
// NOTE ON THE DUPLICATE PAIRS. Content-hash merging keeps the FIRST filename in
// sort order as canonical, so the software-bundle artwork is canonically
// `MOTU M4 (8).jpg`, not `MOTU M6 (11).jpg`. Declaring the wrong one of a
// merged pair silently does nothing — which is exactly what happened here
// first, and is why both names are listed.
const SUBJECT = {
  context: ["motu-m2-10.jpg", "motu-m2-6.jpg", "motu-m6-10.jpg"],
  detail: ["motu-m6-1.jpg"],
  bundle: ["motu-m4-8.jpg", "motu-m6-11.jpg"],
};
const SUBJECT_OF = new Map();
for (const [k, list] of Object.entries(SUBJECT)) for (const f of list) SUBJECT_OF.set(f, k);

const productOf = (f) => {
  const u = f.toUpperCase();
  if (u.includes("M2")) return "pm2";
  if (u.includes("M4")) return "pm4";
  if (u.includes("M6")) return "pm6";
  return null;
};

const slugify = (f) =>
  f.toLowerCase().replace(/^motu /, "motu-").replace(/[()]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const files = readdirSync(ROOT)
  .filter((f) => /^MOTU M[246] /i.test(f) && /\.(jpg|png)$/i.test(f))
  .sort();

const groups = new Map();
for (const f of files) {
  const h = createHash("md5").update(readFileSync(path.join(ROOT, f))).digest("hex");
  if (!groups.has(h)) groups.set(h, []);
  groups.get(h).push(f);
}

const meta = (p) => {
  let s = "";
  try { execFileSync(FFMPEG, ["-hide_banner", "-i", p], { stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { s = (e.stderr || "").toString(); }
  const m = s.match(/Stream #0:0.*?: Video: (\w+).*?, (\w+)(?:\([^)]*\))?, (\d+)x(\d+)/);
  return m ? { codec: m[1], pix: m[2], w: +m[3], h: +m[4] } : null;
};

const ALPHA_PIX = /rgba|argb|bgra|abgr|ya|pal8/i;

const assets = [];
for (const [, fs] of groups) {
  const canonical = fs[0];
  const src = path.join(ROOT, canonical);
  const info = meta(src);
  if (!info) { console.warn("skip (unreadable):", canonical); continue; }

  const slug = slugify(canonical).replace(/\.(jpg|png)$/, (m) => "-" + m.slice(1));
  const ext = /\.png$/i.test(canonical) ? "png" : "jpg";

  // Bleeding an image to a 2160-wide frame means it is often UPSCALED, so the
  // source is kept as large as it came rather than trimmed to fit a band.
  const long = Math.max(info.w, info.h);
  const scale = long > 3000 ? `scale=${info.w >= info.h ? "3000:-2" : "-2:3000"}` : "scale=iw:ih";
  const dst = path.join(OUT, `${slug}.${ext}`);
  const args = ["-v", "error", "-y", "-i", src, "-vf", `${scale}:flags=lanczos`];
  if (ext === "png") args.push("-pred", "mixed"); else args.push("-q:v", "2");
  args.push(dst);
  if (!existsSync(dst)) execFileSync(FFMPEG, args);

  // ── the ambient wash plate ───────────────────────────────────────────────
  //
  // Bleeding a 1.65:1 product photograph to a 0.5625:1 frame with objectFit:
  // cover throws away two thirds of its width — which on this material means
  // the product itself is gone and what fills the screen is a crop of a level
  // meter. So the photograph is shown COMPLETE instead, full frame width, over
  // a darkened wash derived from itself (see BleedShot). Nothing is
  // letterboxed and the screen is still filled edge to edge.
  //
  // The wash is written out here at 512 px because it is scaled up, darkened to
  // about a quarter brightness and desaturated before anyone sees it: no detail
  // in it survives, and rastering a 3,000 px source into a full 4K frame on
  // every one of 2,700 frames to produce a dark blur-substitute would cost more
  // than the photograph it sits behind.
  const bgDir = path.join(OUT, "bg");
  mkdirSync(bgDir, { recursive: true });
  const bg = path.join(bgDir, `${slug}.jpg`);
  if (!existsSync(bg)) {
    execFileSync(FFMPEG, ["-v", "error", "-y", "-i", src,
      "-vf", "scale=512:-2:flags=lanczos", "-q:v", "6", bg]);
  }

  const post = meta(dst);
  const ar = post.w / post.h;
  const hasAlpha = ext === "png" && ALPHA_PIX.test(post.pix);
  const declared = SUBJECT_OF.get(slugify(canonical));

  assets.push({
    slug, file: `${slug}.${ext}`, bg: `bg/${slug}.jpg`, product: productOf(canonical),
    w: post.w, h: post.h, ar: +ar.toFixed(3),
    // A transparent ultra-wide is a panel plan and needs its own staging: it
    // cannot bleed to the frame edges without becoming a 400px sliver.
    kind: hasAlpha && ar > 3.0 ? "panel" : hasAlpha ? "cutout" : "photo",
    subject: declared ?? (hasAlpha && ar > 3.0 ? "panel" : "hardware"),
    alpha: hasAlpha,
    covers: fs,
  });
}

assets.sort((a, b) => a.product.localeCompare(b.product) || a.slug.localeCompare(b.slug));

const byProduct = {};
for (const a of assets) (byProduct[a.product] ??= []).push(a);

const ts = `// AUTO-GENERATED by scripts/prep-assets.mjs — do not edit by hand.
// ${assets.length} distinct images from ${files.length} filenames in the repository root
// (${files.length - assets.length} byte-identical duplicates collapsed).
//
// kind:    panel (transparent ultra-wide plan) | cutout (transparent) | photo
// subject: hardware | panel | context | detail | bundle
//
// \`covers\` lists every original filename this one image satisfies, so the
// coverage ledger can prove all ${files.length} are accounted for.

export type AssetKind = "panel" | "cutout" | "photo";
export type AssetSubject = "hardware" | "panel" | "context" | "detail" | "bundle";
export type ProductKey = "pm2" | "pm4" | "pm6" | "shared";

export type Asset = {
  slug: string;
  file: string;
  /** A 512 px copy, for the darkened wash behind a full-bleed shot. */
  bg: string;
  product: ProductKey;
  w: number;
  h: number;
  ar: number;
  kind: AssetKind;
  subject: AssetSubject;
  alpha: boolean;
  covers: string[];
};

export const ASSETS: Asset[] = ${JSON.stringify(assets, null, 1)};

export const REPO_FILE_COUNT = ${files.length};
`;

writeFileSync("src/assets.ts", ts);

console.log(`${files.length} filenames -> ${assets.length} distinct images`);
for (const [k, v] of Object.entries(byProduct)) {
  const kinds = v.reduce((a, x) => ((a[x.kind] = (a[x.kind] || 0) + 1), a), {});
  console.log(`  ${k}  ${String(v.length).padStart(2)}  ${JSON.stringify(kinds)}`);
}
for (const [, fs] of groups) if (fs.length > 1) console.log(`  merged: ${fs.join("  ==  ")}`);
