# b274 – Exact Fixed-Width Sum Helper Cleanup

## Ziel

Einen weiteren streng defensiven Refactor durchführen: ausschließlich eine vollständig identische Summenformel zentralisieren.

## Änderung

Neu in `src/plate/plate-sequence-width-utils.js`:

- `sumItemWidthsExcept(items, shouldSkip)`

Zentralisierte Formel:

```js
items.reduce((sum, item) => sum + (shouldSkip(item) ? 0 : item.width), 0)
```

Die fachliche Entscheidung, welche Items ausgeschlossen werden, bleibt weiterhin am jeweiligen Aufrufort.

## Bewusst nicht gemacht

- keine Zusammenführung ähnlicher Solver
- keine Zusammenführung ähnlicher Builder
- keine Änderung an Spacing-Regeln
- keine Änderung an Siegel-/Wechselkennzeichenlogik

## Checks

- Lab Regression: 41/41 OK
- b273 → b274 Modell-Hashes: 41/41 identisch
- b273 → b274 SVG-Hashes: 41/41 identisch
