// Shared Chromium resolution for every script that renders.
// Remotion's own Chrome download host is not reachable from this build
// environment; a pre-installed Chromium is used instead.
import { existsSync } from "node:fs";

const CANDIDATES = [
  process.env.REMOTION_BROWSER_EXECUTABLE,
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell",
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/usr/bin/google-chrome",
].filter(Boolean);

export function browserExecutable() {
  for (const c of CANDIDATES) if (existsSync(c)) return c;
  throw new Error(
    "No Chromium found. Set REMOTION_BROWSER_EXECUTABLE to a Chrome/Chromium binary.\n" +
      `Looked in:\n  ${CANDIDATES.join("\n  ")}`
  );
}
