# b297 – Exact Remaining SVG Escape Helper Cleanup

Build: `0.1.1-b297`

## Inhalt

Full-/Übergabestand zu Lab b297. Der im Full-ZIP enthaltene Lab-Spiegel unter `tools/plate-physical-lab/` ist mit dem separaten Lab-ZIP synchronisiert; autoritativ bleibt weiterhin das separate Lab-ZIP.

## Änderung im Lab

- verbliebene lokale SVG-Escape-Kopien in `season-field.js` und `seal-slot-marker.js` durch Helper aus `svg-escape-utils.js` ersetzt
- neuer Helper: `escapeSvgAttrOrEmpty(value)`

## Nicht geändert

- kein produktiver Card-Code
- keine Geometrie
- keine Solver-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
