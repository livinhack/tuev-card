# Kennzeichen Physical Lab b321

## b321 – Card Transfer Staged Copy Preview

b321 baut auf **b320 – Card Transfer Manifest Preview** auf.

## Änderung in b321

- Lab-Version/Titel auf b321 aktualisiert
- Transfer-Dokumentation um die Staged-Copy-Preview ergänzt
- `scripts/card-transfer-dry-run.config.mjs` auf b321 aktualisiert
- keine Renderer-, Geometrie-, Solver- oder UI-Control-Änderung
- das separate Lab-ZIP bleibt die autoritative Renderer-Quelle

Die eigentliche inaktive Kopie liegt im Full-ZIP unter:

```text
src/plate/lab-renderer/
```

## Neue Doku

- `docs/B321_CARD_TRANSFER_STAGED_COPY_PREVIEW.md`

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- b320 → b321 Modell-Hashes: 41/41 identisch
- b320 → b321 SVG-Hashes: 41/41 identisch

## Artefakt

`plate-physical-lab-b321-card-transfer-staged-copy-preview.zip`
