# b261 – Seal Components Thin Wrapper Cleanup

b261 ist ein reiner Modul-Cleanup auf Basis von b260.

## Ziel

`seal-components.js` soll nicht mehr selbst entscheiden, welche Marker in einem Siegel-Slot gezeichnet werden. Es soll nur noch die drei Schichten verbinden:

1. effektive Geometrie
2. Marker-Auswahlplan
3. konkrete Marker-SVGs

## Neue Datei

- `src/plate/seal-marker-plan.js`

## Verschoben aus `seal-components.js`

- Reduced-Vertical-Slot-Auswahl
- Reduced-Upper-Single-Seal-Auswahl
- HU-vs-W-vs-Zulassung-Auswahl
- `changePlateW`-Markerentscheidung

## Unverändert

- keine Geometrieänderung
- keine UI-Änderung
- kein Card-Code
- keine Änderung am fahrzeugbezogenen Wechselteil

## Prüfung

- Lab Regression: `41/41 cases OK`
- b260 → b261 Regression-Modell-Hashes: `41/41 identisch`
- b260 → b261 Regression-SVG-Hashes: `41/41 identisch`
- b260 → b261 Wechselkennzeichen-Smoke Modell/SVG: `6/6 identisch`
