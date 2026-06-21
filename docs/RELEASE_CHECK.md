# Release / Check Notes

Current checked version: `b111`.

## b111 physical lab check notes

- Physical Lab remains separate from the Home Assistant card renderer.
- CAD/mm rule remains unchanged: the physical model is built entirely in millimetres; the viewer only scales the finished SVG.
- b111 keeps law-oriented automatic font selection and the physical layout solver:
  - Mittelschrift is the default.
  - Engschrift is selected only when Mittelschrift does not fit the relevant width cap.
  - `Auto` width uses 520 mm as the one-line maximum width.
  - A fixed width simulates a restricted mounting position in the lab.
- b111 does not mix Middle/Narrow within one plate; if necessary, the full lab plate switches to Engschrift.
- Shared `I` width remains 35.5 mm as a calibrated GL value, not an officially proven individual dimension.

## Version sync

- `package.json`: `0.1.1-b111`
- `dist/tuev-card.js` should start with `// TÜV Card bundled b111` after build.
- `src/tuev-card-entry.js` should start with `// TÜV Card source entry b111`.
- Source imports should use `?v=b111`.


## b111 diagnostic addition

- In-place SVG dimension lines are available for solved outside margins, seal column, character gaps and group gaps.
- This is diagnostic only; no geometry changes from b110.
