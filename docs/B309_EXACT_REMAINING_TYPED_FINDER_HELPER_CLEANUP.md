# Übergabe Full b309 – Exact Remaining Typed Finder Helper Cleanup

Aktueller Stand: **b309**

Artefakte:

- Lab: `plate-physical-lab-b309-exact-remaining-typed-finder-helper-cleanup.zip`
- Full: `tuev-card-full-b309-exact-remaining-typed-finder-helper-cleanup-handover.zip`

b309 baut auf **b308 – Exact Reduced Row Typed Finder Helper Cleanup** auf.

## Änderung b309

Im separaten Physical Lab wurde nur eine bereits vorhandene, vollständig identische Mini-Formel weiterverwendet:

```js
items.find((item) => item.type === type)
```

`src/plate/plate-svg-renderer.js` nutzt an weiteren reinen Typ-Suchstellen jetzt `getFirstItemOfType(items, type)` aus `plate-sequence-width-utils.js`.

Suchen mit Zusatzbedingungen bleiben lokal. Es wurde keine Fachlogik zusammengeführt.

## Full-/Card-Stand

- Card-Code unverändert.
- Full-ZIP enthält aktualisierte Übergabe-/README-/Doku-Informationen.
- `tools/plate-physical-lab/` ist mit dem separaten Lab-ZIP b309 synchronisiert, bleibt aber nicht autoritativ.
- Autoritativ für das Physical Lab ist weiterhin das separate Lab-ZIP.

## Debug-Code-Hinweis für spätere Card-Integration

Debug-Module wie `debug-dimensions.js` bleiben Lab-only. Für die spätere produktive Card-Übernahme darf der Renderer nicht von `debug-*`-Modulen abhängen. Gemeinsame Utility-Helper ohne Debug-Semantik sind unkritisch.

## Checks

- Lab Regression: **41/41 OK**
- b308 → b309 Regression-Modell-Hashes: **41/41 identisch**
- b308 → b309 Regression-SVG-Hashes: **41/41 identisch**
- Full/Card JS Check: **bestanden**
- Release Asset Check: **bestanden**
- ZIP-Test: **bestanden**

## Nächster Schritt

Weiter ab **b309**. Nur noch echte Duplikate oder vollständig identische Formeln zentralisieren. Wenn kein klarer Kandidat bleibt, Smoke-Checkpoint bauen.
