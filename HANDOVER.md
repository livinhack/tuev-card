# Handover – b344 Card Final Release Audit

Current stand: **b344**.

## Basis

b344 baut auf **b343 Card Security / Timer Cleanup** auf.

## Ziel

b344 ist kein Funktionsschritt, sondern ein finaler Card-Release-/Doku-Audit vor der späteren Reminder-Integration.

Die Card soll jetzt als weitgehend fertig vorbereiteter Stand behandelt werden. Der nächste große Block ist nicht mehr Card-Renderer-Refactoring, sondern später:

1. aktuelles Reminder-ZIP analysieren
2. fehlende Reminder-Daten/Optionen anbinden
3. echte End-to-End-Tests durchführen

## Änderung in b344

- README/HANDOVER auf b344 aktualisiert.
- Neue Doku: `docs/B344_CARD_FINAL_RELEASE_AUDIT.md`.
- Neuer Check: `check:card-final-release-audit`.
- Card-/Editor-/Renderer-Cachemarker auf b344 aktualisiert.
- Release-/Font-/HACS-Hinweise klarer zusammengefasst.
- Offene spätere Reminder-End-to-End-Punkte ausdrücklich getrennt von der Card-Finalisierung dokumentiert.
- Security-/Timer-Cleanup aus b343 bleibt durch Checks geschützt.

## Nicht geändert

- keine Kennzeichen-Geometrie
- keine HU-Plakettenlogik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- keine neuen Features
- kein Legacy-/Umschalter
- kein Vite-/Rollup-/Lit-Umbau

## Neue/aktualisierte Checks

- `check:card-final-release-audit`
- bestehende b343/b342 Boundary-/Smoke-/Security-Checks bleiben aktiv.

## Durchgeführte Checks

- Lab: `npm run check`
- Full/Card: `npm run check`
- Full/Card: `npm run build`

## Artefakte

- `plate-physical-lab-b344-card-final-release-audit.zip`
- `tuev-card-full-b344-card-final-release-audit-handover.zip`

## Aktueller Arbeitsstand

b344 ist der aktuelle Card-Final-Release-Audit-Stand.

Der Nummernschildrenderer bleibt Card-seitig vorbereitet/eingefroren. Weitere Änderungen daran nur bei echten Bugs oder nach Reminder-End-to-End-Test.

## Später mit Reminder-ZIP prüfen

Einige Fälle sind Card-seitig vorbereitet, können aber erst mit dem aktuellen Reminder-ZIP realistisch end-to-end geprüft werden:

- fahrzeugbezogene Wechselkennzeichen-Daten
- grün/E/H/Saison als Reminder-/Fahrzeugdaten
- HU-Jahr, HU-Monat, Status und Rotation über echte Integration
- endgültige Service-/Confirm-Flüsse gegen aktuelle Reminder-API

## Font-/HACS-Hinweis

Die ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal im Release vorhanden sein und beim Build nach `dist/fonts/` gespiegelt werden.

## Beibehaltene Editor-/Card-Fixes

- Sortierlogik bleibt bewusst auf dem b337-Rollback-Fluss.
- Gruppen-Farben bleiben beim Verschieben materialisiert und wandern mit der Gruppe.
- Option **Kennzeichen grafisch darstellen** bleibt wirksam.
