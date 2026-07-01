# b198 – Reduced season field row baseline

b198 fixes a Reduced-only season rendering bug introduced during the b197 render guard work.

## Problem

The Reduced row-chain correctly appended the 30-mm season field to the lower row, but `renderSeasonField()` reused the absolute standard two-line season baseline. The debug boxes were in the lower row, while the `04/10` digits were drawn up in the HU/seal area.

## Fix

- Added a field-local season layout helper.
- For `reducedTwoLine`, the month baselines are derived from the actual `season-field` item's `bandY` and `bandHeight`.
- The upper month baseline is at the lower edge of the upper 20-mm month field.
- The lower month baseline is at the lower edge of the lower 20-mm month field.
- Existing one-line, two-line and Kraftrad season reference behavior is preserved.

## Regression

The Reduced season regression now checks that both season baselines sit inside their two 20-mm season boxes.

Result:

```text
Regression passed: 35/35 cases OK.
```
