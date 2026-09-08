"""M4 — ten frames. 8 usable distinct sources (2 files excluded, see report), all used."""
P = 'MOTU M4 '
def W(src, **k): d = dict(src=P+src); d.update(k); return d

SLIDES = [
# 01 — opener, clean studio hero
dict(n=1, unit='M4',
  top='MORE HANDS.<br>SAME NERVE.',
  panel='RAW<br>DIRECT<br>UNFILTERED',
  head=['M4'], hx=54, hy=252, hw=372, maxh=330,
  photos=[W('(4).jpg', x=520, y=236, maxw=426, maxh=318, frame=True, anchor='tr')],
  box=dict(t='ROOM FOR<br>EVERYONE.<br>NO EXCUSES.', x=520, y=590, maxw=290, maxh=158, size=26),
  utils=[dict(l='METHOD', b='PRESS RECORD<br>ASK LATER', x=54, y=636, w=170)],
  icons=[dict(k='meter', x=866, y=596, s=30)],
  xmark=(866, 668, 54), hazard=(54, 752), num=(198, 700, 138)),

# 02 — front panel cut-out band (mirrored: headline right)
dict(n=2, unit='M4',
  top='BLEND IT LIVE.<br>DECIDE LATER.',
  panel='IN<br>BLEND<br>OUT',
  head=['MIX', 'IT'], hx=520, hy=196, hw=344, maxh=306,
  photos=[W('(1).png', x=54, y=560, maxw=892, maxh=232)],
  box=dict(t='EARS<br>FIRST.', x=54, y=252, maxw=250, maxh=130, size=30),
  utils=[dict(l='ORDER', b='SET IT<br>THEN LEAVE IT', x=54, y=422, w=176)],
  icons=[dict(k='knob', x=330, y=256, s=30)],
  hazard=(54, 524), num=(330, 400, 116)),

# 03 — rear panel cut-out band
dict(n=3, unit='M4',
  top='ROUTE IT.<br>THEN FORGET IT.',
  panel='PLUG<br>PRESS<br>PLAY',
  head=['ROUT', 'ING'], hx=54, hy=196, hw=396, maxh=306,
  photos=[W('(2).png', x=54, y=560, maxw=892, maxh=232)],
  box=dict(t='NO MENUS.<br>NO MAZE.', x=546, y=252, maxw=282, maxh=130, size=28),
  utils=[dict(l='RULE', b='ONE CABLE<br>ONE PATH', x=546, y=412, w=176)],
  icons=[dict(k='usbc', x=800, y=410, s=32)],
  xmark=(884, 292, 50), hazard=(452, 246), num=(800, 452, 116)),

# 04 — hero three-quarter on the crate
dict(n=4, unit='M4',
  top='PLAY FIRST.<br>EDIT NEVER.',
  panel='ONE<br>TAKE<br>ONLY',
  head=['TRA', 'CK'], hx=54, hy=248, hw=352, maxh=396,
  photos=[W('(2).jpg', x=520, y=236, maxw=426, maxh=306, frame=True, anchor='tr')],
  box=dict(t='FIRST TAKE<br>WINS.', x=520, y=578, maxw=290, maxh=124, size=28),
  utils=[dict(l='NOTE', b='COMMIT<br>THEN MOVE', x=54, y=690, w=170)],
  icons=[dict(k='jack', x=866, y=582, s=30)],
  num=(232, 700, 132), hazard=(404, 660)),

# 05 — loft desk (mirrored: photo left)
dict(n=5, unit='M4',
  top='LAYERS,<br>NOT EXCUSES.',
  panel='SET<br>STACK<br>GO',
  head=['LAY', 'ERS'], hx=520, hy=250, hw=390, maxh=396,
  photos=[W('(1).jpg', x=54, y=236, maxw=426, maxh=310, frame=True)],
  box=dict(t='STACK IT<br>UNTIL IT MOVES.', x=54, y=582, maxw=300, maxh=124, size=26),
  utils=[dict(l='ORDER', b='TRACK<br>THEN TRIM', x=520, y=690, w=176)],
  xmark=(866, 686, 54), num=(54, 726, 126), hazard=(404, 730)),

# 06 — drummer, top-down
dict(n=6, unit='M4',
  top='NO UNDO IN<br>A LIVE ROOM.',
  panel='HIT<br>HOLD<br>KEEP',
  head=['HIT', 'IT'], hx=54, hy=246, hw=318, maxh=392,
  photos=[W('(5).jpg', x=470, y=236, maxw=476, maxh=340, frame=True, anchor='tr')],
  box=dict(t='MISTAKES ARE<br>MASTER TAKES.', x=470, y=612, maxw=320, maxh=124, size=25),
  utils=[dict(l='RULE', b='KEEP THE<br>FIRST PASS', x=54, y=676, w=176)],
  icons=[dict(k='meter', x=866, y=616, s=30)],
  num=(240, 690, 138), hazard=(404, 656)),

# 07 — keys / synth
dict(n=7, unit='M4',
  top='HEADPHONES<br>DON&rsquo;T LIE.',
  panel='CUE<br>CHECK<br>COMMIT',
  head=['PLAY', 'BACK'], hx=54, hy=248, hw=400, maxh=396,
  photos=[W('(6).jpg', x=520, y=236, maxw=426, maxh=330, frame=True, anchor='tr')],
  box=dict(t='TRUST THE<br>MONITOR.', x=520, y=602, maxw=290, maxh=124, size=28),
  utils=[dict(l='METHOD', b='LISTEN LOUD<br>DECIDE QUIET', x=54, y=690, w=182)],
  xmark=(866, 604, 54), num=(238, 700, 132)),

# 08 — desk with laptop (mirrored: photo left)
dict(n=8, unit='M4',
  top='MONITORS TELL<br>THE TRUTH.',
  panel='A<br>B<br>DONE',
  head=['MONI', 'TOR'], hx=520, hy=250, hw=396, maxh=396,
  photos=[W('(7).jpg', x=54, y=236, maxw=426, maxh=306, frame=True)],
  box=dict(t='IF IT MOVES YOU,<br>IT&rsquo;S DONE.', x=54, y=578, maxw=320, maxh=124, size=25),
  utils=[dict(l='NOTE', b='FLAT IS<br>NOT BORING', x=520, y=690, w=176)],
  icons=[dict(k='knob', x=766, y=690, s=30)],
  num=(54, 726, 126), hazard=(404, 730)),

# 09 — macro detail off the hero
dict(n=9, unit='M4',
  top='TURN IT UNTIL<br>IT SITS.',
  panel='MIX<br>MATCH<br>MOVE',
  head=['BLE', 'ND'], hx=54, hy=246, hw=336, maxh=392,
  photos=[W('(2).jpg', x=470, y=236, maxw=476, maxh=330, frame=True, anchor='tr')],
  box=dict(t='STOP FIXING.<br>START FINISHING.', x=470, y=602, maxw=330, maxh=124, size=24),
  utils=[dict(l='ORDER', b='BALANCE<br>THEN BOUNCE', x=54, y=672, w=182)],
  xmark=(866, 604, 54), num=(238, 690, 138), hazard=(404, 656)),

# 10 — closer
dict(n=10, unit='M4',
  top='PRINT IT.<br>MOVE ON.',
  panel='STOP<br>SAVE<br>SHIP',
  head=['NO', 'RE', 'DO'], hx=54, hy=222, hw=268, maxh=520,
  photos=[W('(7).jpg', x=470, y=236, maxw=476, maxh=320, frame=True, anchor='tr')],
  box=dict(t='NOTHING LEFT<br>TO FIX.', x=470, y=592, maxw=300, maxh=112, size=26),
  utils=[dict(l='END', b='THE TAKE<br>IS THE RECORD', x=470, y=740, w=196)],
  icons=[dict(k='meter', x=866, y=596, s=30)],
  xmark=(866, 676, 54), num=(360, 250, 116), rail=False),
]
