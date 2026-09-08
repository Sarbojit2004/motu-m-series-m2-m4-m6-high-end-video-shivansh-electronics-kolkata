import sys, importlib
import cbuild, mcol
def run(specmod, prefix, nums):
    C = importlib.import_module(specmod)
    outs=[]
    for sl in C.SLIDES:
        if nums and sl['n'] not in nums: continue
        body = cbuild.build(sl, C.P)
        out = f'/tmp/claude-0/-home-user/7b64e9e6-de23-5890-8250-e7472d375088/scratchpad/outc/{prefix}_{sl["n"]:02d}.png'
        mcol.render_slide(f'{prefix}_{sl["n"]:02d}', body, out)
        print('ok', out); outs.append(out)
    return outs
if __name__ == '__main__':
    nums = [int(x) for x in sys.argv[3:]] if len(sys.argv)>3 else None
    run(sys.argv[1], sys.argv[2], nums)
