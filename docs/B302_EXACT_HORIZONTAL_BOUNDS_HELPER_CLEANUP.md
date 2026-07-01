# b302 – Exact Horizontal Bounds Helper Cleanup

Basis: **b301 – Exact Typed Item Filter Helper Cleanup**

## Änderung

Im Lab wurde nur die identische Bounds-Objekt-Formel zentralisiert:

```js
return { left, right, width: right - left };
```

Helper:

- `createHorizontalBounds(left, right)` in `src/plate/plate-layout-result-utils.js`

## Full

- Card-Code unverändert
- `tools/plate-physical-lab/` mit b302 synchronisiert
- Autoritativ bleibt das separate Lab-ZIP

## Prüfung

- Lab Regression: 41/41 OK
- b301 → b302 Modell-Hashes: 41/41 identisch
- b301 → b302 SVG-Hashes: 41/41 identisch
- Full/Card Check bestanden
