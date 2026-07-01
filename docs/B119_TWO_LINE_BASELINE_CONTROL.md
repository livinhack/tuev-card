# b119 – Two-line baseline control fix

b119 fixes the first b118 two-line Lab follow-up issue: the manual **Baseline Y** control did not move the visible glyph baseline in the two-line renderer.

## Cause

The b118 one-line renderer used the calibrated font baseline from the Lab control directly when rendering text.

The first two-line model added explicit row metadata and hard-coded the two row baselines in the row rules:

- top row: `92.5 mm`
- bottom row: `189.5 mm`

Because two-line text cells received those row baselines, `renderText()` used the row value and ignored the manually supplied `font.baselineY`.

## Fix

The two-line renderer now treats the Lab baseline control as the **top-row baseline** and derives both row baselines from the same baseline offset inside their 75-mm character bands.

Example with the default b119 baseline:

```text
Top row y:        14.0 mm
Top baseline:    92.5 mm
Baseline offset: 78.5 mm

Bottom row y:     111.0 mm
Bottom baseline:  189.5 mm
```

If the Lab baseline is changed to `90.0 mm`, the offset becomes `76.0 mm` and the bottom row automatically becomes `187.0 mm`.

## Scope

- Physical Lab only for the new two-line format.
- One-line production Card renderer remains unchanged.
- No Font binaries are included in ChatGPT ZIP artifacts.

