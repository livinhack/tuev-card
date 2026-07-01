# b289 – Exact Finite Number Helper Cleanup

## Basis

b289 baut auf **b288 – Exact Number-Or-Fallback Helper Cleanup** auf.

## Änderung

Der bestehende Helper `numberOrFallback(value, fallback)` aus dem Lab-Modul `plate-number-utils.js` wird jetzt auch in weiteren Eurofeld-/Wechselkennzeichen-Komponenten genutzt.

Entfernt wurden nur lokale Kopien dieser exakt identischen Formel:

```js
const number = Number(value);
return Number.isFinite(number) ? number : fallback;
```

Betroffene Lab-Dateien:

- `src/plate/euro-field.js`
- `src/plate/eu-star-wreath.js`
- `src/plate/eu-country-mark.js`
- `src/plate/change-plate.js`

## Full/Card

- Card-Code unverändert
- Full-Lab-Spiegel mit b289 synchronisiert
- separates Lab-ZIP bleibt autoritativ

## Prüfung

- Lab Regression: 41/41 OK
- Modell-Hashes b288 → b289 identisch
- SVG-Hashes b288 → b289 identisch
- Full/Card JS Check bestanden
- Release Asset Check bestanden
