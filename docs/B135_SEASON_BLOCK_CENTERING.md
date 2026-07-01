# b135 – Season block centering

b135 keeps the two-line seasonal field as a Physical-Lab-only feature. The Card remains on the stable one-line production renderer path.

## Why

The seasonal month values live in two fixed physical fields, each 30 × 20 mm. The previous measured calibration centered each rendered month string independently and then averaged the X deltas. For visual comparison against Anlage 4 sketches and real plates, it is more useful to treat the upper and lower month strings as one shared season column.

## Change

- The measurement helper now unions the rendered SVG `getBBox()` extents of both month strings.
- The combined season block is centered inside the fixed 30 mm season column.
- The resulting shared X correction is written back to `Saison X-Korrektur in mm`.
- The readout now reports the combined block width, field width and block-centering delta.
- Vertical calibration still uses the average row-centering delta.
- The separator remains a physical `30 × 3.25 mm` rectangle centered in the 75 mm top band.

No two-line seal geometry changes were made. The b129 seal-circle experiment remains discarded.
