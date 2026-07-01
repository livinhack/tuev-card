# B188 Reduced Auto Width Gap Chain

Stand: b188

## Zweck

b188 korrigiert die automatische Breitenwahl des verkleinerten zweizeiligen Standardkennzeichens. b187 konnte zwar kurze Fälle wie `W QU1` kompakt lösen, blieb bei dreistelliger Oberzeile wie `WIL QU1` aber unnötig bei 240 mm hängen.

## Änderung

Die Reduced-Auto-Breitenwahl prüft nun die tatsächliche obere Maßkette mit variablem `***`-Korridor:

- `*** = 5–20 mm` wird bei der Fit-Prüfung als gültiger Bereich behandelt.
- Der bevorzugte 15-mm-Wert blockiert keine kleinere Breite mehr.
- Beispiel `WIL QU1` darf dadurch auf 220 × 130 mm springen, wenn der `***`-Korridor auf 5 mm schrumpft.
- Kurze Oberzeilen ohne obere Siegelreihe bleiben weiter über die sichtbare Textkette statt über virtuelle Platzhalter breitenbestimmend.
- Obere Siegelreihe bleibt konservativ bei 255 mm.

## Regression

Neuer Lab-Regressionsfall:

- `WIL QU1` → 220 × 130 mm

Bestehende Nicht-Reduced- und Kraftrad-Fälle bleiben unverändert.

## Lab/Full-Sync

Der autoritative Renderer-Code liegt weiterhin im separaten Lab-ZIP. Der Full-ZIP ist ein Übergabe-/Dokustand und enthält keinen produktiven Card-Code-Import des b188-Lab-Renderers.
