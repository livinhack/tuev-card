# b290 – Exact Format Number Helper Cleanup

b290 baut auf b289 auf und zentralisiert nur eine vollständig identische Formatierungsformel.

## Änderung

`debug-dimensions.js` nutzt jetzt `formatNumber(value)` aus `plate-number-utils.js`.

Entfernte lokale Formel:

```js
Number(value).toLocaleString("de-DE", { maximumFractionDigits: 1 })
```

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichenänderung
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b289 → b290 Modell-Hashes: 41/41 identisch
- b289 → b290 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden, 70 JavaScript-Dateien geprüft
- Release Asset Check: bestanden
- ZIP-Test: beide ZIPs fehlerfrei
