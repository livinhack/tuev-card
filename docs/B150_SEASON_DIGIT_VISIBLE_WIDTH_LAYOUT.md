# b150 – Season digit visible-width layout

b150 is a Physical Lab-only correction for the seasonal validity field.

## Reason

b149 centered the two season month rows separately, but each month was still based on fixed digit slots. When the season font size or glyph shape changed, the visible black glyphs could drift because the fixed slot centers did not match the rendered glyph widths.

## Change

The Lab now keeps the physical season fields unchanged, but lays out the two visible digits after the browser font has loaded:

- restore each digit to its base mm position,
- measure the visible SVG BBox of digit 1 and digit 2 separately,
- compute `digit 1 width + configured digit gap + digit 2 width`,
- center that total visible width inside the 30 mm season field,
- shift digit 1 and digit 2 independently so the configured visible gap and row centering are both respected.

There is still no manual X correction and no centering button.

## Unchanged geometry

- one-line and two-line season block: 30 mm wide and 75 mm high,
- upper/lower season fields: 30 x 20 mm,
- separator: 30 x 3.25 mm,
- default season typography: 20 / 28 / 37.5 / width factor 1 / digit gap 1.5,
- b129 seal-circle change remains reverted,
- Card production renderer is unchanged.
