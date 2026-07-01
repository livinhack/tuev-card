# b270 – Spacing Surface Utils Module Cleanup

## Ziel

`plate-svg-renderer.js` weiter entlasten, ohne geprüfte Geometrie oder Renderer-Ausgabe zu verändern.

## Änderung

Neues Modul:

- `src/plate/plate-spacing-surface-utils.js`

Ausgelagert:

- `createSpacingSurfaces()`
- `waterFillSpacingSurfaces()`
- `spacingSurfaceResult()`

Die fachlichen Wrapper bleiben erhalten:

- `balanceTopRowSpacingSurfaces()`
- `balanceBottomRowSpacingSurfaces()`
- `balanceOneLineSeasonSpacingSurfaces()`

Damit bleiben die jeweiligen Regeln/Parameter an der aufrufenden Stelle. Nur die identische Waterfill-/Result-Formel wurde zentralisiert.

## Prüfungen

- Lab Regression: 41/41 OK
- b269 → b270 Regression-Modell-Hashes: 41/41 identisch
- b269 → b270 Regression-SVG-Hashes: 41/41 identisch

## Ergebnis

No-Geometry-Change-Cleanup bestätigt.
