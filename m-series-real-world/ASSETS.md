# The B-roll assets — how they get in

The ten clips are generated and sitting in the Higgsfield gallery. They cannot
be fetched from here: this session's egress policy blocks `cloudfront.net`,
which is where Higgsfield serves every result. It is a policy denial, not a
transient failure, so it is reported rather than worked around.

```
d8j0ntlcm91z4.cloudfront.net   403 CONNECT   policy denial   <- results live here
d2ol7oe51mr4n9.cloudfront.net  403 CONNECT   policy denial
higgsfield.ai                  403 CONNECT   policy denial
s3.amazonaws.com               307           allowed         <- uploads went out this way
github.com                     reachable                     <- so assets come back this way
```

Uploading the product references worked because those go to an S3 host, which
is permitted. Reading a generated file back does not, and the S3 bucket refuses
an unsigned GET, so there is no round trip.

## What to do

Download the ten clips from the gallery and drop them in `public/broll/` under
exactly these names. The shot plan refers to them by name, so anything else
will not bind.

| file | deployment | hero | generation |
|---|---|---|---|
| `broll-01-home-studio.mp4` | Home studio, late night | M2 | `dae1bf3c` |
| `broll-02-podcast-table.mp4` | Four-seat podcast table | M6 | `7f44c17c` |
| `broll-03-teaching-lab.mp4` | Music-college teaching lab | all three | `237f0519` |
| `broll-04-rehearsal.mp4` | Band rehearsal, tracking live | M6 | `aca6058b` |
| `broll-05-location-kit.mp4` | Location kit on a tailgate | M2 | `c45acab8` |
| `broll-06-streaming-desk.mp4` | Creator's streaming desk | M4 | `d36d5bf1` |
| `broll-07-dealer-counter.mp4` | Dealer demo counter | all three | `685f0963` |
| `broll-08-listening-room.mp4` | Critical-listening room | M6 | `c9bac5b3` |
| `broll-09-live-event.mp4` | Live event AV position | M6 | `48c292fb` |
| `broll-10-producers.mp4` | Two producers, 1 a.m. | M4 | `123f3f7f` |

Every one is 1920 x 1080, 5.000 s, 30 fps, silent, generated on Kling v3.0 in
pro mode from a Nano Banana Pro start frame built on the real product
photography in this repository.

Committing them to this branch is enough — `github.com` is reachable from the
session, so they can be pulled straight in.

## What happens to them then

`scripts/prep_broll.py` takes over: it measures each clip, retimes it so every
source frame lands on exactly one output frame, and writes the manifest the
shot plan reads. Nothing is cropped to a diagonal, sliced or shown in part, in
either film.

* **Explainer** — each clip plays complete, at native speed, all five seconds.
* **Reel** — the main section of each, cut to the line it belongs to.

The clips were composed centre-weighted on purpose, so the one 16:9 set
survives the reel's 9:16 framing without the subject leaving frame.
