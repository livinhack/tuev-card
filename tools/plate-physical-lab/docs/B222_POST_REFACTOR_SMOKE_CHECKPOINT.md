# b222 – Post-refactor smoke checkpoint

b222 is a pure checkpoint after the small Lab refactors b214-b221.

No layout geometry or renderer logic was intentionally changed compared with b221.

Smoke scope:

- Lab regression: `npm run check:regression`
- Full/card checks: `npm run check`
- Current Reduced preset chain remains present in the Lab UI:
  - Reduced Standard
  - Reduced H/E
  - Reduced Saison 04/10
  - Reduced H/E + Saison 04/10
  - 8-slot variants with and without `I`
  - 9-slot Saison/H-E tight-fit boundary case
- Eurofield component state from b212 remains active:
  - Nr. 1: `a = 30 mm`, `D = 20 mm`
  - Nr. 2 / Nr. 2a / Nr. 2c: `a = 30 mm`, `D = 20 mm`
  - Reduced: `a = 22.5 mm`, `D = 15 mm`

Confirmed component split still active:

- `euro-field.js`
- `eu-star-wreath.js`
- `eu-country-mark.js`
- `seal-components.js`
- `season-field.js`
- `debug-dimensions.js`
- `reduced-row-chain-solver.js`
- `text-utils.js`
- `plate-body.js`
- `plate-render-shell.js`

Next suggested step: pause for a quick visual check in the browser, then continue with small variant/rules-object cleanup only if the visual smoke test is still clean.
