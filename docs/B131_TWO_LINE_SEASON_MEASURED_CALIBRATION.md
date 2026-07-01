# b131 – Two-line season measured calibration

b131 keeps the b128/b130 two-line seal geometry. The b129 seal-circle experiment remains discarded.

The seasonal validity area remains Lab-only and consists of two explicit `30 × 20 mm` month fields inside the upper 75 mm row band. The separator remains a physical `30 × 3.25 mm` rectangle, vertically centered in that 75 mm band.

## Why this step exists

The b130 controls exposed target glyph height, SVG font size and baseline Y, but the target height was not actionable. SVG `font-size` is not equal to visible glyph height, and the visual center of a glyph can differ from the baseline-based field center. That made the seasonal months look too large or slightly off-center depending on the loaded DIN font.

## New Lab-only calibration helper

The Physical Lab now measures the rendered season month glyphs with the browser SVG `getBBox()` API. The measurement remains outside the physical model; it is a Lab calibration aid only.

New controls/readout:

- season X offset in mm;
- button: apply measured season calibration;
- live season measurement readout.

The helper performs:

1. measure upper and lower month glyph bounding boxes;
2. scale the season SVG font size so the tallest month reaches the target glyph height;
3. adjust the upper baseline so the measured glyph boxes are vertically centered in their `30 × 20 mm` fields;
4. adjust the X offset so both month glyphs are horizontally centered in their fields.

The resulting values stay explicit in the Lab controls and can be further adjusted manually.

## Scope

- Lab-only.
- No production Card integration.
- No change to one-line rendering.
- No font binary files are included in ChatGPT ZIPs.
