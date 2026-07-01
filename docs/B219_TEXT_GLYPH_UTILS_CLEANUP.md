# b219 – Text/glyph utilities cleanup

b219 is a documentation/handover update for the Full/Card package and corresponds to the separate Lab artifact `plate-physical-lab-b219-text-glyph-utils-cleanup.zip`.

## Lab change

The Lab moves pure text/glyph helpers into `src/plate/text-utils.js`:

- `parsePlate`
- `withSpecialIWidth`
- `makeCells`
- `getCellWidth`
- `splitRecognition`
- `hasHistoricalOrElectricSuffix`
- `getCharacterBand`
- `isDigit`

## Card status

No Card renderer code was changed.

## Full ZIP Lab mirror status

`tools/plate-physical-lab/` in the Full ZIP remains deliberately frozen / not synchronized. The separate Lab ZIP is authoritative.
