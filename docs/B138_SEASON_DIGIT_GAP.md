# b138 – Two-line season digit gap control

b138 is a Physical Lab refinement only. The production Card remains on the stable one-line Physical-Lab renderer path from b116/b117.

## Goal

The seasonal validity field already uses fixed construction geometry:

- upper season field: `30 × 20 mm`
- lower season field: `30 × 20 mm`
- separator: `30 × 3.25 mm`, vertically centered
- shared season column: `30 mm`

b138 adds a separate typography control for the spacing between the two digits of a month value such as `0><4`.

## New control

`Saison Zifferngap in mm`

- Default: `0 mm`
- Range: `-5 … 10 mm`
- Step: `0.25 mm`

The value is applied as SVG letter spacing between the two month digits. Because the season glyphs can also be horizontally scaled by the existing width factor, the model compensates the SVG letter-spacing value so that the requested gap acts in final millimetre space after the width transform.

## Retained behaviour

- The season width factor remains independent.
- The shared BBox-centering measurement continues to union the rendered upper and lower month strings and center that combined block in the 30-mm season column.
- The physical 30-mm season column and all Anlage-4 spacing surfaces remain unchanged.
- b129 seal-circle changes remain reverted; the b128/b130 two-line seal geometry stays active.

## Status

Two-line and seasonal plates remain Lab-only. No Card integration was done in this step.
