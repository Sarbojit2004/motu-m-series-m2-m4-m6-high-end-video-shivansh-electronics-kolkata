# Delivery — MOTU M-Series square montage reel

## What is here

```
montage-reel/
├── out/
│   ├── motu-m-series-montage-2160.mp4         2160x2160, 30 fps, 90.000 s
│   ├── motu-m-series-montage-1080.mp4         1080x1080, 30 fps, 90.000 s
│   ├── motu-m-series-montage-720-preview.mp4  720x720, quick-look cut
│   ├── motu-m-series-montage-music-90s.mp3    the cut music on its own
│   └── contact-sheet.png                      24 frames across the 90 s
├── slides/            the 30 approved collage slides the reel is built from
│   ├── m2/  M2_01..M2_10.png   2000x2000
│   ├── m4/  M4_01..M4_10.png   2000x2000
│   └── m6/  M6_01..M6_10.png   2000x2000
├── build/
│   ├── collage/       the generator that produced the 30 slides
│   └── reel/          the motion engine that animates them
├── README.md          how the reel was built, with the verification numbers
└── DELIVERY.md        this file
```

## Bitrate note — read before judging the 4K file

The reel carries the collage's own film grain, which is close to incompressible.
The archival render is **CRF 17 at 303 Mbps — 3.4 GB**, and a visually
transparent delivery master is **1.04 GB**.

**GitHub hard-rejects any single file over 100 MB**, and this repository has no
Git LFS configured (the largest file previously committed is 72.6 MB). So the two
main video files here are encoded to fit that ceiling at roughly **7.9 Mbps**:

| file | in this repo | true master |
|---|---|---|
| 2160×2160 | ~91 MB @ 7.9 Mbps | 1.04 GB @ 93 Mbps |
| 1080×1080 | ~91 MB @ 7.9 Mbps | 172 MB @ 15 Mbps |

At 7.9 Mbps the grain is where the bitrate goes, so flat red and yellow fields
show more compression noise than the master does. **For paid media or a client
hand-off, regenerate the master** rather than uploading the file in this repo.

## Regenerating the master

The build is deterministic — the 30 slides re-render bit-for-bit (28/30 exactly;
see README.md for the two documented exceptions).

```bash
cd build/reel
python3 music.py                      # cuts the track to exactly 90.000 s
python3 extract_all.py                # splits each slide into planes + sprites
bash par.sh                           # renders 2160x2160 in 4 parallel chunks
```

Requires: Python 3.11 with `pillow` + `numpy`, Playwright Chromium, and an
`ffmpeg` with libx264 (this build used the one bundled in Remotion's
`compositor-linux-x64-gnu` package). Render time is roughly 30 minutes on 4 cores.

The music source is `Leo - Ratata Video  Thalapathy Vijay  Anirudh
Ravichander.mp3` at the repository root (md5 `2c3bd8c75814d9707c978be7972f066e`).

## Not touched

This reel is a separate deliverable from the repository's existing 88-second
vertical reels and 298-second long-form video. None of that project's design
system, audio, pacing or validation scripts (`coverage.mjs`, `branding_audit.mjs`,
`safezone_audit.py`) apply here, and none were run against this output.
