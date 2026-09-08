"""Film grade: the collage's own grain generator, re-run at master size and moving.

Grain that drifts is also the guarantee that no frame is ever perfectly static.
"""
import sys, random, numpy as np
sys.path.insert(0,'/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build')
from PIL import Image, ImageFilter
from motion import SIZE

def _tile(size, seed, blur=0.4):
    rng = random.Random(seed)
    im = Image.new('L', (size, size))
    im.putdata([rng.randint(0, 255) for _ in range(size*size)])
    return np.asarray(im.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255.

def _sheet(tile, w):
    r = int(np.ceil(w / tile.shape[0])) + 1
    return np.tile(tile, (r, r))[:w, :w]

class Grade:
    def __init__(self, size=SIZE):
        self.size = size
        pad = size + 340
        self.g1 = _sheet(_tile(300, 7), pad)          # .grain  — overlay, .72
        self.g2 = _sheet(_tile(220, 19), pad)         # .grain2 — multiply, .30
        # overlay-blend LUT: base 0..255 x quantised grain 0..63, with the
        # .72 opacity already folded in, so the grade is one gather + one multiply
        b = (np.arange(256, dtype=np.float32) / 255.)[:, None]
        l = (np.arange(64, dtype=np.float32) / 63.)[None, :]
        ov = np.where(b < 0.5, 2*b*l, 1 - 2*(1-b)*(1-l))
        self.lut = (b*0.28 + ov*0.72).astype(np.float32)
        self.g1i = np.clip(self.g1*63, 0, 63).astype(np.uint8)
        y, x = np.mgrid[0:size, 0:size].astype(np.float32)
        cx, cy = size/2, size*0.45
        r = np.sqrt(((x-cx)/(size*0.72))**2 + ((y-cy)/(size*0.72))**2)
        v = np.clip((r - 0.42) / 0.58, 0, 1) ** 1.35 * 0.42
        self.vig = (1.0 - v)[:, :, None]

    def apply(self, img, frame):
        a = np.asarray(img.convert('RGB'))
        S = self.size
        ox, oy = (frame*37) % 300, (frame*53) % 300
        g1 = self.g1i[oy:oy+S, ox:ox+S][:, :, None]
        ox2, oy2 = (frame*29) % 220, (frame*41) % 220
        g2 = self.g2[oy2:oy2+S, ox2:ox2+S][:, :, None]
        out = self.lut[a, g1]                       # grain overlay, .72
        out *= (0.70 + 0.30*g2) * self.vig          # grain multiply, .30 + vignette
        return Image.fromarray((out*255.0).clip(0, 255).astype(np.uint8), 'RGB')
