# b137 – Two-line season typography width factor

b137 is a Physical Lab refinement only. The production Card remains on the stable one-line Physical-Lab renderer path from b116/b117.

## Scope

The b136 spacing solver remains unchanged:

- two-line top-row `*`, `**`, 8–25 mm seal gap, and seasonal `*` gap are balanced together;
- the b129 seal-circle change stays reverted;
- the b128/b130 two-line seal geometry remains active;
- the season field stays two explicit `30 × 20 mm` DIN month fields plus a `30 × 3.25 mm` centered separator.

## Season typography

The season month glyphs now have an independent width calibration:

- target visible glyph height remains `20 mm`;
- font weight is fixed to normal/400;
- new lab control: `Season width scale` / `Saison Breitenfaktor`;
- default width scale is `0.85`;
- valid range is `0.60–1.20`.

The width factor is applied only to the season text glyph group. It does not change the physical season field, the separator bar, the top-row spacing solver, or any plate geometry.

## Measurement change

Because the season text is now rendered inside a scaled SVG group, the lab measurement now uses transformed screen-to-SVG bounding boxes. This makes the existing block-centering button measure the actually rendered season glyph block and center that common block inside the `30 mm` season column.

## Manual use

1. Keep the season target glyph height at `20 mm`.
2. Adjust the width factor to compare the DIN month strings with Anlage-4 references or real examples.
3. Use `Saison-Block aus Messung zentrieren/skalieren` after width/height changes.
4. Use X offset only for final manual correction if the measured block centering is not visually satisfactory.

