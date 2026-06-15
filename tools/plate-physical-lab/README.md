# Kennzeichen Physical Lab b102

Eigenständiges Renderer-Lab für VS Code Live Server. Dieses Lab bleibt bewusst von Home Assistant getrennt und ist der neue Ausgangspunkt für den Kennzeichenrenderer.

## Grundprinzip

Das Lab arbeitet CAD-artig:

```text
mm-Modell → fertiges SVG mit mm-viewBox → äußere Anzeige-Skalierung
```

- `mm-model.js` enthält ausschließlich physische Regeln in Millimetern.
- `font-calibration.js` misst die tatsächlich sichtbaren SVG-Glyphen und erzeugt daraus mm-basierte Textparameter.
- `viewer-calibration.js` enthält Monitorprofil, DPR und CSS-px/mm.
- `app.js` verbindet Modell und Anzeige.
- Einzelne Elemente werden niemals nachträglich separat im Viewer skaliert.
- Pixel, DPR, Browser-Zoom und Monitorprofil dürfen nicht in die physische Rendererlogik wandern.

## b98-b100 DXF-Referenz

Der Stand übernimmt Körper-/Euro-/Siegel-Geometrie aus den gelieferten DXF-Skizzen:

- Außenhöhe: 110 mm
- Innenhöhe: 101 mm
- Rand/Innentop: 4,5 mm
- Außenradius: 9,25 mm
- Innenradius: 4,75 mm
- Eurofeld: x 4,5 mm, y 4,5 mm, 45 × 101 mm
- EU-Sternkreis: Mittelpunkt x 27 mm, y 36,5 mm, Radius 15 mm
- Siegelspalte: 63,5 mm, äußerer Referenzraum 67,5 mm
- HU-Plakette: 35 mm, Mittelpunkt y 29,5 mm
- Behördensiegel: 45 mm, Mittelpunkt y 75,5 mm
- Abstand zwischen sichtbaren Kreisen: 6 mm

Die DXF-Dateien liegen im Projekt/Lab unter `tools/plate-physical-lab/reference/` und dienen nur als Referenzmaterial. Die Runtime selbst liest die DXF-Dateien nicht ein.

## b99-b102 Schrift-Fit

Die Zeichenzellen bleiben physisch 75 mm hoch. b99-b102 kann die GL-Schrift im Browser per SVG `getBBox()` und berechnet daraus:

- `font-size` in mm
- `baselineY` in mm

Ziel ist, dass die sichtbare Glyphenhöhe in das 75-mm-Zeichenband passt. Diese automatische Kalibrierung ist Teil des mm-Modells; sie ist keine Pixel-Skalierung und kein nachträgliches Verziehen einzelner Elemente.

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

## Testreihenfolge

1. Browser-Zoom auf 100% stellen.
2. Anzeige-Modus `1:1 physisch` wählen.
3. Mit Lineal prüfen, ob die 100-mm-Kontrolllinie wirklich 100 mm misst.
4. Falls nicht: gemessenen Wert eintragen und Korrekturfaktor übernehmen.
5. Schritt `1 · Schildkörper, Außenmaß, Rand, Eurofeld` prüfen.
6. Schritt `2 · DXF-Referenzlinien für Körper/Euro/Siegel` prüfen.
7. Schritt `4 · HU- und Behördensiegelplätze` prüfen.
8. Schritt `5 · Zeichen in festen Zellen` mit automatischem Schrift-Fit prüfen.
9. Erst danach Komplettbild betrachten.

## b101/b102 Länderkennzeichen D

Das Länderkennzeichen `D` kann mit der lokalen Schriftdatei `din1451alt.ttf` gerendert werden. Die Fontdatei wird aus einem dieser Pfade geladen:

```text
tools/plate-physical-lab/fonts/din1451alt.ttf
fonts/din1451alt.ttf
```

Die Fontdatei ist nicht im Chat-ZIP enthalten.


## b102 Kalibrierprofil und Horizontalprüfung

- GL-Mittelschrift ist zunächst manuell auf `Font-Kalibriergröße 125` und `Baseline 92,5 mm` festgehalten.
- Die automatische Fontmessung bleibt zuschaltbar, ist aber nicht mehr der Standard für die Maßarbeit.
- Der neue Schritt `6 · Horizontale Zeichen-/Zellprüfung` zeigt Zellgrenzen, Zellmitten, Zeichenbreiten, Gap-Breiten und die Siegelspalte, ohne die physische Geometrie zu verändern.
