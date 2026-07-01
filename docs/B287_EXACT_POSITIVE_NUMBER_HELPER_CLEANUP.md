# b287 – Exact Positive Number Helper Cleanup

## Ziel

Nur die vollständig identische `positiveNumber(value, fallback)`-Formel weiter zentralisieren.

## Änderung

Mehrere lokale Kopien dieser identischen Formel wurden entfernt und verwenden nun den bereits vorhandenen Helper aus `plate-number-utils.js`:

```js
const number = Number(value);
return Number.isFinite(number) && number > 0 ? number : fallback;
```

Betroffene Module im Lab:

- `season-field.js`
- `change-plate.js`
- `change-plate-supplement-renderer.js`
- `seal-geometry-plan.js`
- `plate-render-context.js`

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichenänderung
- keine UI-Änderung außer Version/Titel
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b286 → b287 Modell-Hashes: 41/41 identisch
- b286 → b287 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
