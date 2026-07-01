# b122 · Two-line seal vertical alignment

b122 is a focused Physical Lab refinement on top of b121. It does not integrate the two-line renderer into the Card yet. The production Card remains on the one-line Physical Lab renderer path.

## Why

After the b121 Euro-field geometry update, the manually verified GL text calibration for the two-line top row again matched the one-line reference values:

- font calibration size: `125`
- top-row baseline: `92.5 mm`

Because the two-line top row uses the same 75 mm character band and the same top distance as the one-line layout, the neutral seal placeholders should use the same vertical top reference as the one-line plate as well.

## What changed

The two-line seal placeholder vertical positions now reuse the one-line DXF-derived centers:

- HU center y: `29.5 mm`
- authority seal center y: `75.5 mm`
- visible circle gap: `6 mm`

The two-line seal column width remains the two-line model value:

- HU visible circle: `35 mm`
- authority seal visible circle: `45 mm`
- top-row seal column: `45 mm`

## Scope

- Lab-only for the two-line format.
- No Card integration for the two-line format in this step.
- No change to one-line production Card rendering.
- No font binary files in ChatGPT-generated ZIP files.
