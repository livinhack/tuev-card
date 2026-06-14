# TÜV Reminder Card - Übergabeprotokoll b93

## Kurzstand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration `tuev_reminder`.
- Neuer Stand: `0.1.1-b93`.
- Neuer ZIP-Name: `tuev-card-full-b93-plate-anlage4-grid-euro-edge.zip`.
- Ausgangspunkt: `tuev-card-full-b92-plate-spacing-and-seals.zip`.
- Fokus b93: aktiven Card-Kennzeichenrenderer weiter vom geratenen Fontmaß lösen und auf ein explizites Anlage-4-Raster für den einzeiligen Standardfall setzen.

## Direkt vor b93 bestätigte Punkte

- b79 Overlay in Einzelspalte: bestanden.
- b82 Editor-Gruppenfunktionen: bestanden.
- b81 Floating Panels / Sortier-Bestätigungsdialog: bestanden.
- b82 Button-Aktivzustände und „Alle hinzufügen“: bestanden.
- b83 README auf Endnutzer-Level: erledigt.
- b87 HACS-Auslieferung über `dist/`: bestätigt, Fonts kommen nach Update über HACS im Card-Ordner an.
- b90 Kennzeichenrenderer-Neuaufbau: sichtbar besser als b88, aber noch zu grob.
- b91 Außen-/Innenmaßmodell und Breitenstufen: sichtbar besser; Höhe/Randmodell besser.
- b92 Zeichen-/Siegelabstände: etwas besser, aber weiterhin sichtbar geraten; Eurofeld-Lichtkante unschön.

## Wichtige Entscheidungen bis b93

### Renderer-Grundsatz

Der Kennzeichenrenderer soll für den einzeiligen Standardfall nicht mehr über alte EuroPlate-/Preview-Geometrien optimiert werden, sondern in mm-Koordinaten aus einem Anlage-4-Modell aufgebaut werden.

b93 setzt dafür in der Card nicht mehr auf Canvas-/Browser-Glyphbreiten für die Layoutabstände, sondern auf feste Anlage-4-Layoutzellen. Die Glyphen der GL-Fonts werden in diesen Zellen zentriert.

### Amtliche Siegelgrafik

- echte Maße und Positionen: ja
- echte Behörden-/Landessiegelgrafik: nein
- neutrale Platzhalter/Siegelkreise: ja
- HU-Plakette als TÜV-Reminder-Element: ja

Der Behördensiegelplatz bleibt generisch grau/silbern. Es wird kein reales Wappen, keine Druckstücknummer und keine echte amtliche Siegelgrafik nachgebaut.

### Font / HACS

Ab b87 liefert HACS über `dist/` aus. Die lokalen GitHub-Fontdateien müssen im echten Repo liegen:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

Beim Build werden sie nach `dist/fonts/` gespiegelt. Das Chat-ZIP enthält weiterhin keine Font-Binärdateien.

## Was b93 geändert hat

### `src/plate/renderer.js`

b93 korrigiert die aktive einzeilige Geometrie weiter:

```text
Außenmaß:                         520 mm max. × 110 mm
Randband:                         4,5 mm innerhalb des Außenmaßes
weiße Fläche:                     ca. 101 mm hoch
Eurofeld-Breite:                  45 mm
Eurofeld-Höhe im Renderer:         volle innere Höhe, um die weiße Lichtkante zu entfernen
Mindestabstand seitlich:          8 mm
Buchstaben-Zelle Mittelschrift:   47,5 mm
Ziffern-Zelle Mittelschrift:      44,5 mm
Zeichenabstand:                   8 mm
Abstand Buchstaben-/Ziffernblock: 24 mm
Plaketten-/Siegelzone:            65,5 mm
HU-Plakettenplatz:                35 mm Durchmesser
Behördensiegelplatz:              45 mm Durchmesser
```

#### Anlage-4-Raster statt Canvas-Breite

Vor b93 wurden GL-Glyphbreiten per Canvas gemessen und daraus die Zeichenpositionen berechnet. Das führte bei schmalen Zeichen wie `I` zu zu engen Abständen.

b93 verwendet feste Layoutzellen:

- jeder Buchstabe bekommt in Mittelschrift 47,5 mm Layoutbreite;
- jede Ziffer bekommt in Mittelschrift 44,5 mm Layoutbreite;
- Engschrift hat eigene schmalere Layoutzellen;
- die GL-Glyphe wird in der Zelle zentriert;
- es wird kein `textLength`/`lengthAdjust` mehr zum künstlichen Strecken der Glyphen verwendet.

#### Eurofeld

Das Eurofeld füllt jetzt die innere Höhe. Dadurch verschwindet die bisher sichtbare weiße Lichtkante um das blaue Feld. Das ist bewusst eine optische Anpassung an typische reale Kennzeichen, während Breite und übriges Raster erhalten bleiben.

#### Siegel-Y-Positionen

Die Siegelpositionen werden jetzt als absolute mm-Positionen im 110-mm-Außenmaß berechnet:

```text
HU-Mitte:          13 + 35/2 = 30,5 mm
Behörden-Mitte:   110 - 13 - 45/2 = 74,5 mm
```

Damit ist der 4,5-mm-Rand nicht versehentlich ein zweites Mal in die Y-Position eingerechnet.

### `docs/B93_PLATE_ANLAGE4_GRID_AND_EURO_EDGE.md`

Neue Detaildoku für b93.

### Versionierung

- `package.json`: `0.1.1-b93`
- `package-lock.json`: `0.1.1-b93`
- `src/**/*.js`: Import-Querymarker `?v=b93`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b93`
- `dist/tuev-card.js`: `// TÜV Card bundled b93`

## Nicht geändert

- Keine Editor-/Floating-Panel-Funktionsänderung.
- Keine Gruppenlayout-Änderung.
- Keine große TÜV-Plakettenrenderer-Änderung.
- Keine alten Plaketten-/Ziffern-Experimente übernommen.
- Keine Systemschrift als grafischer Kennzeichenfallback.
- Keine echten amtlichen Behörden-/Landessiegelgrafiken.
- Keine Integration neuer Sonderkennzeichenarten in die Card-Config.
- Keine Font-Binärdateien im Chat-ZIP.

## Build- und Prüfanweisungen

Im lokalen GitHub-Repository:

```bash
npm run build
npm run check
```

Danach commit/push und in HACS Redownload/Update.

## Testanweisung für b93

1. b93 in den lokalen GitHub-Ordner übernehmen, ohne lokale `.ttf`-Dateien aus `fonts/` zu löschen.
2. `npm run build` und `npm run check` ausführen.
3. Prüfen, ob `dist/fonts/` die beiden Fontdateien enthält.
4. Commit + Push.
5. HACS Redownload/Update.
6. Dashboard hart neu laden.
7. Screenshots mit diesen Kennzeichen prüfen:

```text
WIL CL 212
BKS R 95
WIL LM 216
TR A 77
S AB 1234
DA CI 500
WIL DE 13H
HH EV 204E
K S 70
TR M 6
BIT GT500
5
```

## Erwartete b93-Wirkung

- Eurofeld ohne weiße Lichtkante.
- `CI500`, `GT500`, `DE13H`, `EV204E` sollten sichtbarer nach Anlage-4-Zellen getrennt wirken.
- Schmale Zeichen wie `I` sollten nicht mehr den gesamten nachfolgenden Abstand zusammenziehen.
- HU- und Behördensiegelplatz sollten vertikal weniger zu tief sitzen.
- b91-Breitenstufen und b91-Card-Skalierung bleiben erhalten.

## Aktuelle Todo-Liste nach b93

### Direkt als nächstes

1. b93 visuell in Home Assistant prüfen.
2. Falls nötig b94-Feintuning:
   - exakte Baseline der GL-Schrift;
   - optische Schriftgröße innerhalb der 75-mm-Zellen;
   - Siegel-X-Position innerhalb der 65,5-mm-Zone;
   - Eurofeld-Stern/D-Optik;
   - ggf. HU-Plakette als einfache farbige Fläche statt Mini-Plakette.
3. Wenn einzeilig stabil ist, Renderer-Lab und Card-Kern wieder angleichen.

### Danach

1. Zweizeilige Kennzeichen als eigenes physisches Modell.
2. Kraftradkennzeichen als eigenes physisches Modell.
3. Saisonkennzeichen.
4. E-/H-Suffix-Regeln sauberer modellieren.
5. Wechselkennzeichen.
6. Grüne Kennzeichen.
7. Option TÜV-Plakette ausblenden / Compact-Card.
8. Integration Architektur V3.

## Wichtige Warnungen für Folgechats

- Renderer nicht wieder mit alten EuroPlate-/Preview-Profilen vermischen.
- Große TÜV-Plakette nicht nebenbei anfassen.
- Systemschrift-Fallback für grafische Kennzeichen bleibt ausgeschlossen.
- Code/Funktionsnamen auf Englisch halten; deutsche UI-Texte nur über Übersetzungen.
- Bei jedem neuen ZIP Versionsnummer weiterzählen und `HANDOVER.md` vollständig aktualisieren.
