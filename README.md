# TÜV Reminder Card b322

## b322 – Card Renderer Adapter Scaffold

b322 baut auf **b321 – Card Transfer Staged Copy Preview** auf.

## Änderung in b322

- Full-/Übergabe-Dokumentation auf b322 aktualisiert
- Lab-Spiegel unter `tools/plate-physical-lab/` auf b322 synchronisiert
- inaktive Staged-Copy bleibt unter `src/plate/lab-renderer/`
- neuer inaktiver Adapter: `src/plate/lab-renderer-adapter.js`
- neuer Full-Check: `scripts/check-card-renderer-adapter-scaffold.mjs`
- neues npm-Script: `npm run check:card-renderer-adapter-scaffold`
- Full-`npm run check` führt den Adapter-Scaffold-Check mit aus

## Wichtig

Der aktive Card-Renderer ist unverändert. Es gibt keine Umschaltung auf den neuen Lab-Renderer. `src/plate/lab-renderer-adapter.js` ist nur ein vorbereiteter, inaktiver Adapter zur staged Lab-Renderer-Kopie.

## Nicht geändert

- kein aktiver Card-Code
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
- b321 → b322 Modell-Hashes: 41/41 identisch
- b321 → b322 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
- ZIP-Test: beide ZIPs fehlerfrei

## Artefakt

`tuev-card-full-b322-card-renderer-adapter-scaffold-handover.zip`
