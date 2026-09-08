"""Quality control on the finished reel: spec, motion continuity, audio, sheet."""
import subprocess, sys, io, numpy as np
from PIL import Image, ImageDraw, ImageFont

FF  = '/home/user/claude-remotion-skill-motion-graphics-animations/packages/compositor-linux-x64-gnu/ffmpeg'
FP  = '/home/user/claude-remotion-skill-motion-graphics-animations/packages/compositor-linux-x64-gnu/ffprobe'
MP4 = sys.argv[1] if len(sys.argv) > 1 else 'MOTU_M_SERIES_MONTAGE_2160.mp4'

def probe(streams):
    out = subprocess.run([FP,'-v','error','-select_streams',streams,
        '-show_entries','stream=codec_name,width,height,r_frame_rate,nb_frames,'
        'sample_rate,channels,duration:format=duration,size,bit_rate',
        '-of','default=nw=1', MP4], capture_output=True, text=True).stdout
    return dict(l.split('=',1) for l in out.strip().splitlines() if '=' in l)

print('=== 1. SPEC ===')
v = probe('v:0'); a = probe('a:0')
print(f"  video   {v.get('width')}x{v.get('height')}  {v.get('codec_name')}  "
      f"{eval(v.get('r_frame_rate','0/1'))} fps  frames={v.get('nb_frames')}")
print(f"  audio   {a.get('codec_name')}  {a.get('sample_rate')} Hz  {a.get('channels')} ch")
print(f"  duration {float(v.get('duration', 0)):.3f}s video / {float(a.get('duration',0)):.3f}s audio")
print(f"  size    {int(v.get('size',0))/1e6:.1f} MB")

print('\n=== 2. MOTION CONTINUITY (no static frames) ===')
p = subprocess.Popen([FF,'-v','error','-i',MP4,'-vf','scale=192:192',
                      '-f','image2pipe','-vcodec','png','-'], stdout=subprocess.PIPE)
data = p.stdout.read(); p.wait()
sig = b'\x89PNG\r\n\x1a\n'
idx = []
p_ = data.find(sig)
while p_ != -1:
    idx.append(p_); p_ = data.find(sig, p_+8)
frames = []
for k, i in enumerate(idx):
    j = idx[k+1] if k+1 < len(idx) else len(data)
    frames.append(np.asarray(Image.open(io.BytesIO(data[i:j])).convert('L'), np.float32))
print(f'  decoded {len(frames)} frames at 192x192')
d = np.array([np.abs(frames[i+1]-frames[i]).mean() for i in range(len(frames)-1)])
print(f'  frame-to-frame delta: min {d.min():.4f}  mean {d.mean():.3f}  max {d.max():.2f}')
print(f'  frames with delta < 0.05 (visually frozen): {(d < 0.05).sum()}')
print(f'  frames with delta < 0.20                 : {(d < 0.20).sum()}')
sec = np.array([d[i*30:(i+1)*30].mean() for i in range(len(d)//30)])
print(f'  quietest second: {sec.argmin()}s (delta {sec.min():.3f})   '
      f'busiest: {sec.argmax()}s ({sec.max():.2f})')

print('\n=== 3. CUT DETECTION vs the beat grid ===')
import editmap as E
cuts = np.where(d > d.mean()*3.2)[0]
print(f'  {len(cuts)} hard visual changes detected')
half = E.HALF
off = np.array([min(abs((c+1)/30 % half), half - abs((c+1)/30 % half)) for c in cuts])
print(f'  distance from the nearest half-beat: mean {off.mean()*1000:.0f} ms '
      f'(half-beat = {half*1000:.0f} ms)')

print('\n=== 4. CONTACT SHEET ===')
n = 24; cell = 300
pick = [int(i*(len(frames)-1)/(n-1)) for i in range(n)]
cols = 6; rows = (n+cols-1)//cols
sheet = Image.new('RGB',(cols*cell+(cols+1)*5, rows*(cell+20)+5),(16,16,18))
dr = ImageDraw.Draw(sheet)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',14)
p2 = subprocess.Popen([FF,'-v','error','-i',MP4,'-vf','scale=300:300',
                       '-f','image2pipe','-vcodec','png','-'], stdout=subprocess.PIPE)
d2 = p2.stdout.read(); p2.wait()
i2 = []
p3 = d2.find(sig)
while p3 != -1:
    i2.append(p3); p3 = d2.find(sig, p3+8)
for k, fi in enumerate(pick):
    j = i2[fi+1] if fi+1 < len(i2) else len(d2)
    im = Image.open(io.BytesIO(d2[i2[fi]:j])).convert('RGB')
    x = 5+(k%cols)*(cell+5); y = 5+(k//cols)*(cell+20)
    sheet.paste(im,(x,y)); dr.text((x+2,y+cell+2), f'{fi/30:.2f}s', fill=(255,255,255), font=f)
sheet.save('REEL_CONTACT_SHEET.png')
print('  -> REEL_CONTACT_SHEET.png', sheet.size)
