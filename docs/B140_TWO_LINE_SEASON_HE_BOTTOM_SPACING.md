# b140 – Two-line seasonal H/E bottom-row spacing surfaces

b140 is a Physical-Lab-only refinement based on b139.

## Purpose

The two-line seasonal H/E reference (`EE 54E`) marks the bottom row as:

```text
* 47.5 ** 47.5 *** 44.5 ** 44.5 *** 47.5 *
```

The previous b139 solver treated the bottom row like the normal two-line H/E case: group gaps were expanded to their maximum first and only the remainder stayed in the outside margins. That was legally valid within the numeric ranges, but it did not match the more balanced visual distribution of the seasonal H/E reference.

## Change

For two-line plates with an enabled season field and a final `H`/`E` suffix after a digit, the bottom row now uses a dedicated waterfill solver:

- outside `*` gaps: minimum 8 mm, uncapped
- character `**` gaps: 8–10 mm
- H/E group `***` gaps: 20–30 mm

The free width is distributed across these spacing surfaces together. Capped gaps stop at their maxima; remaining space stays in the outside `*` gaps.

## Example

For `CW EE 54E`, 340 mm, middle script, season enabled:

```text
bottom outside left/right: 13.875 mm
bottom char gaps:         10.000 mm
bottom H/E group gaps:    25.875 mm
```

This replaces the previous b139 result of 9.75 mm outside margins and 30 mm group gaps.

## Scope

- Lab-only.
- Productive Card renderer remains the stable one-line renderer.
- b129 seal-circle change remains discarded.
- b139 season digit gap and main font stability remain unchanged.
- No font binaries are included in ChatGPT ZIP files.
