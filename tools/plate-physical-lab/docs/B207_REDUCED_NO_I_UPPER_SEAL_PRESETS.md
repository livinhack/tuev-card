# b207 – Reduced no-I upper-seal tightening and expanded check presets

b207 is a targeted Lab-only follow-up to b206.

## Change

For reduced two-line H/E or season layouts with an upper side-by-side seal row, a full-width three-letter district without `I` and at least eight visible slots can become visually too tight at the right HU edge.

b207 adds a narrow top-row rule for that case:

- three full-width district letters in the upper row
- no `I` in district or recognition text
- H/E or season forces the upper side-by-side seal row
- visible reduced slot count at least 8

Then:

- right top edge remains at least `8 mm`
- text to authority seal remains a dynamic `5–20 mm` corridor
- authority seal to HU may use `4 mm`
- cases with `I` do not enter this no-I tight path and stay relaxed when possible

The b206 9-slot season border case remains unchanged and may still use the separate `>= 6 mm` right edge rule.

## Presets

The b204 check preset groups are expanded with no-I and with-I countercheck variants, especially:

- `HVL D191E` / `HVL DI91E` / `WIL D191E`
- `HVL D19E` + Saison / `HVL DI9E` + Saison / `WIL D19E` + Saison
- `HVL D191E` + Saison / `HVL DI91E` + Saison / `WIL D191E` + Saison

## Validation

`npm run check:regression`

Result in b207:

`Regression passed: 40/40 cases OK.`
