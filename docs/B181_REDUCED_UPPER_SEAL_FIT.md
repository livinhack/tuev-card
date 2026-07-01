# b181 – Reduced upper seal row fit

## Zweck

b181 korrigiert den in b180 eingeführten Langfall mit oberer Nebeneinander-Siegelreihe: Die Umschaltung bleibt erhalten, aber die Platzhalterkreise laufen nicht mehr sichtbar ineinander und der untere Gruppengap ist nicht mehr starr auf 15 mm fixiert.

## Basis

- Basis Lab: b180
- b172 bleibt verworfen.
- b170 bleibt bestätigter Kraftradstand.
- b179 bleibt gültige Basis für Reduced Standard mit kurzer oberer Zeile.

## Fachliche Beobachtung

Referenzbilder zeigen bei vollen verkleinerten zweizeiligen Kennzeichen eine abweichende Siegelanordnung:

```text
oben:   obere Schrift + großes Behördensiegel + kleines HU-Siegel
unten:  lange untere Schrift ohne großes Siegelfeld
```

Das gilt als Standard-Langfall/Fallback und bereitet zugleich die spätere H/E- und Saisonlogik vor, bei der die obere Siegelreihe offenbar unabhängig von der unteren Zeilenlänge vorkommen kann.

## Umsetzung im Lab

Aktueller Trigger in b181:

```text
untere Zeile >= 5 sichtbare Zeichen
```

Dann wird gesetzt:

```text
Behördensiegel-Feld: 45 mm, oben links in der Siegelgruppe
HU-Feld:             35 mm, oben rechts in der Siegelgruppe
Feld-Zwischenraum:    0 mm
visuelle Placeholder-Clearance: ca. 2 mm
Text→Siegel:          5 mm im ***-Korridor
unterer Gruppengap:   dynamisch 15–18 mm
```

Normale/kürzere Reduced-Standardfälle bleiben unverändert:

```text
HVL D191 → vertikale Siegelspalte bleibt
WI D191  → kurze obere Zeile bleibt im festen 3er-Feld zentriert
W D191   → einstellige obere Zeile bleibt im festen 3er-Feld zentriert
```

## Regression

b181 ergänzt den Lab-Regressionsfall:

```text
SHG KJ456 → lange Unterzeile, obere Siegelreihe
```

Erwartung:

```text
Regression passed: 23/23 cases OK.
```

## Nicht enthalten

- keine Reduced-H/E-Freischaltung
- keine Reduced-Saison-Freischaltung
- kein Reduced-Grün
- keine Card-Integration

## Full/Lab-Sync

Der separate Lab-ZIP ist weiterhin autoritativ für den Lab-Code.
Dieser Full-ZIP enthält aktualisierte Übergabe-/Docs-Informationen. Ein eventuell vorhandener `tools/plate-physical-lab/`-Spiegel im Full-Projekt ist nur autoritativ, wenn ein Stand ausdrücklich als synchronisiert dokumentiert wird.
