# b305 – Exact Supplement Typed Item Finder Cleanup

Basis: **b304 – Exact Typed Item Finder Helper Cleanup**

## Änderung

`src/plate/change-plate-supplement-renderer.js` nutzt jetzt den bestehenden Helper:

- `getFirstItemOfType(items, type)` aus `plate-sequence-width-utils.js`

Ersetzt wurde ausschließlich die identische Mini-Formel:

```js
items.find((item) => item.type === type)
```

Betroffen sind reine Typ-Suchen für:

- `change-plate-frame`
- `change-plate-hu`
- `change-plate-common-label`

Suchen mit Zusatzbedingungen bleiben bewusst lokal.

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b304 → b305 Modell-Hashes: 41/41 identisch
- b304 → b305 SVG-Hashes: 41/41 identisch
