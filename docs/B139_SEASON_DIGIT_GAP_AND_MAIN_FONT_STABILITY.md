# b140 – Season digit gap and main font stability

b140 is a Physical Lab-only refinement.

## Season digit gap

The season digit gap now defaults to `1.5 mm`. This gap is rendered as millimetre-based SVG letter spacing between the two season month digits. The season block-centering helper measures the rendered SVG BBox, so the visible width used for centering includes the active digit gap.

The season field geometry remains unchanged:

```text
upper month field: 30 × 20 mm
lower month field: 30 × 20 mm
separator:         30 × 3.25 mm, vertically centered
```

## Main GL font stability

The manual GL calibration is held at the screenshot values:

```text
target glyph height: 75 mm
SVG font size:       125
upper baseline:      92.5 mm
I special width:     35.5 mm
```

The Lab no longer rewrites the `fontSize` and `baselineY` inputs on every render while manual font mode is active. These inputs are only updated when the explicit auto-fit checkbox is enabled. This prevents season-control testing from changing the main plate typography unexpectedly.

## Scope

Two-line and season rendering remains Lab-only. The production Card continues to use the stable one-line renderer.
