# b155 – Season font-size width scaling

b155 fixes a b152 side effect: `Saison Font-Kalibriergröße (SVG)` changed the visible glyph height but the constructed digit width stayed fixed because the SVG used a constant `textLength` value.

The deterministic season layout remains active, but the effective constructed digit width is now:

```text
digitSlotWidth × widthScale × (fontSize / digitSlotFontSize)
```

Defaults:

```text
digitSlotWidth: 12.5 mm
digitSlotFontSize: 28
widthScale: 1
digitGap: 1.5 mm
```

This means changing the Saison SVG font size affects both height and width again. The old post-render BBox centering code, manual X correction and centering button remain removed.
