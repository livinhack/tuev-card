# Handover – b341 Card Text Preview Stability

Current stand: **b341**.

## Anlass

Nach b340 funktionierte das Abwählen von **Kennzeichen grafisch darstellen** grundsätzlich: Die grafischen Kennzeichen verschwanden und Text wurde angezeigt. Die Editor-Preview begann dabei aber zu zittern.

## Ursache / Einordnung

Der Fontcheck war nach b339/b340 nicht mehr die wahrscheinliche Ursache. Der Fehler lag im Preview-Layout: Der Textmodus hat keinen festen SVG-Kennzeichenblock. In HA's Editor-Preview konnte die simulierte Multi-Column-Preview-Skalierung dadurch auf ihre eigene Höhenänderung reagieren und wiederholt neu messen/rendern.

## Änderung in b341

- In `src/tuev-card-entry.js` wird im Editor-Preview-Kontext bei `plate_style !== "plate"` keine simulierte Preview-Skalierung mehr verwendet.
- In `src/card/render-parts.js` bekommt der Text-Kennzeichenblock feste `line-height` und `min-height`.
- Neuer Check: `check:card-editor-text-preview-stability`.
- Cache-/Versionsmarker auf b341 aktualisiert.

## Beibehalten aus b340/b339

- Sortierlogik bleibt auf dem b337-Rollback-Stand aus b340.
- Integrierte GL-Fonts werden als Release-Assets behandelt; keine asynchronen Fontchecks im Editor.
- Checkbox **Kennzeichen grafisch darstellen** bleibt wirksam.
- Gruppenfarben-Mitnahme beim Verschieben bleibt aktiv.
- Eurofeld/Rahmen-Overlay-Fix bleibt aktiv.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-Logik
- keine Wechselkennzeichen-Geometrie
- keine Reminder-Integration
- kein Legacy-Renderer

## Checks

- Lab: `npm run check` bestanden
- Full/Card: `npm run check` bestanden
- Full/Card: `npm run build` bestanden

## ZIPs

- `plate-physical-lab-b341-card-text-preview-stability.zip`
- `tuev-card-full-b341-card-text-preview-stability-handover.zip`

## Hinweis

Die ChatGPT-ZIPs enthalten weiterhin keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein.

No plate geometry changed. Later Reminder integration remains separate.
