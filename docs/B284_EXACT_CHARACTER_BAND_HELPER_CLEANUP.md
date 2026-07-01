# b284 – Exact Character Band Helper Cleanup

Full-/Übergabestand zu Lab b284.

## Änderung

- Full-Doku auf b284 aktualisiert
- Lab-Spiegel `tools/plate-physical-lab/` mit b284 synchronisiert
- Card-Code unverändert gelassen

## Lab-Änderung

Lokale Kopien der bereits vorhandenen `getCharacterBand()`-Formel in `season-field.js` und `debug-dimensions.js` wurden durch Imports aus `text-utils.js` ersetzt.

## Checks

- Lab Regression: 41/41 OK
- b283 → b284 model hashes: 41/41 identical
- b283 → b284 SVG hashes: 41/41 identical
- Full/Card JS Check: passed
- Release Asset Check: passed
