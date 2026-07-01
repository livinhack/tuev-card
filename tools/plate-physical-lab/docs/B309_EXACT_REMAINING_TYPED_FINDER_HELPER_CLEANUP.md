# Übergabe Lab b309 – Exact Remaining Typed Finder Helper Cleanup

Aktueller Stand: **b309**

Artefakt:

`plate-physical-lab-b309-exact-remaining-typed-finder-helper-cleanup.zip`

b309 baut auf **b308 – Exact Reduced Row Typed Finder Helper Cleanup** auf.

## Änderung b309

Streng nach der aktuellen Refactor-Regel wurde nur eine bereits vorhandene, vollständig identische Mini-Formel weiterverwendet:

```js
items.find((item) => item.type === type)
```

Konkret nutzt `src/plate/plate-svg-renderer.js` an weiteren reinen Typ-Suchstellen jetzt den bestehenden Helper aus `src/plate/plate-sequence-width-utils.js`:

```js
getFirstItemOfType(items, type)
```

Ersetzt wurden nur reine Typ-Suchen ohne Zusatzbedingungen:

```js
getFirstItemOfType(positioned, "season-field")
getFirstItemOfType([...topPositioned, ...motorcycleSeals], "seals")
```

Suchen mit Zusatzbedingungen wie `rowKey`, `arrangement` oder zusätzlichen numerischen Prüfungen bleiben bewusst lokal.

## Nicht geändert

- keine Geometrieänderung
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code
- keine Debug-Abhängigkeit im produktiven Rendererpfad

## Debug-Code-Hinweis für spätere Card-Integration

Debug-Module wie `debug-dimensions.js` bleiben Lab-only. Für die spätere Card-Übernahme dürfen produktive Rendererdateien nicht von Debug-Modulen abhängen. Gemeinsame Utility-Helper ohne Debug-Semantik sind unkritisch; Debug-Renderer/Dimension-Layer selbst werden nicht produktiv übernommen.

## Checks

- Lab Regression: **41/41 OK**
- b308 → b309 Regression-Modell-Hashes: **41/41 identisch**
- b308 → b309 Regression-SVG-Hashes: **41/41 identisch**
- Full/Card JS Check: **bestanden**
- Release Asset Check: **bestanden**
- ZIP-Test: **bestanden**

## Nächster Schritt

Weiter ab **b309**. Die verbleibenden Redundanzen sind nur noch Restfeinschliff. Weiterhin nur echte Duplikate oder vollständig identische Formeln zentralisieren; wenn kein klarer Kandidat bleibt, besser Smoke-Checkpoint statt erzwungener Zentralisierung.
