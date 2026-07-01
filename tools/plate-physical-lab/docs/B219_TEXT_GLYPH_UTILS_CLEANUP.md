# b219 – Text/glyph utilities cleanup

b219 is a small Lab-only cleanup after b218.

## Goal

Move pure text/glyph helpers out of the large SVG renderer without changing any layout geometry.

## Extracted to `src/plate/text-utils.js`

- `parsePlate`
- `withSpecialIWidth`
- `makeCells`
- `getCellWidth`
- `splitRecognition`
- `hasHistoricalOrElectricSuffix`
- `getCharacterBand`
- `isDigit`

## Unchanged

- Reduced auto-width logic
- Reduced H/E and season switching
- 8-slot / 9-slot tight rules
- Euro-field components
- Seal components
- Season-field component
- Debug/dimension component
- Card code

## Validation

`npm run check:regression` passes with `41/41` cases.
