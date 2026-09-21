#!/bin/sh
# Proves a split master can be put back together.
#
# The films ship as segments because GitHub refuses a file over 100 MB, and the
# instruction was the UNCOMPRESSED original — so the master is CUT, never
# squeezed. A cut is only honest if the pieces rejoin, and "ffmpeg wrote some
# files" is not evidence of that. This rejoins them in a scratch directory and
# compares the result against the master it came from, stream by stream.
#
#   sh scripts/verify-parts.sh motu-m-series-reel
set -e
cd "$(dirname "$0")/.."
BASE=$1
D="out/$BASE-parts"
FF=~/bin/ffmpeg
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

[ -d "$D" ] || { echo "no parts directory: $D"; exit 1; }
[ -f "out/$BASE.mp4" ] || { echo "no master to compare against: out/$BASE.mp4"; exit 1; }

echo "parts:"
ls -la "$D"/$BASE-part*.mp4 | awk '{printf "  %7.1f MB  %s\n", $5/1048576, $9}'
OVER=$(ls -la "$D"/$BASE-part*.mp4 | awk '$5 > 100*1048576' | wc -l)
[ "$OVER" -eq 0 ] || { echo "FAIL: $OVER part(s) over GitHub's 100 MB ceiling"; exit 1; }

# Stream copy, from the rejoin.txt that ships beside the parts — exactly what a
# reader of this repository would run.
( cd "$D" && $FF -v error -y -f concat -safe 0 -i rejoin.txt -c copy "$TMP/rejoined.mp4" )

a=$(stat -c %s "out/$BASE.mp4"); b=$(stat -c %s "$TMP/rejoined.mp4")
echo "master   $a bytes"
echo "rejoined $b bytes"

# Byte equality is too strong: the concat demuxer rewrites the container's
# index and edit lists. The PICTURE and the SOUND are what must survive, so
# both streams are compared as raw decoded data.
$FF -v error -y -i "out/$BASE.mp4" -map 0:v -f md5 "$TMP/v1.txt" -map 0:a -f md5 "$TMP/a1.txt"
$FF -v error -y -i "$TMP/rejoined.mp4" -map 0:v -f md5 "$TMP/v2.txt" -map 0:a -f md5 "$TMP/a2.txt"
echo "video  master $(cat "$TMP/v1.txt")  rejoined $(cat "$TMP/v2.txt")"
echo "audio  master $(cat "$TMP/a1.txt")  rejoined $(cat "$TMP/a2.txt")"
cmp -s "$TMP/v1.txt" "$TMP/v2.txt" || { echo "FAIL: the rejoined picture is not the master's"; exit 1; }
cmp -s "$TMP/a1.txt" "$TMP/a2.txt" || { echo "FAIL: the rejoined sound is not the master's"; exit 1; }
echo "PASS: every part under 100 MB, and the rejoin is bit-identical in both streams"
