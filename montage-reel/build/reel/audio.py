"""Beat-grid and section analysis for the RATATA track — spectral flux + autocorrelation."""
import subprocess, numpy as np, json, os

FF  = '/home/user/claude-remotion-skill-motion-graphics-animations/packages/compositor-linux-x64-gnu/ffmpeg'
SRC = '/root/.claude/uploads/7b64e9e6-de23-5890-8250-e7472d375088/a323c2a0-Leo__Ratata_Video__Thalapathy_Vijay__Anirudh_Ravichander.mp3'
SR  = 22050

def decode(path, sr=SR, start=None, dur=None):
    """This ffmpeg build ships only the wav/mp4/image2pipe muxers, so decode via a temp wav."""
    import tempfile, wave
    cmd = [FF, '-v', 'error', '-y']
    if start is not None: cmd += ['-ss', str(start)]
    if dur is not None:   cmd += ['-t', str(dur)]
    tmp = tempfile.mktemp(suffix='.wav')
    cmd += ['-i', path, '-acodec', 'pcm_s16le', '-ac', '1', '-ar', str(sr), '-f', 'wav', tmp]
    subprocess.run(cmd, check=True, capture_output=True)
    with wave.open(tmp) as w:
        raw = w.readframes(w.getnframes())
    os.unlink(tmp)
    return np.frombuffer(raw, dtype='<i2').astype(np.float32) / 32768.0

def stft(x, n=2048, hop=256):
    w = np.hanning(n).astype(np.float32)
    frames = 1 + (len(x) - n) // hop
    idx = np.arange(n)[None, :] + hop * np.arange(frames)[:, None]
    return np.abs(np.fft.rfft(x[idx] * w, axis=1))

def onset_envelope(x, hop=256):
    S = stft(x, hop=hop)
    S = np.log1p(1000 * S)
    flux = np.diff(S, axis=0)
    flux[flux < 0] = 0
    env = flux.sum(1)
    env = np.concatenate([[0], env])
    env -= env.min()
    return env / (env.max() + 1e-9)

def tempo_and_beats(env, sr=SR, hop=256, lo=60, hi=200):
    fps = sr / hop
    e = env - env.mean()
    ac = np.correlate(e, e, 'full')[len(e)-1:]
    lags = np.arange(len(ac))
    with np.errstate(divide='ignore'):
        bpm = 60 * fps / np.maximum(lags, 1)
    m = (bpm >= lo) & (bpm <= hi)
    cand = np.where(m)[0]
    best = cand[np.argmax(ac[cand])]
    bpm0 = 60 * fps / best
    # refine the phase: slide a comb over the envelope
    period = 60 * fps / bpm0
    best_phase, best_score = 0, -1
    for ph in np.arange(0, period, 0.25):
        t = np.arange(ph, len(env), period)
        sc = np.interp(t, np.arange(len(env)), env).sum() / len(t)
        if sc > best_score: best_score, best_phase = sc, ph
    beats = np.arange(best_phase, len(env), period) * hop / sr
    return bpm0, beats

def rms_env(x, win=4096, hop=2048):
    frames = 1 + (len(x)-win)//hop
    idx = np.arange(win)[None,:] + hop*np.arange(frames)[:,None]
    r = np.sqrt((x[idx]**2).mean(1))
    return r, hop/SR

if __name__ == '__main__':
    x = decode(SRC)
    dur = len(x)/SR
    env = onset_envelope(x)
    bpm, beats = tempo_and_beats(env)
    r, rhop = rms_env(x)
    print(f'duration      : {dur:.2f}s')
    print(f'tempo         : {bpm:.2f} BPM   (beat every {60/bpm:.3f}s)')
    print(f'beats found   : {len(beats)}  first={beats[0]:.3f}  last={beats[-1]:.3f}')
    # energy profile in 4-second blocks so the arrangement is readable
    blk = int(4/rhop)
    print('\nenergy by 4s block (bar = RMS, normalised):')
    rn = r/r.max()
    for i in range(0, len(rn)-blk, blk):
        t = i*rhop; v = rn[i:i+blk].mean()
        print(f'  {t:6.1f}s  {"#"*int(v*54):54s} {v:.3f}')
    np.save('onset_env.npy', env); np.save('beats.npy', beats)
    np.save('rms.npy', r)
    json.dump({'duration':float(dur),'bpm':float(bpm),'rms_hop':float(rhop)}, open('audio.json','w'))
