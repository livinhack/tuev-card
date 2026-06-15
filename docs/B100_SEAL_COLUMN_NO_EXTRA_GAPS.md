# b100 - Seal column without extra adjacent gaps

b100 continues the standalone Physical Lab work outside Home Assistant.

## Goal

The seal area is no longer surrounded by additional gap elements. The 63.5 mm seal column from the Anlage-4/DXF interpretation is treated as the complete measured area between the adjacent character cells.

## Changed files

- `tools/plate-physical-lab/mm-model.js`
  - removed `district-seal-gap`
  - removed `seal-recognition-gap`
  - the sequence is now: district characters, seal column, recognition characters
  - group gaps remain only inside the recognition section, e.g. between letters and digits
  - metric `sealAdjacentGapPolicy` documents the current rule
- `tools/plate-physical-lab/app.js`
  - readout now shows the seal-adjacent-gap policy
- `tools/plate-physical-lab/index.html`
  - version and wording updated to b100
- `tools/plate-physical-lab/README.md`
  - updated for the b100 seal-column rule

## Important rule

The physical renderer still works only in millimetres. Pixel, DPR, browser zoom and monitor calibration remain in the outer viewer layer only.

The seal column now follows this interpretation:

```text
[character cell][63.5 mm seal column][character cell]
```

Not this:

```text
[character cell][extra gap][63.5 mm seal column][extra gap][character cell]
```

## Test focus

Use the Physical Lab with:

```text
HH HU 199
BKS R 95
DA CI 500
```

Check stage `4 · HU- und Behördensiegelplätze` and `6 · Komplettbild`.
