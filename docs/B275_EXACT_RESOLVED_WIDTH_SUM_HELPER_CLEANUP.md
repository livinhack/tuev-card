# b275 – Exact Resolved-Width Sum Helper Cleanup

## Ziel

Full-/Übergabestand zu Lab b275 dokumentieren.

## Änderung

Die Card bleibt unverändert. Im synchronisierten Lab-Spiegel wurde nur die vollständig identische Summenformel für bereits gelöste Item-Breiten zentralisiert:

```js
items.reduce((sum, item) => sum + item.width, 0)
```

Neuer Helper im Lab:

- `sumResolvedItemWidths(items)`

## Checks

- Lab Regression: 41/41 OK
- b274 → b275 Modell-Hashes: 41/41 identisch
- b274 → b275 SVG-Hashes: 41/41 identisch
- Full/Card Check: bestanden
