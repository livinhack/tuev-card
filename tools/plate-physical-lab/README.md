# Kennzeichen Physical Lab b114

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

## DXF-Referenz

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

## Schrift-Fit und Kalibrierprofil

Die Zeichenzellen bleiben physisch 75 mm hoch. Das Lab kann die GL-Schrift im Browser per SVG `getBBox()` messen und daraus mm-basierte Werte für `font-size` und `baselineY` berechnen. Für die aktuelle Maßarbeit ist aber das manuelle Profil festgehalten:

```text
GL-Mittelschrift · manuell kalibriert
Ziel-Glyphenhöhe: 75 mm
Font-Kalibriergröße: 125
Baseline Y: 92,5 mm
```

Die automatische Kalibrierung bleibt zuschaltbar, ist aber nicht mehr der Standard für die manuelle Maßarbeit.

## Gemeinsame I-Sonderbreite

`I` wird im Lab nicht mehr automatisch als volle Buchstabenzelle behandelt. Die gelieferten GL-Mittel-/Engschrift-Fonts verwenden beim `I` dieselbe Glyphenform bzw. dieselbe gemessene Advance-/BBox-Charakteristik. Deshalb nutzt das Lab eine gemeinsame echte physische Zellbreite für beide Schriftmodi:

```text
I-Sonderbreite: 35,5 mm
```

Status: **kalibrierter GL-Mittel-/Engschrift-Modellwert**. Das ist bewusst **keine Behauptung eines amtlich einzeln belegten I-Maßes**. Die übrigen Zeichen bleiben weiterhin je nach Mittel-/Engschrift unterschiedlich breit.

## Länderkennzeichen D

Das Länderkennzeichen `D` kann mit der lokalen Schriftdatei `din1451alt.ttf` gerendert werden. Die Fontdatei wird aus einem dieser Pfade geladen:

```text
tools/plate-physical-lab/fonts/din1451alt.ttf
fonts/din1451alt.ttf
```

Die Fontdatei ist nicht im Chat-ZIP enthalten.


## Rechtsnahe Auto-Schriftwahl

Die Schriftwahl kann auf `Auto` stehen. Dann gilt im Lab:

```text
Mittelschrift bleibt Standard.
Engschrift wird nur verwendet, wenn Mittelschrift in die relevante Höchstlänge beziehungsweise gewählte Breitenbegrenzung nicht passt.
```

Bei Breite `Auto` ist die relevante Grenze das einzeilige Größtmaß `520 mm`. Bei fest gewählter Breite simuliert das Lab eine begrenzte Anbringungsstelle. Die Automatik mischt Mittel- und Engschrift nicht innerhalb eines Kennzeichens; sie schaltet das Lab-Kennzeichen komplett auf Engschrift um, wenn der Mittel-Schrift-Aufbau nicht passt.

## Start

1. In VS Code öffnen:
   `tools/plate-physical-lab/index.html`
2. Mit Live Server starten.
3. Fonts optional hier ablegen:
   - `tools/plate-physical-lab/fonts/GL-Nummernschild-Mtl.ttf`
   - `tools/plate-physical-lab/fonts/GL-Nummernschild-Eng.ttf`
   - `tools/plate-physical-lab/fonts/din1451alt.ttf`

Alternativ werden die Fonts aus dem Projektordner `fonts/` gesucht.

## Testreihenfolge

1. Browser-Zoom auf 100% stellen.
2. Anzeige-Modus `1:1 physisch` wählen.
3. 100-mm-Kontrolllinie mit Lineal prüfen.
4. Schritt `6 · Horizontale Zeichen-/Zellprüfung` für die Zeichen-/Zellbreiten verwenden.
5. Testkennzeichen: `DA CI 500`, `WIL CL 212`, `BIT GT500`, `BKS R 95`, `K S 70`.


## b112 Layout solver + Maßlinien

The lab now solves horizontal spacing as a physical millimetre model before rendering:

- outside margins left/right are equal and at least 8 mm when the layout fits;
- character gaps are variable from 8 to 10 mm, preferred 9 mm;
- group gaps are variable from 20 to 30 mm, preferred 24 mm;
- the seal column is variable from 63.5 to 67.5 mm, preferred 63.5 mm;
- `Auto kompakt` chooses the smallest width band that satisfies minimum spacings without exact boundary squeezing;
- `Auto ausgewogen` chooses the smallest width band that satisfies preferred spacings, otherwise falls back to compact;
- if the chosen width has extra room, variable spacings grow from preferred toward max before remaining space becomes equal outside margins.

Pixel/DPR calibration remains viewer-only. The solver never uses pixels.
