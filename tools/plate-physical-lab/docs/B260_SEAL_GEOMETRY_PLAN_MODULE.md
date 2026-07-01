# b260 – Seal Geometry Plan Module

b260 ist ein reiner Modul-Cleanup ohne Geometrieänderung.

## Ziel

Die effektive Siegelgeometrie wird aus der Marker-Komponente herausgelöst. Damit sind Slot-Plan, Geometrie-Plan und konkrete Marker-Darstellung sauberer getrennt.

## Änderungen im autoritativen Lab

Neue Datei:

- `src/plate/seal-geometry-plan.js`

Verschoben/zentralisiert:

- `getSealGeometry()`
- `getEffectiveSealGeometry()`
- Hilfsfunktionen zur Ermittlung des Zeichenbands für Siegel-/Debuggeometrie

Aktualisierte Imports:

- `src/plate/seal-components.js`
- `src/plate/debug-dimensions.js`
- `src/plate/plate-svg-renderer.js`

## Neue Zuständigkeiten

- `change-plate-supplement-renderer.js` → fahrzeugbezogenes Wechselteil
- `change-plate-slot-plan.js` → W-/Zulassung-Slotentscheidung am Hauptschild
- `seal-geometry-plan.js` → physische/effective Siegelgeometrie für Render- und Debugpfad
- `seal-slot-marker.js` → konkrete SVG-Marker für HU/W/Zulassung
- `seal-components.js` → Marker-Auswahl und Gruppierung

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine Wechselkennzeichen-Geometrie
- keine UI
- kein Card-Code
- kein Full-Lab-Sync

## Checks

- Lab Regression: `41/41 cases OK`
- b259 → b260 Regression-Modell-Hashes: `41/41 identisch`
- b259 → b260 Regression-SVG-Hashes: `41/41 identisch`
- b259 → b260 Wechselkennzeichen-Smoke Modell/SVG: `6/6 identisch`
- Full/Card Check: bestanden
