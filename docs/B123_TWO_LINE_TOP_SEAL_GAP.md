# b123 · Two-line top-row seal gap range

b123 is a focused Physical Lab correction on top of b122. It does not integrate the two-line renderer into the Card yet. The production Card remains on the one-line Physical Lab renderer path.

## Problem

In the first two-line model the distance between the district text and the seal field was treated like a normal character gap (`8-10 mm`). The Anlage 4 two-line reference drawing shows this top-row distance as a separate variable range of `8-25 mm`.

This caused the highlighted district-to-seal distance to be solved and displayed like a normal character spacing, although it has its own wider legal range.

## Change

- Added `SPACING_RULES_MM.twoLineTopSealGap`:
  - minimum: `8 mm`
  - preferred: `25 mm`
  - maximum: `25 mm`
- The two-line top row now uses a dedicated `seal-gap` item between the district cells and the `45 mm` seal field.
- The normal character gaps remain `8-10 mm`.
- The bottom-row recognition group gaps remain `20-30 mm`.
- Lab metrics now show the two-line seal gap separately.
- Dimension lines now label this distance as `Seal gap … mm` instead of treating it as a normal character gap.

## Still active from b122

- two-line text calibration: `font-size 125`, top baseline `92.5 mm`
- two-line Euro field: `40 × 88 mm`, internal vertical split `10 / 30 / 17 / 20 / 11 mm`
- two-line vertical split: `13 / 75 / 15 / 75 / 13 mm`
- neutral seal placeholders aligned to the one-line upper reference:
  - HU center y: `29.5 mm`
  - authority seal center y: `75.5 mm`
  - visible circle gap: `6 mm`

## Card status

The two-line format remains Lab-only. No productive two-line Card integration is included in b123.
