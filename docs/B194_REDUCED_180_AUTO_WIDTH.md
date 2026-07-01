# b194 – Reduced 180-mm auto width

Stand: b194

Autoritativer Lab-ZIP: `plate-physical-lab-b194-reduced-180-auto-width.zip`.
Full-/Übergabe-ZIP: `tuev-card-full-b194-reduced-180-auto-width-handover.zip`.

## Änderung

- Reduced Standard im Physical Lab bekommt den fehlenden Auto-Breitenkandidaten `180 mm`.
- Die Auto-Breitenfolge lautet jetzt `180 / 200 / 220 / 240 / 255 mm`.
- `180 mm` wird nur akzeptiert, wenn das normale vertikale Siegel-Template vollständig passt.
- Upper-Seal-/Nebeneinander-Siegel-Fallback beginnt weiterhin erst ab `200 mm`.
- Dadurch wird `W Q1` zu `180 × 130 mm`, während `W QU1` weiterhin bei `200 × 130 mm` bleibt.
- b193-Logik bleibt erhalten: Text-/Siegelketten ohne Überlappung, vertikale Siegel gleiche X-Achse, dynamische Korridore in der oberen Siegelreihe.

## Regression

`npm run check:regression` im Lab: `Regression passed: 30/30 cases OK.`

Full `npm run check`: JavaScript-Check und Release-Asset-Check erfolgreich. Bekannte Font-Hinweise sind erwartbar, weil Chat-ZIPs keine `.ttf`-Dateien enthalten.

## Full-/Lab-Sync

Der Card-Code wurde in b194 nicht geändert. `tools/plate-physical-lab/` im Full-ZIP bleibt bewusst eingefroren/nicht synchronisiert. Autoritativ ist ausschließlich das separate Lab-ZIP.
