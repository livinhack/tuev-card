# b217 – Debug and dimension layer cleanup

b217 is a small Lab-only cleanup after b216.

The grid, horizontal diagnostics and dimension/measurement overlay rendering were moved from the large `plate-svg-renderer.js` file into `src/plate/debug-dimensions.js`.

No layout geometry is intentionally changed. The new debug module only reads already-solved physical mm layout items and must not solve or mutate row chains, Eurofield geometry, seal placement, season-field placement or width selection.

## Changed files

- `src/plate/debug-dimensions.js`
- `src/plate/plate-svg-renderer.js`
- `README.md`
- `HANDOVER.md`
- `index.html`
- `package.json`
- `docs/B217_DEBUG_DIMENSION_LAYER_CLEANUP.md`

## Validation

- `npm run check:regression`
- Result: `Regression passed: 41/41 cases OK.`

## Preserved behavior

- b213 remains the confirmed Eurofield + Reduced checkpoint.
- b214 centralized Eurofield components.
- b215 centralized seal components.
- b216 centralized season-field rendering.
- b217 centralizes debug/dimension overlays.
- Reduced Standard/H/E/Saison/H/E+Saison behavior is unchanged from b216.
- 8-slot/9-slot Reduced guards remain unchanged.
