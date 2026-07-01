# b125 · Two-line bottom-row group-gap rule

b125 is a focused Physical Lab correction on top of b123. It does not integrate the two-line renderer into the Home Assistant Card yet. The production Card remains on the one-line Physical Lab renderer path.

## Reason

In the two-line Anlage 4 reference, the bottom row recognition-number group gap is not the same in every case:

- normal two-line bottom row: `24-30 mm`
- final Oldtimer/Electric suffix (`H`/`E` after a digit): `20-30 mm` across the complete bottom row

b123 still reused the general `20-30 mm` group-gap rule for the bottom row. That allowed normal two-line plates to shrink below the normal `24 mm` minimum.

## Change

Added dedicated spacing rules:

```js
SPACING_RULES_MM.twoLineBottomGroupGap
SPACING_RULES_MM.twoLineBottomGroupGapHistoricalOrElectric
```

The bottom-row sequence builder now selects the range dynamically:

```text
normal recognition: 24-30 mm
recognition ending in digit + H/E: 20-30 mm for every bottom-row group gap
```

The existing H/E detection is reused:

```text
/\d[HE]$/
```

## Lab behaviour

The Physical Lab metrics now display the active bottom-row group-gap rule and range:

- `HH HU 199` → normal `24-30 mm`
- `DA CI 500` → normal `24-30 mm`
- `B EQ 203E` → H/E `20-30 mm`
- `WIL DE 13H` → H/E `20-30 mm`

Dimension lines continue to label bottom-row group gaps as `Group … mm`, but the value and range now come from the active rule.

## Scope

- Two-line format remains Lab-only.
- One-line production Card renderer is unchanged.
- No font binary files are included in ChatGPT-generated ZIPs.
