# TÜV Reminder Card b344

Full/Card handover ZIP for **b344 Card Final Release Audit**.

## Inhalt

b344 ist ein finaler Card-Release-/Doku-Audit nach b343. Es wurden keine neuen Features eingebaut, sondern der aktuelle Card-Stand für den nächsten Integrationsschritt vorbereitet.

- README/HANDOVER auf den aktuellen b344-Stand gebracht.
- Neuer Release-Audit-Check ergänzt: `check:card-final-release-audit`.
- Neue Doku ergänzt: `docs/B344_CARD_FINAL_RELEASE_AUDIT.md`.
- Card-/Editor-/Renderer-Cachemarker auf b344 aktualisiert.
- Security-/Timer-Cleanup aus b343 bleibt geschützt.
- Font-/HACS-Hinweise bleiben sichtbar dokumentiert.
- Reminder-Integration bleibt ausdrücklich ein späterer End-to-End-Schritt mit aktuellem Reminder-ZIP.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-/TÜV-Plakettenlogik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- keine neuen Card-Features
- kein Buildsystem-/Lit-/Vite-/Rollup-Refactor
- kein Legacy-/Umschalter

## Aktueller Status

Der Nummernschildrenderer ist Card-seitig vorbereitet/eingefroren. b344 ist der aktuelle Card-Final-Release-Audit-Stand, bevor später das aktuelle Reminder-ZIP analysiert und die echten End-to-End-Datenpfade ergänzt/getestet werden.

## Checks

- `npm run check`
- `npm run build`

## Hinweis Fonts

Die ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein und beim Build nach `dist/fonts/` gespiegelt werden:

- `fonts/GL-Nummernschild-Mtl.ttf`
- `fonts/GL-Nummernschild-Eng.ttf`

Die in diesem ZIP enthaltenen README-/Lizenz-/Platzhalterdateien ersetzen die Font-Binaries nicht.

## Beibehaltene Card-Fixes

- Option **Kennzeichen grafisch darstellen** bleibt wirksam.
- Sortierlogik bleibt auf dem zurückgesetzten b337-Fluss.
- Gruppen-Farben bleiben beim Verschieben materialisiert und wandern mit.
- Eurofeld/Rahmen-Fix bleibt erhalten.
- Plattenfarbe für Rahmen/Text/W/Zusatzschild bleibt vereinheitlicht.
- b343-Sicherheitsfixes bleiben aktiv: HTML-Escaping, toter Font-Timer entfernt, Confirm-Timeouts verwaltet.
