# b263 – Visual Style Module Cleanup

Small module cleanup based on the visually confirmed b262 checkpoint.

## Scope

- Adds `src/plate/plate-visual-style.js`.
- Moves color-mode/visual-style helper logic out of `plate-svg-renderer.js`:
  - `resolveVisualStyle()`
  - `resolveSeasonForVisualStyle()`
- Keeps all renderer geometry, seal logic, change-plate logic, UI, and regression cases unchanged.

## Safety

This is a no-geometry-change cleanup. Rendering output is expected to remain byte-identical for the existing regression cases and change-plate smoke cases.
