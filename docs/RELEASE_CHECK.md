# Release check

Current checked version: `b102`.

## Package layout

The HACS-delivered files are in `dist/`:

```text
dist/tuev-card.js
dist/fonts/
```

The root source layout remains modular under `src/`.

## Required checks

```bash
npm run build
npm run check
```

Confirm:

- `dist/tuev-card.js` starts with `// TÜV Card bundled b102`.
- `src/tuev-card-entry.js` starts with `// TÜV Card source entry b102`.
- Source imports use `?v=b102`.
- Root `tuev-card.js` is not the active HACS bundle anymore.
- `hacs.json` does not use `content_in_root: true`.
- If local `.ttf` files exist in `fonts/`, they are copied to `dist/fonts/` by the build.

## Runtime checks

- Lovelace resource: `/hacsfiles/tuev-card/tuev-card.js`.
- GL font URLs: `/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf` and `/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf`.
- Graphical plate option visible only when a supported GL or legacy plate font is reachable.
- No graphical system-font fallback.

## Functional regression checks

- b79 single-column HU overlay still correct.
- b81 sort-confirm dialog closes only via **Cancel/Abbrechen** or **Yes/Ja**.
- b82 button active/open states still consistent.
- Group side-by-side auto layout still behaves calmly.
- b91+ one-line license plates use black border inside the 110 mm outside height.
- b91+ short plates keep a shorter width without ballooning the common display height.

- b98 moves the Physical Lab to a CAD-like mm model: renderer geometry remains in millimetres, while DPR/px/mm live only in the viewer calibration layer.


## b98 physical lab check notes

- One-line plate renderer is a fixed physical mm model before display scaling.
- Display scaling must only affect the complete SVG, never individual text/seal/Euro elements.
- Practical one-line width bands documented in `docs/B95_PHYSICAL_PLATE_RULES_AND_WIDTH_BANDS.md`.

## b98 DXF lab notes

- Physical Lab uses `DXF_REFERENCE_MM` for body, Euro field and seals.
- Reference DXFs are stored in `tools/plate-physical-lab/reference/`.
- HU seal is 35 mm; authority seal is 45 mm.
- Euro field is placed at x=4.5 / y=4.5 with 45 × 101 mm.
- The card runtime renderer is not considered the measurement source while the physical lab is under construction.


## b99 physical lab check notes

- b99 keeps the physical plate lab outside Home Assistant.
- `font-calibration.js` measures SVG glyph bounding boxes and derives mm-based `font-size`/`baselineY`.
- Viewer scaling remains a separate outer layer.


## b101-b102 physical lab check notes

- b101-b102 keep the physical plate lab outside Home Assistant.
- The 63.5 mm seal column is now treated as the complete measured area between adjacent character cells.
- Extra gap elements around the seal column were removed.


## b102 physical lab check notes

- b102 keeps the physical plate lab outside Home Assistant.
- GL-Mittelschrift manual calibration profile: target 75 mm, Font-Kalibriergröße 125, Baseline 92.5 mm.
- New horizontal cell-check stage shows cell boundaries, centers, widths and gap widths without changing model geometry.
