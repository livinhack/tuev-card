# b277 – Exact Variable Range Min Sum Helper Cleanup

## Ziel

Nur die vollständig identische Formel zur Summe von Variable-Range-Minima zentralisieren.

## Änderung

Neuer Helper in `src/plate/plate-sequence-width-utils.js`:

```js
export function sumVariableRangeMinWidths(items, getRange) {
  return items.reduce((sum, item) => sum + (getRange(item)?.min ?? 0), 0);
}
```

Verwendet bei:

- `chain-solver.js` / `getChainStats()`
- `reduced-row-chain-solver.js` / `getPreSealStats()`

## Sicherheitsgrenze

Die fachliche Auswahl der variablen Items und die jeweiligen Range-Regeln bleiben in den bestehenden Solvern. Es wurde keine ähnliche Solverlogik zusammengeführt.

## Checks

- Regression: 41/41 OK
- b276 → b277 Modell-Hashes: 41/41 identisch
- b276 → b277 SVG-Hashes: 41/41 identisch
