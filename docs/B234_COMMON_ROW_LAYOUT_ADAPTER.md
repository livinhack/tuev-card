# b234 – Common row layout adapter cleanup

b234 is a no-geometry-change Lab refactor based on b232 after the user-confirmed smoke checks.

## Goal

Reduce repeated row-positioning code without changing any solved plate geometry.

## Lab changes

- Added `src/plate/row-layout-adapter.js`.
- Centralized solved row item positioning and row metadata attachment.
- `plate-svg-renderer.js` uses the adapter for Reduced row positioning, two-line row metadata and generic linear content positioning.

## Full/Card status

- Card code unchanged.
- `tools/plate-physical-lab/` in the Full ZIP remains intentionally frozen / not synchronized.
- The separate Lab ZIP remains authoritative.

## Validation

- Lab: `Regression passed: 41/41 cases OK.`
- Full: JS and release asset checks passed.
