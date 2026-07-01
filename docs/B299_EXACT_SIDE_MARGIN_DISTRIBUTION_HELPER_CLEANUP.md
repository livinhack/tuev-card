# b299 – Exact Side Margin Distribution Helper Cleanup

Build: `0.1.1-b299`

## Basis

b299 baut auf **b298 – Exact Shared Seal Item Width Helper Cleanup** auf.

## Änderung

Nur eine vollständig identische Mini-Formel wurde lokal in `reduced-row-chain-solver.js` zentralisiert:

```js
const sideMarginLeft = sideMinLeft + Math.max(0, remaining) / 2;
const sideMarginRight = sideMinRight + Math.max(0, remaining) / 2;
```

Neuer lokaler Helper:

```js
distributeRemainingToSideMargins(sideMinLeft, sideMinRight, remaining)
```

Die fachlichen Solverzweige bleiben getrennt. Der Helper verteilt nur die bereits berechnete Restbreite symmetrisch auf linke und rechte Seitenränder.

## Unverändert

- keine Geometrieänderung
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b298 → b299 model hashes: 41/41 identical
- b298 → b299 SVG hashes: 41/41 identical
- Full/Card JS Check: passed
- Release Asset Check: passed
- ZIP test: both ZIPs valid
