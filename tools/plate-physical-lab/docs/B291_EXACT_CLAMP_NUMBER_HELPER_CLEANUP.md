# b291 – Exact Clamp Number Helper Cleanup

Basis: b290.

Änderung: Die lokale `clampNumber(value, min, max)`-Kopie in `season-field.js` wurde entfernt. `season-field.js` verwendet nun den bestehenden `clampNumber()` aus `plate-number-utils.js`.

Zentralisiert wurde nur die identische Clamp-Formel für numerische Eingaben. Die Aufrufstellen liefern weiterhin dieselben numerischen Werte wie vorher.

Keine Geometrie-, Solver-, Wechselkennzeichen-, UI- oder Card-Fachänderung.

Checks:

- Lab Regression: 41/41 OK
- b290 → b291 Modell-Hashes: 41/41 identisch
- b290 → b291 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
