// Builds the safety-net deliverable: a self-contained project zip where
// `npm install && npm run setup && npm run render` reproduces the master
// without this repository, this machine, or any network asset fetch.
//
// Everything the render consumes is vendored INSIDE the zip:
//   assets/        the 27 curated source stills + both logos
//   _shared/fonts  Archivo + Fraunces woff2 (the AVB type system)
//   _shared/sfx    the five sound files reused from the AVB repository
//   _shared/music  the ten music stems
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");
const REPO = resolve(PROJ, "..");
const NAME = "motu-m-series-portrait";

const tmp = mkdtempSync(join(tmpdir(), "mszip-"));
const root = join(tmp, NAME);
mkdirSync(root, { recursive: true });

for (const f of ["package.json", "tsconfig.json", "remotion.config.ts", "README.md", ".gitignore"]) {
  try { cpSync(resolve(PROJ, f), join(root, f)); } catch {}
}
cpSync(resolve(PROJ, "src"), join(root, "src"), { recursive: true });
cpSync(resolve(PROJ, "scripts"), join(root, "scripts"), { recursive: true });
mkdirSync(join(root, "out"), { recursive: true });
writeFileSync(join(root, "out/.keep"), "");

// Vendor the curated stills by their ORIGINAL filenames — copy-assets.mjs
// resolves them from the manifest, so the names must survive.
const manifest = JSON.parse(readFileSync(resolve(PROJ, "src/asset-manifest.json"), "utf8"));
mkdirSync(join(root, "assets"), { recursive: true });
for (const a of manifest) cpSync(resolve(REPO, a.file), join(root, "assets", a.file));
cpSync(resolve(REPO, "MOTU LOGO.png"), join(root, "assets/MOTU LOGO.png"));
cpSync(resolve(REPO, "SHIVANSH ELECTRONICS LOGO FOR VIDEO.png"), join(root, "assets/SHIVANSH ELECTRONICS LOGO FOR VIDEO.png"));

// Only the stems this deliverable actually deploys. The landscape build uses
// three tracks; this reel uses one (DIABLO), so shipping the other six stems
// would add ~30 MB of dead weight to the zip.
cpSync(resolve(REPO, "_shared/fonts"), join(root, "_shared/fonts"), { recursive: true });
cpSync(resolve(REPO, "_shared/sfx"), join(root, "_shared/sfx"), { recursive: true });
mkdirSync(join(root, "_shared/music"), { recursive: true });
for (const f of readdirSync(resolve(REPO, "_shared/music"))) {
  if (f.includes("DIABLO")) cpSync(resolve(REPO, "_shared/music", f), join(root, "_shared/music", f));
}

const outDir = resolve(PROJ, "../dist-zip");
mkdirSync(outDir, { recursive: true });
const zipPath = resolve(outDir, `${NAME}-project.zip`);
rmSync(zipPath, { force: true });
execFileSync("zip", ["-r", "-q", "-9", zipPath, NAME], { cwd: tmp });
rmSync(tmp, { recursive: true, force: true });

const mb = (statSync(zipPath).size / 1e6).toFixed(1);
console.log(`zip: ${zipPath} (${mb} MB)`);
console.log(`     ${manifest.length} stills + 2 logos + 4 fonts + 5 reused sfx + 4 DIABLO stems vendored`);
console.log(`     reproduce with: npm install && npm run setup && npm run render`);
