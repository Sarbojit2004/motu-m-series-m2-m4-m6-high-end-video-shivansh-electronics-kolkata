// Proves both films from the same data the renderer reads.
//
// Not a lint: this builds the real timeline and the real shot list and then
// asks the questions a viewer would notice the answer to — is anything on
// screen for so long it goes dead, is any shot so short it reads as a flash,
// does every caption have a picture under it, and did any of the fifty-three
// pictures and twenty clips delivered for this brief never make it in.
import { REEL_SEGMENTS, VIDEO_SEGMENTS, buildTimeline } from "../src/script.ts";
import { REEL_PLAN, VIDEO_PLAN, buildShots } from "../src/shots.ts";
import { REEL, EXPLAINER } from "../src/films.ts";
import { ASSETS, CLIPS } from "../src/assets.ts";


let bad = 0;
const fail = (m) => { console.log("  ✗ " + m); bad++; };

const used = { img: new Set(), clip: new Set() };

const check = (name, segs, plan, film) => {
  const { segments, total } = buildTimeline(segs);
  const shots = buildShots(segments, plan);
  console.log(`\n${name}`);
  console.log(`  narration ${total.toFixed(2)}s · end screen ${film.outroAt.toFixed(2)}s · total ${(film.durationInFrames / 30).toFixed(2)}s`);
  console.log(`  ${segments.length} chapters · ${segments.reduce((n, s) => n + s.captions.length, 0)} captions · ${shots.length} shots`);

  const spans = shots.map((s, i) => ({
    ...s,
    dur: (i + 1 < shots.length ? shots[i + 1].start : film.outroAt) - s.start,
  }));
  const longest = [...spans].sort((a, b) => b.dur - a.dur).slice(0, 3);
  const shortest = [...spans].sort((a, b) => a.dur - b.dur).slice(0, 3);
  console.log(`  shot length  min ${shortest[0].dur.toFixed(2)}s · median ${[...spans].sort((a,b)=>a.dur-b.dur)[Math.floor(spans.length/2)].dur.toFixed(2)}s · max ${longest[0].dur.toFixed(2)}s`);
  for (const s of spans) {
    if (s.dur > 7.5) fail(`${s.segment}/${s.kind} holds ${s.dur.toFixed(1)}s — long enough to go dead`);
    if (s.dur < 0.65) fail(`${s.segment}/${s.kind} is ${s.dur.toFixed(2)}s — reads as a flash, not a shot`);
  }

  // every caption must have a shot live under it
  for (const seg of segments) {
    for (const c of seg.captions) {
      if (!shots.some((s) => s.start <= c.start + 1e-6)) fail(`caption "${c.t}" has no shot`);
    }
  }

  // a demonstrative pinned past the end of its chapter would silently fall back
  // to the chapter start and lose its sync with the words that introduce it
  for (const [id, list] of Object.entries(film.demos)) {
    const seg = segments.find((s) => s.id === id);
    if (!seg) { fail(`demo declared for unknown chapter ${id}`); continue; }
    for (const d of list) {
      if (!seg.captions[d.from]) fail(`demo ${d.kind} in ${id} points at caption ${d.from}, which does not exist`);
    }
  }
  for (const id of Object.keys(film.chips)) {
    if (!segments.some((s) => s.id === id)) fail(`chips declared for unknown chapter ${id}`);
  }

  // a chapter with no picture change is a chapter the viewer stops watching
  for (const seg of segments) {
    const n = shots.filter((s) => s.segment === seg.id).length;
    if (n < 2 && seg.captions.length > 2) fail(`chapter ${seg.id} has ${n} shot for ${seg.captions.length} captions`);
  }

  // A detail push that asks for more pixels than the plan has arrives soft, and
  // the guard in DetailZoom silently widens it — so the numbers are printed
  // here rather than discovered on the render.
  const W = film.segments === VIDEO_SEGMENTS ? 3840 : 2160;
  const pushes = shots.filter((x) => x.kind === "detail").map((x) => {
    const a = ASSETS.find((y) => y.slug === x.slug);
    const frameAr = W / (W === 3840 ? 2160 : 3840);
    let rw = x.rect.w, rh = x.rect.h;
    if ((rw * a.w) / (rh * a.h) > frameAr) rh = (rw * a.w / frameAr) / a.h;
    else rw = (rh * a.h * frameAr) / a.w;
    rw = Math.min(1, rw * (x.zoom ?? 1));
    const minRw = W / (3.0 * a.w);
    const widened = rw < minRw;
    return { ...x, up: W / (Math.max(rw, minRw) * a.w), widened };
  });
  const widened = pushes.filter((x) => x.widened);
  console.log(`  detail pushes ${pushes.length} · max upscale ${Math.max(...pushes.map((x) => x.up)).toFixed(2)}x` +
    (widened.length ? ` · ${widened.length} widened by the resolution guard (${[...new Set(widened.map((x) => x.region))].join(", ")})` : ""));

  for (const s of shots) {
    if (s.kind === "clip") used.clip.add(s.slug);
    else if (s.kind === "stack" || s.kind === "mosaic") s.slugs.forEach((x) => used.img.add(x));
    else used.img.add(s.slug);
  }
};

check("REEL · 2160 x 3840", REEL_SEGMENTS, REEL_PLAN, REEL);
check("EXPLAINER · 3840 x 2160", VIDEO_SEGMENTS, VIDEO_PLAN, EXPLAINER);

console.log("\nASSET COVERAGE");
const unusedImg = ASSETS.filter((a) => !used.img.has(a.slug));
const unusedClip = CLIPS.filter((c) => !used.clip.has(c.slug));
console.log(`  images ${used.img.size}/${ASSETS.length} used · clips ${used.clip.size}/${CLIPS.length} used`);
if (unusedImg.length) console.log("  unused images: " + unusedImg.map((a) => a.slug).join(", "));
if (unusedClip.length) console.log("  unused clips:  " + unusedClip.map((c) => c.slug).join(", "));

console.log(bad ? `\n${bad} problem(s)` : "\nno problems");
process.exit(bad ? 1 : 0);
