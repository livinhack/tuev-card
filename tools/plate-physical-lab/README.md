# Kennzeichen Physical Lab b96

Eigenständiges Renderer-Lab für VS Code Live Server. Dieses Lab ist der neue Ausgangspunkt für den Kennzeichenrenderer und bewusst von Home Assistant getrennt.

## Grundprinzip ab b96

Das Lab arbeitet CAD-artig:

```text
mm-Modell → fertiges SVG mit mm-viewBox → äußere Anzeige-Skalierung
```

- `mm-model.js` enthält ausschließlich physische Regeln in Millimetern.
- `viewer-calibration.js` enthält Monitorprofil, DPR und CSS-px/mm.
- `app.js` verbindet Modell und Anzeige.
- Einzelne Elemente werden niemals nachträglich separat skaliert.
- Pixel, DPR, Browser-Zoom und Monitorprofil dürfen nicht in die physische Rendererlogik wandern.

## Start

1. In VS Code öffnen:
   `tools/plate-physical-lab/index.html`
2. Mit Live Server starten.
3. Fonts optional hier ablegen:
   - `tools/plate-physical-lab/fonts/GL-Nummernschild-Mtl.ttf`
   - `tools/plate-physical-lab/fonts/GL-Nummernschild-Eng.ttf`

Alternativ werden die Fonts aus dem Projektordner `fonts/` gesucht.

## Acer VG272U V Kalibrierung

Vorbelegt:

- Geräte-px/mm: `4.2918`
- Pixel Pitch: ca. `0.233 mm`
- PPI: ca. `109`

Die Anzeige-Schicht berechnet daraus:

```text
CSS-px/mm 1:1 = Geräte-px/mm / window.devicePixelRatio × Korrekturfaktor
```

Bei Anzeige-Modus `1:1 physisch` und Browser-Zoom 100% sollte die 100-mm-Linie mit einem Lineal 100 mm messen. Falls nicht, gemessene Länge eintragen und den Faktor übernehmen.

## Anzeige-Modi

- `1:1 physisch`: für Messung am Monitor.
- `Fit to screen`: zum Überblick, nicht zum Messen.
- `2× Debug` / `3× Debug`: zum Prüfen kleiner Details, nicht zum Messen.

## Morgen starten mit

1. Browser-Zoom auf 100% stellen.
2. Anzeige-Modus `1:1 physisch` wählen.
3. Mit Lineal prüfen, ob die 100-mm-Kontrolllinie wirklich 100 mm misst.
4. Falls nicht: gemessenen Wert eintragen und Korrekturfaktor übernehmen.
5. Nur Schritt `1 · Schildkörper, Außenmaß, Rand, Eurofeld` prüfen.
6. Erst wenn Außenmaß/Rand/Eurofeld stimmen, zu Raster/Siegel/Text weitergehen.
