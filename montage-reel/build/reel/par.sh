#!/bin/bash
# Render the reel in four cost-balanced chunks in parallel, then concat + mux.
# The montage segments (cold open / close) cost about twice a body frame, so the
# boundaries are weighted rather than even.
cd /tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/reel || exit 1
FF=/home/user/claude-remotion-skill-motion-graphics-animations/packages/compositor-linux-x64-gnu/ffmpeg
B=(0 595 1349 2103 2700)
rm -f chunk*.mp4 chunk*.log list.txt MOTU_M_SERIES_MONTAGE_2160.mp4
for i in 0 1 2 3; do
  a=$(python3 -c "print(${B[$i]}/30)")
  b=$(python3 -c "print(${B[$((i+1))]}/30)")
  python3 build_reel.py --size 2160 --from "$a" --to "$b" --out "chunk$i.mp4" > "chunk$i.log" 2>&1 &
done
wait
for i in 0 1 2 3; do echo "file '$PWD/chunk$i.mp4'" >> list.txt; done
"$FF" -y -v error -f concat -safe 0 -i list.txt -i music_90.wav \
  -c:v copy -c:a aac -b:a 320k -movflags +faststart MOTU_M_SERIES_MONTAGE_2160.mp4
echo "MUX DONE rc=$?"
