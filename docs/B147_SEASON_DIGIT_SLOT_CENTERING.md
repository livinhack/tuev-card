# b147 – Season digit-slot centering

b147 is a Physical Lab-only correction for the seasonal validity field.

## Problem

The b145/b146 deterministic season renderer still used one centered SVG text string for `04` / `10`. Depending on font side bearings and browser advance metrics, the text could look slightly left-heavy even though the field values were stable.

## Change

The season month renderer now uses explicit digit slots:

```text
first digit slot:  12.5 mm
configured gap:    1.5 mm default
second digit slot: 12.5 mm
```

The resulting month width is centered in the fixed `30 mm` season field. No manual X correction and no calibration button are used.

## Unchanged

- Season field geometry: `30 × 75 mm` block.
- Month boxes: `30 × 20 mm`.
- Separator: `30 × 3.25 mm`.
- Season typography defaults: `20 / 28 / 37.5 / 1 / 1.5`.
- b129 seal-circle change remains discarded.
- Production Card renderer remains unchanged.
- Chat ZIPs do not include font binaries.
