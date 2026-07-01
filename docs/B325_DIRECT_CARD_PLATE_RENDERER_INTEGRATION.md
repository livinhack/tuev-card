# b325 – Direct Card Plate Renderer Integration

b325 integriert den vorbereiteten Physical-Lab-Renderer-Adapter direkt als aktiven Kennzeichenrenderer der Card.

## Entscheidung

Es gibt keinen Umschalter und keinen Legacy-Fallback im Card-Code. Wenn ein Rollback nötig ist, wird auf das vorherige ZIP zurückgegangen.

## Änderungen

- `src/plate/renderer.js` delegiert direkt an `src/plate/lab-renderer-adapter.js`.
- Der alte direkte `mm-model.js`-Rendererpfad ist aus `renderer.js` entfernt.
- `isGraphicalPlateAvailable()` hängt nicht mehr an `config.plate_style === "plate"`.
- `src/plate/lab-renderer/` bleibt die gestagte Kopie der 35 produktiven Lab-Rendererdateien.
- Debug-/Lab-only-Module bleiben ausgeschlossen.

## Nicht geändert

- keine Lab-Geometrie
- keine Lab-Solverlogik
- keine Wechselkennzeichen-Fachlogik
- kein Toggle/Legacy-Fallback
- kein paralleler alter Rendererpfad

## Erwartetes Verhalten

Wenn die Font-Verfügbarkeit in der Card gegeben ist, rendert die Card Kennzeichen über den Physical-Lab-Renderer.
Wenn die Font-Verfügbarkeit nicht gegeben ist, bleibt der bestehende Text-/Leer-Fallback der Card erhalten; es gibt dafür keinen Nutzer-Schalter.
