# b322 – Card Renderer Adapter Scaffold

b322 builds on **b321 – Card Transfer Staged Copy Preview**.

## Goal

Prepare an inactive Card-side adapter boundary for the staged Lab renderer copy without switching the active Card renderer.

## Full/Card change

The Full package now contains:

- `src/plate/lab-renderer/` — inactive staged copy of the production Lab renderer files from b321
- `src/plate/lab-renderer-adapter.js` — inactive adapter scaffold around the staged renderer
- `scripts/check-card-renderer-adapter-scaffold.mjs` — guard that verifies the adapter remains inactive and does not import Lab/debug-only modules

The active Card renderer remains `src/plate/renderer.js` and does not import the adapter.

## Adapter scope

The adapter enters the staged renderer only through:

- `src/plate/lab-renderer/plate-public-api.js`

Card font integration stays at the adapter boundary through:

- `src/plate/font.js`

## Forbidden for the adapter

The adapter must not import:

- `debug-dimensions.js`
- `plate-lab-debug-renderers.js`
- `regression-cases.js`
- `app.js`
- `viewer-calibration.js`
- `font-calibration.js`

## Not changed

- no active Card renderer switch
- no geometry change
- no renderer logic change
- no solver merge
- no change-plate logic change
- no visible SVG change

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: passed
- Card Transfer Dry Run Scaffold: passed
- Card Transfer Manifest Preview: passed
- Card Transfer Staged Copy: passed
- Card Renderer Adapter Scaffold: passed
- b321 → b322 model hashes: 41/41 identical
- b321 → b322 SVG hashes: 41/41 identical
