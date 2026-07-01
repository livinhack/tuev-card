# Übergabe Full/Card b307 – Exact Special I Width Helper Cleanup

Aktueller Stand: **b307**

## Artefakte

- Lab: `plate-physical-lab-b307-exact-special-i-width-helper-cleanup.zip`
- Full: `tuev-card-full-b307-exact-special-i-width-helper-cleanup-handover.zip`

## Basis

b307 baut auf **b306 – Exact SVG Number Format Helper Cleanup** auf.

## Änderung b307

Streng nach der Regel: Nur wirklich identische Formeln zentralisieren.

Im autoritativen Lab wurde in `src/plate/plate-render-context.js` der Helper

- `resolveSpecialIWidth(baseFont, options)`

ergänzt und nur die identische Special-I-Breitenformel zentralisiert:

```js
positiveNumber(options.specialIWidth, baseFont.specialWidths?.I || baseFont.letterWidth)
```

Betroffen im Lab:

- `src/plate/plate-render-context.js`
- `src/plate/plate-svg-renderer.js`

## Full-/Card-Stand

- Card-Code wurde nicht fachlich geändert.
- Full-ZIP enthält aktualisierte Übergabe-/README-/Doku-Dateien.
- `tools/plate-physical-lab/` ist mit dem separaten Lab-ZIP **b307 synchronisiert**, bleibt aber nicht autoritativ. Autoritativ ist weiterhin das separate Lab-ZIP.

## Debug-/Card-Hinweis

Dieser Stand ändert keinen Debug-Code. Für die spätere produktive Card-Übernahme gilt:

- Debug-Dateien wie `debug-dimensions.js` sind Lab-Werkzeuge und werden nicht als produktive Renderer-Abhängigkeit übernommen.
- Frühere Cleanups in Debug-Dateien haben nur identische Utility-Formeln wiederverwendet. Das beeinflusst die spätere Card nicht, solange Debug-Module nicht importiert werden.
- Gemeinsame Utilities dürfen in die Card übernommen werden, wenn sie keine Debug-Semantik enthalten und vom produktiven Renderer gebraucht werden.
- Beim Transfer Lab → Card sollte eine Import-Grenze geprüft werden: Produktivrenderer darf nicht von `debug-dimensions.js` oder anderen Lab-only-Modulen abhängen.

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Änderung außer Version/Titel/Beschreibung im Lab
- kein Card-Code

## Checks

- Lab Regression: **41/41 OK**
- b306 → b307 Regression-Modell-Hashes: **41/41 identisch**
- b306 → b307 Regression-SVG-Hashes: **41/41 identisch**
- Full/Card JS Check: **bestanden**
- Release Asset Check: **bestanden**
- ZIP-Test: **bestanden**

## Nächster Einstieg

Weiter ab **b307**. Die verbleibenden Redundanzen sind Restfeinschliff; wenn kein wirklich identischer Kandidat bleibt, besser einen Smoke-Checkpoint bauen.
