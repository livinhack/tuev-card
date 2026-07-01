# b341 – Card Text Preview Stability

Status: Fix-Checkpoint nach b340.

## Anlass

Beim Abwählen von „Kennzeichen grafisch darstellen“ wurde korrekt auf Text-Kennzeichen umgeschaltet, die Home-Assistant-Editor-Preview begann aber zu zittern.

## Änderung

- Text-Kennzeichen bleiben im Editor-Preview-Kontext außerhalb der simulierten Multi-Column-Preview-Skalierung.
- Der Text-Kennzeichenblock erhält eine feste `line-height` und `min-height`, damit der Wechsel zwischen Mess-/Renderzyklen keine Höhenoszillation auslöst.
- Die Änderung betrifft nur den nicht-grafischen Textmodus im Editor-Preview-Kontext.

## Nicht geändert

- keine Sortierlogik
- keine Kennzeichen-Geometrie
- keine HU-Logik
- keine Wechselkennzeichen-Geometrie
- keine Reminder-Integration
- keine Fontpfade

## Checks

- `check:card-editor-text-preview-stability`
- kompletter `npm run check`
- `npm run build`
