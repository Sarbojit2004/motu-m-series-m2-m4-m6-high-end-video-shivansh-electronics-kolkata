#!/bin/sh
# Everything after the reel's chunks: mux, render the explainer, mux, covers,
# and split both masters into playable segments under GitHub's 100 MB ceiling.
#
# Run unattended. Each stage is idempotent — anything already on disk is
# skipped — so if the box restarts this can simply be started again.
set -e
cd "$(dirname "$0")/.."
SP=/tmp/claude-0/-home-user/5add9b72-8882-5bc8-a930-175fa0fdfeba/scratchpad/ms
FF=~/bin/ffmpeg

log() { echo "[$(date -u +%H:%M:%S)] $*"; }

# ── 1. wait for the reel's silent join ──────────────────────────────────────
log "waiting for the reel"
prev=-1
while [ ! -f out/motu-m-series-reel-silent.mp4 ]; do
  cur=$(ls out/motu-m-series-reel-chunks/chunk*.mp4 2>/dev/null | wc -l)
  [ "$cur" != "$prev" ] && { log "reel chunks: $cur/8"; prev=$cur; }
  sleep 30
done
log "reel picture done"

# ── 2. the reel's audio ─────────────────────────────────────────────────────
[ -f out/motu-m-series-reel.mp4 ] || { log "muxing reel"; python3 scripts/mux.py reel; }

# ── 3. the explainer ────────────────────────────────────────────────────────
if [ ! -f out/motu-m-series-explainer-silent.mp4 ]; then
  log "rendering the explainer"
  sh scripts/render.sh Explainer motu-m-series-explainer 8950 358
fi
[ -f out/motu-m-series-explainer.mp4 ] || { log "muxing explainer"; python3 scripts/mux.py video; }

# ── 4. the covers ───────────────────────────────────────────────────────────
[ -f out/motu-m-series-reel-cover.png ] || \
  npx remotion still ThumbnailReel out/motu-m-series-reel-cover.png --log=error
[ -f out/motu-m-series-explainer-cover.png ] || \
  npx remotion still ThumbnailVideo out/motu-m-series-explainer-cover.png --log=error
log "covers done"

# ── 5. playable segments under the 100 MB ceiling ───────────────────────────
# Stream copy, so nothing is re-encoded and rejoining is a concatenation rather
# than a render. The user asked for the uncompressed original, not a smaller
# version of it — so the master is cut, never squeezed.
for pair in "motu-m-series-reel 18" "motu-m-series-explainer 22"; do
  set -- $pair; BASE=$1; SEG=$2
  D="out/$BASE-parts"
  if [ ! -d "$D" ]; then
    mkdir -p "$D"
    log "splitting $BASE into ${SEG}s segments"
    $FF -v error -y -i "out/$BASE.mp4" -c copy -map 0 -f segment \
      -segment_time "$SEG" -reset_timestamps 1 -movflags +faststart \
      "$D/$BASE-part%02d.mp4"
    : > "$D/rejoin.txt"
    for f in "$D"/$BASE-part*.mp4; do echo "file '$(basename "$f")'" >> "$D/rejoin.txt"; done
  fi
  log "$BASE parts:"
  ls -la "$D" | awk '{printf "    %10s  %s\n", $5, $9}' | grep -v '^\s*$'
done

log "PIPELINE COMPLETE"
ls -la out/*.mp4 out/*.png 2>/dev/null | awk '{printf "%12s  %s\n", $5, $9}'
