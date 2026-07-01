# b323 – Card Renderer Adapter Smoke Checkpoint

b323 builds on **b322 – Card Renderer Adapter Scaffold**.

## Scope

This is a conservative smoke checkpoint for the inactive Card adapter path. It keeps the staged Lab renderer copy inactive and verifies the adapter boundary without switching the active Card renderer.

## Changes

- Added `scripts/check-card-renderer-adapter-smoke.mjs` in the Full package.
- Added `npm run check:card-renderer-adapter-smoke`.
- Full `npm run check` now includes the adapter smoke check.
- Full and Lab documentation/version markers updated to b323.
- `tools/plate-physical-lab/` is synchronized with the separate Lab ZIP.

## Adapter smoke check

The check verifies:

- inactive adapter file exists
- adapter enters the staged renderer via `src/plate/lab-renderer/plate-public-api.js`
- adapter keeps Card font integration at the adapter boundary
- no Lab/debug-only modules are imported
- active Card renderer files do not import `lab-renderer-adapter.js`
- required adapter exports exist
- normalization smoke cases pass
- empty metrics smoke case passes
- a basic `B VM 146` metrics smoke case passes
- a basic SVG smoke case returns staged Card renderer output

## Still not changed

- No active Card renderer switch.
- No Card UI/control change.
- No renderer geometry change.
- No solver merge.
- No debug dependency added to production Card code.

## Expected checks

- Lab regression: 41/41 OK
- Production import boundary guard: OK
- Card transfer dry run: OK
- Card transfer manifest preview: OK
- Card transfer staged copy: 35/35 OK
- Card renderer adapter scaffold: OK
- Card renderer adapter smoke: OK
- b322 → b323 model hashes: 41/41 identical
- b322 → b323 SVG hashes: 41/41 identical
