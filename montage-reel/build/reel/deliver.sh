#!/bin/bash
cd /tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/reel || exit 1
FF=/home/user/claude-remotion-skill-motion-graphics-animations/packages/compositor-linux-x64-gnu/ffmpeg
SRC=MOTU_M_SERIES_MONTAGE_2160.mp4

# 2160x2160 delivery master
"$FF" -y -v error -i "$SRC" -c:v libx264 -preset faster -crf 25 -pix_fmt yuv420p \
  -profile:v high -c:a copy -movflags +faststart MOTU_M_SERIES_MONTAGE_2160_MASTER.mp4 &

# 1080x1080 viewing / social cut
"$FF" -y -v error -i "$SRC" -vf scale=1080:1080:flags=lanczos -c:v libx264 -preset faster \
  -crf 23 -pix_fmt yuv420p -profile:v high -c:a copy -movflags +faststart \
  MOTU_M_SERIES_MONTAGE_1080.mp4 &
wait
echo "ENCODES DONE"
ls -la MOTU_M_SERIES_MONTAGE_2160_MASTER.mp4 MOTU_M_SERIES_MONTAGE_1080.mp4
