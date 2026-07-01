# b301 – Exact Typed Item Filter Helper Cleanup

Build: `0.1.1-b301`

## Basis

b301 baut auf **b300 – Exact Typed Item Widths Helper Cleanup** auf.

## Ziel

Nur die vollständig identische Typfilter-Formel zentralisieren:

```js
items.filter((item) => item.type === type)
```

## Änderung

Neu bzw. erweitert in `src/plate/plate-sequence-width-utils.js`:

- `getItemsOfType(items, type)`

Interne Nutzung:

- `countItemsOfType(items, type)`
- `getItemWidthsByType(items, type)`

Zusätzlich wurden lokale exakt gleiche Typfilter auf den Helper umgestellt.

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-/Card-Änderung außer Versions-/Dokutexten

## Checks

- Lab regression: 41/41 OK
- b300 → b301 model hashes: 41/41 identical
- b300 → b301 SVG hashes: 41/41 identical
