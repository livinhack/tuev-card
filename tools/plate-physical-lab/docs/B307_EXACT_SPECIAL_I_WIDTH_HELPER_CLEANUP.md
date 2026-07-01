# Übergabe Lab b307 – Exact Special I Width Helper Cleanup

Aktueller Stand: **b307**

## Artefakt

`plate-physical-lab-b307-exact-special-i-width-helper-cleanup.zip`

b307 baut auf **b306 – Exact SVG Number Format Helper Cleanup** auf.

## Änderung b307

Streng nach der Regel: Nur wirklich identische Formeln zentralisieren.

Neu bzw. weiterverwendet in `src/plate/plate-render-context.js`:

- `resolveSpecialIWidth(baseFont, options)`

Ersetzt wurde nur die identische Special-I-Breitenformel:

```js
positiveNumber(options.specialIWidth, baseFont.specialWidths?.I || baseFont.letterWidth)
```

Betroffen:

- `src/plate/plate-render-context.js`
- `src/plate/plate-svg-renderer.js`

## Debug-/Card-Hinweis

Dieser Stand ändert keinen Debug-Code. Die bisherigen Cleanups in Debug-Dateien haben nur identische Hilfsformeln auf gemeinsame Utility-Helper zurückgeführt. Für die spätere Card-Übernahme gilt: Debug-Module wie `debug-dimensions.js` bleiben Lab-Werkzeuge und werden nicht produktiv übernommen. Gemeinsame Utility-Helper sind nur dann unkritisch, wenn sie keine Debug-Semantik enthalten und vom produktiven Renderer unabhängig nutzbar sind.

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung
- kein Card-Code

## Checks

- Lab Regression: **41/41 OK**
- b306 → b307 Regression-Modell-Hashes: **41/41 identisch**
- b306 → b307 Regression-SVG-Hashes: **41/41 identisch**
- Full/Card JS Check: **bestanden**
- Release Asset Check: **bestanden**

## Nächster Einstieg

Weiter ab **b307**. Die verbleibenden Redundanzen sind Restfeinschliff. Weiterhin nur echte Duplikate oder vollständig identische Formeln zentralisieren; wenn kein klarer Kandidat bleibt, besser Smoke-Checkpoint statt erzwungener Zentralisierung.
