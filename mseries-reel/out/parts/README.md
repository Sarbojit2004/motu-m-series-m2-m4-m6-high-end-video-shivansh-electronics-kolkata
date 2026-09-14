# The 4K master, in three pieces

`motu-mseries-reel.mp4` is 183 MB and GitHub rejects any blob over 100 MB, so
the master ships here as three keyframe-aligned **stream copies**. Nothing was
re-encoded — the video and audio bitstreams are the originals, cut at keyframe
boundaries — so rejoining them gives back the master, not a second-generation
copy of it.

```bash
ffmpeg -f concat -safe 0 -i concat.txt -c copy motu-mseries-reel.mp4
```

Verified: the rejoined file is `00:01:30.05`, the same duration as the master,
and differs from it only by a few hundred bytes of container overhead.

If you only want to watch it, use `../motu-mseries-reel-1080p.mp4` — same cut,
same audio, 1080 × 1920, 13 MB.
