"""M2 — ten frames. 9 distinct sources, all used."""
P = 'MOTU M2 '
def W(src, **k): d = dict(src=P+src); d.update(k); return d

SLIDES = [
# 01 — opener, clean studio hero
dict(n=1, unit='M2',
  top='SOUND ISN&rsquo;T POLITE.<br>IT&rsquo;S HONEST.',
  panel='RAW<br>DIRECT<br>UNFILTERED',
  head=['M2'], hx=54, hy=252, hw=372, maxh=330,
  photos=[W('(8).jpg', x=520, y=236, maxw=426, maxh=318, frame=True, anchor='tr')],
  box=dict(t='NO ALIBI.<br>JUST THE<br>TAKE.', x=520, y=590, maxw=282, maxh=158, size=27),
  utils=[dict(l='METHOD', b='PRESS RECORD<br>ASK LATER', x=54, y=636, w=170)],
  icons=[dict(k='meter', x=866, y=596, s=30)],
  xmark=(866, 668, 54), hazard=(54, 752), num=(198, 700, 138)),

# 02 — front panel cut-out as a full-width band
dict(n=2, unit='M2',
  top='SIGNAL FIRST.<br>EVERYTHING ELSE LATER.',
  panel='IN<br>THROUGH<br>OUT',
  head=['SIG', 'NAL'], hx=54, hy=196, hw=352, maxh=306,
  photos=[W('(2).png', x=54, y=560, maxw=892, maxh=232)],
  box=dict(t='NOISE<br>IS DATA.', x=520, y=252, maxw=252, maxh=132, size=29),
  utils=[dict(l='ORDER', b='PLAY<br>THEN THINK', x=520, y=424, w=170)],
  icons=[dict(k='jack', x=792, y=424, s=30)],
  hazard=(452, 246), num=(800, 452, 116)),

# 03 — rear panel cut-out
dict(n=3, unit='M2',
  top='PLUG IT IN.<br>STOP READING.',
  panel='PLUG<br>PRESS<br>PLAY',
  head=['CONN', 'ECT'], hx=54, hy=196, hw=390, maxh=306,
  photos=[W('(9).png', x=54, y=560, maxw=892, maxh=232)],
  box=dict(t='ROUTE IT.<br>FORGET IT.', x=546, y=252, maxw=272, maxh=130, size=28),
  utils=[dict(l='RULE', b='NO SECOND<br>GUESSES', x=546, y=412, w=170)],
  icons=[dict(k='usbc', x=800, y=410, s=32)],
  xmark=(884, 292, 50), hazard=(452, 246), num=(800, 452, 116)),

# 04 — desk hero, wood + brick
dict(n=4, unit='M2',
  top='THE FIRST TAKE<br>ALREADY KNOWS.',
  panel='ONE<br>TAKE<br>ONLY',
  head=['TAKE', 'ONE'], hx=54, hy=248, hw=386, maxh=396,
  photos=[W('(1).jpg', x=520, y=236, maxw=426, maxh=300, frame=True, anchor='tr')],
  box=dict(t='FIRST TAKE<br>WINS.', x=520, y=572, maxw=282, maxh=124, size=28),
  utils=[dict(l='NOTE', b='THE ROOM<br>IS THE FX', x=54, y=688, w=170)],
  icons=[dict(k='knob', x=866, y=590, s=30)],
  num=(232, 700, 132), hazard=(54, 620)),

# 05 — glass table / couch lifestyle
dict(n=5, unit='M2',
  top='THE ROOM IS PART<br>OF THE TAKE.',
  panel='SET<br>LEVEL<br>GO',
  head=['ROOM', 'TONE'], hx=54, hy=248, hw=390, maxh=396,
  photos=[W('(3).jpg', x=520, y=236, maxw=426, maxh=306, frame=True, anchor='tr')],
  box=dict(t='THE ROOM<br>STAYS IN.', x=520, y=578, maxw=282, maxh=124, size=28),
  utils=[dict(l='RULE', b='LEAVE THE<br>BLEED IN', x=54, y=690, w=170)],
  xmark=(866, 578, 54), num=(232, 700, 132)),

# 06 — amp + guitar
dict(n=6, unit='M2',
  top='LOUD IS A DECISION.<br>NOT AN ACCIDENT.',
  panel='LOUD<br>CLEAR<br>DONE',
  head=['LOU', 'DER'], hx=54, hy=248, hw=356, maxh=396,
  photos=[W('(4).jpg', x=520, y=236, maxw=426, maxh=310, frame=True, anchor='tr')],
  box=dict(t='LOUD IS<br>A CHOICE.', x=520, y=582, maxw=282, maxh=124, size=28),
  utils=[dict(l='METHOD', b='TURN IT UP<br>THEN COMMIT', x=54, y=690, w=178)],
  icons=[dict(k='meter', x=866, y=582, s=30)],
  num=(240, 700, 132), hazard=(54, 618)),

# 07 — producer at desk
dict(n=7, unit='M2',
  top='GAIN IS NOT<br>A SUGGESTION.',
  panel='SET<br>IT<br>ONCE',
  head=['GA', 'IN'], hx=54, hy=246, hw=306, maxh=392,
  photos=[W('(5).jpg', x=470, y=236, maxw=476, maxh=356, frame=True, anchor='tr')],
  box=dict(t='STOP<br>POLISHING.', x=470, y=628, maxw=282, maxh=124, size=28),
  utils=[dict(l='ORDER', b='LEVEL<br>THEN LISTEN', x=54, y=676, w=170)],
  xmark=(866, 630, 54), num=(238, 690, 138), hazard=(404, 660)),

# 08 — top-down keys
dict(n=8, unit='M2',
  top='RECORD IT BEFORE<br>YOU OVERTHINK IT.',
  panel='NOW<br>NOT<br>LATER',
  head=['PRE', 'SS'], hx=54, hy=248, hw=330, maxh=392,
  photos=[W('(6).jpg', x=470, y=236, maxw=476, maxh=330, frame=True, anchor='tr')],
  box=dict(t='DONE BEATS<br>PERFECT.', x=470, y=602, maxw=300, maxh=124, size=27),
  utils=[dict(l='NOTE', b='THE TAKE<br>IS THE PLAN', x=54, y=666, w=170)],
  icons=[dict(k='knob', x=866, y=604, s=30)],
  num=(232, 690, 138)),

# 09 — podcast room (the cross-set duplicate: this unit is an M2)
dict(n=9, unit='M2',
  top='SILENCE IS ALSO<br>A SIGNAL.',
  panel='CUT<br>KEEP<br>MOVE',
  head=['ON', 'AIR'], hx=54, hy=246, hw=336, maxh=392,
  photos=[W('(10).jpg', x=470, y=236, maxw=476, maxh=340, frame=True, anchor='tr')],
  box=dict(t='TAKE IT<br>OR LEAVE IT.', x=470, y=612, maxw=300, maxh=124, size=27),
  utils=[dict(l='RULE', b='ONE MIC<br>ONE CHANCE', x=54, y=672, w=170)],
  xmark=(866, 614, 54), num=(238, 690, 138), hazard=(404, 656)),

# 10 — closer
dict(n=10, unit='M2',
  top='PRINT IT.<br>MOVE ON.',
  panel='STOP<br>SAVE<br>SHIP',
  head=['NO', 'RE', 'TAKE'], hx=54, hy=222, hw=272, maxh=520,
  photos=[W('(1).jpg', x=470, y=236, maxw=476, maxh=320, frame=True, anchor='tr')],
  box=dict(t='PRINT IT.', x=470, y=592, maxw=282, maxh=112, size=30),
  utils=[dict(l='END', b='NOTHING LEFT<br>TO FIX', x=470, y=740, w=190)],
  icons=[dict(k='meter', x=866, y=596, s=30)],
  xmark=(866, 676, 54), num=(360, 250, 116), rail=False),
]
