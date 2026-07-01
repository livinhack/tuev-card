# b266 – Season Options Module Cleanup

## Ziel

`plate-svg-renderer.js` weiter entlasten, ohne Rendering, Geometrie oder UI zu verändern.

## Änderung

Neue Datei:

- `src/plate/plate-season-options.js`

Ausgelagert:

- `resolveSeasonOptions()`
- `resolveRulesForSeason()`

## Sicherheitsgrenzen

- keine Änderungen an Kennzeichenmaßen
- keine Änderungen an Wechselkennzeichen
- keine Änderungen an Siegeln/Slots
- keine UI-Änderungen

## Checks

- Regression: `41/41 OK`
- b265 → b266 Modell-Hashes: `41/41 identisch`
- b265 → b266 SVG-Hashes: `41/41 identisch`
