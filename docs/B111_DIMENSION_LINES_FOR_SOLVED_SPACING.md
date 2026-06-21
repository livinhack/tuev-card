# b111 Dimension Lines for Solved Spacing

b111 updates the standalone physical plate lab only. The physical millimetre model and solver geometry from b110 remain unchanged.

## Purpose

The solved spacing values were already available in the metrics table, but it was hard to associate values with the exact area in the rendered plate. b111 adds direct in-place dimension lines to the SVG, similar to the existing outer width/height dimension lines.

## Added in-place dimension lines

- left and right outside margins
- solved seal column width
- solved group gaps, such as the gap between a recognition letter block and number block
- solved character gaps between adjacent characters

These measurement lines are diagnostic only. They do not change the physical geometry. The model still builds the plate in millimetres first and the viewer still scales only the completed SVG.

## Files changed

- `tools/plate-physical-lab/mm-model.js`
- `tools/plate-physical-lab/app.js`
- `tools/plate-physical-lab/index.html`
- `tools/plate-physical-lab/README.md`
- `HANDOVER.md`

## Test focus

Use `BIT GT500`, `K S 70`, `TR M 6`, and `HH EV 204E` in Auto ausgewogen mode. With `Maßlinien anzeigen` enabled, the solved group gap should be visible directly over the gap between letter and number groups.
