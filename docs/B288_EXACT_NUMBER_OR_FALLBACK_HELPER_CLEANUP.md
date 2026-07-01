# b288 – Exact Number-Or-Fallback Helper Cleanup

## Basis

- b287 – Exact Positive Number Helper Cleanup

## Änderung

Full-/Übergabestand zu Lab b288. Die Card bleibt unverändert.

Im Lab wurde `season-field.js` auf den bestehenden Helper `numberOrFallback(value, fallback)` aus `plate-number-utils.js` umgestellt. Entfernt wurde nur die lokale Kopie der identischen Formel:

```js
const number = Number(value);
return Number.isFinite(number) ? number : fallback;
```

## Checks

- Lab Regression 41/41 OK
- Modell-Hashes b287 → b288 identisch
- SVG-Hashes b287 → b288 identisch
- Full/Card JS Check bestanden
- Release Asset Check bestanden

## Hinweis

`tools/plate-physical-lab/` ist mit b288 synchronisiert. Das separate Lab-ZIP bleibt autoritativ.
