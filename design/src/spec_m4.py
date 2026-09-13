"""The ten MOTU M4 slides.

M4's library runs to ten frames and this set is ten slides, one per\nphotograph. Bands and plates draw from the rest, so every frame appears\nseveral times but never twice on one slide.

Same design system as every other set: one display line on the measure, a
photograph punched through it, a wide lower photograph, a figure caption under
it, a plate register beside it, and the branding rail.
"""

SPEC = {
"01": dict(
    name="01_motu-m4-interface", labels=("MOTU M4", "Four In Four Out"),
    head=("INTER", "FACE"),
    hero="M4-06", hero_mode="cut", band="M4-01", band_mode="scene", band_pos="center",
    plates=['M4-02', 'M4-04', 'M4-10', 'M4-09'],
    cap_title=("The whole ", "box"),
    cap_body="Four inputs and four outputs on a desktop chassis, with the colour metering screen sitting between the gain controls where the levels can be read at a glance.",
    cap_meta="Above &mdash; on white", band_meta="Below &mdash; on a working desk",
),
"02": dict(
    name="02_motu-m4-front-panel", labels=("Front Panel", "Gain &amp; Monitor"),
    head=("PRE", "AMPS"),
    hero="M4-02", hero_mode="block", band="M4-10", band_mode="scene", band_pos="center",
    plates=['M4-06', 'M4-04', 'M4-01', 'M4-03'],
    cap_title=("Set by ", "hand"),
    cap_body="A gain control for each input, monitor level, and two headphone outputs &mdash; enough for a player and an engineer to hear different things.",
    cap_meta="Above &mdash; the front panel", band_meta="Below &mdash; the panel, wide",
),
"03": dict(
    name="03_motu-m4-rear-panel", labels=("Rear Panel", "Combo &amp; Line"),
    head=("CONNEC", "TORS"),
    hero="M4-04", hero_mode="block", band="M4-09", band_mode="scene", band_pos="center",
    plates=['M4-02', 'M4-10', 'M4-06', 'M4-05'],
    cap_title=("Out the ", "back"),
    cap_body="Two combination inputs alongside a pair of line inputs, balanced monitor outputs, and USB-C &mdash; four in and four out on one panel.",
    cap_meta="Above &mdash; the rear panel", band_meta="Below &mdash; monitors on a desk",
),
"04": dict(
    name="04_motu-m4-metering", labels=("The Display", "Read On Panel"),
    head=("MET", "ERING"),
    hero="M4-10", hero_mode="block", band="M4-02", band_mode="scene", band_pos="center",
    plates=['M4-06', 'M4-04', 'M4-01', 'M4-07'],
    cap_title=("Read on the ", "panel"),
    cap_body="The screen reads input and output together, so a level is set by looking at the box rather than by going back into the session.",
    cap_meta="Above &mdash; the meter screen", band_meta="Below &mdash; the front panel",
),
"05": dict(
    name="05_motu-m4-desktop", labels=("On The Desk", "By A Window"),
    head=("DESK", "TOP"),
    hero="M4-01", hero_mode="block", band="M4-09", band_mode="scene", band_pos="center",
    plates=['M4-03', 'M4-05', 'M4-06', 'M4-10'],
    cap_title=("Beside the ", "screen"),
    cap_body="Photographed in use rather than on a sweep &mdash; on a desk by a window with the session open beside it and a single cable back to the machine.",
    cap_meta="Above &mdash; a desk by a window", band_meta="Below &mdash; under monitors",
),
"06": dict(
    name="06_motu-m4-podcast", labels=("Spoken Word", "Mic Arm"),
    head=("POD", "CAST"),
    hero="M4-05", hero_mode="block", band="M4-03", band_mode="scene", band_pos="center",
    plates=['M4-01', 'M4-09', 'M4-02', 'M4-07'],
    cap_title=("Two voices, ", "one box"),
    cap_body="Four inputs covers an interview with room to spare. Here it sits on a table under a boom arm, with a second chair across from it.",
    cap_meta="Above &mdash; a table setup", band_meta="Below &mdash; close, in a room",
),
"07": dict(
    name="07_motu-m4-tracking", labels=("Tracking", "Drums &amp; Mics"),
    head=("TRACK", "ING"),
    hero="M4-07", hero_mode="block", band="M4-08", band_mode="scene", band_pos="center",
    plates=['M4-05', 'M4-01', 'M4-04', 'M4-06'],
    cap_title=("More than ", "two"),
    cap_body="Where the extra pair of inputs earns its place &mdash; a percussion take with more than one microphone up, captured in one pass.",
    cap_meta="Above &mdash; a percussion take", band_meta="Below &mdash; hands on the keys",
),
"08": dict(
    name="08_motu-m4-writing", labels=("Writing", "Controller &amp; Keys"),
    head=("WRIT", "ING"),
    hero="M4-08", hero_mode="block", band="M4-05", band_mode="scene", band_pos="center",
    plates=['M4-03', 'M4-09', 'M4-01', 'M4-10'],
    cap_title=("While you ", "write"),
    cap_body="Hands on the keys with the interface alongside &mdash; the arrangement most of these boxes spend their working life in.",
    cap_meta="Above &mdash; writing at the keys", band_meta="Below &mdash; a table setup",
),
"09": dict(
    name="09_motu-m4-monitors", labels=("Monitoring", "Two Pairs Out"),
    head=("MON", "ITORS"),
    hero="M4-09", hero_mode="block", band="M4-01", band_mode="scene", band_pos="center",
    plates=['M4-02', 'M4-10', 'M4-04', 'M4-03'],
    cap_title=("What you ", "hear"),
    cap_body="Balanced outputs feeding a pair of nearfields, with the headphone outputs carrying their own mix for whoever is playing.",
    cap_meta="Above &mdash; under monitors", band_meta="Below &mdash; a desk by a window",
),
"10": dict(
    name="10_motu-m4-in-service", labels=("In The Room", "Close Up"),
    head=("STU", "DIOS"),
    hero="M4-03", hero_mode="block", band="M4-07", band_mode="scene", band_pos="center",
    plates=['M4-05', 'M4-08', 'M4-01', 'M4-09'],
    cap_title=("Rooms, not ", "sweeps"),
    cap_body="The frames shot where the thing lives &mdash; on a crowded desk with the plants and the cabling and the wear the room happened to have.",
    cap_meta="Above &mdash; close, in a room", band_meta="Below &mdash; a percussion take",
),
}

# White-sweep frames get a bounding-box trim so the product fills its plate.
# Everything else -- lifestyle, macros on dark, diagrams -- goes in whole.
PREP = {k: dict(mode="bbox") for k in ['M4-06']}
