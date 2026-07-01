# b264 – Render Context Helpers Cleanup

Basis: **b263 – Visual Style Module Cleanup**.

## Ziel

Kleiner defensiver Modul-Cleanup, um wiederholte Font-/Input-Normalisierung aus `plate-svg-renderer.js` auszulagern.

## Änderungen

Neue Datei:

- `src/plate/plate-render-context.js`

Ausgelagert:

- `createOneLineRenderFont()`
- `createTwoLineRenderFont()`
- `resolveChangePlateBaseInput()`

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine Wechselkennzeichen-Geometrie
- keine Siegel-/Slot-Geometrie
- keine UI
- kein Card-Code

## Checks

- Lab Regression: `41/41 OK`
- b263 → b264 Regression-Modell-Hashes: `41/41 identisch`
- b263 → b264 Regression-SVG-Hashes: `41/41 identisch`
- Full/Card Check: bestanden
