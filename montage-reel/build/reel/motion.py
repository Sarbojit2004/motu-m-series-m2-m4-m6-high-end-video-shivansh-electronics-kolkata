"""2.5-D motion engine: gimbal camera + depth-staged parallax over the collage planes."""
import math, json, pathlib, numpy as np
from PIL import Image, ImageFilter
import layers

OUT = pathlib.Path(layers.OUT)
SIZE = 2160                 # square master
SRC  = 1000 * layers.DSF    # 3000 px artwork

# depth per plane: background drifts slowest, the hero cut-out rides closest to camera
DEPTH = dict(bg=0.45, mid=0.80, hero=1.26, sprite=1.10, brand=0.92)

def ease(t, k=3.0):            # smooth in/out
    t = max(0.0, min(1.0, t)); return t*t*(3-2*t) if k == 3.0 else t**k
def eout(t, p=3.0):
    t = max(0.0, min(1.0, t)); return 1 - (1-t)**p
def ein(t, p=3.0):
    t = max(0.0, min(1.0, t)); return t**p
def overshoot(t, amp=0.10):
    """0 -> 1 with a single settle past the target."""
    t = max(0.0, min(1.0, t))
    return 1 - (1-t)**3 * math.cos(t * math.pi * 1.6) - amp*(1-t)**3*0

class Slide:
    _cache = {}
    def __init__(self, sid):
        self.sid = sid
        d = OUT / sid
        self.rec = json.loads((d / 'layers.json').read_text())
        self.planes = {k: Image.open(d / v).convert('RGBA')
                       for k, v in self.rec['planes'].items()}
        self.blur = {'bg': self.planes['bg'].filter(ImageFilter.GaussianBlur(9)),
                     'mid': self.planes['mid'].filter(ImageFilter.GaussianBlur(7))}
        self.sprites = []
        for s in sorted(self.rec['sprites'], key=lambda s: (s['z'], s['i'])):
            im = Image.open(d / s['f']).convert('RGBA')
            self.sprites.append(dict(im=im, z=s['z'],
                                     x=s['x']*layers.DSF, y=s['y']*layers.DSF,
                                     w=im.width, h=im.height))
        # headline rows are the two widest z20 elements; the rest are call-outs
        self.head = [i for i, s in enumerate(self.sprites) if s['z'] == 20]
        self.stick = [i for i, s in enumerate(self.sprites) if s['z'] != 20]

    @classmethod
    def get(cls, sid):
        if sid not in cls._cache:
            if len(cls._cache) > 2: cls._cache.clear()
            cls._cache[sid] = cls(sid)
        return cls._cache[sid]

def sample(img, zoom, cx, cy, depth, size=SIZE, blur_img=None, blur_mix=0.0):
    """Crop the artwork through a camera at (zoom, cx, cy) for a plane at `depth`."""
    z = 1.0 + (zoom - 1.0) * depth
    z = max(1.0001, z)
    w = SRC / z
    ox = (cx - 0.5) * SRC * depth
    oy = (cy - 0.5) * SRC * depth
    left = (SRC - w) / 2 + ox
    top  = (SRC - w) / 2 + oy
    # keep the frame filled with artwork — never let the camera run off the edge
    left = max(0.0, min(SRC - w, left))
    top  = max(0.0, min(SRC - w, top))
    box = (left, top, left + w, top + w)
    out = img.resize((size, size), Image.BILINEAR, box=box)
    if blur_img is not None and blur_mix > 0.004:
        b = blur_img.resize((size, size), Image.BILINEAR, box=box)
        out = Image.blend(out, b, min(1.0, blur_mix))
    return out

def place_sprite(canvas, spr, zoom, cx, cy, depth, scale=1.0, alpha=1.0,
                 dx=0.0, dy=0.0, wipe=None, size=SIZE):
    """Draw one sprite through the same camera, with its own scale/alpha/wipe."""
    if alpha <= 0.004: return
    z = 1.0 + (zoom - 1.0) * depth
    k = (size / SRC) * z * scale
    ox = (cx - 0.5) * SRC * depth
    oy = (cy - 0.5) * SRC * depth
    # sprite centre in artwork space -> screen space
    scx = spr['x'] + spr['w']/2; scy = spr['y'] + spr['h']/2
    sx = (scx - SRC/2 - ox) * (size/SRC) * z + size/2 + dx
    sy = (scy - SRC/2 - oy) * (size/SRC) * z + size/2 + dy
    nw, nh = max(1, int(spr['w']*k)), max(1, int(spr['h']*k))
    if nw > size*3 or nh > size*3: return
    im = spr['im'].resize((nw, nh), Image.BICUBIC)
    if wipe is not None and wipe < 0.999:
        a = np.asarray(im.getchannel('A'), dtype=np.float32)
        g = np.linspace(0, 1, nw, dtype=np.float32)[None, :]
        gy = np.linspace(0, 0.28, nh, dtype=np.float32)[:, None]   # soft diagonal edge
        m = np.clip((wipe*1.34 - (g + gy)) / 0.16, 0, 1)
        im.putalpha(Image.fromarray((a*m).astype(np.uint8)))
    if alpha < 0.999:
        a = np.asarray(im.getchannel('A'), dtype=np.float32) * alpha
        im.putalpha(Image.fromarray(a.astype(np.uint8)))
    canvas.alpha_composite(im, (int(round(sx - nw/2)), int(round(sy - nh/2))))
