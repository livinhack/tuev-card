# b324 – Direct Card Renderer Replacement Prep

b324 baut auf **b323 – Card Renderer Adapter Smoke Checkpoint** auf.

## Ziel

Die spätere Card-Renderer-Integration wird als direkte Ersetzung vorbereitet:

- kein Umschalter
- kein Legacy-/Alt-Renderer-Fallback
- kein paralleler Alt-/Neu-Pfad
- Rückweg bleibt das vorherige ZIP

## Änderung

Im Full-ZIP erhält der inaktive Adapter eine `renderer.js`-kompatible API:

- `normalizePlate()`
- `getLicensePlateMetrics()`
- `renderLicensePlate()`

Diese Aliase delegieren auf den staged Lab-Renderer-Adapter. Der aktive Card-Renderer wird noch nicht geändert.

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- Card Transfer Staged Copy: 35/35 OK
- Card Renderer Adapter Scaffold: bestanden
- Card Renderer Adapter Smoke: bestanden
- Card Renderer Direct Replacement Prep: bestanden
- b323 → b324 Modell-Hashes: 41/41 identisch
- b323 → b324 SVG-Hashes: 41/41 identisch

## Wichtig

`src/plate/renderer.js` bleibt in b324 aktiv unverändert. Die direkte Ersetzung ist vorbereitet, aber noch nicht durchgeführt.
