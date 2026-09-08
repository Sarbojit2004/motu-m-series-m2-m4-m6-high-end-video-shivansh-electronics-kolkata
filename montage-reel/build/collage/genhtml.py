import sys, importlib, cbuild, mcol, slide as S
OUT='/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/build/outc/'
for mod, pre in (('cspec_m2','M2C'), ('cspec_m4','M4C')):
    C = importlib.import_module(mod)
    for sl in C.SLIDES:
        open(f'{OUT}{pre}_{sl["n"]:02d}.html','w').write(mcol.page(cbuild.build(sl, C.P)))
        S._clips.clear()
print('html written')
