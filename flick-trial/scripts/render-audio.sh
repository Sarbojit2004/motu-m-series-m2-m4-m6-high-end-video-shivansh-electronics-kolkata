#!/usr/bin/env bash
# The two standalone audio deliverables, rendered from the same schedule that
# drives the picture. Run after the scene renders so the two jobs don't contend.
set -euo pipefail
cd "$(dirname "$0")/../flick-output/remotion"
OUT=../../out
mkdir -p "$OUT"
npx remotion render src/index.tsx MusicBedOnly \
  "$OUT/motu-m-series-portrait-flick-trial-music-bed.wav" --codec=wav
npx remotion render src/index.tsx SfxTimelineOnly \
  "$OUT/motu-m-series-portrait-flick-trial-transition-sfx-timeline.wav" --codec=wav
echo "AUDIO DELIVERABLES DONE"
