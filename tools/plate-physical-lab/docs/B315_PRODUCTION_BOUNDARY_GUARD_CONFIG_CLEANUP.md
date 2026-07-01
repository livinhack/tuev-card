# b315 – Production Boundary Guard Config Cleanup

## Ziel

b315 trennt die Konfiguration des Production-Import-Boundary-Guards vom Guard-Ablauf. Das ist eine reine Transfer-Sicherungsmaßnahme für die spätere Lab-→Card-Übernahme.

## Änderung

Neu:

- `scripts/production-import-boundary.config.mjs`

Geändert:

- `scripts/check-production-import-boundary.mjs` importiert `productionEntries` und `labOnlyModules` aus der neuen Konfiguration.

## Warum

Die produktive Renderer-Closure und die Liste verbotener Lab-/Debug-only-Module sollen später leicht gepflegt werden können, ohne den Guard-Ablauf zu verändern.

## Boundary-Regel

Produktive Renderer-Einstiege dürfen keine Lab-/Debug-only-Module statisch erreichen.

Produktive Einstiege:

- `src/plate/mm-model.js`
- `src/plate/plate-public-api.js`
- `src/plate/plate-svg-renderer.js`
- `src/plate/plate-render-shell.js`
- `src/plate/spacing-solver.js`

Nicht produktiv übernehmen/importieren:

- `src/plate/debug-dimensions.js`
- `src/plate/plate-lab-debug-renderers.js`
- `src/plate/regression-cases.js`
- `app.js`
- `viewer-calibration.js`
- `font-calibration.js`
- `scripts/run-regression.mjs`

## Nicht geändert

- keine Renderlogik
- keine Geometrie
- keine Solver-Zusammenführung
- keine Wechselkennzeichenlogik
- kein Card-Code
- keine sichtbare SVG-Änderung

## Check-Ergebnis

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- b314 → b315 Modell-Hashes: 41/41 identisch
- b314 → b315 SVG-Hashes: 41/41 identisch
