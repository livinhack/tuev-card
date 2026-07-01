# b258 – Seal Slot Marker Module

b258 ist ein reiner Modul-Cleanup ohne Geometrieänderung.

## Ziel

Die konkrete Darstellung der Siegel-/Slot-Marker wird von der Geometrie- und Slotentscheidung getrennt.

## Neu

- `src/plate/seal-slot-marker.js`

Darin liegen jetzt:

- `renderChangePlateWMarker()`
- `renderHuSealMarker()`
- `renderAuthoritySealMarker()`

## Unverändert

- Wechselkennzeichen-Geometrie
- Einzeiler-/Zweizeiler-/Kraftrad-/Reduced-Renderer
- UI
- Card-Code

## Prüfung

- Lab Regression: `41/41 OK`
- Wechselkennzeichen-Smoke b257 → b258: Modell-/SVG-Hashes identisch für einzeilig, zweizeilig und Kraftrad mit/ohne H/E
