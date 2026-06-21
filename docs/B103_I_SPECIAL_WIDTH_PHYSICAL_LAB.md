# b103 · I special width in the physical plate lab

## Goal

Continue the standalone physical plate lab without changing the Home Assistant card runtime. b103 adds a physical special-width rule for the character `I`, because the current GL/FE-like rendering shows that `I` should not occupy a full 47.5-mm letter cell in the measured layout.

## What changed

- Added `specialWidths` to the font cell profiles in `tools/plate-physical-lab/mm-model.js`.
- `makeCells()` now resolves character width through `getCellWidth()`.
- `I` gets a configurable width before the SVG is rendered.
- Added a new UI field: `I-Sonderbreite in mm`.
- Metrics now show the active I special width.
- Horizontal diagnostics show the real narrowed I cell.

## Defaults

```text
Mittelschrift I: 18 mm
Engschrift I:   14 mm
```

To disable the special treatment for comparison, set the value to the normal letter width:

```text
Mittelschrift: 47.5 mm
Engschrift:   40.5 mm
```

## Important rule

The I special width is part of the physical mm model. It is not CSS scaling, not an SVG transform and not a post-render adjustment. The final SVG may still be scaled as a whole by the viewer layer.

## Files changed

- `tools/plate-physical-lab/mm-model.js`
- `tools/plate-physical-lab/app.js`
- `tools/plate-physical-lab/index.html`
- `tools/plate-physical-lab/styles.css`
- `tools/plate-physical-lab/README.md`
- `HANDOVER.md`
- `docs/RELEASE_CHECK.md`
