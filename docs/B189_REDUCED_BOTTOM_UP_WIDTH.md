# b189 – Reduced bottom-up width calculation

Stand: b189

## Ziel

Die automatische Breitenwahl für `reducedTwoLine` wurde bottom-up auf die textkritische Erkennungsnummer umgestellt. Starre Siegel-/Plakettenketten dürfen nicht mehr verhindern, dass kurze gültige Kombinationen kleinere Breitenstufen erreichen.

## Regeln

- Layout: verkleinert zweizeilig Standard, Höhe 130 mm, Größtmaß 255 mm.
- Breitenkandidaten im Lab: `200 / 220 / 240 / 255 mm`.
- Schrift: ausschließlich verkleinerte Mittelschrift.
- Zeichenhöhe: 49 mm.
- Buchstabenbreite: 31 mm.
- Ziffernbreite: 29 mm.
- `*`: Außenrand mindestens 8 mm, danach symmetrisch wachsend.
- `**`: Zeichenabstand 8–10 mm.
- `***`: Gruppenabstand 15–18 mm.

## Algorithmus

1. Untere Erkennungsnummer in Zeichen-/Gruppenfolge zerlegen.
2. Mindestbreite aus festen Zeichenbreiten, `**`-Minimum, `***`-Minimum und zwei 8-mm-Außenrändern berechnen.
3. Kleinste Breitenstufe auswählen, deren nutzbare Breite diese Mindestkette erfüllt.
4. Restplatz zuerst in `**` bis maximal 10 mm und `***` bis maximal 18 mm verteilen.
5. Danach verbleibenden Restplatz exakt 50/50 auf linken und rechten Außenrand verteilen.

## Regression

```text
Regression passed: 27/27 cases OK.
```

Beispiele:

- `HVL D191` → `200 × 130 mm`
- `W QU1` → `200 × 130 mm`
- `WIL QU1` → `200 × 130 mm`
- `W QU111` → `220 × 130 mm`
- `SHG KJ456` → `220 × 130 mm`
- `AB AB1234` → `255 × 130 mm`

## Full-ZIP-Hinweis

Der Full-/Card-Code wurde nicht geändert. `tools/plate-physical-lab/` im Full-ZIP bleibt bewusst eingefroren und ist nicht autoritativ. Maßgeblich ist das separate Lab-ZIP `plate-physical-lab-b189-reduced-bottom-up-width.zip`.
