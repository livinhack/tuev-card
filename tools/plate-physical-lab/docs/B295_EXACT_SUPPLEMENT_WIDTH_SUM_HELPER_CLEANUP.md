# b295 – Exact Supplement Width Sum Helper Cleanup

## Ziel

Weiterer defensiver Cleanup nach der strengen Regel: Nur vollständig identische Formeln zentralisieren.

## Änderung

Der Wechselkennzeichen-Supplement-Renderer verwendet für die Gesamtbreite der Fahrzeugzeichen jetzt den bestehenden Helper:

- `sumValues(values)`

Ersetzt wurde nur:

```js
widths.reduce((sum, width) => sum + width, 0)
```

## Ergebnis

- Keine fachliche Änderung
- Keine Geometrieänderung
- Modell- und SVG-Hashes gegenüber b294 identisch
