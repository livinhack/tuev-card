# b275 – Exact Resolved-Width Sum Helper Cleanup

## Ziel

Einen weiteren streng defensiven Refactor durchführen: ausschließlich eine vollständig identische Summenformel für bereits gelöste Item-Breiten zentralisieren.

## Änderung

Neu in `src/plate/plate-sequence-width-utils.js`:

- `sumResolvedItemWidths(items)`

Zentralisierte Formel:

```js
items.reduce((sum, item) => sum + item.width, 0)
```

Die fachliche Entscheidung, wann eine Sequenz gelöst ist und welche Items enthalten sind, bleibt weiterhin am jeweiligen Aufrufort.

## Bewusst nicht gemacht

- keine Zusammenführung ähnlicher Solver
- keine Zusammenführung ähnlicher Builder
- keine Änderung an Spacing-Regeln
- keine Änderung an Siegel-/Wechselkennzeichenlogik

## Checks

- Lab Regression: 41/41 OK
- b274 → b275 Modell-Hashes: 41/41 identisch
- b274 → b275 SVG-Hashes: 41/41 identisch
