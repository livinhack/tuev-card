# b105 · Shared I width for supplied GL fonts

## Goal

Continue the standalone physical plate lab without changing the Home Assistant card runtime. b105 corrects the b104 assumption that the `I` cell should be proportionally narrower in Engschrift.

## Finding

The supplied GL-Nummernschild TTF files use different advances/bounds for most middle vs. narrow characters, but the `I` glyph is identical in the supplied middle and narrow files. In the checked files, `I` has the same advance and visible bounds in both fonts. Therefore a proportional Engschrift value such as 30.3 mm is not appropriate for this specific GL font package.

## Changes

- One shared `I` width control in the lab.
- Default `I` width: `35.5 mm`.
- Mittelschrift keeps normal letter/digit cells: `47.5 / 44.5 mm`.
- Engschrift keeps normal letter/digit cells: `40.5 / 38.5 mm`.
- `I` uses `35.5 mm` in both modes.
- Metrics show the active font family and the shared I-width policy.

## Important rule

The special width is a physical cell width before the SVG is built. It is not a CSS transform, not pixel scaling and not post-render stretching. The completed SVG can still be scaled only as one whole object by the viewer.

## Test focus

- Switch between Mittelschrift and Engschrift using `WIL CL 212`.
- Verify that W/L/C/etc. change to the narrower Engschrift cells.
- Verify that `I` remains at the shared 35.5 mm cell width.
- Compare `DA CI 500`, `BIT GT500`, `BKS R 95`.
