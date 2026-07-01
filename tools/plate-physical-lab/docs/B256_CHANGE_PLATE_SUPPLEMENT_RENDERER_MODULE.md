# b256 – Change Plate Supplement Renderer Module

b256 lagert den fahrzeugbezogenen Wechselkennzeichen-Zusatzteil aus `change-plate.js` in ein eigenes Modul aus.

## Ziel

Der Zusatzteil ist physisch ein eigenes Schild und soll später unabhängig von den Hauptschild-Renderern gepflegt werden können.

## Modulgrenze

Neu:

- `src/plate/change-plate-supplement-renderer.js`

Enthält:

- Rendern des Zusatzteil-Rahmens
- HU-Platzhalter im Zusatzteil
- fahrzeugbezogene Ziffer/H/E
- kleine gemeinsame Kennung unten
- Erzeugung der `change-plate-*` Supplement-Items

Bleibt in `change-plate.js`:

- Optionen/Defaults
- Eingabeaufteilung
- Anbindung an vorhandene Hauptschildmodelle
- W-Ersatz im Hauptschild

## Ergebnisgleichheit

Die Extraktion ist funktionsneutral. Die geprüften Wechselkennzeichen-Smokes liefern gegenüber b255 identische Modell- und SVG-Hashes.
