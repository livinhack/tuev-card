# b206 – Reduced 9-slot Saison/H-E tight fit

b206 adds a dedicated tight-fit rule for the official reduced two-line Saison/H-E border case at 255 × 130 mm.

## Rule

For `reducedTwoLine` with Saison enabled and a 9-slot occupied chain (`district + recognition + season block >= 9`):

- right outside margin may fall to `>= 6 mm`
- left outside margin remains `>= 8 mm`
- lower row keeps:
  - `** = 8-10 mm`
  - `*** = 15-18 mm`
  - last character / H-E suffix to Saison field `>= 8 mm`
- upper side-by-side seal row may use the tight sequence:
  - left `8`
  - character gaps `8 / 8`
  - text → authority seal `5`
  - authority seal → HU seal `4`
  - right `6`

The relaxation is not global. Shorter or I-width-relaxed combinations keep the larger normal margins whenever the row-chain solver has enough space.

## Validation case

`HVL D191E` with Saison `04/10` now fits as:

- width: `255 mm`
- top margin: `8 / 6 mm`
- bottom margin: `8 / 6 mm`
- top text → authority: `5 mm`
- authority → HU: `4 mm`
- lower `D → 191`: `15 mm`
- lower digit gaps: `8 mm`
- lower `1 → E`: `15 mm`
- `E → Saison`: `8 mm`

## Scope

- Lab renderer only.
- Card renderer unchanged.
- Kraftrad b170 remains unchanged.
- b204/b205 Reduced Prüfkette-Presets remain available.
