# b177 – Reduced short top row guard

## Ziel

b177 ergänzt zur b175-Reduced-Standard-Basis einen Regression-Guard für kurze obere Zeilen beim verkleinerten zweizeiligen Standardkennzeichen.

## Beobachtung

Wenn die obere Zeile weniger als drei Zeichen hat, wirkt sie im Anlage-4-Maßbild eher rechtsbündig. Die Zeile ist nicht frei im oberen Band zentriert, sondern bleibt am nachfolgenden `***`-Abstand vor der Siegelspalte verankert.

## Umsetzung

- neuer Regression-Fall `reduced-standard-short-top`
- Eingabe: `WI D191`
- Erwartung: obere Zeile weniger hart rechts am Siegeltemplate verankert
- keine Geometrieänderung an `HVL D191`
- keine H/E-/Saison-/Grün-Reduced-Variante

## Status

- b172 bleibt verworfen
- b175 bleibt Reduced-Standard-Basis
- b177 ist ein Guard-/Dokumentationsstand, keine abschließende Reduced-H/E-Freigabe
