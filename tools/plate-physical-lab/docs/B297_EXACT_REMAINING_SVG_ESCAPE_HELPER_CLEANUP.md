# b297 – Exact Remaining SVG Escape Helper Cleanup

Build: `0.1.1-b297`

## Ziel

Nur die noch verbliebenen exakt identischen SVG-Escape-Formeln zentralisieren. Keine Geometrie-, Solver- oder UI-Fachänderung.

## Änderung

- `season-field.js` nutzt `escapeSvgTextOrEmpty()` aus `svg-escape-utils.js`.
- `seal-slot-marker.js` nutzt den neuen Helper `escapeSvgAttrOrEmpty()` aus `svg-escape-utils.js`.
- Neu in `svg-escape-utils.js`: `escapeSvgAttrOrEmpty(value)`.

## Bewusst nicht geändert

- keine Renderer-Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- kein Card-Code

## Erwartung

Regression und Hashes gegenüber b296 bleiben identisch.
