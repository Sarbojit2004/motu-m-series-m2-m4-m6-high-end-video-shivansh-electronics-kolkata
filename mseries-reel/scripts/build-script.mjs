#!/usr/bin/env node
// Generates VO_SCRIPT_MSERIES_REEL_90S.md — the read-aloud deliverable.
//
// Run:  node --experimental-strip-types scripts/build-script.mjs
//
// Every timestamp here is DERIVED from src/script.ts, never typed by hand, so
// the printed script and the on-screen captions can never disagree.
import { writeFileSync } from "node:fs";
import { buildTimeline, WPM, SEGMENT_GAP } from "../src/script.ts";

const { segments, total } = buildTimeline();
const RUNTIME = 90.0;

const ts = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const tsp = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`;

const TITLES = {
  hook: "HOOK — the question, asked without answering it",
  engine: "THE ENGINE — the counter-intuitive answer, then the numbers",
  m2: "MOTU M2 — two in, and it travels",
  m4: "MOTU M4 — two more at the back, and a knob at the front",
  m6: "MOTU M6 — six in, and a control room",
  close: "CLOSE — the buying rule",
};

// Reading notes the client needs in order to actually perform the read.
//
// Written for a plain speaker, by instruction. There is no performance asked
// for anywhere below — the anticipation in this script is structural, and a
// flat, clear read is the correct read.
const NOTES = {
  hook:
    "Flat and even. These are four short statements of fact, not a build-up — " +
    "resist any temptation to lift your voice through them. The question at the " +
    "end is a real question: ask it the way you would ask a customer across a " +
    "counter, then stop.",
  engine:
    "'Not sound quality.' is the turn of the whole reel. Say it plainly and " +
    "leave the beat after it — the silence is what makes it land, not emphasis. " +
    "Read the three numbers unhurried and clean; they are the credibility of " +
    "everything that follows.",
  m2:
    "Ordinary, practical tone. This is you describing a product on a shelf. " +
    "'The whole studio fits in a bag' is the only line with any warmth in it, " +
    "and even that should stay matter-of-fact.",
  m4:
    "Same register as the M2 section. 'by hand. No routing software.' is two " +
    "short pieces — small gap between them, equal weight. Do not push.",
  m6:
    "Slightly more forward, because the section is about capacity, but still " +
    "plain. Read 'A-B' as 'A B'. The list at the end — drum kit, four-person " +
    "panel — should sound like examples, not like a climax.",
  close:
    "Slow down a little. 'Never by how good it sounds.' is the sentence you " +
    "want a viewer to leave with, so give it room on both sides. The last line " +
    "is a sign-off: plain, unhurried, then stop.",
};

const words = segments.reduce((a, s) => a + s.words, 0);

let md = `# MOTU M-SERIES — 90-SECOND VERTICAL REEL
## SPEECH SCRIPT FOR CLIENT RECORDING

**Client:** Shivansh Electronics, Kolkata
**Deliverable:** \`mseries-reel\` — ${RUNTIME.toFixed(3)} s / 2160 × 3840 (9:16, 4K portrait) / 30 fps
**Voice:** to be recorded by the client. No AI or synthesised narration is used anywhere in this build.

---

## HOW TO USE THIS SCRIPT

Read it top to bottom in one take if you can. The reel is cut to these
timestamps, so the closer your read sits to them, the less re-timing is needed.

| | |
|---|---|
| **Total script length** | **${words} words** |
| **Written speaking rate** | **${WPM} wpm** |
| **Effective rate over the narration** | **${(words / (total / 60)).toFixed(1)} wpm** — the difference is the pauses below |
| **Narration runs** | **00:00.0 – ${tsp(total)}** |
| **Film runtime** | **${RUNTIME.toFixed(3)} s** — the tail is the end screen |
| **Pause held between segments** | ${SEGMENT_GAP.toFixed(2)} s |

**On the two rates.** The script is *written* at ${WPM} wpm — that is how fast the
words themselves come out while you are speaking a phrase. Across the whole read
the average drops to ~${(words / (total / 60)).toFixed(0)} wpm, because roughly
${(total - (words / WPM) * 60).toFixed(0)} seconds of it is deliberate silence: the beats after each
thought and the gap between segments. **Do not try to fill the pauses** — they
are where the picture changes and where the on-screen graphics land.

**On tone.** This script is written for a plain speaker, deliberately. There is
no rhetoric in it to perform, no superlatives, and nothing that needs selling
with your voice. The anticipation is carried by the *structure* — an open
question, an answer withheld for one beat, then a capability that widens three
times — so a flat, clear, unhurried read is the correct read, and pushing it
would work against the writing.

**Marks in the text.**

- \`▌\` a short beat — roughly a fifth of a second. End of a thought.
- \`▌▌\` the segment break — take a breath, the picture changes here.
- **Bold** words are the ones set in the script face on screen. Give them a
  little more weight in the read; the caption is timed to you.

**Numbers, said aloud.** \`120 dB\` = "one hundred and twenty dee-bee".
\`Minus 129 dBu\` = "minus one twenty-nine dee-bee-you". \`2.5 milliseconds\` =
"two point five milliseconds". \`48 volt\` = "forty-eight volt". \`USB-C\` =
"you-ess-bee see". \`A-B\` = "A B". \`Sabre32\` = "sabre thirty-two".
\`M2 / M4 / M6\` = "em two", "em four", "em six".

---

`;

for (const seg of segments) {
  md += `## ${ts(seg.start)} – ${ts(seg.end)}  ·  ${TITLES[seg.id]}\n\n`;
  md += `> **${seg.words} words · ${(seg.end - seg.start).toFixed(1)} s**\n>\n`;
  md += `> *Delivery:* ${NOTES[seg.id]}\n\n`;

  const body = seg.captions
    .map((c) => {
      let t = c.t;
      if (c.e && t.includes(c.e)) t = t.replace(c.e, `**${c.e}**`);
      return t + (c.beat ? " ▌" : "");
    })
    .join(" ");
  md += `${body} ▌▌\n\n`;

  md += `<details><summary>Line-by-line cue sheet (${seg.captions.length} caption lines)</summary>\n\n`;
  md += `| In | Line as spoken | Script-face word |\n|---|---|---|\n`;
  for (const c of seg.captions) {
    md += `| \`${tsp(c.start)}\` | ${c.t} | ${c.e ? `**${c.e}**` : "—"} |\n`;
  }
  md += `\n</details>\n\n---\n\n`;
}

md += `## ${ts(total)} – ${ts(RUNTIME)} · END SCREEN — nothing spoken

The last ${(RUNTIME - total).toFixed(1)} seconds carry the end card, and there is no narration
over it. By instruction, **this is the only place in the film where any branding
appears at all** — no logo, no company name, no phone number and no website is
on screen at any point before it:

- Shivansh Electronics and MOTU logos, together
- *Authorised Distributor of MOTU (Mark of the Unicorn, USA) for East & North East India*
- all three WhatsApp numbers, each with the WhatsApp mark
- www.shivanshelectronics.in

---

## AFTER YOU RECORD

Save the take as a single continuous WAV or MP3 and drop it in at:

\`\`\`
mseries-reel/public/audio/vo.wav
\`\`\`

A silent placeholder of exactly ${RUNTIME.toFixed(3)} s is already sitting at that path, so
**nothing in the project needs to be edited** — replace the file, re-render, and
the voice is in the film. If your take runs longer or shorter than
${total.toFixed(1)} s, run:

\`\`\`
node --experimental-strip-types scripts/sync-vo.mjs
\`\`\`

which measures the recording and reports the drift per segment against these
timestamps, so the edit can be nudged to your actual read rather than the other
way round.

---

## TECHNICAL ACCURACY

Every specification spoken in this script — and every chip of extra text on
screen — is taken from the M-Series material already in this repository
(\`README.md\` and \`VO_SCRIPT_MOTU_M_SERIES_PORTRAIT_178S.md\`), cross-checked
against the supplied product photography for the panel counts.

| Claim | Where it comes from |
|---|---|
| All three share the ESS Sabre32 Ultra converter | repository \`README.md\`, "the narrative rule" |
| 120 dB dynamic range, identical across the three | repository \`README.md\` |
| −129 dBu EIN preamps, identical across the three | repository \`README.md\` |
| 2.5 ms round-trip latency, identical across the three | repository \`README.md\` |
| M2 — 2 combo in / 2 out, 48 V on both, USB-C bus power | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`m2-front-panel\` / \`m2-rear-panel\` |
| M2 — just over a pound, runs off the cable | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`m2-in-the-room\` |
| M4 — adds 2 rear line inputs, 4 DC-coupled outputs | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`m4-rear-panel\` |
| M4 — Input Monitor Mix knob, blends input against playback | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`m4-front-panel\` |
| M6 — 4 combo preamps at the rear, plus 2 line inputs | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`m6-rear-panel\` |
| M6 — 4 gain / 4 phantom controls, 2 headphone outputs | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`m6-front-panel\` |
| M6 — A/B switch across two monitor pairs, second cue mix | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`m6-control-room\` |
| M6 — 15 V DC socket | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`m6-rear-panel\` |
| Loopback, DC-coupled outputs, bundled software on all three | \`VO_SCRIPT…PORTRAIT_178S.md\`, \`shared-extras\` |

**Two things this script deliberately does not do.**

1. **It never frames one model as better-sounding than another.** The three are
   identical in fidelity and the script says so explicitly — that is the whole
   argument, and it is also what makes the reel honest.
2. **It never names, compares to, or implies another manufacturer or product.**
   There is no competitor anywhere in the narration, in the captions, or in the
   on-screen chips.
`;

writeFileSync("../VO_SCRIPT_MSERIES_REEL_90S.md", md);
console.log(
  `VO_SCRIPT_MSERIES_REEL_90S.md written — ${words} words, ${total.toFixed(2)}s narration / ` +
    `${RUNTIME.toFixed(2)}s film, ${WPM} wpm written / ${(words / (total / 60)).toFixed(1)} wpm effective`,
);
