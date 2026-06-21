# b104 · Separate I special widths for middle and narrow fonts

## Goal

Continue the standalone physical plate lab without changing the Home Assistant card runtime. b104 keeps the successful middle-font `I` calibration value and separates it from the narrow-font value.

## Changes

- `I` is still handled as a physical cell-width override inside the millimetre model.
- Mittelschrift uses `I = 35.5 mm`.
- Engschrift uses `I = 30.3 mm`.
- The narrow value is derived proportionally from the middle value using the relation between narrow and middle letter cells:
  - `40.5 / 47.5 ≈ 0.8526`
  - `35.5 × 0.8526 ≈ 30.3`
- The UI now exposes two separate controls:
  - `I-Sonderbreite Mittelschrift in mm`
  - `I-Sonderbreite Engschrift in mm`

## Important rule

The special width is a physical cell width before the SVG is built. It is not a CSS transform, not pixel scaling and not post-render stretching. The completed SVG can still be scaled only as one whole object by the viewer.

## Test focus

- `DA CI 500` in Mittelschrift with `I = 35.5 mm`
- same examples in Engschrift with `I = 30.3 mm`
- switch between `Mittelschrift` and `Engschrift` and verify the matching I value is used in the metrics readout
