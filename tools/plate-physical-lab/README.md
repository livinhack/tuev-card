# Kennzeichen Physical Lab b325

## b325 – Direct Card Plate Renderer Integration

b325 baut auf **b324 – Direct Card Renderer Replacement Prep** auf.

## Änderung in b325

- Lab-Version/Titel auf b325 aktualisiert
- Lab-Version auf `0.1.1-b325` aktualisiert
- Lab-Renderer/Geometrie/Solver bleiben unverändert
- b325 dokumentiert, dass die Full/Card den vorbereiteten Lab-Renderer-Adapter direkt integriert

## Wichtig

Das separate Lab-ZIP bleibt autoritativ für die Renderer-Geometrie.
Debug-/Lab-only-Dateien bleiben weiterhin Lab-only.

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- b324 → b325 Lab-Modell-/SVG-Hashes: 41/41 identisch erwartet, da Lab-Renderer unverändert bleibt

## Artefakt

`plate-physical-lab-b325-direct-card-plate-renderer-integration.zip`
