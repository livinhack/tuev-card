# b276 – Exact Numeric Values Sum Helper Cleanup

## Ziel

Full-/Übergabe-Stand zum autoritativen Lab b276 erstellen. Die Card bleibt unverändert.

## Lab-Änderung

Neu in `tools/plate-physical-lab/src/plate/plate-sequence-width-utils.js`:

- `sumValues(values)`

Zentralisierte Formel:

```js
values.reduce((sum, value) => sum + value, 0)
```

## Full-Änderung

- Version auf `0.1.1-b276`
- `tools/plate-physical-lab/` mit Lab b276 synchronisiert
- README/HANDOVER/Doku aktualisiert
- Card-Code unverändert

## Checks

- Lab Regression: 41/41 OK
- b275 → b276 Modell-Hashes: 41/41 identisch
- b275 → b276 SVG-Hashes: 41/41 identisch
- Full/Card Check: bestanden
