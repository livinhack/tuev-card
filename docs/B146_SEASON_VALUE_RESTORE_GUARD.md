# b146 – Season value restore guard

This is a Physical Lab stability update with no geometry changes.

Some browsers restore number-input values after a Live Server reload or after the Lab UI structure changes. Because the season typography controls changed several times between b130 and b145, restored values could appear shifted between fields. Typical broken values were `28 / 37.5 / 17.5` instead of the intended `20 / 28 / 37.5`.

b146 adds a guard in `tools/plate-physical-lab/app.js`:

- disables autocomplete metadata for Lab inputs,
- detects known shifted season rows,
- detects out-of-range values caused by older measurement-calibration states,
- resets only the season typography controls to the deterministic defaults.

Defaults:

- visible target glyph height: `20`
- SVG font size: `28`
- upper baseline Y: `37.5`
- width factor: `1`
- digit gap: `1.5`

The b145 deterministic season centering remains unchanged. The month string is still centered by construction inside the fixed 30 mm field.
