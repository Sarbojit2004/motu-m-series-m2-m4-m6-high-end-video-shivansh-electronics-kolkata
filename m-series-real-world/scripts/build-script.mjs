// Emits the timestamped read-aloud script for both films.
//
// This is the document the narration is recorded against. Every timestamp comes
// from the same buildTimeline() the picture is cut to, so a read that lands on
// these marks needs no sync pass afterwards — and the word budget beside each
// chapter is the one the edit was written to.
import { REEL_SEGMENTS, VIDEO_SEGMENTS, buildTimeline, WPM, SEGMENT_GAP, BEAT, spokenWords } from "../src/script.ts";
import { REEL, EXPLAINER, OUTRO_LEN } from "../src/films.ts";
import { sheetFor } from "../src/cues.ts";
import { writeFileSync } from "node:fs";

const clock = (s) => {
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${String(m).padStart(2, "0")}:${r.toFixed(2).padStart(5, "0")}`;
};

const render = (title, segs, film) => {
  const { segments, total, words } = buildTimeline(segs);
  const L = [];
  L.push(`# ${title}`, "");
  L.push(`Written at **${WPM} words per minute**, with a **${SEGMENT_GAP}s** breath between`);
  L.push(`chapters and a **${BEAT}s** beat after a line that closes a thought — the same`);
  L.push("pacing model the M-Series reel was cut to.");
  L.push("");
  L.push(`| | |`);
  L.push(`|---|---|`);
  L.push(`| Spoken words | ${words} |`);
  L.push(`| Narration | ${total.toFixed(2)}s |`);
  L.push(`| Effective rate | ${(words / total * 60).toFixed(1)} wpm |`);
  L.push(`| End screen from | ${film.outroAt.toFixed(2)}s (${OUTRO_LEN.toFixed(1)}s long) |`);
  L.push(`| Total | ${(film.durationInFrames / 30).toFixed(2)}s · ${film.durationInFrames} frames @ 30fps |`);
  L.push("");
  L.push("Read straight. The anticipation is carried by the structure, not by the");
  L.push("delivery — no superlatives to perform, no build-up language to lean on.");
  L.push("");
  for (const seg of segments) {
    L.push(`## ${seg.chapter}  ·  ${clock(seg.start)} – ${clock(seg.end)}  ·  ${seg.words} words`);
    L.push("");
    for (const c of seg.captions) {
      const beat = c.beat ? "   ⟨beat⟩" : "";
      L.push(`${clock(c.start)}   ${c.t}${beat}`);
    }
    L.push("");
  }
  L.push(`${clock(film.outroAt)}   ⟨end screen — no narration⟩`);
  L.push("");
  return L.join("\n");
};

const out =
  render("Soundcraft Signature Plus — 90-second vertical reel", REEL_SEGMENTS, REEL) +
  "\n---\n\n" +
  render("Soundcraft Signature Plus — five-minute landscape explainer", VIDEO_SEGMENTS, EXPLAINER);

writeFileSync(new URL("../VOICEOVER-SCRIPT.md", import.meta.url), out);

// The audio build needs the same lengths the picture is cut to, and Python
// cannot read films.ts — so they are written out here rather than typed twice.
// An edit to a single caption changes both films' durations, and this is what
// keeps the music bed, the silent placeholders and the compositions in step.
writeFileSync(
  new URL("./durations.json", import.meta.url),
  JSON.stringify(
    {
      reel: { frames: REEL.durationInFrames, seconds: REEL.durationInFrames / 30, outroAt: REEL.outroAt },
      video: { frames: EXPLAINER.durationInFrames, seconds: EXPLAINER.durationInFrames / 30, outroAt: EXPLAINER.outroAt },
    },
    null,
    1,
  ) + "\n",
);

// The transition layer is delivered as a standalone stem as well as inside the
// films, so the cue sheet is written out from the SAME function the renderer
// calls. Rebuilding the stem from a second copy of that logic would drift from
// the film the first time either copy was touched.
const sheet = (data) => {
  const { cues } = sheetFor(data, 30);
  return { seconds: data.durationInFrames / 30, outroAt: data.outroAt, cues };
};
writeFileSync(
  new URL("./cues.json", import.meta.url),
  JSON.stringify({ reel: sheet(REEL), video: sheet(EXPLAINER) }, null, 1) + "\n",
);
console.log(`cue sheet: ${sheetFor(REEL, 30).cues.length} reel · ${sheetFor(EXPLAINER, 30).cues.length} explainer`);
console.log(out.split("\n").slice(0, 18).join("\n"));
console.log("...\nwrote VOICEOVER-SCRIPT.md");
