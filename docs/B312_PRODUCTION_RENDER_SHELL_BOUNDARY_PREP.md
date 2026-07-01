# b312 – Production Render Shell Boundary Prep

## Basis

b312 baut auf **b311 – Lab → Card Transfer Boundary Audit** auf.

## Ziel

Vorbereitung der späteren Lab → Card-Übernahme, ohne bereits Card-Code zu ändern:

- produktive SVG-Shell darf keinen statischen Debug-Import mehr haben
- Lab-Debug-Layer bleiben weiterhin verfügbar
- Regression und SVG-Ausgabe bleiben unverändert

## Änderung in b312

`src/plate/plate-render-shell.js` importiert `debug-dimensions.js` nicht mehr statisch.

Neu:

- `src/plate/plate-lab-debug-renderers.js`
  - Lab-only Wiring für Debug-Layer
  - importiert `debug-dimensions.js`
  - exportiert `labDebugRenderers`

Angepasst:

- `app.js` übergibt `debugRenderers: labDebugRenderers` an `renderPlateSvgMm()`
- `src/plate/regression-cases.js` übergibt ebenfalls `debugRenderers: labDebugRenderers`, damit Lab-Regressionen die bisherigen Debug-/Dimension-Layer unverändert prüfen
- `plate-render-shell.js` rendert Debug-Layer nur noch über optionale Renderer-Callbacks aus `options.debugRenderers`

## Wichtig für spätere Card-Integration

Die Card darf später **nicht** `plate-lab-debug-renderers.js` oder `debug-dimensions.js` importieren.

Produktiv erlaubt:

- `plate-render-shell.js`
- Renderer-/Model-/Utility-Module ohne Debug-Semantik

Lab-only:

- `debug-dimensions.js`
- `plate-lab-debug-renderers.js`

Dadurch kann die produktive Card später die SVG-Shell verwenden, ohne Debug-Code ins Bundle zu ziehen.

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- kein Card-Code
- keine sichtbare SVG-Änderung

## Checks

- Lab Regression: 41/41 OK
- b311 → b312 Modell-Hashes: 41/41 identisch
- b311 → b312 SVG-Hashes: 41/41 identisch

## ZIP

`plate-physical-lab-b312-production-render-shell-boundary-prep.zip`

## Nächster Einstieg

Weiter ab **b312**. Nächster sinnvoller Schritt: Transfer-Grenze weiter prüfen, insbesondere ob weitere produktive Module noch Lab-only-Imports besitzen.
