# b190 – Reduced row-chain width selection without text/seal overlap

Stand: b190

## Anlass

b189 öffnete die automatische Breitenwahl für verkleinerte zweizeilige Kennzeichen, prüfte aber nicht die vollständige reale Renderkette. Dadurch konnten Buchstaben/Ziffern sichtbar auf HU-/Siegelfeldern liegen.

## Lösung

`reducedTwoLine` prüft jetzt vollständige Zeilenketten:

- Top normal: Bezirk + Text→Siegel-Gap + HU-/Siegelfeld
- Bottom normal: Erkennungsnummer + Text→Siegel-Gap + 45-mm-Behördensiegelfeld
- Upper-Seal-Fallback: Bezirk + Gap + 45-mm-Behördensiegelfeld + 35-mm-HU-Feld, unten text-only

Die automatische Breite nimmt den kleinsten Kandidaten aus `200 / 220 / 240 / 255 mm`, bei dem die tatsächlich gerenderten Ketten kollisionsfrei passen.

## Feste Reduced-Regeln

- verkleinerte Mittelschrift only
- keine verkleinerte Engschrift
- Zeichenhöhe `49 mm`
- Buchstabenbreite `31 mm`
- Ziffernbreite `29 mm`
- `** = 8–10 mm`
- unterer `*** = 15–18 mm`
- Text→Siegel `5–20 mm`
- Rest symmetrisch in die Außenränder

## Ergebnisbeispiele

- `W QU1` → `200 mm`
- `WIL QU1` → `220 mm`
- `HVL D191` → `240 mm`
- `W QU111` → `255 mm`, obere Siegelreihe
- `WIL QU111` → `255 mm`, obere Siegelreihe

## Regression

`npm run check:regression`:

```text
Regression passed: 27/27 cases OK.
```

Die Regression enthält ab b190 eine Text↔Siegel-Kollisionsprüfung für Reduced.

## Full-/Card-Status

Der Full-/Card-Code wurde nicht geändert. `tools/plate-physical-lab/` im Full-ZIP bleibt bewusst eingefroren und ist nicht autoritativ. Maßgeblich ist das separate Lab-ZIP `plate-physical-lab-b190-reduced-row-chain-no-overlap.zip`.
