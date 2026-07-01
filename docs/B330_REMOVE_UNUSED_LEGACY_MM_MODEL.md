# b330 Remove Unused Legacy mm-model

b330 follows the b329 renderer legacy audit with one conservative cleanup.

## Removed

- Full/Card `src/plate/mm-model.js`

The b329 audit proved this file had no incoming imports in the active Full/Card source graph. The active Card renderer already delegates through:

1. `src/plate/renderer.js`
2. `src/plate/lab-renderer-adapter.js`
3. `src/plate/lab-renderer/plate-public-api.js`

## Kept

Standalone Lab compatibility files remain present, including Lab `src/plate/mm-model.js`. They are not the same cleanup target as the old Full/Card file.

## Guard

`check:renderer-legacy-audit` now verifies that the old Full/Card `src/plate/mm-model.js` path is absent and not imported.
