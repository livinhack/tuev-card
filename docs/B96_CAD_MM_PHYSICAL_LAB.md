# b96 - CAD mm Physical Lab

b96 richtet das Physical Lab auf den CAD-artigen Ansatz aus:

```text
physisches mm-Modell -> fertiges SVG -> äußere Anzeige-Skalierung
```

## Ziel

Der Kennzeichenrenderer soll nicht mehr früh in Pixel umrechnen. Die gesamte Kennzeichengeometrie bleibt in Millimetern. Pixel, DPR und Monitorprofil sind nur Teil der Anzeige- und Kalibrierungsschicht.

## Neue/überarbeitete Dateien

- `tools/plate-physical-lab/mm-model.js`
  - reines mm-Modell.
  - enthält feste Maße, Breitenstufen, Zellen, Eurofeld, Siegelplätze und SVG-Ausgabe.
  - importiert keine Anzeige-/Pixelwerte.
- `tools/plate-physical-lab/viewer-calibration.js`
  - Monitorprofil Acer VG272U V.
  - berechnet CSS-px/mm für 1:1.
  - setzt Anzeige-Modi für 1:1, Fit und Debug.
- `tools/plate-physical-lab/app.js`
  - verbindet mm-Modell und Anzeige-Schicht.
- `tools/plate-physical-lab/index.html`
  - Anzeige-Modus statt früherer Lab-Skalierung.
  - beschreibt die CAD-Regeln direkt im Lab.
- `tools/plate-physical-lab/README.md`
  - Startanleitung für morgen.

## Regeln

- Alle Modellkoordinaten sind Millimeter.
- Die SVG-ViewBox ist ein mm-Koordinatensystem.
- Nach dem physischen Aufbau wird nur das fertige Gesamt-SVG skaliert.
- Keine Einzelelement-Skalierung von Text, Eurofeld, Siegeln oder Abständen.
- Browser-/Monitorwerte liegen nur in `viewer-calibration.js`.

## Test morgen

1. Live Server öffnen: `tools/plate-physical-lab/index.html`.
2. Browser-Zoom 100%.
3. Anzeige-Modus `1:1 physisch`.
4. 100-mm-Kontrolllinie mit Lineal messen.
5. Falls nötig Korrekturfaktor setzen.
6. Nur Schritt 1 prüfen: Schildkörper, Außenmaß, Rand, Eurofeld.
