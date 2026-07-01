# b148 – Season visible BBox auto-centering

b148 is a Physical Lab-only correction for the seasonal validity field.

It keeps the b147 geometry and the explicit two-digit season layout, but removes the last visual weakness of the deterministic slot approach: when the season font size or glyph shape changes, the visible ink can drift inside the 30 mm season field even though the construction slots remain centered.

The Lab now keeps the season construction model unchanged:

- season field: `30 × 75 mm`
- upper month field: `30 × 20 mm`
- lower month field: `30 × 20 mm`
- separator: `30 × 3.25 mm`
- season digit gap default: `1.5 mm`
- no manual X correction input
- no calibration/centering button

After the SVG is rendered and fonts are available, the Lab measures the visible SVG BBox of each rendered month group and applies a guarded mm `translate(x, 0)` so the visible month BBox is centered inside its own 30 mm field. The measurement is display-layer Lab behavior only; it does not change the physical model, spacing solver, or season field geometry.

The Card production renderer remains unchanged.
