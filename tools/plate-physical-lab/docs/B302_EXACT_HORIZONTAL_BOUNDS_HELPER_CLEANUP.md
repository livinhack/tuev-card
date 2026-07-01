# b302 – Exact Horizontal Bounds Helper Cleanup

Basis: **b301 – Exact Typed Item Filter Helper Cleanup**

## Ziel

Weitere Reduktion nur bei exakt identischer Formel.

## Änderung

Die identische Bounds-Objekt-Formel wurde in `createHorizontalBounds(left, right)` zentralisiert:

```js
return { left, right, width: right - left };
```

## Grenzen

- keine fachliche Zusammenlegung der Content-Limits-Funktionen
- keine Solver-Zusammenlegung
- keine Geometrieänderung

## Prüfung

- Lab Regression: 41/41 OK
- b301 → b302 Modell-Hashes: 41/41 identisch
- b301 → b302 SVG-Hashes: 41/41 identisch
