# b127 · Two-line season field size refinement

b127 refines the two-line seasonal validity field in the Physical Lab only.

## Context

b126 added the first seasonal validity field to the two-line plate model. The first version centered a compact `20 / 3.25 / 20 mm` month stack in the upper character band.

The Anlage-4 detail provided afterwards shows the intended season proportions more precisely:

- each month row is `20 mm` high;
- the top edge of the upper month row to the bottom edge of the lower month row spans `75 mm`;
- the separator bar is vertically centered within that 75 mm span;
- separator bar height is `3.25 mm`.

## Change

The season field renderer now uses:

```text
field width:        30 mm
season gap:          8 mm
upper month row:    20 mm high
content span:       75 mm
lower month row:    20 mm high
separator height:    3.25 mm
separator position: centered in the 75 mm content span
```

For the current two-line top character band (`y = 17.5 mm`, height `75 mm`) this means:

```text
upper month center y: 27.5 mm
separator bar y:      53.375–56.625 mm
lower month center y: 82.5 mm
```

## Scope

- Lab-only.
- The production Card remains on the stable one-line renderer path.
- No Font binaries are included in ChatGPT-generated ZIPs.
