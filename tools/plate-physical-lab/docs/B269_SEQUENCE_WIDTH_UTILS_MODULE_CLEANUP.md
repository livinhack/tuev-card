# b269 – Sequence Width Utils Module Cleanup

## Ziel

`plate-svg-renderer.js` weiter entlasten, ohne die geprüfte Geometrie zu ändern.

## Änderung

Neues Modul:

- `src/plate/plate-sequence-width-utils.js`

Ausgelagert wurden generische Sequenzbreiten-Helfer:

- `shrinkVariablesToFit()`
- `growVariablesToFit()`
- `sumSequenceWidth()`
- `getItemMinWidth()`
- `getItemPreferredWidth()`
- `getItemMaxWidth()`
- `average()`
- `getVariableRangeLabel()`
- `minVariableWidth()`

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine Wechselkennzeichen-Geometrie
- keine Siegel-/Slot-Geometrie
- keine UI-Änderung

## Prüfung

- Lab Regression: 41/41 OK
- b268 → b269 Regression-Modell-Hashes: 41/41 identisch
- b268 → b269 Regression-SVG-Hashes: 41/41 identisch
