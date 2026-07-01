# Übergabe Lab b321 – Card Transfer Staged Copy Preview

## b321 – Card Transfer Staged Copy Preview

b321 baut auf **b320 – Card Transfer Manifest Preview** auf.

## Änderung in b321

- sichtbare Lab-Version/Titel auf b321 aktualisiert
- Transfer-Dokumentation ergänzt
- `scripts/card-transfer-dry-run.config.mjs` auf b321 aktualisiert
- keine aktive Card-Integration im Lab
- keine Renderer-/Geometrieänderung

## Wichtig

Die inaktive Card-Zielkopie wird im Full-ZIP unter `src/plate/lab-renderer/` bereitgestellt. Das separate Lab-ZIP bleibt weiterhin autoritative Quelle für den Renderer.

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- b320 → b321 Modell-Hashes: 41/41 identisch
- b320 → b321 SVG-Hashes: 41/41 identisch

## ZIPs

- `plate-physical-lab-b321-card-transfer-staged-copy-preview.zip`
- `tuev-card-full-b321-card-transfer-staged-copy-preview-handover.zip`

## Nächster sinnvoller Schritt

Weiter ab **b321**. Sinnvoll wäre danach `b322 – Card Renderer Adapter Scaffold`, weiterhin ohne Standard-Umschaltung.
