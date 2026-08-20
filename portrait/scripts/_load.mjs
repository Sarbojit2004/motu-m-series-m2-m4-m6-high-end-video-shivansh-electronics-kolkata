// Loads the TypeScript schedule into plain Node so the verification scripts
// check the SAME data that renders the video, rather than a copy that can drift.
import { build } from "esbuild";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), "../src");

export async function loadSchedule() {
  const dir = mkdtempSync(join(tmpdir(), "mseries-"));
  const entry = join(dir, "entry.ts");
  writeFileSync(
    entry,
    `export * from ${JSON.stringify(resolve(SRC, "schedule.ts"))};
     export * from ${JSON.stringify(resolve(SRC, "beat.ts"))};
     export { ASSETS, A } from ${JSON.stringify(resolve(SRC, "assets.ts"))};
     export { BRAND, PRICE, SPEC, VIDEO, COLORS, SPACE, SAFE } from ${JSON.stringify(resolve(SRC, "theme.ts"))};`
  );
  const out = join(dir, "bundle.mjs");
  await build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: out,
    logLevel: "silent",
    // `remotion` is only used for staticFile() in assets.ts — stub it, since
    // these scripts never touch the filesystem paths it produces.
    plugins: [
      {
        name: "stub-remotion",
        setup(b) {
          b.onResolve({ filter: /^remotion$/ }, () => ({ path: "remotion", namespace: "stub" }));
          b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({
            contents: "export const staticFile = (p) => p; export const Easing = {}; export const interpolate = () => 0;",
            loader: "js",
          }));
        },
      },
    ],
  });
  const mod = await import(pathToFileURL(out).href);
  rmSync(dir, { recursive: true, force: true });
  return mod;
}

export const tc = (f, fps = 30) => {
  const s = Math.round(f / fps);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};
