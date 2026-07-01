# b300 – Exact Typed Item Widths Helper Cleanup

Build: `0.1.1-b300`

## Basis

b300 baut auf **b299 – Exact Side Margin Distribution Helper Cleanup** auf.

## Ziel

Weiterer defensiver Exact-Cleanup nach der strengen Regel: Nur echte Duplikate oder vollständig identische Formeln zentralisieren.

## Änderung

In `plate-sequence-width-utils.js` wurde ein neuer Helper ergänzt:

```js
getItemWidthsByType(items, type)
```

Er kapselt ausschließlich die identische Formel:

```js
items.filter((item) => item.type === type).map((item) => item.width)
```

`plate-svg-renderer.js` nutzt diesen Helper für die `actualCharGaps`-/`actualGroupGaps`-Diagnosewerte bereits gelöster Sequenzen.

## Bewusst nicht geändert

- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Regelentscheidung im Helper
- keine Breitenberechnung im Helper
- keine Geometrieänderung
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b299 → b300 model hashes: 41/41 identical
- b299 → b300 SVG hashes: 41/41 identical
