# b265 – Width Strategy Module Cleanup

Basis: **b264 – Render Context Helpers Cleanup**.

## Ziel

Kleiner defensiver Modul-Cleanup im autoritativen Physical Lab. Die Breitenstrategie-Helfer werden aus dem großen Renderer-Orchestrator ausgelagert, ohne Geometrie oder Renderer-Ausgabe zu verändern.

## Geändert im autoritativen Lab

Neue Datei:

- `src/plate/plate-width-strategy.js`

Aus `src/plate/plate-svg-renderer.js` ausgelagert:

- `resolveTwoLineWidthRule()`
- `getTwoLineWidthBandsForFont()`
- `resolveTwoLineWidthCapMm()`
- `resolveWidthCapMm()`
- `resolveWidthStrategy()`

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine Wechselkennzeichen-Geometrie
- keine Siegel-/Slot-Geometrie
- keine UI-Änderung
- kein Card-Code

## Checks

- Lab Regression: `41/41 OK`
- b264 → b265 Regression-Modell-Hashes: `41/41 identisch`
- b264 → b265 Regression-SVG-Hashes: `41/41 identisch`
- Full/Card Check: bestanden

## Full-Hinweis

Das separate Lab-ZIP bleibt autoritativ. Der Full-ZIP dokumentiert den Stand und enthält Card/Übergabeinformationen; `tools/plate-physical-lab/` ist weiterhin nicht der maßgebliche Lab-Arbeitsbaum.
