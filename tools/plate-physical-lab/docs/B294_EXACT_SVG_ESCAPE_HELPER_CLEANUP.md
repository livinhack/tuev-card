# b294 – Exact SVG Escape Helper Cleanup

## Ziel

Nur vollständig identische SVG-Escape-Formeln zentralisieren.

## Änderung

Neu:

- `src/plate/svg-escape-utils.js`
- `escapeSvgText(value)`
- `escapeSvgTextOrEmpty(value)`
- `escapeSvgAttr(value)`

Entfernt wurden lokale Kopien in:

- `plate-render-shell.js`
- `debug-dimensions.js`
- `eu-country-mark.js`
- `change-plate-supplement-renderer.js`

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung

## Checks

- Lab Regression: 41/41 OK
- b293 → b294 Modell-Hashes: 41/41 identisch
- b293 → b294 SVG-Hashes: 41/41 identisch
