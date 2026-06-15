# b98 - Separate seal geometry in the physical lab

## Goal

The physical renderer must not treat the seal area as one generic circle. Seal layout is now split into independent mm values before any display scaling happens.

## Rules

- The plate model remains CAD-like and millimetre-based.
- Pixel, DPR and monitor calibration stay in the viewer layer.
- The finished SVG may be scaled as a whole; individual elements must not be scaled afterwards.
- The seal area is calculated separately:
  - seal column width: 63.5 mm, reference maximum 67.5 mm
  - construction/embossing slot: 45 mm
  - visible neutral plaque/seal placeholder: 35 mm
  - HU and authority positions are derived from the 75 mm character band

## Files

- `tools/plate-physical-lab/mm-model.js`
- `tools/plate-physical-lab/app.js`
- `tools/plate-physical-lab/index.html`
- `tools/plate-physical-lab/README.md`

## Test entry

Open `tools/plate-physical-lab/index.html` through VS Code Live Server, choose stage `3 · HU- und Behördensiegelplätze`, and check the separate yellow seal construction outlines.
