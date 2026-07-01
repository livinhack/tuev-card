# b135 – Season font status and glyph BBox calibration

b135 keeps the b128/b130 two-line seasonal validity geometry and adds diagnostics for season typography.

## Geometry kept unchanged

```text
upper season field: 30 × 20 mm
lower season field: 30 × 20 mm
separator:          30 × 3.25 mm
```

The upper field top aligns with the top edge of the large upper-row character fields. The lower field bottom aligns with the bottom edge of the large upper-row character fields. The separator stays vertically centered in the 75 mm upper-row band.

## What changed

The lab now distinguishes between:

```text
field height:          fixed 20 mm construction field
visible glyph height:  measured SVG getBBox() height of the actual rendered digits
```

The season controls and readout now make this explicit. The lab also shows whether the DIN font used for the season field and Euro-field `D` is actually loaded or whether a browser fallback is likely.

## Why

The Anlage 4 drawing defines the seasonal month fields and separator geometry, but the visible size of `04` / `10` depends on the concrete font face and browser font loading state. A missing or pending `din1451alt.ttf` can make the season digits look different even when the physical field dimensions are correct.

b135 waits for browser fonts before season measurement/calibration and then reports the measured glyph bounding boxes.
