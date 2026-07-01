# b149 – Separate season row centering

b149 is a Physical Lab-only season-centering correction.

The physical geometry is unchanged from b148. The seasonal validity block remains a `30 × 75 mm` block with two `30 × 20 mm` month fields and a centered `30 × 3.25 mm` separator.

The change is limited to Lab-side season centering:

- the upper month row (`from`) is measured and centered only within the upper `30 mm` field;
- the lower month row (`to`) is measured and centered only within the lower `30 mm` field;
- no shared block centering is used across both rows;
- the manual season X offset and calibration button remain removed;
- the diagnostic readout remains read-only.

This keeps `digit 1 + digit gap + digit 2` as the constructive basis, but the visible SVG BBox is corrected per row after fonts are available.
