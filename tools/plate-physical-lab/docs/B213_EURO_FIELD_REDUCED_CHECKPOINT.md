# b213 – Euro field / Reduced confirmed checkpoint

b213 is a pure checkpoint after the b212 Euro-field correction. It intentionally changes no renderer geometry or layout logic.

## Confirmed carried-forward state

- EU star wreath and Euro country mark are reusable components.
- Nr. 1 one-line uses `a = 30 mm`, star size `5 mm`, D height `20 mm`.
- Nr. 2 two-line uses `a = 30 mm`, star size `5 mm`, D height `20 mm`.
- Nr. 2a / 280-mm subvariant inherits the Nr. 2 Euro field.
- Nr. 2c motorcycle inherits the Nr. 2 Euro field.
- Reduced two-line uses its own 35 × 56 mm Euro field with `a = 22.5 mm`, star size `3.75 mm`, and D height `15 mm`.
- Reduced b209/b211/b212 width, seal, H/E, Saison, 8-slot and 9-slot behaviour is unchanged.

## Next recommended step

Start cleanup in small, testable steps. Suggested first cleanup: keep the Euro-field components stable and remove any remaining duplicated star/D rendering assumptions from the large renderer.

## Verification

`npm run check:regression` passes with `41/41` cases.
