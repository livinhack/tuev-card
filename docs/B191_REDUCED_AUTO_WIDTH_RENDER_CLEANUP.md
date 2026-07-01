# b191 – Reduced auto-width and seal-render cleanup

Stand: b191

## Anlass

Die visuelle b190-Prüfung zeigte:

- Der Upper-Seal-Fallback war in Auto-Breite noch künstlich auf 255 mm begrenzt. Kurze obere Zeilen mit längerer unterer Erkennungsnummer konnten dadurch unnötig bei 255 mm bleiben, obwohl 220 mm rechnerisch und visuell passen.
- Das Reduced-Vertical-Rendering verwendete nur das erste `seals`-Item. Dadurch konnten HU und Behördensiegel aus derselben X-Position gezeichnet werden, obwohl die gelöste Top- und Bottom-Zeile unterschiedliche Siegelfeldpositionen hatten.

## Änderung im separaten Physical Lab

- Für `reducedTwoLine` wird pro Breitenkandidat `200 / 220 / 240 / 255 mm` zuerst das normale vertikale Template geprüft.
- Falls dieses nicht passt, wird auf demselben Kandidaten direkt das Upper-Seal-Template geprüft.
- Der erste Kandidat, dessen vollständige Zeilenketten passen, wird gewählt.
- Der Upper-Seal-Fallback ist nicht mehr nur bei 255 mm erlaubt.
- `renderSeals()` rendert jetzt alle `seals`-Items.
- Bei `reduced-standard-vertical` rendert das Top-Row-Siegelfeld nur HU, das Bottom-Row-Siegelfeld nur das Behördensiegel.
- Bei `reduced-standard-upper-row` werden beide Siegel aus der oberen Siegelreihe gerendert.

## Beispiele b191

- `W QU1` → 200 mm, normales vertikales Template
- `WIL QU1` → 220 mm, normales vertikales Template
- `HVL D191` → 240 mm, normales vertikales Template
- `W D191` → 200 mm, Upper-Seal-Template
- `WI D191` → 220 mm, Upper-Seal-Template
- `W QU111` → 220 mm, Upper-Seal-Template
- `WI QU111` → 220 mm, Upper-Seal-Template
- `WIL QU111` → 255 mm, Upper-Seal-Template

## Regression

```text
Regression passed: 29/29 cases OK.
```

Die Regression enthält jetzt zusätzlich einen Fixed-Width-Rendercheck für getrennte Top-/Bottom-Row-Siegelpfade bei Reduced-Vertical.

## Full-/Card-Status

Der Full-/Card-Code wurde nicht geändert. `tools/plate-physical-lab/` im Full-ZIP bleibt bewusst eingefroren und ist nicht autoritativ. Maßgeblich ist das separate Lab-ZIP `plate-physical-lab-b191-reduced-auto-width-render-cleanup.zip`.
