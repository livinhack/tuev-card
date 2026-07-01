# b288 – Exact Number-Or-Fallback Helper Cleanup

## Basis

- b287 – Exact Positive Number Helper Cleanup

## Ziel

Weiterer defensiver Redundanzabbau nach der strengen Refactor-Regel. Nur wirklich identische Formeln werden zentralisiert.

## Änderung

`season-field.js` nutzt jetzt den bereits vorhandenen Helper:

- `numberOrFallback(value, fallback)` aus `plate-number-utils.js`

Entfernt wurde nur die lokale Kopie dieser identischen Formel:

```js
const number = Number(value);
return Number.isFinite(number) ? number : fallback;
```

## Bewusst nicht geändert

- keine Geometrie
- keine Solver- oder Builder-Zusammenführung
- keine Wechselkennzeichenlogik
- keine UI-Logik außer sichtbarer Version/Beschreibung
- kein Card-Code

## Checks

- Lab Regression 41/41 OK
- Modell-Hashes b287 → b288 identisch
- SVG-Hashes b287 → b288 identisch
