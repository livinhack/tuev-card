# b323 – Card Renderer Adapter Smoke Checkpoint

b323 builds on **b322 – Card Renderer Adapter Scaffold**.

## Scope

This is a conservative smoke checkpoint for the inactive Card adapter path. It does not activate the staged renderer in the Card.

## Changes

- Lab visible version/title updated to b323.
- Lab package version updated to `0.1.1-b323`.
- Documentation updated for the adapter smoke checkpoint.
- No production renderer geometry or SVG logic changed.

## Card transfer status

The staged renderer remains available only in the Full package under:

- `src/plate/lab-renderer/`
- `src/plate/lab-renderer-adapter.js`

The active Card renderer remains unchanged.

## Expected checks

- Lab regression: 41/41 OK
- Production import boundary guard: OK
- Card transfer dry run: OK
- Card transfer manifest preview: OK
- b322 → b323 model hashes: 41/41 identical
- b322 → b323 SVG hashes: 41/41 identical

## Next step

Continue with a controlled inactive adapter comparison or another Card transfer smoke checkpoint. Do not switch the active Card renderer yet.
