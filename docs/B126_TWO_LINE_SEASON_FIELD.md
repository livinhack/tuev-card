# b126 – Two-line seasonal validity field

b126 keeps the two-line plate renderer Lab-only and adds the first seasonal validity field model for `Anlage 4 · Abschnitt 2 Nr. 2 · zweizeilig`.

## Scope

- Production Card rendering remains unchanged: the Card continues to use the stable one-line Physical Lab renderer path.
- The seasonal field is available only in the Physical Lab for the two-line format.
- The model remains CAD-like: all geometry is in millimetres and the viewer only scales the complete SVG.

## New geometry

The two-line seasonal validity field is modelled as a top-row item on the right side after the neutral 45 mm seal field:

```text
district
→ seal gap 8-25 mm
→ 45 mm seal field
→ season gap 8 mm
→ 30 mm season field
```

The seasonal field uses the dimensions from the provided Anlage-4 crop:

```text
field width: 30 mm
month stack: 20 / 3.25 / 20 mm
standard value: 04 / 10
```

The stack is vertically centred inside the 75 mm top character band. The separator line is drawn between the two month values.

## UI

The Physical Lab now has controls for:

- enabling/disabling the seasonal field;
- season start month;
- season end month.

The defaults are enabled, `04` and `10` so the new geometry is visible immediately when the Lab opens in two-line mode.

## Active carried-over rules

- Two-line width choices remain `340 / 320 / 280 / 260` mm.
- Top-row district-to-seal gap remains `8-25 mm`.
- Lower-row group gaps remain `24-30 mm`, or `20-30 mm` for final H/E suffixes.
- Two-line Euro field remains `40 × 88 mm` with `10 / 30 / 17 / 20 / 11 mm` inner split.
- Two-line seal placeholders remain vertically aligned to the one-line upper reference: HU center `29.5 mm`, authority seal center `75.5 mm`.
