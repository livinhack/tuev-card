# b200 – Reduced Standard lower-row threshold

b200 fixes the Standard Reduced switching threshold.

## Problem

While typing `W QU111`, the intermediate plate `W QU11` already switched to the upper side-by-side seal row. This was wrong for the current Standard Reduced rule because the lower row only contains four visible characters.

## Fix

- Standard Reduced without H/E and without season can use the upper seal row only with at least five visible lower-row characters.
- Four-character lower rows remain vertical and step up in width.
- H/E or season remain independent mandatory upper-seal templates.

## Regression

`npm run check:regression` passes with `36/36 cases OK`.
