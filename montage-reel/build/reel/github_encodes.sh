#!/bin/bash
# GitHub hard-blocks files >100 MB and this repo has no LFS, so produce
# encodes that fit under that ceiling. Budget: ~8.0 Mbps video + 128k audio
# over 90 s = ~91 MB.
cd /tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/reel || exit 1
FF=/home/user/claude-remotion-skill-motion-graphics-animations/packages/compositor-linux-x64-gnu/ffmpeg
SRC=MOTU_M_SERIES_MONTAGE_2160.mp4

"$FF" -y -v error -i "$SRC" -c:v libx264 -preset medium \
  -b:v 7900k -maxrate 9200k -bufsize 16000k -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 128k -movflags +faststart gh-2160.mp4 &

"$FF" -y -v error -i "$SRC" -vf scale=1080:1080:flags=lanczos -c:v libx264 -preset medium \
  -b:v 7900k -maxrate 9200k -bufsize 16000k -pix_fmt yuv420p -profile:v high \
  -c:a aac -b:a 128k -movflags +faststart gh-1080.mp4 &

# the cut music on its own, as mp3
"$FF" -y -v error -i music_90.wav -c:a libmp3lame -b:a 256k gh-music-90s.mp3 &
wait
echo "GH ENCODES DONE"
ls -la gh-*.mp4 gh-*.mp3 | awk '{printf "  %-18s %7.1f MB\n", $9, $5/1e6}'
