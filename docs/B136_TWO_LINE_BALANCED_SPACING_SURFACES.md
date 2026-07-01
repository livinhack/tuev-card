# b136 – Two-line balanced spacing surfaces

b136 is a Physical Lab solver refinement for the two-line plate top row. It does not change the productive one-line Card renderer.

## Problem

In b135 the season field itself was correct, but the top-row spacing was still too mechanical:

- the district-to-seal gap used the 8-25 mm range,
- the season gap stayed fixed at 8 mm,
- remaining free width went mostly into the implicit left/right `*` margins.

This made the seasonal case look less evenly distributed than the Anlage 4 construction drawing suggests.

## Change

The two-line top-row solver now treats the relevant spacing surfaces as one balancing set:

- left `*` margin, at least 8 mm,
- `**` character gaps, 8-10 mm,
- district-to-seal gap, 8-25 mm,
- season `*` gap, at least 8 mm when the season field is enabled,
- right `*` margin, at least 8 mm.

The solver water-fills these surfaces from their minima. Capped gaps stop at their maximum values. Any remaining width stays in uncapped `*` gaps.

## Example

For `DD GD 645`, two-line, season enabled, 320 mm width, the top row now solves approximately to:

- left top margin: 22.75 mm,
- `**` character gap: 10 mm,
- district-to-seal gap: 22.75 mm,
- season gap: 22.75 mm,
- right top margin: 22.75 mm.

Previously the season gap stayed at 8 mm while the outer top margins grew to about 29 mm.

## Scope

- b129 seal-circle changes remain reverted.
- b128/b130 seal geometry remains active.
- b135 season block centering remains active.
- Bottom-row group gap rules remain unchanged.
- Two-line and seasonal plates remain Lab-only.
- The productive Card renderer remains the stable one-line Physical-Lab-based renderer.
