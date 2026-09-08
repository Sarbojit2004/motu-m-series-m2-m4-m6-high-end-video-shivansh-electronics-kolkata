"""M6 — ten frames. 12 distinct sources (M6 (11).jpg excluded), all used.
Two frames carry a main shot plus a supporting inset so all 12 fit in 10."""
P = 'MOTU M6 '
def W(src, **k): d = dict(src=P+src); d.update(k); return d

SLIDES = [
# 01 — opener, clean front-on hero
dict(n=1, unit='M6',
  top='EVERYONE PLAYS.<br>NOBODY WAITS.',
  panel='ALL<br>IN<br>AT ONCE',
  head=['M6'], hx=54, hy=252, hw=372, maxh=330,
  photos=[W('(10).jpg', x=520, y=236, maxw=426, maxh=340, frame=True, anchor='tr')],
  box=dict(t='NO ALIBI.<br>JUST THE<br>ROOM.', x=520, y=590, maxw=282, maxh=158, size=27),
  utils=[dict(l='METHOD', b='PRESS RECORD<br>ASK LATER', x=54, y=636, w=170)],
  icons=[dict(k='meter', x=866, y=596, s=30)],
  xmark=(866, 668, 54), hazard=(54, 752), num=(198, 700, 138)),

# 02 — front panel band + meter macro inset
dict(n=2, unit='M6',
  top='CLEAN IN.<br>OR NOTHING.',
  panel='CLEAN<br>QUIET<br>OPEN',
  head=['PRE', 'AMP'], hx=54, hy=190, hw=356, maxh=258,
  photos=[W('(1).png', x=54, y=524, maxw=892, maxh=262),
          W('(1).jpg', x=700, y=262, maxw=246, maxh=200, frame=True, anchor='tr')],
  box=dict(t='CLEAN OR<br>NOTHING.', x=440, y=196, maxw=240, maxh=118, size=26),
  utils=[dict(l='RULE', b='CLEAN AT<br>THE SOURCE', x=440, y=352, w=176)],
  icons=[dict(k='jack', x=660, y=352, s=30)],
  hazard=(54, 462), num=(624, 438, 80)),

# 03 — rear panel band
dict(n=3, unit='M6',
  top='PATCH IT ONCE.<br>PLAY ALL NIGHT.',
  panel='PATCH<br>LOCK<br>GO',
  head=['PA', 'TCH'], hx=54, hy=196, hw=330, maxh=306,
  photos=[W('(2).png', x=54, y=560, maxw=892, maxh=240)],
  box=dict(t='ONE PATCH.<br>ALL NIGHT.', x=546, y=252, maxw=282, maxh=130, size=28),
  utils=[dict(l='ORDER', b='PATCH<br>THEN PLAY', x=546, y=412, w=176)],
  icons=[dict(k='usbc', x=800, y=410, s=32)],
  xmark=(884, 292, 50), hazard=(452, 246), num=(800, 452, 116)),

# 04 — hero three-quarter desk
dict(n=4, unit='M6',
  top='SWITCH IT.<br>TRUST YOUR EARS.',
  panel='THIS<br>OR<br>THAT',
  head=['SWIT', 'CH'], hx=54, hy=248, hw=386, maxh=396,
  photos=[W('(3).jpg', x=520, y=236, maxw=426, maxh=340, frame=True, anchor='tr')],
  box=dict(t='TRUST YOUR<br>EARS.', x=520, y=596, maxw=290, maxh=124, size=28),
  utils=[dict(l='NOTE', b='SWITCH<br>THEN DECIDE', x=54, y=690, w=176)],
  icons=[dict(k='knob', x=866, y=600, s=30)],
  num=(232, 700, 132), hazard=(404, 660)),

# 05 — four-mic podcast table
dict(n=5, unit='M6',
  top='A ROOM FULL<br>OF OPINIONS.',
  panel='SIT<br>SPEAK<br>KEEP',
  head=['HEAD', 'ROOM'], hx=54, hy=248, hw=396, maxh=396,
  photos=[W('(5).jpg', x=520, y=236, maxw=426, maxh=340, frame=True, anchor='tr')],
  box=dict(t='LET THEM<br>TALK.', x=520, y=624, maxw=282, maxh=118, size=28),
  utils=[dict(l='RULE', b='EVERYONE<br>GETS HEARD', x=54, y=690, w=176)],
  xmark=(866, 626, 54), num=(240, 700, 132), hazard=(404, 656)),

# 06 — drum room
dict(n=6, unit='M6',
  top='THE BAND DOESN&rsquo;T<br>WAIT FOR YOU.',
  panel='COUNT<br>IN<br>GO',
  head=['BA', 'ND'], hx=54, hy=246, hw=300, maxh=392,
  photos=[W('(4).jpg', x=566, y=236, maxw=380, maxh=360, frame=True, anchor='tr')],
  box=dict(t='THE COUNT-IN<br>IS THE PLAN.', x=520, y=632, maxw=310, maxh=118, size=25),
  utils=[dict(l='ORDER', b='COUNT<br>THEN COMMIT', x=54, y=676, w=182)],
  icons=[dict(k='meter', x=866, y=636, s=30)],
  num=(238, 690, 138), hazard=(404, 640)),

# 07 — live duo
dict(n=7, unit='M6',
  top='ONE NIGHT.<br>NO SECOND PASS.',
  panel='ONE<br>NIGHT<br>ONLY',
  head=['CUE', 'UP'], hx=54, hy=246, hw=330, maxh=392,
  photos=[W('(7).jpg', x=470, y=236, maxw=476, maxh=340, frame=True, anchor='tr')],
  box=dict(t='NO SECOND<br>PASS.', x=470, y=572, maxw=290, maxh=124, size=28),
  utils=[dict(l='NOTE', b='THE NIGHT<br>IS THE TAKE', x=54, y=676, w=176)],
  xmark=(866, 578, 54), num=(238, 690, 138), hazard=(404, 656)),

# 08 — studio desk + home-studio inset
dict(n=8, unit='M6',
  top='THE DESK REMEMBERS<br>EVERY TAKE.',
  panel='SET<br>HOLD<br>KEEP',
  head=['SESS', 'ION'], hx=54, hy=248, hw=396, maxh=380,
  photos=[W('(6).jpg', x=520, y=236, maxw=426, maxh=300, frame=True, anchor='tr'),
          W('(8).jpg', x=700, y=500, maxw=246, maxh=200, frame=True, anchor='tr')],
  box=dict(t='THE DESK<br>REMEMBERS.', x=54, y=674, maxw=300, maxh=118, size=27),
  utils=[dict(l='METHOD', b='SET IT<br>LEAVE IT', x=396, y=676, w=170)],
  num=(396, 496, 116), hazard=(404, 620)),

# 09 — couch / guitar
dict(n=9, unit='M6',
  top='COMFORT IS NOT<br>THE ENEMY.',
  panel='SIT<br>PLAY<br>STAY',
  head=['LIS', 'TEN'], hx=54, hy=246, hw=330, maxh=392,
  photos=[W('(9).jpg', x=566, y=236, maxw=380, maxh=360, frame=True, anchor='tr')],
  box=dict(t='PLAY WHERE<br>YOU SIT.', x=520, y=632, maxw=300, maxh=118, size=27),
  utils=[dict(l='RULE', b='SIT DOWN<br>STAY DOWN', x=54, y=676, w=176)],
  icons=[dict(k='knob', x=866, y=636, s=30)],
  num=(238, 690, 138), hazard=(404, 640)),

# 10 — closer
dict(n=10, unit='M6',
  top='CALL IT.<br>WALK AWAY.',
  panel='CALL<br>IT<br>DONE',
  head=['NO', 'NO', 'TES'], hx=54, hy=222, hw=268, maxh=520,
  photos=[W('(2).jpg', x=470, y=236, maxw=476, maxh=330, frame=True, anchor='tr')],
  box=dict(t='CALL IT.<br>WALK AWAY.', x=470, y=602, maxw=300, maxh=112, size=26),
  utils=[dict(l='END', b='NOTHING LEFT<br>TO SAY', x=470, y=746, w=196)],
  icons=[dict(k='meter', x=866, y=606, s=30)],
  xmark=(866, 686, 54), num=(360, 250, 116), rail=False),
]
