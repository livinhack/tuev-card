# Kennzeichen Physical Lab b324

## b324 – Direct Card Renderer Replacement Prep

b324 baut auf **b323 – Card Renderer Adapter Smoke Checkpoint** auf.

## Änderung in b324

- Lab-Version/Titel auf b324 aktualisiert
- Lab-Version auf `0.1.1-b324` aktualisiert
- Doku zur direkten Card-Renderer-Ersetzung ergänzt
- keine Geometrieänderung
- keine Rendererlogikänderung

## Full/Card-Kontext

Im Full-ZIP wird der inaktive Card-Adapter so vorbereitet, dass er später `src/plate/renderer.js` direkt ersetzen kann. Es wird kein Umschalter und kein Legacy-Fallback eingebaut.

## Checks

- Lab Regression: 41/41 OK
- b323 → b324 Modell-Hashes: 41/41 identisch
- b323 → b324 SVG-Hashes: 41/41 identisch

## Artefakt

`plate-physical-lab-b324-direct-card-renderer-replacement-prep.zip`
