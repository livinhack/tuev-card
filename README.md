# TÜV Reminder Card b321

## b321 – Card Transfer Staged Copy Preview

b321 baut auf **b320 – Card Transfer Manifest Preview** auf.

## Änderung in b321

- Full-/Übergabe-Dokumentation auf b321 aktualisiert
- Lab-Spiegel unter `tools/plate-physical-lab/` auf b321 synchronisiert
- inaktive Staged-Copy der 35 produktiven Lab-Rendererdateien unter `src/plate/lab-renderer/`
- neuer Full-Check: `scripts/check-card-transfer-staged-copy.mjs`
- neues npm-Script: `npm run check:card-transfer-staged-copy`
- Full-`npm run check` führt den Staged-Copy-Check mit aus

## Wichtig

Der aktive Card-Renderer ist unverändert. Es gibt keine Umschaltung auf den neuen Lab-Renderer. `src/plate/lab-renderer/` ist nur eine vorbereitete, hashgeprüfte Zielkopie.

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
- b320 → b321 Modell-Hashes: 41/41 identisch
- b320 → b321 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
- ZIP-Test: beide ZIPs fehlerfrei

## Artefakt

`tuev-card-full-b321-card-transfer-staged-copy-preview-handover.zip`
