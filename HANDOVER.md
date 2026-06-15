# TÜV Reminder Card - Übergabeprotokoll b96

## Stand

- Version: `0.1.1-b96`
- ZIP: `tuev-card-full-b96-cad-mm-physical-lab.zip`
- Standalone Lab-ZIP: `plate-physical-lab-b96-cad-mm-vscode-liveserver.zip`
- Ausgangspunkt: `b95`
- Fokus: Physical Lab konsequent CAD-artig aufbauen: interne Rendererlogik in Millimetern, Pixel/DPR/Monitorprofil nur als äußere Anzeige-/Kalibrierungsschicht.

## Nutzerentscheidung / Vorgabe

- Die bisherigen Card-Renderer-Versuche b90-b94 sollen nicht weiter direkt in Home Assistant feingetunt werden.
- Der Kennzeichenrenderer wird ab jetzt außerhalb von Home Assistant neu aufgebaut.
- Pro Schritt entsteht ein separater physischer Lab-Stand.
- Erst wenn Teilrenderer stimmen, werden sie zusammengeführt und später in die Card integriert.
- CAD-Regel ab b96:

```text
physisches mm-Modell -> fertiges SVG -> äußere Anzeige-Skalierung
```

- Der Renderer selbst darf nicht früh in Pixel umrechnen.
- Pixel, DPR, Browser-Zoom und Monitorprofil sind nur für die Anzeige zuständig.
- Einzelne Elemente wie Text, Eurofeld, Siegel oder Abstände werden nicht separat nachskaliert.

## Monitorbasis für 1:1-Arbeit

Nutzer-Monitor: Acer VG272U V.

Startwerte im Lab:

```text
Geräte-px/mm: 4,2918
Pixel Pitch: ca. 0,233 mm
PPI: ca. 109
```

Die Anzeige-Schicht rechnet:

```text
CSS-px/mm 1:1 = Geräte-px/mm / window.devicePixelRatio × Korrekturfaktor
```

Damit soll die 100-mm-Kontrolllinie bei Anzeige-Modus `1:1 physisch`, Browser-Zoom 100% und korrektem Korrekturfaktor physisch 100 mm messen.

## Geänderte Dateien

- `tools/plate-physical-lab/mm-model.js`
  - neu.
  - reine physische Renderer-/SVG-Logik in Millimetern.
  - enthält keine Monitor-, Pixel-, DPR- oder Browser-Zoom-Logik.
  - SVG-ViewBox ist ein mm-Koordinatensystem.
- `tools/plate-physical-lab/viewer-calibration.js`
  - neu.
  - enthält Acer-Monitorprofil, DPR-/CSS-px/mm-Rechnung und Anzeige-Modi.
  - Anzeige-Modi:
    - `1:1 physisch`
    - `Fit to screen`
    - `2× Debug`
    - `3× Debug`
- `tools/plate-physical-lab/app.js`
  - überarbeitet.
  - verbindet mm-Modell und Anzeige-Schicht.
  - skaliert nur das komplette SVG.
- `tools/plate-physical-lab/index.html`
  - auf b96 aktualisiert.
  - Anzeige-Modus statt Lab-Skalierung.
  - CAD-Regeln im UI ergänzt.
- `tools/plate-physical-lab/README.md`
  - b96-Anleitung für direkten morgigen Einstieg.
- `docs/B96_CAD_MM_PHYSICAL_LAB.md`
  - neue Dokumentation.
- `package.json`, `package-lock.json`, `src/**/*.js`
  - Version/Import-Cachebuster auf b96.
- `dist/tuev-card.js`
  - neu gebaut, Bundle-Header `// TÜV Card bundled b96`.

## Entfernt / ersetzt

- `tools/plate-physical-lab/physical-renderer.js` wurde durch `mm-model.js` und `viewer-calibration.js` ersetzt.
- Dadurch ist die Trennung zwischen physischem Modell und Anzeige deutlich klarer.

## Nicht geändert

- Card-Renderer wurde inhaltlich nicht weiter verbessert.
- Großer TÜV-Plakettenrenderer unverändert.
- Gruppen-/Editorlogik unverändert.
- Floating Panels unverändert.
- HACS/dist-Struktur unverändert.
- Font-Binärdateien sind weiterhin nicht im Chat-ZIP enthalten.

## Font-Hinweis

Für das neue Lab optional lokal ablegen:

```text
tools/plate-physical-lab/fonts/GL-Nummernschild-Mtl.ttf
tools/plate-physical-lab/fonts/GL-Nummernschild-Eng.ttf
```

Alternativ nutzt das Lab die Fonts aus dem Projektordner:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

## Build/Check

Auszuführen/ausgeführt:

```bash
npm run check
npm run build
```

## Nächster Einstieg morgen

Direkt öffnen:

```text
tools/plate-physical-lab/index.html
```

Dann mit VS Code Live Server starten.

Startreihenfolge:

1. Browser-Zoom auf 100% stellen.
2. Anzeige-Modus `1:1 physisch` lassen.
3. Mit Lineal prüfen, ob die 100-mm-Kontrolllinie wirklich 100 mm misst.
4. Falls nicht: gemessenen Wert eintragen und Korrekturfaktor übernehmen.
5. Nur Schritt `1 · Schildkörper, Außenmaß, Rand, Eurofeld` prüfen.
6. Erst wenn Außenmaß/Rand/Eurofeld stimmen, zu Raster/Siegel/Text weitergehen.

## Offene Entscheidung

Die Card bleibt vorerst ungeeignet als Messumgebung. Erst wenn das Physical Lab in echten mm-Schritten stimmt, wird entschieden, wie der Renderer wieder in die Card integriert wird und ob der Card-Renderer auf einen früheren stabileren Stand zurückgeht.
