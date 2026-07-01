# b152 – Season deterministic centering rebuild

b152 removes the complete Lab-side post-render season centering path. This is a corrective step after b148-b151 repeatedly changed the measuring/autocenter code without producing reliable visible changes in the Lab.

## Removed

- `autoCenterSeasonGlyphs()`
- `layoutSeasonDigitRows()`
- row `transform` rewriting after render
- manual X correction workflow remains removed
- centering button remains removed

## New model

The season month rows are laid out deterministically while the SVG is generated:

```text
digit 1 width + configured digit gap + digit 2 width = month layout width
month layout width is centered inside the 30 mm season field
```

Digit width is controlled by the model:

```text
base digit width = 12.5 mm
effective digit width = base digit width × season width factor
configured gap = season digit gap in mm
```

The SVG uses `textLength` and `lengthAdjust="spacingAndGlyphs"` on each digit so that the constructed digit width is actually represented in the SVG output. The diagnostic measurement still reads visible boxes, but it never writes values or transforms back.

## Kept

- Season field: `30 × 75 mm`
- Month fields: two `30 × 20 mm` boxes
- Separator: `30 × 3.25 mm`
- Standard typography values: `20 / 28 / 37.5 / 1 / 1.5`
- b143 Euro country mark grid
- b142 green standard plate mode
- b140 two-line seasonal H/E bottom solver
- b129 seal circle change remains reverted

The production Card renderer is not extended in this step.
