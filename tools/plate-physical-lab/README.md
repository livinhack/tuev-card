# Kennzeichen Physical Lab b322

## b322 – Card Renderer Adapter Scaffold

b322 baut auf **b321 – Card Transfer Staged Copy Preview** auf.

## Änderung in b322

- Lab-Version/Titel auf b322 aktualisiert
- Transfer-Dokumentation um den inaktiven Card-Adapter-Scaffold ergänzt
- `scripts/card-transfer-dry-run.config.mjs` auf b322 aktualisiert
- keine Renderer-, Geometrie-, Solver- oder UI-Control-Änderung
- das separate Lab-ZIP bleibt die autoritative Renderer-Quelle

Die eigentliche inaktive Kopie und der Adapter liegen im Full-ZIP unter:

```text
src/plate/lab-renderer/
src/plate/lab-renderer-adapter.js
```

## Neue Doku

- `docs/B322_CARD_RENDERER_ADAPTER_SCAFFOLD.md`

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- b321 → b322 Modell-Hashes: 41/41 identisch
- b321 → b322 SVG-Hashes: 41/41 identisch

## Artefakt

`plate-physical-lab-b322-card-renderer-adapter-scaffold.zip`
