# b263 – Visual Style Module Cleanup

Full-/Übergabe-Dokumentation zum autoritativen Lab-Stand `b263`.

## Einordnung

- Das separate Lab-ZIP bleibt autoritativ.
- `tools/plate-physical-lab/` im Full-ZIP bleibt bewusst eingefroren/nicht autoritativ.
- Card-Code wurde nicht geändert.

## Inhalt

Im autoritativen Lab wurde die Visual-Style-/Farbmodus-Hilfslogik aus dem großen Renderer-Orchestrator in ein eigenes Modul ausgelagert:

- neu: `src/plate/plate-visual-style.js`
- verschoben:
  - `resolveVisualStyle()`
  - `resolveSeasonForVisualStyle()`

Damit bleibt die Regel „grünes Kennzeichen deaktiviert Saison“ zentraler gefasst, ohne Rendering-Geometrie zu verändern.

## Checks

- Lab Regression: `41/41 cases OK`
- b262 → b263 Regression-Modell-Hashes: `41/41 identisch`
- b262 → b263 Regression-SVG-Hashes: `41/41 identisch`
- Full/Card: `npm run check` → bestanden
