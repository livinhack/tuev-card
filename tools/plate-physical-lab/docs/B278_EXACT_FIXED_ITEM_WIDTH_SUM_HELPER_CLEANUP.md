# b278 – Exact Fixed Item Width Sum Helper Cleanup

## Ziel

Kleiner defensiver Cleanup nach der strengen Regel: Nur wirklich identische Formeln werden zentralisiert.

## Änderung

Neuer Helper in `src/plate/plate-sequence-width-utils.js`:

- `sumItemWidthsWhere(items, shouldInclude)`

Zentralisierte Formel:

```js
items.reduce((sum, item) => sum + (shouldInclude(item) ? (Number(item.width) || 0) : 0), 0)
```

Die fachlichen Include-Bedingungen bleiben an ihren jeweiligen Aufrufstellen.

## Verwendet bei

- `chain-solver.js` / `getChainStats()`
- `reduced-row-chain-solver.js` / `getPreSealStats()`
- `plate-svg-renderer.js` / `getReducedTextChainStats()`

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine UI-Änderung
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b277 → b278 model hashes: 41/41 identical
- b277 → b278 SVG hashes: 41/41 identical
