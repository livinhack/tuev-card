# b304 – Exact Typed Item Finder Helper Cleanup

Build: `0.1.1-b304`

Basis: **b303 – Exact Number-Or-Null Helper Cleanup**

## Änderung

Neuer Helper in `src/plate/plate-sequence-width-utils.js`:

```js
getFirstItemOfType(items, type)
```

Zentralisiert nur die identische Mini-Formel:

```js
items.find((item) => item.type === type)
```

Die Nutzung beschränkt sich auf reine Typ-Suchen. Suchen mit Zusatzbedingungen wurden nicht angefasst.

## Checks

- Lab Regression: 41/41 OK
- b303 → b304 Modell-Hashes: 41/41 identisch
- b303 → b304 SVG-Hashes: 41/41 identisch
