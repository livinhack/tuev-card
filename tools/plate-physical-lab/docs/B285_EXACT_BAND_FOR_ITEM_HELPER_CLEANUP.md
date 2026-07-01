# Kennzeichen Physical Lab b285

## b285 – Exact Band For Item Helper Cleanup

b285 baut auf **b284 – Exact Character Band Helper Cleanup** auf.

Dieser Stand ist ein defensiver Cleanup nach der strengen Refactor-Regel:

- nur wirklich identische Logik zentralisieren
- nur vollständig gleiche Formeln/Abläufe auslagern
- fachlich ähnliche, aber nicht identische Abläufe getrennt lassen
- keine Geometrieänderung
- keine UI-Änderung

## Änderung in b285

Die identische Band-for-Item-Formel wurde aus Komponenten in den gemeinsamen Text-/Band-Helfer verschoben:

- `text-utils.js` exportiert jetzt `getBandForItem(rules, item)`
- `season-field.js` nutzt jetzt `getBandForItem()` aus `text-utils.js`
- `debug-dimensions.js` nutzt jetzt `getBandForItem()` aus `text-utils.js`

Ersetzt wurde nur die identische Formel:

```js
if (Number.isFinite(Number(item?.bandY)) && Number.isFinite(Number(item?.bandHeight))) {
  return { y: Number(item.bandY), height: Number(item.bandHeight), baselineY: Number(item.baselineY) || null };
}
return getCharacterBand(rules, item?.rowKey);
```

Die Regel bleibt unverändert: explizite Band-Daten am Item haben Vorrang, ansonsten wird die Character-Band aus den Regeln abgeleitet.

## Nicht geändert

- keine Rendergeometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichenänderung
- keine UI-Änderung
- kein Card-Code

## Prüfergebnis

- Lab Regression: 41/41 OK
- b284 → b285 Modell-Hashes: 41/41 identisch
- b284 → b285 SVG-Hashes: 41/41 identisch

## Artefakt

`plate-physical-lab-b285-exact-band-for-item-helper-cleanup.zip`
