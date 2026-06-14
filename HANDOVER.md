# TÜV Reminder Card - Übergabeprotokoll b78

## Projektkontext

- Projekt: Home Assistant Custom Card / Integration „TÜV Reminder“
- Aktueller Schwerpunkt: `tuev-card`, insbesondere Gruppen-/Editor-Darstellung und kleine UI-Feinschliffe.
- Code, Dateinamen und Funktionen bleiben grundsätzlich Englisch.
- Deutsche UI-Texte werden über Übersetzungen/Lokalisierung gelöst.
- ZIP-Versionierung wird fortlaufend weitergezählt.
- Ab b77/b78 soll jedes neue ZIP ein vollständiges Übergabeprotokoll enthalten.

## Version / Stand

- Vorheriger Arbeitsstand: `tuev-card-full-b77-editor-group-layout-handover.zip`
- Tatsächlich erkannte Version im Input: `0.1.1-b77`
- Neuer Stand: `0.1.1-b78`
- Neuer ZIP-Name: `tuev-card-full-b78-single-column-stamp-scale.zip`

## Stabile Grundlagen, die nicht unnötig geändert werden sollen

- Frühere stabile Basis: `tuev-card-full-a91-cleanup.zip`
- Danach b-Versionen; aktueller Arbeitszweig ist b-Serie.
- Kennzeichenrenderer ist grundsätzlich stabil.
- Grafische Kennzeichen sind nur verfügbar, wenn die benötigte Schrift vorhanden ist.
- Kein Systemschrift-Fallback für grafische Kennzeichen.
- TÜV-Plakettenrenderer nicht unnötig ändern.
- Alte Plaketten-/Ziffern-Experimente nach „Zentrierung sieht gut aus“ bleiben verworfen, bis neue SVG-Daten vorliegen.
- Gruppenabhängige Färbung der Buttons/Badges ist gut und soll nicht grundsätzlich umgedacht werden.

## Ausgangslage b77

b77 enthielt insbesondere:

- Reparatur des Schalters `Kleine Gruppen nebeneinander`.
- Verschiebung dieser Option in den globalen Darstellungsdialog.
- Stabilisierung des Klickverhaltens, damit `Zur Gruppe hinzufügen` nicht durch Floating-Panel-Schließen verschluckt wird.
- Zusätzlicher `Gruppe hinzufügen`-Button unten ab 3 Gruppen.
- Erstes vollständiges `HANDOVER.md` im ZIP.

## Anlass für b78

Der Nutzer meldete anhand eines Screenshots:

- Das rote/grüne TÜV-abgelaufen-/HU-bestanden-Stempeloverlay ist in der 1-Spalten-Darstellung zu klein im Verhältnis zum verfügbaren Platz.
- Die 2-, 3- und 4-Spalten-Darstellung wirken inzwischen gut und sollen möglichst nicht verändert werden.

## Was b78 ändert

### Single-column stamp overlay scale

Datei: `src/card/render-parts.js`

Änderung:

- `renderCompactConfirmPanel()` unterscheidet jetzt zusätzlich den Fall:
  - `badgeCompactText`: Badge sichtbar + kompakte/multicolumn Darstellung.
  - `badgeSpaciousText`: Badge sichtbar + nicht kompakte 1-Spalten-Darstellung.
- Nur für `badgeSpaciousText` wurden folgende Werte vergrößert:
  - Schriftgröße des roten Warnstempels.
  - Schriftgröße des grünen Aktionsstempels.
  - Mindestbreiten.
  - Padding.
  - Abstand zwischen rotem und grünem Stempel.
  - Maximalbreite des Overlay-Containers.
  - Checkbox/Icon-Größe im grünen Stempel.
  - leichte X-Verschiebung des grünen Stempels passend zur größeren Darstellung.

Ziel:

- In 1 Spalte nutzt der Dialog mehr der verfügbaren Plakettenfläche.
- 2/3/4-Spalten bleiben durch die bestehende kompakte Logik praktisch unverändert.

## Betroffene Dateien in b78

- `package.json`
  - Version auf `0.1.1-b78`
- `package-lock.json`
  - Version auf `0.1.1-b78`
- `src/card/render-parts.js`
  - neue `badgeSpaciousText`-Größenlogik für den Stempeloverlay.
- `src/**/*.js`
  - Import-Cachebuster auf `?v=b78` aktualisiert.
- `tuev-card.js`
  - Bundle neu gebaut.
- `docs/B78_SINGLE_COLUMN_STAMP_SCALE.md`
  - Versionsdokumentation.
- `HANDOVER.md`
  - vollständiges Übergabeprotokoll aktualisiert.

## Bewusst nicht geändert

- `src/badge/*`: keine Änderung am TÜV-Plakettenrenderer.
- `src/plate/*`: keine Änderung am Kennzeichenrenderer oder an der Font-/EuroPlate-Logik.
- Gruppenlayout-Logik aus b75-b77 nicht umgebaut.
- Editor-Floating-Panels nicht erneut angefasst.

## Tests ausgeführt

```bash
node --check src/card/render-parts.js
npm run check
npm run build
```

Alle genannten Prüfungen liefen erfolgreich.

## Was als Nächstes manuell getestet werden soll

1. Eine 1-Spalten-Card mit sichtbarer TÜV-Plakette und `expired`/`due` Zustand öffnen.
   - Erwartung: roter und grüner Stempel sind spürbar größer und füllen den verfügbaren Bereich harmonischer aus.
2. Zwei-Spalten-Darstellung prüfen.
   - Erwartung: Stempel wirkt weiterhin wie in b77 und läuft nicht über.
3. Drei- und Vier-Spalten-Darstellung prüfen.
   - Erwartung: keine Verschlechterung, keine übergroßen Stempel.
4. Klick auf `HU bestanden?` in 1 Spalte prüfen.
   - Erwartung: Button bleibt bedienbar und die bestehende Aktualisierungsanimation bleibt erhalten.
5. Kurz prüfen, ob die b77-Editor-Fixes weiterhin funktionieren:
   - `Kleine Gruppen nebeneinander` mehrfach ein-/ausschalten.
   - `Zur Gruppe hinzufügen` sollte beim ersten Klick reagieren.

## Offene / spätere Punkte

- Falls die 1-Spalten-Stempel jetzt zu groß oder noch zu klein wirken, nur die `badgeSpaciousText`-Werte in `src/card/render-parts.js` feinjustieren.
- Kennzeichen-Rendering zwischen Firefox, Chrome und Android-App später umfassender prüfen.
- Preview-Darstellung später eventuell an aktuelles Kennzeichenrendering angleichen.
- Keine größeren Renderer-Refactors als Nebenänderung einschleusen.
- Gruppen nebeneinander nach Praxistest ggf. weiter feinjustieren.
- Falls Chatlimit erneut erreicht wird: In neuem Chat mit diesem `HANDOVER.md` und dem neuesten ZIP fortsetzen.
