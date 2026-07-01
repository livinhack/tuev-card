# b298 – Exact Shared Seal Item Width Helper Cleanup

Build: `0.1.1-b298`

## Ziel

Weiterer defensiver Cleanup nach der strengen Regel: nur wirklich identische Formel zentralisieren, keine fachlich nur ähnliche Logik.

## Änderung

`src/plate/plate-sequence-width-utils.js` ergänzt:

- `applySharedTypeWidth(item, type, totalWidth, itemCount)`

`src/plate/plate-svg-renderer.js` nutzt den Helper an den zwei Stellen, an denen Seal-Items eine gemeinsame Breite anteilig erhalten.

Ersetzt wurde nur:

```js
if (item.type === "seals") return { ...item, width: sealWidth / Math.max(1, sealItems.length) };
```

## Bewusst nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Checks

- Lab Regression: 41/41 OK
- b297 → b298 model hashes: 41/41 identical
- b297 → b298 SVG hashes: 41/41 identical
