# b293 – Exact Seal Circle Geometry Helper Cleanup

Defensiver Cleanup nach b292.

## Änderung

In `seal-geometry-plan.js` wurde nur der identische Aufbau der HU-/Zulassungssiegel-Kreisgeometrieobjekte in `createSealCircleGeometry(cx, cy, diameter, radius)` zentralisiert.

Ersetzt wurde nur die wiederholte Objektform:

```js
{ cx, cy, diameter, radius }
```

Die fachlichen Seal-Geometriezweige bleiben getrennt.

## Checks

- Lab Regression: 41/41 OK
- b292 → b293 Modell-Hashes: 41/41 identisch
- b292 → b293 SVG-Hashes: 41/41 identisch
- Full/Card JS Check bestanden
- Release Asset Check bestanden
