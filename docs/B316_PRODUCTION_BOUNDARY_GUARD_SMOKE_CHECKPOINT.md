# b316 – Production Boundary Guard Smoke Checkpoint

## Ziel

b316 ist ein konservativer Sicherungsstand nach b314/b315:

- der Production-Import-Boundary-Guard ist vorhanden,
- die Guard-Konfiguration ist zentralisiert,
- Full-`npm run check` führt den Guard mit aus,
- die produktive Renderer-Closure bleibt frei von Lab-/Debug-only-Modulen.

Es wurden keine Renderer-, Geometrie-, Solver- oder UI-Fachregeln geändert.

## Ergebnis

Der Guard bestätigt weiterhin:

```text
Production import boundary OK: 5 entries, 35 production files, 0 lab/debug-only imports.
```

## Produktive Einstiege

Die produktive Closure wird weiterhin ab diesen Einstiegen geprüft:

```text
src/plate/mm-model.js
src/plate/plate-public-api.js
src/plate/plate-svg-renderer.js
src/plate/plate-render-shell.js
src/plate/spacing-solver.js
```

## Lab-/Debug-only

Diese Dateien dürfen später nicht in die Card-Renderer-Closure gelangen:

```text
src/plate/debug-dimensions.js
src/plate/plate-lab-debug-renderers.js
src/plate/regression-cases.js
app.js
viewer-calibration.js
font-calibration.js
scripts/run-regression.mjs
```

## Transfer-Regel für die spätere Card

Vor jeder produktiven Renderer-Übernahme muss der Boundary-Guard erfolgreich laufen.
Die Card darf keine statische oder indirekte Abhängigkeit auf Lab-/Debug-only-Module bekommen.

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: OK
- b315 → b316 Modell-Hashes: 41/41 identisch
- b315 → b316 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: OK
- Release Asset Check: OK
