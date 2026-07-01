# b235 – Waterfill Loop Helper Cleanup

Base: b234 (`plate-physical-lab-b234-common-row-layout-adapter.zip`)

## Why

The previous cleanup branch was rejected because a visual issue had entered after b234. This step restarts from b234 and performs only a minimal cleanup that cannot alter solver behavior.

## What changed

`src/plate/plate-svg-renderer.js` now contains a small local helper:

- `waterFillSpacingSurfaces(surfaces, targetWidth)`

It centralizes only the repeated equal-step waterfill loop:

1. collect active surfaces below max
2. split remaining surplus equally
3. cap each surface at its max
4. repeat until no meaningful surplus remains

The caller still builds its own surfaces and keeps its own result wrapper and reason text.

## What did not change

- no row adapter changes
- no sequence builder changes
- no Reduced solver changes
- no Euro/seal/season component changes
- no Card changes
- no geometry/rule/layout change intended

## Checks

- Lab regression: `41/41 cases OK`
- b234 vs b235 model hashes: `41/41 identical`
- b234 vs b235 SVG hashes: `41/41 identical`
