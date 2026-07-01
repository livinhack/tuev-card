# B296 – Exact Width Cap Positive Number Helper Cleanup

## Ziel

Weiterer defensiver Cleanup nach b295: Nur eine bereits vorhandene, vollständig identische positive-Zahlen-Fallback-Formel wird wiederverwendet.

## Änderung

`src/plate/plate-width-strategy.js` importiert jetzt `positiveNumber()` aus `src/plate/plate-number-utils.js`.

Ersetzt wurde nur diese identische Formel:

```js
const number = Number(value);
return Number.isFinite(number) && number > 0 ? number : fallback;
```

Die fachliche Breitenstrategie bleibt unverändert. `resolveTwoLineWidthCapMm()` bleibt wegen zusätzlichem `maxWidth`-Clamp bewusst getrennt.

## Nicht geändert

- keine Geometrieänderung
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b295 → b296 Modell-Hashes: 41/41 identisch
- b295 → b296 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
- ZIP-Test: beide ZIPs fehlerfrei
