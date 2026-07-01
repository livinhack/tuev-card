# Handover – b342 Plate Color Source Unification

Current stand: **b342**.

## Basis

b342 baut auf **b341 Card Text Preview Stability** auf.

## Änderung in b342

- Die Farbe von schwarzen Nicht-HU-Siegel-Elementen im Kennzeichenrenderer wurde vereinheitlicht.
- Wechselkennzeichen-Zusatzrahmen nutzt jetzt die zentrale Platten-/Rahmenfarbe.
- Der kleine gemeinsame Text im Wechselkennzeichen-Zusatzteil nutzt jetzt dieselbe Plattenfarbe.
- Die W-Markierung im großen Hauptschild nutzt jetzt dieselbe Plattenfarbe.
- Fahrzeugbezogener Zusatztext bleibt an die zentrale Textfarbe angebunden.
- HU-/TÜV-Siegel bleibt eigenständig und wird nicht über diese Plattenfarbe umgefärbt.

## Wichtig

Die Kombination **grünes Kennzeichen + Wechselkennzeichen** wird dadurch nicht als echte fachliche Variante freigeschaltet. Der Testfall dient nur dazu, Farbquellenfehler sichtbar zu machen.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-Plakettenlogik
- keine Wechselkennzeichen-Geometrie
- keine Reminder-Integration
- keine Sortierlogik
- kein Legacy-/Umschalter

## Neue/aktualisierte Checks

- `check:plate-color-source-unification`

Der Check prüft grüne und schwarze Wechselkennzeichen-Ausgaben und schützt insbesondere:

- Zusatzrahmenfarbe
- W-Markierung
- kleiner Zusatztext
- Standard-Schwarz-Fallback

## Durchgeführte Checks

- Lab: `npm run check`
- Full/Card: `npm run check`
- Full/Card: `npm run build`

## Artefakte

- `plate-physical-lab-b342-plate-color-source-unification.zip`
- `tuev-card-full-b342-plate-color-source-unification-handover.zip`

## Nächster Einstieg

b342 ist ein kleiner Renderer-Farbquellen-Fix nach b341. Wenn der Screenshot-Test passt, kann wieder mit Card-/Editor-Fertigstellung weitergemacht werden.

## Beibehalten aus vorherigen Card-Fixes

- Option **Kennzeichen grafisch darstellen** bleibt wirksam.
- Sortierlogik bleibt auf dem b337-Rollback-Pfad.
- Gruppen-Farben bleiben beim Verschieben materialisiert und wandern mit.
