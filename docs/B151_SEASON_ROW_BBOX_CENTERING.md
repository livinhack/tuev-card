# b151 – Season row BBox centering

## Scope

b151 fixes the Physical Lab season month centering after b150 did not visibly change the output in some browsers.

The geometry is unchanged:

- season field: `30 × 75 mm`
- upper/lower month fields: `30 × 20 mm`
- separator: `30 × 3.25 mm`
- default season typography: `20 / 28 / 37.5 / 1 / 1.5`

## Change

The Lab no longer tries to reposition the individual season digits independently. After fonts are ready, each month row is handled as a complete rendered row:

1. restore the row transform
2. measure the visible SVG BBox of the whole row (`04`, `10`, etc.)
3. compute the row center
4. translate the whole row so that the visible row BBox is centered in its own 30-mm field

The two rows remain independent: the upper month is centered in the upper 30-mm field and the lower month is centered in the lower 30-mm field.

## Rationale

The per-digit correction from b150 still depended on each digit's own text BBox/side-bearing behaviour. With DIN fonts and changed test font sizes the individual corrections could cancel out or remain visually unchanged.

Moving the whole rendered row is less clever and more robust: the configured digit gap remains intact, and only the visible month row is centered inside the physical 30-mm construction field.

## Unchanged

- no manual X correction
- no centering button
- b129 two-line seal-circle change remains discarded
- Card production renderer remains unchanged
- no font binary files are included in ChatGPT ZIPs
