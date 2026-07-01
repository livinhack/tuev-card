# b256 – Change Plate Supplement Renderer Module

b256 lagert im autoritativen Lab den fahrzeugbezogenen Wechselkennzeichen-Zusatzteil in ein eigenes Modul aus.

## Lab-Modul

Neu im Lab:

- `src/plate/change-plate-supplement-renderer.js`

Aufgaben:

- Zusatzteil-Rahmen rendern
- HU-Platzhalter im Zusatzteil rendern
- fahrzeugbezogene Ziffer/H/E rendern
- kleine gemeinsame Kennung unten rendern
- Supplement-Items erzeugen

## Modulgrenze

Bleibt in `change-plate.js`:

- Optionen/Defaults
- Eingabeaufteilung
- Anbindung an vorhandene Hauptschildmodelle
- W-Ersatz im Hauptschild

## Ergebnisgleichheit

Funktionsneutraler Modulschritt. Gegenüber b255 sind die geprüften Wechselkennzeichen-Smoke-Fälle modell- und SVG-identisch.

## Full-ZIP-Hinweis

`tools/plate-physical-lab/` im Full-ZIP ist nicht autoritativ. Maßgeblich ist das separate Lab-ZIP.
