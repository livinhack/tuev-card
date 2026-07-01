# b342 – Plate Color Source Unification

## Ziel

Die Farbe aller schwarzen Nicht-HU-Siegel-Elemente im Kennzeichenrenderer soll aus derselben visuellen Farbquelle kommen wie Text/Rahmen des Hauptschilds.

Auslöser war ein Lab-Test mit der fachlich nicht realen Kombination **Wechselkennzeichen + grünes Kennzeichen**: Das Hauptschild wurde grün, der separate fahrzeugbezogene Wechselkennzeichen-Zusatzrahmen blieb aber schwarz.

## Änderung

- Wechselkennzeichen-Zusatzrahmen nutzt jetzt `metrics.frameColor || metrics.textColor || "#111"`.
- Kleiner gemeinsamer Text im Zusatzschild nutzt dieselbe Plattenfarbe.
- Fahrzeugbezogener Text bleibt an `metrics.textColor` angebunden.
- W-Markierung im Hauptschild nutzt dieselbe Plattenfarbe.
- HU-/TÜV-Siegel bleibt ausdrücklich eigenständig und wird nicht über diese Plattenfarbquelle eingefärbt.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-Plakettenlogik
- keine Wechselkennzeichen-Geometrie
- keine Reminder-Integration
- keine neue fachliche Zulässigkeitsregel für Wechselkennzeichen + grün

## Check

Neu: `check:plate-color-source-unification`

Der Check rendert ein grünes Wechselkennzeichen und prüft:

- Zusatzrahmen ist grün.
- W-Markierung ist grün.
- kleiner gemeinsamer Zusatztext ist grün.
- fahrzeugbezogener Zusatztext ist grün.
- Standard-Wechselkennzeichen bleibt schwarz.
