# b115 – Card renderer canonical GL font sync

## Context

b114 moved the production Card renderer to the Physical Lab millimetre model. The Lab result was correct, but the Home Assistant Card could still render differently because the production SVG selected a transient candidate font-family name from the asynchronous font availability probe.

If the probe had not yet populated `availablePlateFonts`, or if the active font path differed from the default candidate, the SVG could fall back to a browser font. That broke the visual match with the calibrated mm cells from the Lab.

## Change

The Card renderer now uses the same canonical GL font-family names as the Physical Lab:

- `GL-Nummernschild-Mtl`
- `GL-Nummernschild-Eng`

`src/plate/font.js` now injects canonical `@font-face` aliases for these names. Each alias contains the known HACS/local candidate URLs for the matching GL role.

The previous per-candidate font-family names are still injected for compatibility and availability probing, but the production SVG no longer depends on whichever candidate name was last detected.

## Files

- `src/plate/font.js`
- `src/plate/renderer.js`
- `dist/tuev-card.js`
- `HANDOVER.md`

## Expected result

The Card and Physical Lab should now use the same font identity for the same mm model. The plate is still generated as a complete physical SVG and then scaled only as a whole in the Card.

## Validation

- `npm run check` passed.
- `npm run build` passed.
- No font binary files are included in the ZIP.
