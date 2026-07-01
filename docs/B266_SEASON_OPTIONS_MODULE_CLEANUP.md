# b266 – Season Options Module Cleanup

## Ziel

`plate-svg-renderer.js` weiter entlasten, ohne Rendering, Geometrie, UI oder Card-Code zu verändern.

## Änderung

Neue Datei im autoritativen Lab:

- `src/plate/plate-season-options.js`

Ausgelagert aus `src/plate/plate-svg-renderer.js`:

- `resolveSeasonOptions()`
- `resolveRulesForSeason()`

## Full/Card

Card-Code unverändert. Der Full-ZIP enthält aktualisierte Übergabe/Doku. Das separate Lab-ZIP bleibt autoritativ.

## Checks

- Lab Regression: `41/41 OK`
- b265 → b266 Modell-Hashes: `41/41 identisch`
- b265 → b266 SVG-Hashes: `41/41 identisch`
- Full/Card Check: bestanden
