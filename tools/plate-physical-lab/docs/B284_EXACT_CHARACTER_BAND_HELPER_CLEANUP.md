# b284 – Exact Character Band Helper Cleanup

## b284 – Exact Character Band Helper Cleanup

b284 baut auf **b283 – Exact Font Resolution Result Helper Cleanup** auf.

Dieser Stand ist ein defensiver Cleanup nach der strengen Refactor-Regel:

- nur wirklich identische Logik zentralisieren
- nur vollständig gleiche Formeln/Abläufe auslagern
- fachlich ähnliche, aber nicht identische Abläufe getrennt lassen
- keine Geometrieänderung
- keine UI-Änderung

## Änderung in b284

Die lokale Character-Band-Formel in Komponenten wurde entfernt und durch den bereits vorhandenen gemeinsamen Helper ersetzt:

- `season-field.js` importiert jetzt `getCharacterBand()` aus `text-utils.js`
- `debug-dimensions.js` importiert jetzt `getCharacterBand()` aus `text-utils.js`

Ersetzt wurde nur die identische Formel:

```js
if (rules.layoutType === "two-line") {
  const row = rowKey === "bottom" ? rules.content.bottomRow : rules.content.topRow;
  return {
    y: row.y,
    height: row.characterHeight,
    baselineY: row.baselineY
  };
}
return {
  y: rules.innerInset + rules.content.topClearance,
  height: rules.content.characterHeight,
  baselineY: rules.cells?.middle?.baselineY || 92.5
};
```

## Nicht geändert

- keine Rendergeometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichenänderung
- keine UI-Änderung
- kein Card-Code

## Prüfergebnis

- Lab Regression: 41/41 OK
- b283 → b284 Modell-Hashes: 41/41 identisch
- b283 → b284 SVG-Hashes: 41/41 identisch

## Artefakt

`plate-physical-lab-b284-exact-character-band-helper-cleanup.zip`
