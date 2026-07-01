# b254 – Lab UI Controls Cleanup

Basis: **b253 – W Render Reset + Motorcycle Slot Position Fix**.

## Ziel

Reiner Weboberflächen-Cleanup für das Physical Lab. Kennzeichenbezogene Renderer und Geometrie bleiben unangetastet.

## Änderungen

- Lab-Bedienung in aufklappbare Bereiche gegliedert:
  - 1:1-Kalibrierung
  - Renderer-Schritt
  - Format & Eingabe
  - Presets & Prüfvorschläge
  - Saisonfeld
  - Breite & Schrift
- Presets und Wechselkennzeichen-Zufallspresets optisch vereinheitlicht.
- Lange interne Versionshinweise aus sichtbaren Optionsnamen entfernt.
- Layout stabiler gemacht, damit Controls nicht hinter dem Renderbereich verschwinden:
  - Preview-Spalte `minmax(0, 1fr)`
  - Controls-Spalte begrenzt
  - Responsive Einspalten-Gitter bei engeren Viewports
- Titel/Version auf b254 synchronisiert.

## Nicht geändert

- Keine Änderung an `src/plate/*` Rendererlogik.
- Keine Änderung an Wechselkennzeichen-Geometrie.
- Keine Änderung an Regression-Cases.
- Keine Card-Code-Änderung.

## Checks

- Lab Regression: `41/41 cases OK`.
- Full/Card Check: bestanden.
