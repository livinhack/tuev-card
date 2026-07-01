# Kennzeichen Physical Lab b306

## b306 – Exact SVG Number Format Helper Cleanup

b306 baut auf **b305 – Exact Supplement Typed Item Finder Cleanup** auf.

## Änderung in b306

Streng nach der Regel: Nur wirklich identische Formeln zentralisieren.

Neu bzw. weiterverwendet in `src/plate/plate-number-utils.js`:

- `formatSvgNumber(value)`

Ersetzt wurde nur die identische SVG-Zahlenformat-Formel:

```js
numberOrFallback(value).toFixed(3).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
```

Betroffen:

- `src/plate/eu-star-wreath.js`
- `src/plate/eu-country-mark.js`

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b305 → b306 Modell-Hashes: 41/41 identisch
- b305 → b306 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden

## Artefakt

`plate-physical-lab-b306-exact-svg-number-format-helper-cleanup.zip`
