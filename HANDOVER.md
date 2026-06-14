# TÜV Reminder Card - Übergabeprotokoll b89

## Kurzstand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration `tuev_reminder`.
- Neuer Stand: `0.1.1-b89`.
- Neuer ZIP-Name: `tuev-card-full-b89-plate-renderer-law-lab.zip`.
- Ausgangspunkt: `tuev-card-full-b88-physical-plate-renderer-v2.zip`.
- Fokus b89: b88-Renderer nicht weiter in der Card verschlimmern, sondern einen unabhängigen Live-Server-Kennzeichenrenderer nach FZV-Anlage-4-Regelbasis aufbauen.

## Direkt vor b89 bestätigte Punkte

- b79 Overlay in Einzelspalte: bestanden.
- b82 Editor-Gruppenfunktionen: bestanden.
- b81 Floating Panels / Sortier-Bestätigungsdialog: bestanden.
- b82 Button-Aktivzustände und „Alle hinzufügen“: bestanden.
- b83 README auf Endnutzer-Level: erledigt.
- b87 HACS-Auslieferung über `dist/`: bestätigt, Fonts kommen nach Update über HACS im Card-Ordner an.
- b88 physischer Card-Renderer: visuell nicht akzeptabel; Screenshot zeigte, dass Layout/Text/Siegel/Skalierung noch nicht stimmen.

## Wichtige Entscheidung b89

Der neue gesetzes-/maßbasierte Renderer wird zunächst **außerhalb der Card** entwickelt und getestet. Die Card selbst wird vorerst wieder auf den letzten kompakten GL-/EuroPlate-Rendererpfad zurückgesetzt, damit HACS-Tests nicht weiter vom unfertigen b88-Renderer blockiert werden.

Ziel:

```text
1. Standalone Renderer-Lab mit Eingabefeld und Regel-/Maßanalyse bauen
2. Werte im Browser/VS Code Live Server visuell abstimmen
3. Erst danach den geprüften Kern in die Card übernehmen
```

## Was b89 geändert hat

### Standalone Renderer-Lab neu

Neuer Ordner:

```text
tools/plate-renderer-lab/
```

Enthalten:

```text
index.html
app.js
plate-renderer-core.js
styles.css
README.md
fonts/README.md
```

Nutzung:

1. `tools/plate-renderer-lab/index.html` mit VS Code Live Server öffnen.
2. Falls nötig Fontdateien für den Live-Server-Test lokal bereitstellen:

```text
tools/plate-renderer-lab/fonts/GL-Nummernschild-Mtl.ttf
tools/plate-renderer-lab/fonts/GL-Nummernschild-Eng.ttf
```

Alternativ versucht das Lab auch:

```text
../../fonts/GL-Nummernschild-Mtl.ttf
../../fonts/GL-Nummernschild-Eng.ttf
```

Das ChatGPT-ZIP enthält weiterhin keine Font-Binärdateien.

### Im Lab umgesetzte Regelbasis

- einzeilige Kennzeichen: 520 × 110 mm Maximalmaß
- zweizeilige Kennzeichen: 340 × 200 mm Maximalmaß, 280 mm bei zwei-/dreirädrigen Kraftfahrzeugen als Regelhinweis
- Kraftradkennzeichen: 180–220 × 200 mm
- verkleinerte zweizeilige Kennzeichen: 255 × 130 mm
- Eurofeldprofile:
  - einzeilig: 45 × 88 mm
  - zweizeilig/Kraftrad: 40 × 88 mm
  - verkleinert zweizeilig: 35 × 56 mm
- Schriftprofile:
  - Mittelschrift 75 mm
  - Engschrift 75 mm
  - verkleinerte Mittelschrift 49 mm
- Regelprüfung für:
  - allgemeine Kennzeichen
  - Oldtimer H
  - Elektro E
  - Saison
  - Elektro + Saison
  - Wechselkennzeichen
  - Kurzzeitkennzeichen
  - Ausfuhrkennzeichen
  - rote Kennzeichen
  - grüne Kennzeichen
- neutrale Behördensiegel-Platzhalter
- kleine generische HU-Plakette als TÜV-Reminder-Element
- Debug-Maßlinien und Analyse-Tabelle

Wichtig: Echte Behörden-/Landessiegelgrafiken, Wappen, Druckstücknummern oder amtliche Sicherheitsmerkmale werden bewusst nicht nachgebaut.

### Card-Runtime zurück auf stabileren Rendererpfad

- `src/plate/renderer.js` wurde auf den kompakten b87-GL-/EuroPlate-Pfad zurückgesetzt und auf `?v=b89` aktualisiert.
- `src/plate/physical-layout.js` aus b88 wurde entfernt.
- Die Card nutzt damit noch **nicht** den neuen Lab-Renderer.
- Der große TÜV-Plakettenrenderer bleibt unverändert.

### Check erweitert

- `scripts/check-js.mjs` prüft jetzt auch JavaScript-Dateien unter `tools/`.

### Versionierung

- `package.json`: `0.1.1-b89`
- `package-lock.json`: `0.1.1-b89`
- `src/**/*.js`: Import-Querymarker `?v=b89`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b89`
- `dist/tuev-card.js`: `// TÜV Card bundled b89`

### Neue Doku

- `docs/B89_PLATE_RENDERER_LAW_LAB.md`

## Nicht geändert

- Keine Editor-/Floating-Panel-Funktionsänderung.
- Keine Gruppenlayout-Änderung.
- Keine große TÜV-Plakettenrenderer-Änderung.
- Keine alten Plaketten-/Ziffern-Experimente übernommen.
- Keine Systemschrift als grafischer Kennzeichenfallback.
- Keine echten amtlichen Siegelgrafiken.
- Keine Integration des neuen Lab-Renderers in die Card.

## Font-/HACS-Regel ab b89

Im echten lokalen GitHub-Repository sollen die Fontdateien erhalten bleiben:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

Beim Build werden sie nach `dist/fonts/` gespiegelt. HACS installiert die Inhalte aus `dist/`, sodass Home Assistant danach diese Pfade hat:

```text
/config/www/community/tuev-card/tuev-card.js
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

Lovelace-Resource bleibt:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

## Build- und Prüfanweisungen

Im lokalen GitHub-Repository:

```bash
npm run build
npm run check
```

Zusätzlich kann das Lab direkt mit VS Code Live Server geöffnet werden:

```text
tools/plate-renderer-lab/index.html
```

## Testanweisung für b89

1. b89 in den lokalen GitHub-Ordner übernehmen, ohne lokale `.ttf`-Dateien aus `fonts/` zu löschen.
2. `npm run build` und `npm run check` ausführen.
3. Für Renderer-Arbeit zuerst `tools/plate-renderer-lab/index.html` mit Live Server öffnen.
4. Beispiele testen:

```text
WIL CL 212
BKS R 95
TR A 77
S AB 1234
DA CI 500
HH EV 204E
K A 1
```

5. Im Lab prüfen:
   - stimmt die physische Breite?
   - passt Mittelschrift/Engschrift-Umschaltung?
   - sitzen Eurofeld, Text und Siegelplätze plausibel?
   - ist die Mini-HU-Plakette zu unruhig oder brauchbar?
   - welche Werte sollen später in die Card übernommen werden?

## Aktuelle Todo-Liste nach b89

### Direkt als nächstes

1. Renderer-Lab visuell prüfen.
2. Gesetzes-/Maßwerte im Lab weiter nachziehen:
   - einzeiliges Standardkennzeichen exakt abstimmen
   - danach zweizeilig/Kraftrad/verkleinert
   - dann Saison/Kurzzeit/Ausfuhr/Wechsel optisch verfeinern
3. Erst nach Freigabe den Lab-Kern in `src/plate/renderer.js` übernehmen.

### Danach

4. Card-weite Skalierungsregel wieder anwenden:
   - breitestes Kennzeichen bestimmt Spaltenbreite
   - alle Kennzeichen derselben Card auf daraus entstehende Zielhöhe
5. Firefox / Chrome / Android-App prüfen.
6. Release Candidate vorbereiten, falls Card stabil genug.
7. Danach Integrationsarchitektur V3.

### Später

- Preview-Darstellung an aktuelles Kennzeichenrendering angleichen.
- Sonderkennzeichen weiter ausbauen.
- Option TÜV-Plakette ausblenden / Compact-Card.
- Gruppen nebeneinander ggf. weiter verfeinern, falls Praxisfälle auffallen.

## Fortsetzungshinweis für neuen Chat

Bitte mit `tuev-card-full-b89-plate-renderer-law-lab.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. Stand: b79 Overlay bestanden, Editor-Gruppenfunktionen bestanden, Floating Panels bestanden, b81 Sortier-Bestätigungsdialog modal bestanden, b82 Button-Zustände und „Alle hinzufügen“ bestanden, b83 README auf Endnutzer-Level, b87 HACS-Auslieferung auf `dist/` bestätigt, b88 Card-Renderer war visuell nicht akzeptabel. b89 setzt die Card zurück auf den kompakten GL-/EuroPlate-Pfad und legt ein unabhängiges VS-Code-Live-Server-Renderer-Lab unter `tools/plate-renderer-lab/` an. Nächster Schritt: Lab visuell prüfen und dort die Gesetzes-/Maßwerte finalisieren, bevor der neue Renderer wieder in die Card übernommen wird. TÜV-Plakettenrenderer nicht unnötig ändern. Systemschrift-Fallback bleibt ausgeschlossen. Echte Behörden-/Landessiegelgrafik wird nicht nachgebaut; nur neutrale Platzhalter sind vorgesehen.
