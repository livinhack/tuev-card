# Übergabe Full b321 – Card Transfer Staged Copy Preview

b321 baut auf **b320 – Card Transfer Manifest Preview** auf.

## Änderung in b321

- Full-/Übergabe-Dokumentation auf b321 aktualisiert
- Lab-Spiegel unter `tools/plate-physical-lab/` auf b321 synchronisiert
- produktive Lab-Rendererdateien zusätzlich inaktiv nach `src/plate/lab-renderer/` kopiert
- neuer Check `scripts/check-card-transfer-staged-copy.mjs`
- Full-`npm run check` prüft die Staged-Copy mit

## Staged-Copy-Status

- 35 produktive Rendererdateien kopiert
- Ziel: `src/plate/lab-renderer/`
- alle Ziel-Dateien hashgleich zur Quelle im Lab-Spiegel
- keine Debug-/Lab-only-Dateien enthalten
- aktive Card-Dateien importieren `lab-renderer` nicht

## Full-Lab-Spiegel

`tools/plate-physical-lab/` ist in diesem Full-ZIP bewusst mit dem separaten Lab-ZIP b321 synchronisiert. Autoritativ bleibt weiterhin das separate Lab-ZIP.

## Nicht geändert

- kein aktiver Card-Code
- keine Renderer-Umschaltung
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

## ZIPs

- `plate-physical-lab-b321-card-transfer-staged-copy-preview.zip`
- `tuev-card-full-b321-card-transfer-staged-copy-preview-handover.zip`

## Nächster sinnvoller Schritt

Weiter ab **b321**. Sinnvoller nächster Schritt: `b322 – Card Renderer Adapter Scaffold`, weiterhin ohne Default-Umschaltung.
