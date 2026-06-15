# b95 - Physical Lab Calibration Start

b95 stoppt das direkte Feintuning des Kennzeichenrenderers innerhalb der Card und startet eine getrennte physische Messumgebung.

## Ziel

Der Renderer soll erst außerhalb von Home Assistant exakt aufgebaut werden:

1. physisches Kennzeichen in Millimetern
2. feste Elemente und Abstände
3. keine nachträgliche Element-Skalierung
4. nur das fertige SVG/Gesamtbild wird skaliert

## Neues Lab

```text
tools/plate-physical-lab/index.html
```

Für VS Code Live Server.

## Kalibrierung

Voreinstellung für Acer VG272U V:

```text
Geräte-px/mm: 4,2918
Pixel Pitch: ca. 0,233 mm
PPI: ca. 109
```

Das Lab nutzt:

```text
CSS-px/mm = Geräte-px/mm / window.devicePixelRatio × Korrekturfaktor × Lab-Skalierung
```

Die 100-mm-Kontrolllinie dient als reale Linealprüfung.

## Arbeitsreihenfolge

1. Schildkörper, Außenmaß, Rand, Eurofeld
2. Raster, Zeichen- und Siegelzellen
3. HU- und Behördensiegelplätze
4. Zeichen in festen Zellen
5. Komplettbild
6. Erst danach Integration in die Card

## Wichtig

Die b90-b94-Card-Renderer-Experimente gelten als Erkenntnisstände, nicht als finaler Rendererweg. Für die nächsten Schritte zählt das Physical Lab als Hauptarbeitsfläche.
