# b272 – Exact Width Helper Export Cleanup

Basis: **b271 – Renderer Module Smoke Checkpoint**

## Änderung

Lab-only, Card unverändert.

Nach `src/plate/plate-sequence-width-utils.js` exportiert:

- `sumItemWidths(items, getWidth)`
- `createItemWidthMap(items, getWidth)`

## Refactor-Grenze

Nur wirklich identische, formelgleiche Mini-Helfer. Keine fachlich ähnlichen Solver/Builder/Layoutpfade zusammengeführt.

## Checks

- Lab Regression: 41/41 OK
- b271 → b272 Modell-Hashes: 41/41 identisch
- b271 → b272 SVG-Hashes: 41/41 identisch
- Full/Card Check: bestanden
