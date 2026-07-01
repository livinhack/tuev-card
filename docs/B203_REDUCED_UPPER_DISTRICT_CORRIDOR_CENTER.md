# b203 – Reduced upper district corridor centering

b203 fixes the remaining visual Reduced top-row issue after b202.

## Problem

Short upper district codes, especially a single `W`, were no longer pulled into the seal axis, but they were still not visually centered in the available corridor between the Euro field and the first plaque/seal field.

When typing from `W Q1` to `W QU1`, the wider plate could make the upper `W` move left or stay too far left, although the usable corridor grew.

## Fix

For Reduced two-line top rows with one or two district characters:

1. Keep the existing row-chain width decision.
2. Keep vertical seal-axis sharing and the upper side-by-side seal requirement for H/E/season.
3. After the physical row chain is solved, center only the short district text run inside the usable corridor:
   - left boundary: Euro field right edge plus the minimum outside `*` spacing,
   - right boundary: first seal/plaque field minus the minimum text-to-seal clearance.
4. The remaining slack becomes the text-to-seal corridor.

Three-letter district rows are unchanged.

## Validation

`npm run check:regression` passes with 36/36 cases.
