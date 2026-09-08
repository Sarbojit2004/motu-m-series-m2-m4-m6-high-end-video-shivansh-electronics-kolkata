"""Cut the RATATA track to exactly 90.000 s, on the bar, around the edit."""
import subprocess, wave, numpy as np, os
import editmap as E

FF  = '/home/user/claude-remotion-skill-motion-graphics-animations/packages/compositor-linux-x64-gnu/ffmpeg'
SRC = '/root/.claude/uploads/7b64e9e6-de23-5890-8250-e7472d375088/a323c2a0-Leo__Ratata_Video__Thalapathy_Vijay__Anirudh_Ravichander.mp3'
SR  = 48000
XF  = 0.030          # equal-power crossfade at each splice

def decode_stereo(path, sr=SR):
    tmp = '/tmp/_m.wav'
    subprocess.run([FF,'-v','error','-y','-i',path,'-acodec','pcm_s16le','-ac','2',
                    '-ar',str(sr),'-f','wav',tmp], check=True, capture_output=True)
    with wave.open(tmp) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), '<i2').astype(np.float32)/32768.
    os.unlink(tmp)
    return a.reshape(-1, 2)

def write_wav(path, x, sr=SR):
    d = np.clip(x, -1, 1)
    with wave.open(path,'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes((d*32767).astype('<i2').tobytes())

def build(out='music_90.wav'):
    x = decode_stereo(SRC)
    segs = []
    for name, a, b in E.SEGMENTS:
        s0 = int(round(E.src_bar(a)*SR)); s1 = int(round(E.src_bar(b)*SR))
        segs.append(x[s0:min(s1, len(x))].copy())
    n = int(round(XF*SR))
    fi = np.sqrt(np.linspace(0,1,n, dtype=np.float32))[:,None]      # equal power
    fo = np.sqrt(np.linspace(1,0,n, dtype=np.float32))[:,None]
    edit = segs[0]
    for s in segs[1:]:
        head = edit[-n:] * fo + s[:n] * fi
        edit = np.concatenate([edit[:-n], head, s[n:]])
    write_wav('/tmp/_edit.wav', edit)
    pre = len(edit)/SR
    subprocess.run([FF,'-v','error','-y','-i','/tmp/_edit.wav',
                    '-filter:a',f'atempo={E.TEMPO:.6f}','-acodec','pcm_s16le',
                    '-ar',str(SR),'-ac','2','-f','wav','/tmp/_st.wav'],
                   check=True, capture_output=True)
    with wave.open('/tmp/_st.wav') as w:
        y = np.frombuffer(w.readframes(w.getnframes()),'<i2').astype(np.float32)/32768.
    y = y.reshape(-1,2)
    want = int(round(90.0*SR))
    if len(y) < want:                       # pad with the tail, never dead air
        y = np.concatenate([y, np.zeros((want-len(y),2), np.float32)])
    y = y[:want]
    y[-int(0.05*SR):] *= np.linspace(1,0,int(0.05*SR),dtype=np.float32)[:,None]
    # hype-reel mix: this track is the whole soundscape, so drive it hard
    peak = np.abs(y).max()
    y *= (0.97/peak) if peak > 0 else 1.0
    rms = np.sqrt((y**2).mean())
    write_wav(out, y)
    return dict(segments=len(segs), pre_stretch=pre, atempo=E.TEMPO,
                out_len=len(y)/SR, peak=float(np.abs(y).max()),
                rms_dbfs=float(20*np.log10(rms+1e-9)))

if __name__ == '__main__':
    r = build()
    for k,v in r.items(): print(f'  {k:12s} {v}')
