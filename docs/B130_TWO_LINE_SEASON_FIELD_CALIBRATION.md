# b130 – Two-line seasonal field calibration controls

b130 returns to the b128 two-line seal geometry and explicitly discards the b129 seal-circle experiment. The production Card remains on the stable one-line renderer path; the two-line seasonal format is still Physical Lab only.

## Change

The two-line seasonal validity area is now modelled as field geometry instead of as two centered text labels inside one 75 mm stack.

Season field geometry:

```text
field width:          30 mm
upper field:          30 × 20 mm
lower field:          30 × 20 mm
upper field y:        top-row character band y
lower field bottom:   top-row character band bottom
separator:            30 × 3.25 mm
separator position:   vertically centered in the 75 mm top-row band
season gap:            8 mm fixed to the seal field
```

For the current two-line top row (`17.5–92.5 mm`):

```text
upper field:        y 17.5–37.5 mm
separator:          y 53.375–56.625 mm
lower field:        y 72.5–92.5 mm
```

## New Lab controls

The seasonal field has its own typography calibration row:

- `Season target glyph height in mm`
- `Season SVG font calibration size`
- `Season baseline Y in mm`

The baseline control refers to the upper seasonal field. The lower baseline is derived by applying the physical field offset between the upper and lower 20 mm fields.

Default values:

```text
target glyph height: 20 mm
SVG font size:      27 mm
upper baseline:     37.5 mm
lower baseline:     92.5 mm
```

## Notes

- The month values remain model fields (`season.from`, `season.to`) and are not part of the plate text.
- The DIN font stack remains the same as the Euro-field `D`.
- The SVG continues to be built entirely in millimetres; display scaling still only applies to the complete SVG.
- Font binaries are intentionally not included in ChatGPT-generated ZIP files.
