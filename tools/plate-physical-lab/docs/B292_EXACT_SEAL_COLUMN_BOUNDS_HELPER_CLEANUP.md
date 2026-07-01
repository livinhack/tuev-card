# b292 – Exact Seal Column Bounds Helper Cleanup

Defensiver Cleanup nach b291.

## Änderung

In `seal-geometry-plan.js` wurde nur der identische Aufbau der Seal-Column-Bounds-Felder in `createSealColumnBounds(innerX, innerWidth, outerX = innerX, outerWidth = innerWidth)` zentralisiert.

Die fachlichen Seal-Geometriezweige bleiben getrennt.

## Checks

- Lab Regression: 41/41 OK
- b291 → b292 Modell-Hashes: 41/41 identisch
- b291 → b292 SVG-Hashes: 41/41 identisch
- Full/Card JS Check bestanden
- Release Asset Check bestanden
