# Übergabe Lab b308 – Exact Reduced Row Typed Finder Helper Cleanup

Aktueller Stand: **b308**

Artefakt:

`plate-physical-lab-b308-exact-reduced-row-typed-finder-helper-cleanup.zip`

b308 baut auf **b307 – Exact Special I Width Helper Cleanup** auf.

## Änderung b308

Streng nach der aktuellen Refactor-Regel wurde nur eine bereits vorhandene, vollständig identische Mini-Formel weiterverwendet:

```js
items.find((item) => item.type === type)
```

Konkret nutzt `src/plate/reduced-row-chain-solver.js` jetzt den bestehenden Helper aus `src/plate/plate-sequence-width-utils.js`:

```js
getFirstItemOfType(items, type)
```

Ersetzt wurde nur die reine Typ-Suche nach dem ersten Seal-Item in der Reduced-Row-Shared-Seal-Logik:

```js
const bottomInitialSeal = getFirstItemOfType(bottomInitialItems, "seals");
```

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
- b307 → b308 Regression-Modell-Hashes: **41/41 identisch**
- b307 → b308 Regression-SVG-Hashes: **41/41 identisch**
- Full/Card JS Check: **bestanden**
- Release Asset Check: **bestanden**
- ZIP-Test: **bestanden**

## Nächster Schritt

Weiter ab **b308**. Die verbleibenden Redundanzen sind nur noch Restfeinschliff. Weiterhin nur echte Duplikate oder vollständig identische Formeln zentralisieren; wenn kein klarer Kandidat bleibt, besser Smoke-Checkpoint statt erzwungener Zentralisierung.
