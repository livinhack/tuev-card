# b236 – Spacing Surface Result Helper Cleanup

## Goal

Continue the safe cleanup line after b235 without changing renderer behavior.

The only target was repeated boilerplate around already-existing spacing-surface balancing wrappers.

## Implementation

Changed file:

- `src/plate/plate-svg-renderer.js`

Added helper:

- `createSpacingSurfaces(spacingItems, sideMin, { getMinWidth, getMaxWidth })`
- `spacingSurfaceResult(surfaces, sideMin, reason)`

Existing wrappers remain in place and still own their rule-specific accessors and reason strings:

- `balanceTopRowSpacingSurfaces()`
- `balanceBottomRowSpacingSurfaces()`
- `balanceOneLineSeasonSpacingSurfaces()`

## Explicit non-goals

This does not merge solver families and does not infer that top-row, bottom-row, and one-line-season logic are semantically identical.

The caller still supplies the variant-specific min/max accessors:

- Top row uses `getTopRowSpacingMinWidth()` / `getTopRowSpacingMaxWidth()`
- Bottom H/E uses `getItemMinWidth()` / `getItemMaxWidth()`
- One-line season uses `getOneLineSeasonSpacingMinWidth()` / `getOneLineSeasonSpacingMaxWidth()`

## Verification

- Regression: `41/41 cases OK`
- b235 vs b236 model hashes: `41/41 identical`
- b235 vs b236 SVG hashes: `41/41 identical`

## Notes

The earlier broken broad cleanup line must stay discarded. b236 is only this defensive cleanup based on the visually accepted b235.
