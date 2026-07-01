# Übergabe Lab b325 – Direct Card Plate Renderer Integration

b325 baut auf **b324 – Direct Card Renderer Replacement Prep** auf.

## Änderungen

- sichtbare Lab-Version/Titel auf b325 aktualisiert
- Lab-Version auf `0.1.1-b325` aktualisiert
- keine Lab-Renderer-/Geometrie-/Solveränderung
- keine Debug-Abhängigkeitsänderung im Lab

## Full/Card-Bezug

Die Full/Card integriert in b325 den vorbereiteten Lab-Renderer-Adapter direkt als aktiven Kennzeichenrenderer.
Das Lab bleibt weiterhin autoritativ; der Full-ZIP enthält einen synchronisierten Lab-Spiegel.

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- Lab-Modell-/SVG-Hashes bleiben gegenüber b324 identisch, da keine Lab-Rendererlogik geändert wurde

## Artefakt

- `plate-physical-lab-b325-direct-card-plate-renderer-integration.zip`
