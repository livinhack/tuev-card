# TÜV Reminder Card - Übergabeprotokoll b92

## Kurzstand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration `tuev_reminder`.
- Neuer Stand: `0.1.1-b92`.
- Neuer ZIP-Name: `tuev-card-full-b92-plate-spacing-and-seals.zip`.
- Ausgangspunkt: `tuev-card-full-b91-law-plate-inner-border-width-bands.zip`.
- Fokus b92: einzeiligen Kennzeichenrenderer weiter an Anlage-4-Maßlogik annähern: Zeichenabstände, Gruppentrennung, EU-Feldhöhe und Plaketten-/Siegelgröße/-position.

## Direkt vor b92 bestätigte Punkte

- b79 Overlay in Einzelspalte: bestanden.
- b82 Editor-Gruppenfunktionen: bestanden.
- b81 Floating Panels / Sortier-Bestätigungsdialog: bestanden.
- b82 Button-Aktivzustände und „Alle hinzufügen“: bestanden.
- b83 README auf Endnutzer-Level: erledigt.
- b87 HACS-Auslieferung über `dist/`: bestätigt, Fonts kommen nach Update über HACS im Card-Ordner an.
- b90 Kennzeichenrenderer-Neuaufbau: sichtbar besser als b88, aber noch zu grob.
- b91 Außen-/Innenmaßmodell und Breitenstufen: sichtbar besser; weiterhin falsch waren Zeichenabstände sowie Größe/Position der Siegel.

## Wichtige Entscheidungen bis b92

### Renderer-Grundsatz

Der Kennzeichenrenderer soll für den einzeiligen Standardfall nicht mehr über alte EuroPlate-/Preview-Geometrien optimiert werden, sondern in mm-Koordinaten aus einem normnahen Anlage-4-Modell aufgebaut werden.

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

## Was b92 geändert hat

### `src/plate/renderer.js`

b92 korrigiert die einzeilige Geometrie weiter:

```text
Außenmaß:                         520 mm max. × 110 mm
Randband:                         4,5 mm innerhalb des Außenmaßes
weiße Fläche:                     ca. 101 mm hoch
EU-Feld:                          45 × 98 mm, vertikal zentriert
Mindestabstand seitlich:          8 mm
Zeichenabstand:                   ca. 8,5 mm
Abstand Buchstaben-/Ziffernblock: ca. 26 mm
Plaketten-/Siegelzone:            65,5 mm
HU-Plakettenplatz:                35 mm Durchmesser
Behördensiegelplatz:              45 mm Durchmesser
```

#### Recognition-Splitting

Der Erkennungsnummernteil wird jetzt vor dem Rendern segmentiert:

```text
CI500   -> CI + 500
GT500   -> GT + 500
DE13H   -> DE + 13 + H
EV204E  -> EV + 204 + E
```

Zwischen diesen Segmenten wird ein größerer Gruppenabstand gesetzt. Dadurch wirken `CI500`, `GT500`, `DE13H` oder `EV204E` nicht mehr wie eine zusammengeklebte Zeichenkette.

#### Siegelzone

Statt kleiner 20,5-mm-Kreise aus b91 verwendet b92 jetzt:

- HU-Plakettenplatz: 35 mm
- neutraler Behördensiegelplatz: 45 mm
- beide übereinander in einer festen 65,5-mm-Zone zwischen Unterscheidungszeichen und Erkennungsnummer.

#### Zeichenabstände

Die Einzelzeichen werden weiterhin einzeln gerendert, aber die Zusatzabstände liegen jetzt näher an den Anlage-4-Abständen. Die Font-Messung per Canvas bleibt erhalten, damit GL-Mittelschrift/Engschrift real gemessen werden können.

### `docs/B92_PLATE_SPACING_AND_SEALS.md`

Neue Detaildoku für die b92-Änderungen.

### `docs/RELEASE_CHECK.md`

Auf b92 aktualisiert.

### Versionierung

- `package.json`: `0.1.1-b92`
- `package-lock.json`: `0.1.1-b92`
- `src/**/*.js`: Import-Querymarker `?v=b92`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b92`
- `dist/tuev-card.js`: `// TÜV Card bundled b92`

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

## Testanweisung für b92

1. b92 in den lokalen GitHub-Ordner übernehmen, ohne lokale `.ttf`-Dateien aus `fonts/` zu löschen.
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

## Erwartete b92-Wirkung

- Zeichen innerhalb eines Blocks haben mehr Luft.
- Zwischen Buchstaben- und Ziffernblock der Erkennungsnummer ist ein klarer größerer Abstand sichtbar.
- HU- und Behördensiegelplatz sind deutlich größer und normnäher.
- Die Siegelzone sitzt als feste Zone zwischen Ortskennung und Erkennungsnummer.
- b91-Breitenstufen und b91-Card-Skalierung bleiben erhalten.

## Aktuelle Todo-Liste nach b92

### Direkt als nächstes

1. b92 visuell in Home Assistant prüfen.
2. Falls nötig b93-Feintuning:
   - exakte Baseline der GL-Schrift
   - tatsächliche GL-Glyphbreiten vs. Anlage-4-Muster
   - Siegel-Y-Positionen bei kleinen Darstellungsgrößen
   - Eurofeld-Stern/D-Optik
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
