# b125 – Two-line width selection cleanup

b125 limits the two-line Physical Lab width choices to the currently accepted set:

```text
340 mm
320 mm
280 mm
260 mm
```

The Lab dropdown displays those fixed choices in descending order for readability. The automatic solver still evaluates the physical bands from small to large internally:

```text
260 → 280 → 320 → 340 mm
```

This keeps `Auto kompakt` and `Auto ausgewogen` aligned with their existing behaviour: choose the smallest width band that satisfies the active spacing rules.

## Scope

- Applies to `plateFormat: "twoLine"`.
- One-line width bands remain unchanged.
- The two-line renderer remains Lab-only in b125.
- The production Card renderer remains the stable one-line Physical-Lab renderer path.

## Implementation

- `TWO_LINE_WIDTH_BANDS.middle` and `.narrow` now contain `[260, 280, 320, 340]`.
- The Physical Lab dynamically rebuilds the width dropdown when the plate format changes:
  - one-line: existing one-line width choices;
  - two-line: `340 / 320 / 280 / 260`.
- Invalid fixed widths are reset to `Auto ausgewogen` when switching formats.

## Font note

ChatGPT-generated ZIP files still do not include font binary files. Local release builds must be run with the local `fonts/*.ttf` files present before pushing to GitHub/HACS.
