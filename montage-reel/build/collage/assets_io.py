"""Embed fonts and images as data URIs so the render is hermetic."""
import base64, io, os, pathlib
from PIL import Image

REPO = '/home/user/motu-m-series-m2-m4-m6-high-end-video-shivansh-electronics-kolkata'
HERE = pathlib.Path(__file__).parent
_cache = {}

def font_face(name, file):
    b = (HERE/'fonts'/file).read_bytes()
    u = base64.b64encode(b).decode()
    return (f"@font-face{{font-family:'{name}';src:url(data:font/woff2;base64,{u}) "
            f"format('woff2');font-display:block;}}")

FONTS = "".join(font_face(n, f) for n, f in [
    ('Anton','anton.woff2'), ('ArchivoBlack','archivoblack.woff2'),
    ('Oswald','oswald.woff2'), ('Bebas','bebas.woff2'),
    ('Marker','marker.woff2'), ('Playfair','playfair.woff2'),
    ('Pixel','pixel.woff2'),  ('Elite','elite.woff2'),
    ('Yeseva','yeseva.woff2'),('Caveat','caveat.woff2')])

def img(path, maxpx=2400, absolute=False, trim=False):
    """Data-URI an image. Colour pixels are NEVER altered — resize/crop only.

    trim=True crops away fully-transparent margin so the mark fills its box.
    This removes empty padding only; it never scales, distorts or recolours."""
    key = (path, maxpx, trim)
    if key in _cache: return _cache[key]
    p = path if absolute or os.path.isabs(path) else os.path.join(REPO, path)
    im = Image.open(p)
    keep_alpha = im.mode in ('RGBA', 'LA') or 'transparency' in im.info
    im = im.convert('RGBA' if keep_alpha else 'RGB')
    if trim and keep_alpha:
        bb = im.split()[-1].getbbox()
        if bb: im = im.crop(bb)
    if max(im.size) > maxpx:
        s = maxpx/max(im.size)
        im = im.resize((round(im.width*s), round(im.height*s)), Image.LANCZOS)
    b = io.BytesIO()
    if keep_alpha:
        im.save(b, 'PNG', optimize=True); mime = 'png'
    else:
        im.save(b, 'JPEG', quality=94, subsampling=0); mime = 'jpeg'
    out = f'data:image/{mime};base64,' + base64.b64encode(b.getvalue()).decode()
    _cache[key] = out
    return out

_dcache = {}
def dims(path, absolute=False, trim=False):
    """(w, h) of a source image — used to size scraps to the picture's own aspect."""
    key = (path, trim)
    if key in _dcache: return _dcache[key]
    p = path if absolute or os.path.isabs(path) else os.path.join(REPO, path)
    im = Image.open(p)
    if trim and (im.mode in ('RGBA', 'LA') or 'transparency' in im.info):
        bb = im.convert('RGBA').split()[-1].getbbox()
        if bb: im = im.crop(bb)
    _dcache[key] = im.size
    return im.size
