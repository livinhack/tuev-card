# b277 – Exact Variable Range Min Sum Helper Cleanup

## Ziel

Full-/Übergabe-Stand zum autoritativen Lab b277 erstellen. Die Card bleibt unverändert.

## Lab-Änderung

Im Lab wurde nur die vollständig identische Formel zur Summe von Variable-Range-Minima zentralisiert:

```js
variableItems.reduce((sum, item) => sum + (getVariableRangeForItem(item)?.min ?? 0), 0)
```

Neuer Helper:

- `sumVariableRangeMinWidths(items, getRange)`

## Full-Änderung

- Version auf `0.1.1-b277`
- `tools/plate-physical-lab/` mit Lab b277 synchronisiert
- README/HANDOVER/Doku aktualisiert
- Card-Code unverändert

## Checks

- Lab Regression: 41/41 OK
- b276 → b277 Modell-Hashes: 41/41 identisch
- b276 → b277 SVG-Hashes: 41/41 identisch
- Full/Card Check: bestanden
