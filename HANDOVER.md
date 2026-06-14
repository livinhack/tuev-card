# TÜV Reminder Card - Übergabeprotokoll b90

## Aktueller Stand

- Projekt: Home Assistant Dashboard Card `tuev-card` für TÜV Reminder.
- Aktueller Arbeitsstand: `0.1.1-b90`.
- ZIP-Name: `tuev-card-full-b90-law-based-plate-renderer-rebuild.zip`.
- Schwerpunkt b90: Kennzeichenrenderer in der Card von Grund auf neu aufbauen, basierend auf FZV-Anlage-4-Maßmodell plus unseren Skalierungs- und Siegelregeln.

## Direkt vor b90 bestätigte Punkte

- b79 Overlay final geprüft: bestanden.
- b82 Editor-Gruppenfunktionen, Buttonzustände und „Alle hinzufügen“: bestanden.
- b81/b82 Floating Panels und Sortier-Bestätigungsdialog: bestanden.
- b87 HACS-Auslieferung über `dist/` funktioniert: bestätigt.
- b88 Renderer war optisch nicht brauchbar.
- b89 hatte die Card deshalb wieder auf den alten kompakten Renderer zurückgesetzt und ein separates Renderer-Lab angelegt.
- Nutzer meldete danach: In der Card ist alles wie vor der Änderung; der Kennzeichenrenderer soll komplett neu auf Basis der FZV-Anlage 4 und unserer Skalierungs-/Siegelregeln aufgebaut werden.

## Wichtige Grundentscheidungen

- Code/Dateien/Funktionen bleiben grundsätzlich Englisch.
- Deutsche UI-Texte laufen nur über Übersetzung/Lokalisierung.
- Kein Systemschrift-Fallback für grafische Kennzeichen.
- GL-Nummernschild ist der bevorzugte Font.
- Fonts sollen bei echter HACS-Nutzung über `dist/fonts/` mit ausgeliefert werden.
- Chat-ZIPs enthalten weiterhin keine Font-Binärdateien.
- Große TÜV-Plakette und alter Plakettenrenderer werden nicht nebenbei verändert.
- Echte Behörden-/Landessiegelgrafiken, Wappen, Druckstücknummern oder amtliche Sicherheitsmerkmale werden nicht nachgebildet.
- Behördensiegelstelle: generischer grau/silberner Platzhalter.
- HU-Stelle: kleine generische TÜV-Reminder-Plakette/Farbfläche, bevorzugt mit Jahr/Monat.

## Was b90 geändert hat

### `src/plate/renderer.js`

Der Renderer wurde neu geschrieben. Alte visuelle Profilwerte wie `EURO_PLATE_GEOMETRY`, `GL_MTL_PLATE_GEOMETRY`, Preview-Tuning und alte Character-Width-Tabellen wurden entfernt.

Neue Basis:

- Koordinaten in Millimetern.
- Einzeiliges Standardkennzeichen als FZV-Anlage-4-Modell:
  - maximale Breite 520 mm
  - Höhe 110 mm
  - Randbreite 3 mm
  - Eurofeld als physischer Bereich
  - Mittelschrift 75 mm
  - Engschrift 75 mm nur, wenn Mittelschrift nicht passt
- Parser trennt Kennzeichen in:
  - Ortskennung / Prefix
  - Erkennungsnummer / Recognition
- Wenn Prefix und Recognition vorhanden sind, wird dazwischen eine Siegelspalte gerendert.
- Inhalt wird zwischen Eurofeld und rechter Kante zentriert.
- Behördensiegel ist neutral grau/silbern.
- HU-Siegel nutzt `tuevColorForYear(year)` und Month/Rotation aus dem Fahrzeug.
- Textbreiten werden im Browser per Canvas mit GL-Font gemessen; falls das nicht verfügbar ist, greift eine deterministische Ersatzmessung.
- Renderer gibt SVG mit physischem `viewBox` aus und skaliert nur über den von der Card gelieferten gemeinsamen Scale.

### `src/tuev-card-entry.js`

- Source-Kommentar auf b90 aktualisiert.
- Import-Queries auf `?v=b90` aktualisiert.
- `huMonth` wird jetzt zusätzlich an `renderLicensePlate()` übergeben.

### Versionierung/Build

- `package.json`: `0.1.1-b90`
- `package-lock.json`: `0.1.1-b90`
- `src/**/*.js`: `?v=b90`
- `dist/tuev-card.js`: `// TÜV Card bundled b90`

## Nicht geändert

- Card-Gruppenlayout.
- Editorlogik.
- Floating Panels.
- Sortier-Bestätigungsdialog.
- großer TÜV-Plakettenrenderer.
- HACS `dist/`-Struktur.
- Fontloader-Pfade.
- README-Endnutzerstil.
- `tools/plate-renderer-lab/` bleibt als separates Experiment/Lab erhalten.

## Font-/HACS-Regel

Lokaler Repo-Ordner soll die Fontdateien enthalten:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

Beim Build werden sie nach `dist/fonts/` kopiert:

```text
dist/fonts/GL-Nummernschild-Mtl.ttf
dist/fonts/GL-Nummernschild-Eng.ttf
```

HACS liefert die Card aus `dist/` aus. Erwarteter Pfad in Home Assistant:

```text
/config/www/community/tuev-card/tuev-card.js
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

Erwartete URL:

```text
/hacsfiles/tuev-card/tuev-card.js
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

## Testanweisung für b90

1. b90 in lokalen GitHub-Ordner übernehmen.
2. Lokale `.ttf`-Dateien in `fonts/` behalten.
3. `npm run build` ausführen.
4. Prüfen, ob `dist/fonts/` die Fontdateien enthält.
5. Commit + Push.
6. In HACS neu herunterladen/Redownload.
7. Dashboard prüfen.

Konkrete Kennzeichen zum Testen:

```text
WIL CL 212
BKS R 95
WIL LM 216
WIL LC 122
TR A 77
S AB 1234
DA CI 500
WIL DE 13H
BN FR 248
K S 70
HH EV 204E
MY KA 84
B EQ 203E
TR M 6
BIT GT 500
WI MX 55
```

Besonders prüfen:

- vier Spalten: gleiche Kennzeichenhöhe innerhalb der Card
- zwei Spalten: keine abgeschnittenen Kennzeichen
- eine Spalte: Kennzeichen darf groß werden, soll aber nicht absurd wirken
- Siegelspalte zwischen Ortskennung und Erkennungsnummer
- HU-Farbpunkt/Kleinstplakette sichtbar, aber nicht amtlich wirkend
- Engschrift nur bei sehr langen Kennzeichen

## Wahrscheinlich nächster Schritt

b91 wird sehr wahrscheinlich visuelles Feintuning des neuen Maß-Renderers:

- Text-Y/Baseline
- Eurofeldposition
- Siegelspaltenbreite
- HU-/Behördensiegelgröße
- Mindestbreiten für kurze Kennzeichen
- ggf. optisches Verhältnis in 1-Spalten-Darstellung

## Weiterhin offene spätere Themen

- Renderer-Lab und Card-Renderer zusammenführen oder klarer trennen.
- Zweizeilige Kennzeichen in die Card übernehmen.
- Saisonkennzeichen.
- Wechselkennzeichen.
- grüne Kennzeichen.
- optionale Ausblendung der großen TÜV-Plakette / Compact-Mode.
- Renderer-Stabilität Firefox/Chrome/Android grundsätzlich prüfen.
- Integration Architektur V3.

## Fortsetzungshinweis für neuen Chat

Bitte mit `tuev-card-full-b90-law-based-plate-renderer-rebuild.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. Stand: b79 Overlay bestanden, b82 Editor-/Gruppen-/Buttonzustände bestanden, b87 HACS `dist/` bestätigt, b88 Renderer verworfen, b89 Lab/Restore, b90 neuer Card-Kennzeichenrenderer nach FZV-Anlage-4-Maßmodell. Nächster sinnvoller Schritt: b90 anhand Screenshots testen und b91 als visuelles Feintuning des neuen Maß-Renderers bauen. Große TÜV-Plakette nicht unnötig ändern. Systemschrift-Fallback bleibt ausgeschlossen. Echte amtliche Siegelgrafiken bleiben out of scope.
