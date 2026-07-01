# b211 – Reduced Euro-field star diameter and D-band centering

b211 is a Lab-only Euro-field correction on top of b210.

## Scope

No Reduced text/seal row-chain logic was changed. The b209/b210 Reduced auto-width, H/E, season, 8-slot and 9-slot tight-fit behaviour remains unchanged.

## Change

Reduced two-line Euro field now uses the explicit Reduced Euro-field component parameters:

- Euro field remains `35 × 56 mm`.
- Vertical raster remains `5 / 22.5 / 8 / 15 / 5.5 mm`.
- EU star wreath uses `a = 22.5 mm` as the diameter through the star centre points.
- Star size is derived from the legal component rule as `a / 6 = 3.75 mm`.
- The country mark `D` remains a 15-mm country mark but is centered in the actual 15-mm D band.
- Reduced `D` center moved from the old b210 value to the centre of the D band: `y = 47 mm` in the plate coordinate system.

## Regression

Regression now asserts the Reduced Euro component geometry:

- `euroStarDiameterThroughCenters = 22.5`
- `euroStarSize = 3.75`
- `euroCountryHeight = 15`
- `euroCountryCenterY = 47`
