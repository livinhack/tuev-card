# TÜV Reminder Card b324

## b324 – Direct Card Renderer Replacement Prep

b324 baut auf **b323 – Card Renderer Adapter Smoke Checkpoint** auf.

## Änderung in b324

- Full-/Lab-Version auf `0.1.1-b324` aktualisiert
- sichtbarer Lab-Titel/Version auf b324 aktualisiert
- inaktiver Adapter `src/plate/lab-renderer-adapter.js` erhält eine `renderer.js`-kompatible API:
  - `normalizePlate()`
  - `getLicensePlateMetrics()`
  - `renderLicensePlate()`
- neuer Check: `scripts/check-card-renderer-direct-replacement-prep.mjs`
- neues Script: `npm run check:card-renderer-direct-replacement-prep`
- Full-`npm run check` führt den neuen Check mit aus
- neue Doku: `docs/B324_DIRECT_CARD_RENDERER_REPLACEMENT_PREP.md`

## Wichtig

Der aktive Card-Renderer wurde noch nicht ersetzt. Es gibt keinen Umschalter und keinen Legacy-Fallback. Der Rückweg bleibt das vorherige ZIP.

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

## Artefakt

`tuev-card-full-b324-direct-card-renderer-replacement-prep-handover.zip`
