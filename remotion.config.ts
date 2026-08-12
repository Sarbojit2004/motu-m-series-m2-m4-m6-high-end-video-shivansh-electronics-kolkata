import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
Config.setConcurrency(4);
Config.setDelayRenderTimeoutInMilliseconds(120000);

// This environment blocks egress to remotion.media, so Remotion cannot fetch
// its own Chrome Headless Shell. A Playwright-managed Chromium headless shell
// is pre-installed here, so point Remotion at that instead of downloading.
const LOCAL_HEADLESS_SHELL =
  process.env.REMOTION_BROWSER ??
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

Config.setBrowserExecutable(LOCAL_HEADLESS_SHELL);
