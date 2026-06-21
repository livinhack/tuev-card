# b116 – Card renderer fully rebuilt from the Physical Lab

## Goal

The productive Home Assistant card plate renderer must no longer contain a separate/legacy character placement renderer. The Physical Lab is the source of truth.

## Change

b116 removes the previous Card-specific SVG placement path from `src/plate/renderer.js` and makes the Card render the same physical SVG model as the Lab:

1. build the CAD-like mm model with `buildPlateModelMm()`
2. render the complete physical SVG with `renderPlateSvgMm()`
3. disable Lab-only overlays for production:
   - no DXF reference guides
   - no grid/cell guides
   - no dimension lines
4. scale only the final SVG via `width`/`height` while keeping the SVG `viewBox` in millimetres

The Card now uses:

```text
Lab mm model -> Lab SVG builder without debug overlays -> final Card scaling
```

No separate Card character positioning remains.

## Font handling

The Card SVG embeds the canonical GL font-face CSS inside the SVG `<defs>` in addition to the global injected font faces. This keeps the productive Card renderer aligned with the Lab font-family names:

- `GL-Nummernschild-Mtl`
- `GL-Nummernschild-Eng`

The ZIP still does not include font binary files. Local/HACS font files remain external to the Chat ZIP.

## Files changed

- `src/plate/renderer.js`
- `src/plate/font.js`
- `src/plate/mm-model.js`
- `tools/plate-physical-lab/mm-model.js`
- `dist/tuev-card.js`
- `package.json`
- `HANDOVER.md`

## Validation

- `npm run check` passed
- `npm run build` passed
- Production SVG for `DA CI 500` has:
  - `viewBox="0 0 520 110"`
  - no `layer-grid`
  - no `layer-dxf-guides`
  - no dimension lines
- Metrics remain aligned with the Lab:
  - `DA CI 500`: middle script, 520 mm, seal column 67.5 mm, margins 8.5/8.5 mm
  - `HH EV 204E`: narrow script, 520 mm, H/E seal column 58.6 mm, margins 8.0/8.0 mm
