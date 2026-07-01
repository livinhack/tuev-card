# b313 – Production Renderer Dependency Audit (Full/Handover)

## Ziel

Full-/Übergabestand zu b313. Der synchronisierte Lab-Spiegel wurde auf die spätere Transfer-Grenze Lab → Card geprüft.

Es wurde bewusst **kein Renderer-Code** geändert. Der Stand dokumentiert nur, welche Dateien für einen produktiven Card-Renderer relevant sind und welche Lab-/Debug-Dateien nicht übernommen werden dürfen.

## Ergebnis

Die b312-Entkopplung ist wirksam:

- `plate-render-shell.js` hat keinen statischen Import auf `debug-dimensions.js` mehr.
- Die produktive Import-Closure über `mm-model.js`/`plate-public-api.js` erreicht keine Debug-Module.
- Debug wird nur über Lab-Einstiege injiziert.

## Produktiv übernehmbar

Diese Module gehören zur produktiven Renderer-Closure oder sind produktive Kompatibilitäts-/Utility-Grenzen:

- `mm-model.js`
- `plate-public-api.js`
- `plate-svg-renderer.js`
- `plate-render-shell.js`
- `plate-render-context.js`
- `plate-rules.js`
- `plate-layout-model.js`
- `plate-layout-result-utils.js`
- `plate-format-strategy.js`
- `plate-variant-rules.js`
- `plate-visual-style.js`
- `plate-width-strategy.js`
- `plate-season-options.js`
- `plate-number-utils.js`
- `plate-sequence-width-utils.js`
- `plate-spacing-surface-utils.js`
- `text-utils.js`
- `svg-escape-utils.js`
- `row-sequence-builder.js`
- `row-layout-adapter.js`
- `chain-solver.js`
- `reduced-row-chain-solver.js`
- `plate-body.js`
- `euro-field.js`
- `eu-star-wreath.js`
- `eu-country-mark.js`
- `season-field.js`
- `seal-components.js`
- `seal-geometry-plan.js`
- `seal-marker-plan.js`
- `seal-slot-marker.js`
- `change-plate.js`
- `change-plate-slot-plan.js`
- `change-plate-supplement-renderer.js`

## Nicht produktiv übernehmen

Diese Dateien bleiben Lab-/Test-/Debug-only und dürfen später nicht in den produktiven Card-Renderer importiert werden:

- `app.js`
- `viewer-calibration.js`
- `font-calibration.js`
- `styles.css`
- `src/plate/debug-dimensions.js`
- `src/plate/plate-lab-debug-renderers.js`
- `src/plate/regression-cases.js`
- `scripts/run-regression.mjs`
- `reference/`
- Lab-Dokumentation und Prüfdaten

## Sonderfall Kompatibilitätsgrenze

`spacing-solver.js` ist kein direkter Bestandteil der produktiven Import-Closure. Es ist nur eine Kompatibilitätsgrenze und re-exportiert `buildPlateModelMm` aus `plate-public-api.js`.

Für die spätere Card-Integration kann es weggelassen werden, solange keine externe Altstelle diesen Kompatibilitätsimport erwartet.

## Import-Audit

Direkte Debug-/Lab-only-Importe wurden nur an Lab-Einstiegen gefunden:

- `app.js` importiert `plate-lab-debug-renderers.js`
- `regression-cases.js` importiert `plate-lab-debug-renderers.js`
- `plate-lab-debug-renderers.js` importiert `debug-dimensions.js`

Produktive Module importieren keine Lab-only-/Debug-only-Module.

## Transfer-Regeln für Card

1. Card-Renderer über `mm-model.js` oder eine später bewusst definierte Card-Entry-Grenze anbinden.
2. Keine Importe auf `debug-dimensions.js`, `plate-lab-debug-renderers.js` oder `regression-cases.js`.
3. `debugRenderers` in der Card nicht übergeben.
4. Lab-Kalibrierung, Referenzen und Regressionen nicht in das produktive Bundle übernehmen.
5. Vor Integration eine automatisierte Import-Guard-Prüfung ergänzen, die Debug-/Lab-only-Importe im Card-Bundle blockiert.

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- kein Card-Code
- keine sichtbare SVG-Änderung

## Checks

- Lab Regression: 41/41 OK
- b312 → b313 Modell-Hashes: 41/41 identisch
- b312 → b313 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
