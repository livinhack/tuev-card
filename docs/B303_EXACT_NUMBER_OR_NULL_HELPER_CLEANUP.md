# b303 – Exact Number-Or-Null Helper Cleanup

Basis: **b302 – Exact Horizontal Bounds Helper Cleanup**

## Änderung

Nur die bereits zentral vorhandene finite-number-or-fallback-Formel wird wiederverwendet.

- `seal-geometry-plan.js` importiert jetzt `numberOrFallback()` aus `plate-number-utils.js`.
- Der lokale `numberOrNull(value)`-Wrapper delegiert auf `numberOrFallback(value, null)`.
- Die fachliche Siegelgeometrie bleibt unverändert.

Ersetzt wurde nur diese identische Formel:

```js
const numeric = Number(value);
return Number.isFinite(numeric) ? numeric : null;
```

## Checks

- Lab Regression: 41/41 OK
- b302 → b303 Modell-Hashes: 41/41 identisch
- b302 → b303 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
