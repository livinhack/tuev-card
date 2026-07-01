# b220 – Plate body/background cleanup

b220 is a small Lab-only cleanup after b219.

## Goal

Move the invariant physical plate body/background rendering out of the large SVG renderer without changing any geometry.

## Changes

- Added `src/plate/plate-body.js`.
- Moved the body layer renderer into `renderPlateBody()`.
- The body component renders:
  - black outer frame
  - white reflective inner field
  - blue Euro field background
  - Euro-field components via `renderEuroFieldComponents()`
- `plate-svg-renderer.js` now imports `renderPlateBody()`.

## Behaviour

No intentional layout or dimension changes. Regression remains the technical guard; visual smoke tests can compare b219 and b220 directly.
