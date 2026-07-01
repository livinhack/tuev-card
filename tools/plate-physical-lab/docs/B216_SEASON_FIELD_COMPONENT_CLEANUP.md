# b216 – Season field component cleanup

b216 is a small Lab-only cleanup after b215.

## Goal

Move seasonal validity field SVG rendering out of the large plate SVG renderer and into a dedicated component module.

## Changed

- `src/plate/season-field.js` now owns:
  - `normalizeSeasonMonth()`
  - `getSeasonFieldLayout()`
  - `renderSeasonField()`
- `src/plate/plate-svg-renderer.js` imports the season-field component entry points.
- The row-chain solver, season-field placement, H/E/Saison rules, 8-slot/9-slot guards, Eurofield components and seal components are unchanged.

## Validation

- `npm run check:regression`
- Result: `Regression passed: 41/41 cases OK.`
