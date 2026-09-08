"""Cut map derived from the track's beat grid — audio analysis first, edit second."""
BPM_SRC   = 184.5688              # detected
BEAT0     = 0.16327               # first beat, source time
BAR_SRC   = 4 * 60 / (BPM_SRC/2)  # musical bar (the detector reports double-time)
BAR_SRC   = 8 * 60 / BPM_SRC      # == 2.600772 s
TARGET    = 90.0
BARS      = 34
BAR_OUT   = TARGET / BARS         # 2.647059 s after the global stretch
TEMPO     = (BARS * BAR_SRC) / TARGET   # atempo factor -> exactly 90.000 s
BEAT_OUT  = BAR_OUT / 4
HALF      = BAR_OUT / 8

def src_bar(n): return BEAT0 + n * BAR_SRC

# Music segments: source bar ranges. 17->49 is ONE unbroken run, so the whole
# body of the reel has no music edit at all; the only splices are into the cold
# open and out to the close.
SEGMENTS = [
    ('cold',  0,  2),   # intro
    ('M2',   19, 29),   # verse -> rise, ends exactly on the 75.9 s break
    ('M4',   29, 41),   # starts on that break, hook, ends on the 107.8 s break
    ('M6',   41, 49),   # starts on that break, final drop
    ('close', 2,  4),   # intro reprise = callback under the closing montage
]

# Output movement spans, in output bars
MOVE = {}
_b = 0
for name, a, b in SEGMENTS:
    n = b - a
    MOVE[name] = (_b * BAR_OUT, (_b + n) * BAR_OUT, n)
    _b += n

# Per-slide durations in half-beats (HALF = 0.330882 s).
# Long values = deliberate componentised breakdown; short = fast connective run.
SHOTS = {
 'M2': [10, 6, 8, 6, 10, 6, 8, 6, 12, 8],   # 80 half-beats = 10 bars
 'M4': [ 8,12, 8,10,  8,12, 8,10,  8,12],   # 96 half-beats = 12 bars
 'M6': [ 8, 6, 6, 8,  6, 6, 6, 6,  6, 6],   # 64 half-beats =  8 bars
}

# Slide play order per movement — sequenced for pacing, not numeric order.
# Each movement closes on its own "itS jUSt Mx!" punctuation slide (10).
ORDER = {
 'M2': [1, 4, 2, 7, 5, 3, 8, 6, 9, 10],
 'M4': [1, 5, 2, 8, 4, 3, 9, 6, 7, 10],
 'M6': [1, 6, 2, 8, 4, 3, 9, 5, 7, 10],
}

# Six transition types, rotated so no two consecutive cuts repeat.
# 'tear' (the collage-tear wipe) is the signature move: >=1 per movement.
TRANS = {
 'M2': ['cut','push','tear','whip','cut','punch','whip','cut','push','tear'],
 'M4': ['punch','whip','tear','cut','push','whip','cut','tear','punch','cut'],
 'M6': ['whip','cut','punch','tear','cut','whip','push','cut','tear','punch'],
}

def build():
    """-> list of shots: (movement, slide_no, t_in, t_out, transition_in)"""
    shots = []
    for mv in ('M2', 'M4', 'M6'):
        t0, t1, nbars = MOVE[mv]
        assert abs(sum(SHOTS[mv]) * HALF - (t1 - t0)) < 1e-6, (mv, sum(SHOTS[mv]))
        t = t0
        for k, (n, sl) in enumerate(zip(SHOTS[mv], ORDER[mv])):
            shots.append(dict(mv=mv, slide=sl, t0=t, t1=t + n * HALF,
                              half=n, tin=TRANS[mv][k]))
            t += n * HALF
    return shots

if __name__ == '__main__':
    print(f'bar(src) {BAR_SRC:.6f}s   bar(out) {BAR_OUT:.6f}s   atempo {TEMPO:.6f}')
    print(f'half-beat {HALF:.6f}s   beat {BEAT_OUT:.6f}s\n')
    for name, a, b in SEGMENTS:
        s0, s1 = src_bar(a), src_bar(b)
        o0, o1, n = MOVE[name]
        print(f'  {name:6s} src {s0:7.3f}-{s1:7.3f}s ({b-a:2d} bars)   '
              f'out {o0:6.3f}-{o1:6.3f}s')
    print()
    for s in build():
        print(f"  {s['mv']} slide {s['slide']:2d}  {s['t0']:6.3f}-{s['t1']:6.3f}  "
              f"{s['t1']-s['t0']:5.3f}s  in:{s['tin']}")
    print(f"\ntotal shots {len(build())}  end {build()[-1]['t1']:.3f}s "
          f"+ close {MOVE['close'][1]-MOVE['close'][0]:.3f}s = {MOVE['close'][1]:.3f}s")
