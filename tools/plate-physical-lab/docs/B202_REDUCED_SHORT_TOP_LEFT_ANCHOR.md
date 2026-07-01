# b202 – Reduced short top left anchor

b202 corrects a visible regression from b201 in the Reduced Standard vertical-seal template.

## Problem

In b201 the one-letter upper district in `W Q1` was pulled against the shared vertical seal axis. The rendered result kept `180 mm`, but the upper `W` sat too far right and the top row showed unequal outside margins.

## Fix

- Vertical Reduced Standard still keeps HU and authority seal on one common X-axis.
- For one- and two-letter upper district codes, the upper text is anchored to the left/right outside-margin chain instead of being pulled towards the fixed seal axis.
- Remaining slack in the short upper row becomes a free text-to-seal corridor.
- Auto-width behaviour remains unchanged from b200/b201.
- H/E and season still force the upper side-by-side seal row.

## Key checks

- `W Q1` -> `180 mm`, vertical seals, upper `W` no longer pulled against HU.
- `W QU1` -> `200 mm`, vertical seals, upper `W` anchored left.
- `W QU11` -> `240 mm`, vertical seals, upper `W` anchored left.
- `WI QU11` -> `240 mm`, vertical seals, upper `WI` anchored left.
- `W QU111` -> `220 mm`, upper side-by-side seals.

Regression: `36/36 cases OK`.
