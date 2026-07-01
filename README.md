# TÜV Reminder Card b325

## b325 – Direct Card Plate Renderer Integration

b325 baut auf **b324 – Direct Card Renderer Replacement Prep** auf.

## Änderung in b325

- Full-/Lab-Version auf `0.1.1-b325` aktualisiert
- sichtbarer Lab-Titel/Version auf b325 aktualisiert
- `src/plate/renderer.js` delegiert jetzt direkt an `src/plate/lab-renderer-adapter.js`
- kein Umschalter, kein Legacy-Fallback, kein paralleler Alt-/Neu-Pfad
- `isGraphicalPlateAvailable()` hängt nicht mehr an `config.plate_style === "plate"`
- neuer Check: `npm run check:card-renderer-direct-integration`
- neue Doku: `docs/B325_DIRECT_CARD_PLATE_RENDERER_INTEGRATION.md`

## Wichtig

Der aktive Card-Kennzeichenrenderer ist damit der vorbereitete Physical-Lab-Renderer-Adapter.
Ein Rollback erfolgt über das vorherige ZIP, nicht über einen Code-Umschalter.

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- Card Transfer Staged Copy: 35/35 OK
- Card Renderer Adapter Scaffold: bestanden
- Card Renderer Adapter Smoke: bestanden
- Card Renderer Direct Integration: bestanden
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
- ZIP-Test: beide ZIPs fehlerfrei

## Artefakt

`tuev-card-full-b325-direct-card-plate-renderer-integration-handover.zip`
