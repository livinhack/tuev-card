# b195 – Reduced H/E/Saison vertikal

Stand: b195

## Änderung

Das Physical Lab hat für das verkleinerte zweizeilige Kennzeichen die erste H/E- und Saison-Fassung erhalten.

Regel:

- Sobald H/E oder Saison vorhanden ist, ist das vertikale Siegeltemplate Pflicht.
- Die obere Nebeneinander-Siegelreihe bleibt nur Standard-Fallback ohne H/E/Saison.
- HU oben und Behördensiegel unten teilen bei vertikalen Templates dieselbe X-Achse.
- Reduced bleibt feste verkleinerte Mittelschrift: Zeichenhöhe 49 mm, Buchstabenfeld 31 mm, Ziffernfeld 29 mm.
- Keine verkleinerte Engschrift.
- Zeichenabstand `**`: 8–10 mm.
- Gruppengap in der unteren Zeile, auch Zahl → H/E: 15–18 mm.
- Saisonfeld wird in der unteren Zeile nach der Erkennungsnummer bzw. nach H/E geführt.
- Abstand Zahl/H/E → Saison: `*`, mindestens 8 mm.

## Auto-Breitenbeispiele

- `W Q1` → 180 × 130 mm
- `W Q1E` → 200 × 130 mm
- `W Q1` + Saison → 200 × 130 mm
- `W Q1E` + Saison → 240 × 130 mm

## Ergebnis

Lab-Regression:

```text
Regression passed: 33/33 cases OK.
```

## Full/Card-Hinweis

Card-Code wurde nicht geändert.
Das separate Lab-ZIP bleibt autoritativ. `tools/plate-physical-lab/` im Full-ZIP ist weiterhin bewusst nicht synchronisiert/eingefroren.
