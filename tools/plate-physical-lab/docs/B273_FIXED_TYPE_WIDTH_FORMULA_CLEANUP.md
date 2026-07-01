# b273 – Fixed-Type Width Formula Cleanup

## Ziel

Weiterer defensiver Redundanzabbau nach der strengen Regel: nur wirklich identische Formeln zentralisieren.

## Änderung

Aus zwei fachlich getrennten Bereichen wurde eine exakt identische Mini-Formel in `plate-sequence-width-utils.js` zentralisiert:

```js
if (item.type === fixedType) return fixedWidth;
return getItem...Width(item);
```

Neue Helfer:

- `getFixedTypeOrItemMinWidth()`
- `getFixedTypeOrItemPreferredWidth()`
- `getFixedTypeOrItemFiniteMaxWidth()`
- `getFixedTypeOrItemMaxWidth()`

## Bewusst nicht geändert

- Top-Row-Spacing und One-Line-Season-Spacing bleiben fachlich getrennte Wrapper.
- Keine Solver- oder Builder-Zusammenführung.
- Keine Geometrie- oder UI-Änderung.

## Prüfung

- Lab Regression: 41/41 OK
- b272 → b273 Modell-Hashes: 41/41 identisch
- b272 → b273 SVG-Hashes: 41/41 identisch
