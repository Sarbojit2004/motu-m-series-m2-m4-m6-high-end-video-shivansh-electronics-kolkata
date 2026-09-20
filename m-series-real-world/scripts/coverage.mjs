// Proves both films from the same data the renderer reads: every frame of the
// speech has exactly one shot under it, and no shot is too short to register.
import { REEL, VIDEO } from "../src/films.ts";

let bad = 0;
for (const film of [REEL, VIDEO]) {
  const fps = 30;
  const endF = Math.round(film.speechEnd * fps);
  const cover = new Int32Array(endF);
  film.shots.forEach((s) => {
    const a = Math.round(s.start * fps);
    const b = Math.round(s.end * fps);
    for (let i = a; i < Math.min(b, endF); i++) cover[i]++;
  });
  const holes = [];
  let run = null;
  for (let i = 0; i < endF; i++) {
    if (cover[i] === 0) { if (!run) run = [i, i]; else run[1] = i; }
    else if (run) { holes.push(run); run = null; }
  }
  if (run) holes.push(run);
  const over = [...cover].filter((c) => c > 1).length;
  const short = film.shots.filter((s) => (s.end - s.start) * fps < 12);
  console.log(
    `${film.id.padEnd(6)} ${film.shots.length} shots over ${endF} frames  ` +
    `holes ${holes.length}  overlap ${over}  under-12f ${short.length}`,
  );
  holes.forEach(([a, b]) =>
    console.log(`   HOLE frames ${a}-${b}  (${(a / fps).toFixed(2)}s - ${(b / fps).toFixed(2)}s)`));
  short.forEach((s) =>
    console.log(`   SHORT ${s.kind} ${((s.end - s.start) * fps).toFixed(1)}f at ${s.start.toFixed(2)}s`));
  bad += holes.length + short.length;
}
process.exit(bad ? 1 : 0);
