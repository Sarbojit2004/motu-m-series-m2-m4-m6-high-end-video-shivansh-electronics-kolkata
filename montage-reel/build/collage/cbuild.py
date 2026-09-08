"""Generic collage slide builder — one renderer, ten layout archetypes, two products."""
import lib, slide as S, deck as D, mcol as M
from lib import BLACK, RED, YELLOW, CREAM
from slide import scrap, frag, spray_patch, halftone_patch


def build(sl, P):
    """Assemble one slide from its layout record `sl` and the product config `P`."""
    b = []
    R = P['roles']

    # ---- torn colour zones ------------------------------------------------
    b.append(D.zones(sl['zones']))
    for wd in sl.get('wedges', []):
        b.append(D.wedge(**wd))
    for vb in sl.get('vbands', []):
        b.append(D.vband(**vb))

    # ---- paint drips off the torn edges ----------------------------------
    for x, y, w, h, sd, col, n, fl in sl.get('drips', []):
        b.append(D.drip(x, y, w, h, sd, col, n=n, flip=fl))

    # ---- procedural texture ----------------------------------------------
    for sp in sl.get('spray', []):
        b.append(spray_patch(*sp[:4], seed=sp[4], colour=sp[5], n=sp[6], z=sp[7], op=sp[8]))
    for ht in sl.get('half', []):
        b.append(halftone_patch(*ht[:4], seed=ht[4], colour=ht[5], step=ht[6], z=ht[7],
                                op=ht[8], rot=ht[9], fade=ht[10]))

    # ---- photographs (aspect-exact, full colour, nothing cropped) ---------
    for ph in sl.get('photos', []):
        sd, role, x, y, mw, mh, rot, z, amp = ph[:9]
        anchor = ph[9] if len(ph) > 9 else 'tl'
        b.append(M.photo_fit(sd, R[role], x, y, mw, mh, rot=rot, z=z, amp=amp, anchor=anchor))

    # ---- alpha cut-outs of the unit itself --------------------------------
    for co in sl.get('cutouts', []):
        role, x, y, w, rot, z = co[:6]
        sh = co[6] if len(co) > 6 else '0 18px 30px rgba(0,0,0,.7)'
        b.append(M.cutout(R[role], x, y, w, rot, z=z, shadow=sh))

    # ---- headline 1 : serif/script chaos ----------------------------------
    t = sl['top']
    b.append(M.headline(
        M.word(t['t'], t['size'], M.SERIF, t.get('c', RED), seed=P['seed'] + sl['n'] * 7,
               extra=t.get('extra', '')),
        x=t['x'], baseline=t['bl'], box=t['box'], maxw=t.get('maxw', 946),
        z=20, rot=t.get('rot', -1.4), gap=t.get('gap', 11)))

    # ---- headline 2 : slab chaos with the product's own knob as a glyph ---
    o = sl['bot']
    b.append(M.headline(
        M.word(o['t'], o['size'], M.SLAB, o.get('c', YELLOW), seed=P['seed'] + sl['n'] * 13,
               knob_at=o.get('knob'), knob_img=P['knob'], knob_sc=o.get('knob_sc', .70),
               extra=o.get('extra', '')),
        x=o['x'], baseline=o['bl'], box=o['box'], maxw=o.get('maxw', 960),
        z=20, rot=o.get('rot', -0.9), gap=o.get('gap', 8),
        shadow=o.get('shadow', '4px 6px 7px rgba(0,0,0,.6)')))

    # ---- the product's own knob as a standalone torn prop ----------------
    if sl.get('knobprop'):
        x, y, sz, rot, z = sl['knobprop']
        b.append(f'<img src="{__import__("assets_io").img(P["knob"], absolute=True)}" '
                 f'style="position:absolute;left:{x}px;top:{y}px;width:{sz}px;height:{sz}px;'
                 f'z-index:{z};transform:rotate({rot}deg);'
                 f'filter:drop-shadow(3px 6px 9px rgba(0,0,0,.6))">')

    # ---- the reference's magnifying-glass prop ----------------------------
    if sl.get('lens'):
        b.append(D.lens(*sl['lens'][:5], handle=sl['lens'][5]))

    # ---- scattered typographic noise --------------------------------------
    for f in sl.get('frags', []):
        b.append(frag(**f))
    for sc in sl.get('scribbles', []):
        b.append(D.scribble(**sc))
    for st in sl.get('stacks', []):
        b.append(D.stack(**st))

    # ---- name badge, straddling an edge (the reference's chest badge) -----
    if sl.get('badge'):
        sd, x, y, w, h, l2, rot = sl['badge']
        b.append(D.badge(sd, x, y, w, h, P['tag'], l2, rot=rot))

    # ---- the four permitted brand items ------------------------------------
    bl = sl.get('brand', (900, 826, False))
    b.append(M.brand_layer(seed=bl[0], y=bl[1], flip=bl[2]))
    return ''.join(b)
