# b272 – Exact Width Helper Export Cleanup

Basis: **b271 – Renderer Module Smoke Checkpoint**

## Ziel

Nur einen nachweislich identischen, formelgleichen Mini-Cleanup durchführen.

## Änderung

Nach `src/plate/plate-sequence-width-utils.js` exportiert:

- `sumItemWidths(items, getWidth)`
- `createItemWidthMap(items, getWidth)`

Aus `src/plate/plate-svg-renderer.js` entfernt und importiert.

## Warum zulässig

Die Helfer enthalten keine Fachregel und keine Geometrieentscheidung. Sie sind vollständig parametrisierte Hilfsformeln:

- `items.reduce((sum, item) => sum + getWidth(item), 0)`
- `new Map(items.map((item) => [item.key, getWidth(item)]))`

## Nicht gemacht

- keine Font-Mode-Zusammenführung
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine fachlich ähnlichen Layoutpfade zentralisiert

## Checks

- Lab Regression: 41/41 OK
- b271 → b272 Modell-Hashes: 41/41 identisch
- b271 → b272 SVG-Hashes: 41/41 identisch
