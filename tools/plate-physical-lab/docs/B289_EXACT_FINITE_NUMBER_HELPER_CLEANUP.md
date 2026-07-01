# b289 – Exact Finite Number Helper Cleanup

## Basis

b289 baut auf **b288 – Exact Number-Or-Fallback Helper Cleanup** auf.

## Ziel

Weiterer defensiver Redundanzabbau nach der strengen Refactor-Regel:

- nur wirklich identische Formeln zentralisieren
- keine fachlich nur ähnliche Logik zusammenlegen
- keine Geometrie ändern

## Änderung

Der vorhandene Helper `numberOrFallback(value, fallback)` aus `src/plate/plate-number-utils.js` wird jetzt auch in weiteren Komponenten genutzt.

Entfernt wurden lokale Kopien dieser exakt identischen Formel:

```js
const number = Number(value);
return Number.isFinite(number) ? number : fallback;
```

Betroffene Dateien:

- `src/plate/euro-field.js`
- `src/plate/eu-star-wreath.js`
- `src/plate/eu-country-mark.js`
- `src/plate/change-plate.js`

## Nicht geändert

- keine Renderer-Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichenänderung
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Prüfung

- Lab Regression: 41/41 OK
- Modell-Hashes b288 → b289 identisch
- SVG-Hashes b288 → b289 identisch
