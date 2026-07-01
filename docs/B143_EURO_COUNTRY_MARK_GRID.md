# b143 · Euro country mark D grid correction

b143 keeps b142 as the base and only changes the Euro country mark geometry in the Physical Lab/shared mm model.

## What changed

- One-line Euro field now explicitly carries its Anlage-4 inner grid: `17 / 30 / 17 / 20 / 17 mm` inside the 101-mm Euro field.
- Two-line Euro field keeps its separate grid: `10 / 30 / 17 / 20 / 11 mm` inside the 88-mm Euro field.
- The `D` country mark is anchored to the center of the 20-mm country field instead of relying on an old fixed baseline-only value.
- The country mark uses the DIN font stack with normal weight.
- Dimension lines now show the Euro inner grid for both one-line and two-line formats, including a highlighted 20-mm country field box.

## Not changed

- b142 green standard plate mode remains unchanged.
- b141 one-line season field remains unchanged.
- b140 two-line seasonal H/E bottom-row spacing remains unchanged.
- b129 seal circle changes remain reverted.
- The Card production renderer is still not extended to the new two-line/season Lab formats in this step.
- ChatGPT ZIPs still do not include font binaries.
