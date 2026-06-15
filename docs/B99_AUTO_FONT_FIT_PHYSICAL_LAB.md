# b99 - Automatic font fit in Physical Lab

b99 continues the renderer reset outside Home Assistant. The lab remains CAD-like: all physical geometry is modelled in millimetres, and only the finished SVG is scaled by the viewer layer.

## Why

Manual tuning of `font-size` and baseline made it difficult to fit the GL glyphs into the fixed 75-mm character band. SVG `font-size` is not the same as visible cap height, so a numeric font-size value cannot be read directly as visible character height.

## Change

b99 adds a browser-side font measurement layer:

- `tools/plate-physical-lab/font-calibration.js`
  - waits for web fonts when possible
  - measures the visible SVG bounding box of a representative character sample at a 100-mm probe font-size
  - computes a model `font-size` and `baselineY` in millimetres
  - returns only mm parameters to the model

This does not change the core rule:

```text
mm model -> complete SVG -> outer viewer scaling
```

The automatic fitting does not scale the finished SVG and does not apply per-element post-scaling in the viewer. It only derives the correct mm-based text parameters before rendering.

## UI changes

The lab now has:

- checkbox: `Schrift automatisch ins 75-mm-Zeichenband einpassen`
- numeric target: `Ziel-Glyphenhöhe in mm`
- readout for measured probe bbox, font-size, baseline and resulting visible band

Manual values still remain visible and can be edited when the checkbox is disabled.

## Test

1. Open `tools/plate-physical-lab/index.html` through VS Code Live Server.
2. Keep auto font fit enabled.
3. Use step `5 · Zeichen in festen Zellen` or `6 · Komplettbild`.
4. Check that the cyan glyph guide covers the 75-mm character band.
5. Test `HH HU 199`, `DA CI 500`, `BKS R 95` and `K S 70`.

## Not changed

- Card runtime renderer is not integrated with the new lab renderer yet.
- DXF body/Euro/seal geometry from b98 remains the reference.
- Pixel/DPR monitor calibration remains in `viewer-calibration.js` only.
- No font binaries are included in the Chat ZIP.
