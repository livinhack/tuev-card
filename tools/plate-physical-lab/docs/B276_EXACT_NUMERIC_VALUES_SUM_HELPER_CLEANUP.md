# b276 – Exact Numeric Values Sum Helper Cleanup

## Ziel

Einen weiteren streng defensiven Refactor durchführen: ausschließlich eine vollständig identische Summenformel für reine Zahlenwerte zentralisieren.

## Änderung

Neu in `src/plate/plate-sequence-width-utils.js`:

- `sumValues(values)`

Zentralisierte Formel:

```js
values.reduce((sum, value) => sum + value, 0)
```

Die fachliche Entscheidung, welche Zahlenwerte summiert werden, bleibt weiterhin am jeweiligen Aufrufort.

## Bewusst nicht gemacht

- keine Zusammenführung ähnlicher Solver
- keine Zusammenführung ähnlicher Builder
- keine Änderung an Spacing-Regeln
- keine Änderung an Siegel-/Wechselkennzeichenlogik

## Checks

- Lab Regression: 41/41 OK
- b275 → b276 Modell-Hashes: 41/41 identisch
- b275 → b276 SVG-Hashes: 41/41 identisch
