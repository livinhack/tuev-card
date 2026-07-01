# b192 – Reduced seal axis and dynamic corridor

Stand: b192

## Ziel

Reduced Standard weiter stabilisieren, nachdem b191 visuell zeigte, dass vertikal übereinanderliegende Siegel zwar getrennt gerendert wurden, aber nicht zwingend dieselbe X-Achse nutzten.

## Umsetzung im autoritativen Lab

- Normales vertikales Reduced-Template löst HU und Behördensiegel auf einer gemeinsamen X-Achse.
- Die untere Erkennungsnummer bestimmt die bevorzugte Siegelspalte; die obere Zeile wird gegen dieselbe X-Position gelöst.
- Wenn das bei einem Breitenkandidaten nicht kollisionsfrei passt, wird das Upper-Seal-Template geprüft.
- Upper-Seal bleibt pro Breitenkandidat aktiv und nutzt den Text→Siegel-/Randkorridor dynamisch.
- Die sichtbaren Upper-Seal-Kreise werden innerhalb ihrer gelösten 45-mm-/35-mm-Felder gerendert.
- Reduced bleibt Standard-only, 49-mm verkleinerte Mittelschrift, keine Engschrift.

## Regression

```text
npm run check:regression
Regression passed: 29/29 cases OK.
```

Zusätzlich geprüft:

- keine Reduced-Text-/Siegelfeld-Überlappung
- gleiche X-Position der vertikalen Reduced-Siegel
- automatische Breitenwahl bleibt aktiv

## Beispiele

```text
W QU1     -> 200 mm, normal vertical, gemeinsame Siegel-X-Achse
WIL QU1   -> 220 mm, normal vertical, gemeinsame Siegel-X-Achse
HVL D191  -> 240 mm, normal vertical, gemeinsame Siegel-X-Achse
W QU111   -> 220 mm, upper seal row
WI QU111  -> 220 mm, upper seal row
WIL QU111 -> 255 mm, upper seal row
```

## Full-/Card-Hinweis

Der Full-/Card-Code wurde nicht geändert. `tools/plate-physical-lab/` im Full-ZIP bleibt bewusst eingefroren und ist nicht autoritativ. Maßgeblich ist das separate Lab-ZIP `plate-physical-lab-b192-reduced-seal-axis-dynamic-corridor.zip`.
