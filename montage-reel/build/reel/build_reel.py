"""Render the 90-second square montage and mux it against the cut music."""
import sys, os, io, time, subprocess, argparse
from PIL import Image
import editmap as E, shots as SH, transitions as TR, montage as MG, motion as MO
from motion import Slide
from grade import Grade

FF  = '/home/user/claude-remotion-skill-motion-graphics-animations/packages/compositor-linux-x64-gnu/ffmpeg'
FPS = 30
DUR = 90.0

SHOTS = E.build()
# Product-to-product changes get the colour-flash cut, per the brief; the hand-off
# into the closing montage gets the signature collage tear.
for s in SHOTS:
    if abs(s['t0'] - E.MOVE['M4'][0]) < 1e-6 or abs(s['t0'] - E.MOVE['M6'][0]) < 1e-6:
        s['tin'] = 'flash'
CLOSE_TIN = 'tear'

def shot_at(t):
    for k, s in enumerate(SHOTS):
        if s['t0'] <= t < s['t1']: return k, s
    return len(SHOTS)-1, SHOTS[-1]

def shot_frame(k, t, size):
    s = SHOTS[k]
    dur = s['t1'] - s['t0']
    u = min(1.0, max(0.0, (t - s['t0']) / dur))
    treat = 'breakdown' if s['half'] >= 8 else 'fast'
    return SH.render_shot(f"{s['mv']}_{s['slide']:02d}", u, dur, 31*k + s['slide'], treat, size)

def body_frame(t, size):
    k, s = shot_at(t)
    nfr = TR.FRAMES.get(s['tin'], 0)
    if k > 0 and nfr and t < s['t0'] + nfr / FPS:
        u = (t - s['t0']) / (nfr / FPS)
        a = shot_frame(k-1, SHOTS[k-1]['t1'] - 1e-4, size)
        b = shot_frame(k, t, size)
        return TR.apply(s['tin'], a, b, min(1.0, u), 17*k + 3, size)
    return shot_frame(k, t, size)

def frame_at(t, size):
    c0, c1 = E.MOVE['close'][0], E.MOVE['close'][1]
    if t < E.MOVE['M2'][0]:
        return MG.frame(t, 'cold', size)
    if t >= c0:
        nfr = TR.FRAMES[CLOSE_TIN]
        if t < c0 + nfr / FPS:
            u = (t - c0) / (nfr / FPS)
            a = shot_frame(len(SHOTS)-1, SHOTS[-1]['t1'] - 1e-4, size)
            b = MG.frame(t, 'close', size)
            return TR.apply(CLOSE_TIN, a, b, min(1.0, u), 991, size)
        return MG.frame(t, 'close', size)
    return body_frame(t, size)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--size', type=int, default=2160)
    ap.add_argument('--out', default='MOTU_M_SERIES_MONTAGE_2160.mp4')
    ap.add_argument('--from', dest='t0', type=float, default=0.0)
    ap.add_argument('--to', dest='t1', type=float, default=DUR)
    ap.add_argument('--stills', default=None)
    a = ap.parse_args()
    MO.SIZE = a.size; SH.SIZE = a.size; TR.SIZE = a.size
    g = Grade(a.size)
    f0, f1 = int(round(a.t0*FPS)), int(round(a.t1*FPS))

    if a.stills:
        os.makedirs(a.stills, exist_ok=True)
        for t in [float(x) for x in a.stills.split(',')[1:]] if ',' in a.stills else []:
            pass
        return

    cmd = [FF, '-y', '-v', 'error', '-f', 'image2pipe', '-vcodec', 'png', '-framerate', str(FPS), '-i', '-']
    if a.t0 == 0.0 and a.t1 >= DUR:
        cmd += ['-i', 'music_90.wav', '-c:a', 'aac', '-b:a', '320k']
    cmd += ['-c:v', 'libx264', '-preset', 'medium', '-crf', '17',
            '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', str(FPS),
            '-movflags', '+faststart', a.out]
    p = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=subprocess.PIPE)
    t0 = time.time()
    for f in range(f0, f1):
        img = frame_at(f / FPS, a.size)
        out = g.apply(img, f)
        buf = io.BytesIO(); out.save(buf, 'PNG', compress_level=0)
        p.stdin.write(buf.getvalue())
        if (f - f0) % 60 == 0:
            el = time.time() - t0; done = max(1, f - f0)
            eta = el / done * (f1 - f0 - done)
            print(f'  {f-f0:5d}/{f1-f0}  t={f/FPS:6.2f}s  {el:5.0f}s elapsed  ETA {eta/60:4.1f} min',
                  flush=True)
    p.stdin.close(); err = p.stderr.read().decode()[-2000:]; rc = p.wait()
    if rc: print('--- ffmpeg stderr ---\n' + err)
    print(f'ffmpeg exit {rc}   {time.time()-t0:.0f}s   -> {a.out}')

if __name__ == '__main__':
    main()
