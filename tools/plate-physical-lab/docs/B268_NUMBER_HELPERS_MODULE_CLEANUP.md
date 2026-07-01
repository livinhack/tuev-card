# b268 – Number Helpers Module Cleanup

Basis: b267 – Renderer Module Smoke Checkpoint.

Änderung:

- neues Modul `src/plate/plate-number-utils.js`
- gemeinsame numerische Hilfsfunktionen ausgelagert:
  - `formatNumber()`
  - `positiveNumber()`
  - `clampNumber()`
  - `numberOrFallback()`
- `plate-svg-renderer.js` und `plate-season-options.js` nutzen die gemeinsamen Helper.

Keine Änderung an Kennzeichen-Geometrie, Wechselkennzeichen-Geometrie, Siegel-/Slot-Geometrie oder UI.

Prüfung:

- Lab Regression: 41/41 OK
- b267 → b268 Regression-Modell-Hashes: 41/41 identisch
- b267 → b268 Regression-SVG-Hashes: 41/41 identisch
