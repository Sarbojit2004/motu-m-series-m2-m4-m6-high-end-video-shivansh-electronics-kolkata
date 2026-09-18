"""The ten MOTU M6 slides.

M6's library runs to thirteen frames across ten slides. Ten lead their own\nslide and the remaining three appear as bands and plates; no frame appears\ntwice on a single slide.

Same design system as every other set: one display line on the measure, a
photograph punched through it, a wide lower photograph, a figure caption under
it, a plate register beside it, and the branding rail.
"""

SPEC = {
"01": dict(
    name="01_motu-m6-interface", labels=("MOTU M6", "Six In Six Out"),
    head=("INTER", "FACE"),
    hero="M6-02", hero_mode="cut", band="M6-03", band_mode="scene", band_pos="center",
    plates=['M6-01', 'M6-06', 'M6-04', 'M6-10'],
    cap_title=("The whole ", "box"),
    cap_body="Six inputs and six outputs on a desktop chassis, with the colour metering screen between the gain controls and a monitor knob at the right-hand end.",
    cap_meta="Above &mdash; on white", band_meta="Below &mdash; with headphones",
),
"02": dict(
    name="02_motu-m6-metering", labels=("The Display", "Input &amp; Playback"),
    head=("MET", "ERING"),
    hero="M6-01", hero_mode="block", band="M6-02", band_mode="bbox", band_pos="center",
    plates=['M6-06', 'M6-03', 'M6-04', 'M6-12'],
    cap_title=("Read on the ", "panel"),
    cap_body="The screen reads input and playback side by side across six channels, with an A/B monitor select and a separate 5-6 monitor path beneath it.",
    cap_meta="Above &mdash; the meter screen", band_meta="Below &mdash; on white",
),
"03": dict(
    name="03_motu-m6-rear-panel", labels=("Rear Panel", "Combo &amp; Line"),
    head=("CONNEC", "TORS"),
    hero="M6-06", hero_mode="block", band="M6-01", band_mode="scene", band_pos="center",
    plates=['M6-02', 'M6-03', 'M6-05', 'M6-09'],
    cap_title=("Out the ", "back"),
    cap_body="Combination inputs alongside line inputs, balanced outputs for two pairs of monitors, and USB-C &mdash; six in and six out along one panel.",
    cap_meta="Above &mdash; the rear panel", band_meta="Below &mdash; the meter screen",
),
"04": dict(
    name="04_motu-m6-monitoring", labels=("Monitoring", "A / B &amp; Phones"),
    head=("MON", "ITORS"),
    hero="M6-03", hero_mode="block", band="M6-07", band_mode="scene", band_pos="center",
    plates=['M6-01', 'M6-10', 'M6-12', 'M6-02'],
    cap_title=("What you ", "hear"),
    cap_body="Two headphone outputs and an A/B monitor select, so a second pair of speakers and a player's own mix are both a button away.",
    cap_meta="Above &mdash; with headphones", band_meta="Below &mdash; a lit room",
),
"05": dict(
    name="05_motu-m6-desktop", labels=("On The Desk", "Screen &amp; Keys"),
    head=("DESK", "TOP"),
    hero="M6-04", hero_mode="block", band="M6-10", band_mode="scene", band_pos="center",
    plates=['M6-12', 'M6-09', 'M6-05', 'M6-02'],
    cap_title=("Beside the ", "screen"),
    cap_body="Photographed in use rather than on a sweep &mdash; on a desk between the screen and the controller, with one cable running back to the machine.",
    cap_meta="Above &mdash; a writing desk", band_meta="Below &mdash; monitors and keys",
),
"06": dict(
    name="06_motu-m6-podcast", labels=("Spoken Word", "Mic Arm"),
    head=("POD", "CAST"),
    hero="M6-09", hero_mode="block", band="M6-12", band_mode="scene", band_pos="center",
    plates=['M6-04', 'M6-10', 'M6-13', 'M6-03'],
    cap_title=("Voices, ", "several"),
    cap_body="Six inputs is a round-table rather than an interview. Here it sits under a boom arm with headphones beside it and the session on the screen.",
    cap_meta="Above &mdash; a table setup", band_meta="Below &mdash; a desk of monitors",
),
"07": dict(
    name="07_motu-m6-tracking", labels=("Tracking", "Drums &amp; Mics"),
    head=("TRACK", "ING"),
    hero="M6-08", hero_mode="block", band="M6-11", band_mode="scene", band_pos="center",
    plates=['M6-09', 'M6-13', 'M6-05', 'M6-04'],
    cap_title=("A whole ", "kit"),
    cap_body="Where six inputs earn their place &mdash; a kit with several microphones up, captured in one pass rather than layered.",
    cap_meta="Above &mdash; a kit, miked", band_meta="Below &mdash; two players, warm room",
),
"08": dict(
    name="08_motu-m6-writing", labels=("Writing", "Laptop &amp; Amp"),
    head=("WRIT", "ING"),
    hero="M6-05", hero_mode="block", band="M6-13", band_mode="scene", band_pos="center",
    plates=['M6-04', 'M6-10', 'M6-12', 'M6-07'],
    cap_title=("While you ", "write"),
    cap_body="A laptop, an amp within reach and the interface on the table between them &mdash; the arrangement most of these boxes spend their life in.",
    cap_meta="Above &mdash; a writing setup", band_meta="Below &mdash; on a sofa, playing",
),
"09": dict(
    name="09_motu-m6-sessions", labels=("Sessions", "Lit Rooms"),
    head=("SESS", "IONS"),
    hero="M6-07", hero_mode="block", band="M6-09", band_mode="scene", band_pos="center",
    plates=['M6-03', 'M6-11', 'M6-08', 'M6-10'],
    cap_title=("Where it ", "lives"),
    cap_body="The frames shot in rooms rather than on a sweep &mdash; headphones on the desk, the lighting whatever the room had, the gear where it fell.",
    cap_meta="Above &mdash; a lit room", band_meta="Below &mdash; a table setup",
),
"10": dict(
    name="10_motu-m6-in-service", labels=("In The Room", "Two Players"),
    head=("STU", "DIOS"),
    hero="M6-11", hero_mode="block", band="M6-05", band_mode="scene", band_pos="center",
    plates=['M6-08', 'M6-13', 'M6-12', 'M6-07', 'M6-10'],
    cap_title=("Rooms, not ", "sweeps"),
    cap_body="Two players in a warm room with the interface on the table, which is the picture the sweep shots never manage to take.",
    cap_meta="Above &mdash; two players", band_meta="Below &mdash; a writing setup",
),
}

# White-sweep frames get a bounding-box trim so the product fills its plate.
# Everything else -- lifestyle, macros on dark, diagrams -- goes in whole.
PREP = {k: dict(mode="bbox") for k in ['M6-02']}  # M6-06 is not a keyable sweep
