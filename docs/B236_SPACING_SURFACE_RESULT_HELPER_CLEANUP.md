# b236 – Spacing Surface Result Helper Cleanup

## Purpose

Continue the safe cleanup line after b235 without changing renderer behavior.

## Lab change

Only repeated spacing-surface boilerplate was centralized in the Lab renderer.

Changed file in authoritative Lab ZIP:

- `src/plate/plate-svg-renderer.js`

New helpers:

- `createSpacingSurfaces(spacingItems, sideMin, { getMinWidth, getMaxWidth })`
- `spacingSurfaceResult(surfaces, sideMin, reason)`

Existing rule-specific wrappers remain:

- `balanceTopRowSpacingSurfaces()`
- `balanceBottomRowSpacingSurfaces()`
- `balanceOneLineSeasonSpacingSurfaces()`

## Safety

No geometry, rule, solver-family, Reduced, Card, or font behavior was changed.

## Verification

- Lab regression: `41/41 cases OK`
- b235 vs b236 model hashes: `41/41 identical`
- b235 vs b236 SVG hashes: `41/41 identical`
- Full/Card check: passes

## Full ZIP note

`tools/plate-physical-lab/` in the Full ZIP remains frozen / not authoritative. Use the separate Lab ZIP for renderer validation.
