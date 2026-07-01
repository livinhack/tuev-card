# b215 – Seal component cleanup

b215 is a small Lab-only cleanup after b214.

## Changed

- Added `src/plate/seal-components.js`.
- Moved generic HU/authority seal geometry resolution into the seal component.
- Moved generic seal SVG rendering into the seal component.
- `plate-svg-renderer.js` still owns the row-chain/layout solver and imports `getSealGeometry()` / `renderSeals()` from the component.

## Not changed

- Reduced auto-width and row-chain rules.
- Reduced H/E, Saison and H/E+Saison rules.
- 8-slot `3 / 4 / 8` and 9-slot `5 / 4 / 6` edge rules.
- Euro-field component geometry.
- Card renderer code.

## Full ZIP status

`tools/plate-physical-lab/` in the Full ZIP is intentionally not synchronised/frozen. The separate Lab ZIP remains authoritative.
