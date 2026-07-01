# b230 – Public API / renderer entry cleanup

b230 keeps the b229 geometry unchanged and makes the Lab public API boundary clearer.

## Changed

- Added `src/plate/plate-public-api.js`.
- `src/plate/mm-model.js` now forwards through the public API boundary.
- `src/plate/spacing-solver.js` remains a compatibility boundary and forwards through the public API boundary.
- Added `renderPlateSvg` as alias for `renderPlateSvgMm`.

## Not changed

- No geometry changes.
- No Reduced width/spacing/template changes.
- No H/E or season changes.
- No Card integration.

## Validation

- `npm run check:regression`
- Expected: `Regression passed: 41/41 cases OK.`
