#!/usr/bin/env python3
"""Rebuild a rendered film's audio from the mastered stems and swap it in.

WHY THIS EXISTS. The renderer reads the cue palette off disk at the end of a
run, which means a film can be rendered against a palette that was mid-rebuild —
and an eleven-decibel error in the transition layer is not something to discover
after a six-hour render. This assembles the mix from the same mastered stems the
repository ships, measures it, and swaps it onto the finished video with the
picture copied rather than re-encoded, so it costs seconds and cannot touch a
frame.

The mix is exactly what the timeline plays: narration + music bed + transition
layer, every one at unity, because each was already mastered to the same
reference by gen_audio.py.
"""
import numpy as np, os, subprocess, sys, json, wave

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, 'out')
AUD = os.path.join(ROOT, 'public', 'audio')
FF = os.path.expanduser('~/bin/ffmpeg')
SR = 48000

FILMS = {
    'reel': ('reel', 'soundcraft-signature-plus-reel.mp4'),
    'video': ('explainer', 'soundcraft-signature-plus-explainer.mp4'),
}


def read(path):
    raw = subprocess.run([FF, '-v', 'error', '-i', path, '-ac', '2', '-ar', str(SR),
                          '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, dtype='<i2').astype(np.float64).reshape(-1, 2) / 32768.0


def measure(path):
    import re
    p = subprocess.run([FF, '-hide_banner', '-i', path, '-af', 'ebur128=peak=true',
                        '-f', 'null', '-'], capture_output=True, text=True).stderr
    I = re.findall(r'I:\s+(-?[\d.]+) LUFS', p)
    P = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', p)
    return (float(I[-1]) if I else -70.0, float(P[-1]) if P else -70.0)


def main():
    with open(os.path.join(HERE, 'durations.json')) as fh:
        dur = json.load(fh)
    for key, (name, video) in FILMS.items():
        path = os.path.join(OUT, video)
        if not os.path.exists(path):
            print('%-46s not rendered yet, skipped' % video)
            continue
        n = int(round(dur[key]['seconds'] * SR))
        mix = np.zeros((n, 2))
        for src in (os.path.join(AUD, 'vo-%s.wav' % key),
                    os.path.join(OUT, 'soundcraft-signature-plus-%s-music-bed.mp3' % name),
                    os.path.join(OUT, 'soundcraft-signature-plus-%s-transitions.flac' % name)):
            x = read(src)
            m = min(len(x), n)
            mix[:m] += x[:m]
        peak = np.abs(mix).max()
        if peak > 0.99:
            mix *= 0.99 / peak
        tmp = os.path.join(OUT, '_mix.wav')
        w = wave.open(tmp, 'w'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes()); w.close()
        I, P = measure(tmp)

        out = os.path.join(OUT, '_remux.mp4')
        subprocess.run([FF, '-v', 'error', '-y', '-i', path, '-i', tmp,
                        '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
                        '-c:a', 'aac', '-b:a', '320k', '-shortest',
                        '-movflags', '+faststart', out], check=True)
        os.replace(out, path)
        os.remove(tmp)
        print('%-46s %7.2f s  mix %6.1f LUFS  peak %5.1f dBFS%s'
              % (video, dur[key]['seconds'], I, P,
                 '   (summed hot, pulled down)' if peak > 0.99 else ''))


if __name__ == '__main__':
    main()
