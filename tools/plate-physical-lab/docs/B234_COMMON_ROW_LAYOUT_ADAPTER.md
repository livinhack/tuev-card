# b234 – Common row layout adapter cleanup

b234 is a small no-geometry-change refactor based on b232 after the user confirmed the b230/b232 smoke tests.

## Goal

Reduce repeated row-positioning code without changing any solved plate geometry.

## Changes

- Added `src/plate/row-layout-adapter.js`.
- Centralized the generic bridge from solved row sequences to positioned render items:
  - solved item width resolution from `itemWidths` / `charGap` / `groupGap` / `sealGap` / `seasonGap`
  - x-cursor placement
  - row metadata attachment (`rowKey`, character band, baseline, content limits)
- `plate-svg-renderer.js` now uses the adapter for:
  - Reduced row sequence positioning
  - two-line row metadata attachment
  - generic linear content positioning

## Non-goals

- No width-selection change.
- No Reduced H/E/Saison or 8-slot/9-slot behavior change.
- No Eurofield, seal, season-field, debug-layer or Card change.

## Validation

- `npm run check:regression`
- Result: `Regression passed: 41/41 cases OK.`
