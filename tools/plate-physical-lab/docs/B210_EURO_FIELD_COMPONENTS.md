# b210 – Euro-field component cleanup

## Goal

Extract repeated Euro-field subrendering into reusable CAD components without touching the validated Reduced row-chain logic.

## Implemented

- `eu-star-wreath.js`
  - receives centre and legal diameter `a`
  - derives star size as `a / 6`
  - renders 12 upright star polygons
- `eu-country-mark.js`
  - receives mark centre and intended visible D height
  - keeps the current text-based D implementation centralised
- `euro-field.js`
  - component entry point for Euro-field helpers

## Reduced two-line values

Reduced two-line keeps the `35 × 56 mm` Euro field and `5 / 22.5 / 8 / 15 / 5.5 mm` raster.

The reduced Euro field now explicitly defines:

- star wreath centre: `21.5 / 20.25 mm`
- star wreath diameter `a`: `21 mm`
- star size: `3.5 mm`
- D centre: `21.5 / 49 mm`
- D height: `15 mm`

## Safety

No row-chain, seal, width or Saison logic was changed. Regression stays `41/41 OK`.
