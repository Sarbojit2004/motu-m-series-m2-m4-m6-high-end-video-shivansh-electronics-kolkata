import { buildShots } from "../src/shots.ts";
import { ASSETS } from "../src/assets.ts";
const { shots, total } = buildShots();
const used = new Map(); let cur="";
for (const s of shots) {
  if (s.segment!==cur){ cur=s.segment; console.log(`\n── ${cur} ──`); }
  console.log(`  ${s.start.toFixed(1).padStart(5)}–${s.end.toFixed(1).padStart(5)}s ${(s.end-s.start).toFixed(1).padStart(4)}s ${s.kind.padEnd(6)} ${String(s.assets.length).padStart(2)}img  "${s.captions[0].t.slice(0,32)}"`);
  if (!s.reprise) for (const a of s.assets) used.set(a.slug,(used.get(a.slug)||0)+1);
}
const miss = ASSETS.filter(a=>!used.has(a.slug));
console.log(`\nshots ${shots.length}   total ${total.toFixed(2)}s`);
console.log(`coverage ${used.size}/${ASSETS.length}   missing ${miss.length}`);
if(miss.length) console.log("MISSING:", miss.map(a=>a.slug).join(", "));
