# Übergabe Full b324 – Direct Card Renderer Replacement Prep

b324 baut auf **b323 – Card Renderer Adapter Smoke Checkpoint** auf.

## Entscheidung

Keine Toggle-/Legacy-Integration. Wenn der alte Renderer benötigt wird, dient das vorherige ZIP als Rücksetzpunkt.

## Änderung

- Full-/Lab-Version auf `0.1.1-b324` aktualisiert
- `src/plate/lab-renderer-adapter.js` vorbereitet als direkte spätere `renderer.js`-Ersatzgrenze
- Adapter exportiert nun zusätzlich Card-kompatible Namen:
  - `normalizePlate()`
  - `getLicensePlateMetrics()`
  - `renderLicensePlate()`
- neuer Check:
  - `scripts/check-card-renderer-direct-replacement-prep.mjs`
- neues Script:
  - `npm run check:card-renderer-direct-replacement-prep`
- Full-`npm run check` führt den neuen Check mit aus
- neue Doku:
  - `docs/B324_DIRECT_CARD_RENDERER_REPLACEMENT_PREP.md`

## Synchronisation

`tools/plate-physical-lab/` ist in diesem Full-ZIP bewusst mit dem separaten Lab-ZIP b324 synchronisiert. Autoritativ bleibt weiterhin das separate Lab-ZIP.

## Nicht geändert

- aktiver Card-Renderer `src/plate/renderer.js` bleibt unverändert
- kein Umschalter
- kein Legacy-Fallback
- keine Geometrie
- keine Rendererlogik
- keine Solver-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine sichtbare SVG-Änderung

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
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
- ZIP-Test: beide ZIPs fehlerfrei

## Artefakte

- `plate-physical-lab-b324-direct-card-renderer-replacement-prep.zip`
- `tuev-card-full-b324-direct-card-renderer-replacement-prep-handover.zip`

## Nächster Schritt

Direkte Card-Renderer-Ersetzung in b325 durchführen: `src/plate/renderer.js` ersetzen/umbauen auf die vorbereitete Lab-Renderer-Grenze, ohne Toggle und ohne Alt-Renderer-Codepfad.
