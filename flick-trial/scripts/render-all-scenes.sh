#!/usr/bin/env bash
# Renders every approved scene through Flick's own render-scene.mjs, one
# dedicated composition at a time. Flick has no all-scenes composition by
# design; the 5,340-frame master is assembled from these 25 files afterwards.
set -uo pipefail
FLICK=/home/user/flick-claude-remotion-insta/skills/flick/scripts/render-scene.mjs
PROJECT=/home/user/motu-m-series-m2-m4-m6-high-end-video-shivansh-electronics-kolkata/flick-trial/flick-output
cd "$PROJECT/.."
node -e '
const s=require("'"$PROJECT"'/scene-spec.json");
console.log(s.map(x=>x.id).join("\n"));
' | while read -r id; do
  [ -f "$PROJECT/scenes/$id/$id.mp4" ] && { echo "skip $id (exists)"; continue; }
  echo "=== render $id ==="
  node "$FLICK" --project "$PROJECT" --composition "$id" --name "$id" \
    && echo "DONE $id" || echo "FAILED $id"
done
echo "ALL SCENES ATTEMPTED"
