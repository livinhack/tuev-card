# b346 – Card Editor Preview Columns / Popup Stability Fix

## Zweck

b346 ist ein gezielter Card-/Editor-Fix nach b344. Der Nummernschildrenderer bleibt eingefroren; es geht nur um Preview-/Editmodus-Stabilität und Floating-Panel-Bedienung.

## Änderungen

- Grafischer und textueller Kennzeichenmodus nutzen im Editor denselben Spalten-Simulationspfad.
- Die Checkbox **Kennzeichen grafisch darstellen** verändert die Fahrzeugdarstellung, aber nicht mehr die Preview-Spaltenentscheidung.
- Die Textmodus-Stabilisierung aus b341 bleibt über feste Textkennzeichen-Zeilenhöhe und Mindesthöhe erhalten.
- Für Dashboard-Editmodus/Abschnitte gibt es einen konservativen Breiten-Fallback: normale Dashboard-Anzeige bleibt elementgebunden, erkannter Editmodus darf nahe Parentbreiten als Korrektur nutzen.
- Floating-Panels schließen zuverlässiger per `pointerdown`/`click` außerhalb sowie per `Escape`.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-Logik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration

## Check

- `check:card-editor-preview-popup-stability`
