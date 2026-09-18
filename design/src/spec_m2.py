"""The nine MOTU M2 slides.

M2's supplied library runs to nine frames, so this set is nine slides -- one\nper photograph, each leading its own slide. Bands and plates then draw from\nthe rest, so every frame appears several times but never twice on one slide.

Same design system as every other set: one display line on the measure, a
photograph punched through it, a wide lower photograph, a figure caption under
it, a plate register beside it, and the branding rail.
"""

SPEC = {
"01": dict(
    name="01_motu-m2-interface", labels=("MOTU M2", "Two In Two Out"),
    head=("INTER", "FACE"),
    hero="M2-08", hero_mode="cut", band="M2-01", band_mode="scene", band_pos="center",
    plates=['M2-03', 'M2-09', 'M2-05', 'M2-04'],
    cap_title=("The whole ", "box"),
    cap_body="A two-input desktop interface with a full-colour metering screen between the gain knobs &mdash; the levels read on the unit itself rather than only in the session.",
    cap_meta="Above &mdash; on white", band_meta="Below &mdash; on a working desk",
),
"02": dict(
    name="02_motu-m2-front-panel", labels=("Front Panel", "Gain &amp; Monitor"),
    head=("PRE", "AMPS"),
    hero="M2-03", hero_mode="block", band="M2-09", band_mode="scene", band_pos="center",
    plates=['M2-08', 'M2-04', 'M2-01', 'M2-07'],
    cap_title=("Set by ", "hand"),
    cap_body="Two input channels with their own gain controls, a monitor level and a headphone output, laid across a panel narrow enough to sit beside a keyboard.",
    cap_meta="Above &mdash; the front panel", band_meta="Below &mdash; the rear",
),
"03": dict(
    name="03_motu-m2-rear-panel", labels=("Rear Panel", "Combo In"),
    head=("CONNEC", "TORS"),
    hero="M2-09", hero_mode="block", band="M2-08", band_mode="bbox", band_pos="center",
    plates=['M2-03', 'M2-02', 'M2-06', 'M2-05'],
    cap_title=("Out the ", "back"),
    cap_body="Combination inputs that take a microphone or an instrument in the same socket, balanced outputs for monitors, and a single USB-C connector back to the computer.",
    cap_meta="Above &mdash; the rear panel", band_meta="Below &mdash; on white",
),
"04": dict(
    name="04_motu-m2-desktop", labels=("On The Desk", "With A Keyboard"),
    head=("DESK", "TOP"),
    hero="M2-01", hero_mode="block", band="M2-05", band_mode="scene", band_pos="center",
    plates=['M2-07', 'M2-02', 'M2-08', 'M2-04'],
    cap_title=("Beside the ", "keys"),
    cap_body="MOTU photograph this one in use rather than on a sweep &mdash; on a desk beside a controller keyboard, with one cable running back to the machine.",
    cap_meta="Above &mdash; a writing desk", band_meta="Below &mdash; a room with a guitar",
),
"05": dict(
    name="05_motu-m2-podcast", labels=("Spoken Word", "Mic Arm"),
    head=("POD", "CAST"),
    hero="M2-02", hero_mode="block", band="M2-07", band_mode="scene", band_pos="center",
    plates=['M2-01', 'M2-06', 'M2-03', 'M2-09'],
    cap_title=("Two voices, ", "one box"),
    cap_body="Two inputs is the number a two-handed interview needs. Here it sits under a boom arm on a table, with the session open on the screen behind it.",
    cap_meta="Above &mdash; a table setup", band_meta="Below &mdash; hands on the keys",
),
"06": dict(
    name="06_motu-m2-metering", labels=("The Display", "Read On Panel"),
    head=("MET", "ERING"),
    hero="M2-04", hero_mode="block", band="M2-03", band_mode="scene", band_pos="center",
    plates=['M2-08', 'M2-09', 'M2-01', 'M2-05'],
    cap_title=("Read on the ", "panel"),
    cap_body="The colour screen carries the metering, so setting a level is a glance at the box rather than a trip back into the software.",
    cap_meta="Above &mdash; setting a level", band_meta="Below &mdash; the panel, lit",
),
"07": dict(
    name="07_motu-m2-tracking", labels=("Tracking", "Guitar &amp; Laptop"),
    head=("TRACK", "ING"),
    hero="M2-05", hero_mode="block", band="M2-02", band_mode="scene", band_pos="center",
    plates=['M2-04', 'M2-07', 'M2-06', 'M2-01'],
    cap_title=("Wherever it ", "sits"),
    cap_body="A room rather than a studio &mdash; a laptop, an instrument within reach and the interface on the table between them.",
    cap_meta="Above &mdash; a room with a guitar", band_meta="Below &mdash; under a boom arm",
),
"08": dict(
    name="08_motu-m2-writing", labels=("Writing", "Controller &amp; Screen"),
    head=("WRIT", "ING"),
    hero="M2-07", hero_mode="block", band="M2-06", band_mode="scene", band_pos="center",
    plates=['M2-05', 'M2-01', 'M2-02', 'M2-04'],
    cap_title=("While you ", "write"),
    cap_body="Hands on a controller, the interface alongside and the session on the screen &mdash; the arrangement most of these boxes actually spend their life in.",
    cap_meta="Above &mdash; writing at the desk", band_meta="Below &mdash; a desk by a window",
),
"09": dict(
    name="09_motu-m2-in-service", labels=("In The Room", "By A Window"),
    head=("STU", "DIOS"),
    hero="M2-06", hero_mode="block", band="M2-04", band_mode="scene", band_pos="center",
    plates=['M2-02', 'M2-05', 'M2-01', 'M2-07'],
    cap_title=("Rooms, not ", "sweeps"),
    cap_body="The frames shot where the thing lives &mdash; a desk by a window with the gear stacked as it fell, not arranged for a catalogue.",
    cap_meta="Above &mdash; a desk by a window", band_meta="Below &mdash; setting a level",
),
}

# White-sweep frames get a bounding-box trim so the product fills its plate.
# Everything else -- lifestyle, macros on dark, diagrams -- goes in whole.
PREP = {k: dict(mode="bbox") for k in ['M2-08']}
