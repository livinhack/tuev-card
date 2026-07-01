# TÜV Reminder Full b285

## b285 – Exact Band For Item Helper Cleanup

Dieses Full-/Übergabe-Artefakt dokumentiert den autoritativen Lab-Stand b285. Die Card bleibt unverändert.

Lab-ZIP:

`plate-physical-lab-b285-exact-band-for-item-helper-cleanup.zip`

Full-ZIP:

`tuev-card-full-b285-exact-band-for-item-helper-cleanup-handover.zip`

## Inhalt dieses Full-Stands

- Lab-Version auf `0.1.1-b285` aktualisiert
- Full-Version auf `0.1.1-b285` aktualisiert
- `tools/plate-physical-lab/` mit b285 synchronisiert
- Full-README/HANDOVER/Doku auf b285 aktualisiert
- Card-Code bleibt unverändert

## Lab-Änderung b285

Die identische Band-for-Item-Formel wurde zentralisiert:

- `text-utils.js` exportiert jetzt `getBandForItem(rules, item)`
- `season-field.js` nutzt jetzt den gemeinsamen Helper
- `debug-dimensions.js` nutzt jetzt den gemeinsamen Helper

Ersetzt wurde nur die identische Regel:

```js
if (Number.isFinite(Number(item?.bandY)) && Number.isFinite(Number(item?.bandHeight))) {
  return { y: Number(item.bandY), height: Number(item.bandHeight), baselineY: Number(item.baselineY) || null };
}
return getCharacterBand(rules, item?.rowKey);
```

## Nicht geändert

- keine Card-Logik
- keine Rendergeometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichenänderung
- keine UI-Änderung

## Prüfergebnis

- Lab Regression: 41/41 OK
- b284 → b285 Modell-Hashes: 41/41 identisch
- b284 → b285 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden

## Lab-Spiegel im Full-ZIP

Das separate Lab-ZIP ist autoritativ. `tools/plate-physical-lab/` ist für diesen Full-Stand mit b285 synchronisiert, bleibt aber nicht die maßgebliche Quelle für weitere Lab-Arbeit.
