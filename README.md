# TÜV Reminder Card b342

Full/Card handover ZIP for **b342 Plate Color Source Unification**.

## Inhalt

b342 vereinheitlicht die Farbquelle für schwarze Nicht-HU-Siegel-Elemente im Kennzeichenrenderer:

- Wechselkennzeichen-Zusatzrahmen folgt der zentralen Rahmenfarbe.
- W-Markierung im großen Schild folgt der zentralen Plattenfarbe.
- kleiner gemeinsamer Text im Wechselkennzeichen-Zusatzteil folgt der zentralen Plattenfarbe.
- HU-/TÜV-Siegel bleibt eigenständig.

Keine Geometrie, HU-Logik, Sortierlogik oder Reminder-Integration wurde geändert.

## Checks

- `npm run check`
- `npm run build`

## Hinweis Fonts

Die ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein.

## Renderer-Grenze

Keine Kennzeichen-Geometrie geändert. Der Nummernschildrenderer bleibt nach b336/b337 vorbereitet/eingefroren; b342 ändert nur die gemeinsame Farbquelle für Nicht-HU-Elemente.

Reminder-Integration folgt später mit aktuellem Reminder-ZIP.

## Beibehaltene Editor-Fixes

Die frühere Option **Kennzeichen grafisch darstellen** bleibt wirksam. Die Sortierlogik bleibt auf dem zurückgesetzten b337-Fluss, und Gruppen-Farben bleiben beim Verschieben erhalten.
