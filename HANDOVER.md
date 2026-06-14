# TÜV Reminder Card - Übergabeprotokoll b86

## Stand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration `tuev_reminder` / „TÜV Reminder“.
- Aktueller Fokus: Card, GL-Nummernschild-Font und Kennzeichenrenderer.
- Neuer Stand: `0.1.1-b86`.
- Neuer ZIP-Name: `tuev-card-full-b86-hacs-bundled-font-readme-cleanup.zip`.
- Ausgangspunkt: `tuev-card-full-b85-gl-font-license-path-prep.zip`.

## Feste Projektregeln

- Code, Dateinamen und Funktionen grundsätzlich auf Englisch halten.
- Deutsche UI-Texte nur über Übersetzungen/Lokalisierung lösen.
- ZIP-Versionierung fortlaufend weiterzählen.
- Jeder neue Arbeitsstand muss ein vollständiges `HANDOVER.md` enthalten.
- Alte stabile Renderer-Entscheidungen nicht unnötig anfassen.
- TÜV-Plakettenrenderer nicht nebenbei verändern.
- Systemschrift-Fallback für grafische Kennzeichen bleibt ausgeschlossen.
- Grafische Kennzeichen nur anbieten, wenn ein gültiger Kennzeichen-Font verfügbar ist.

## Direkt vor b86 bestätigte Punkte

- b79 Overlay final geprüft: bestanden.
- Editor-Gruppenfunktionen: bestanden.
- Floating Panels: bestanden.
- b81 Sortier-Bestätigungsdialog modal: bestanden.
- b82 Button-Zustände und „Alle hinzufügen“: bestanden.
- b83 README auf Endnutzer-Level: erledigt.
- b84/b85 GL-Font-/Renderer-Grundlage: vorhanden.
- Nutzer hat gemeldet: Der Renderer ist nach GL-Fonttest sichtbar aus der Bahn, das Laden hat also wahrscheinlich funktioniert.
- Nutzer legt die GL-Fonts jetzt selbst in den lokalen GitHub-Ordner auf dem PC.
- Wunsch: Wenn Fonts im Paket enthalten sind, soll im Endnutzer-README kein eigener Font-Erklärblock stehen.

## Wichtig zu b86

Das generierte ChatGPT-ZIP enthält weiterhin keine Font-Binärdateien (`.ttf`, `.otf`, `.woff`, ...). Für den echten GitHub-/HACS-Stand sollen die Fontdateien lokal im Repo liegen:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

HACS installiert Dashboard-Repositories nach `www/community/<repo-name>/`; damit werden die Fonts über folgende Laufzeitpfade erreichbar:

```text
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

`src/plate/font.js` prüft diese HACS-Pfade bereits zuerst.

## Was b86 ändert

### 1. README auf Paket-/HACS-Zustand vereinfacht

`README.md` wurde weiter auf Endnutzer-Level gehalten:

- GL-Fontdateien nicht mehr als manuelle Voraussetzung gelistet.
- Der separate Abschnitt „Graphical license plates“ mit Dateinamen/Installationshinweisen wurde entfernt.
- Grafische Kennzeichen bleiben als normales Feature erwähnt.
- HACS-Pfad bleibt ohne Cachebuster:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

### 2. Font-/Lizenznotizen angepasst

- `NOTICE.md` beschreibt nun, dass Fontdateien, wenn sie im `fonts/`-Ordner liegen, über HACS zusammen mit der Card installiert und unter `/hacsfiles/tuev-card/fonts/...` bereitgestellt werden.
- `fonts/README.md` beschreibt den Repository-/Paketort der Fonts.
- `fonts/LICENSE.GL-Nummernschild.txt` nennt die Release-Dateinamen, ohne die Fonts als grundsätzlich extern darzustellen.

### 3. Versionierung synchronisiert

- `package.json`: `0.1.1-b86`
- `package-lock.json`: `0.1.1-b86`
- `src/**/*.js`: Import-Querymarker `?v=b86`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b86`
- `tuev-card.js`: nach Build `// TÜV Card bundled b86`

## Betroffene Hauptdateien

- `README.md`
- `NOTICE.md`
- `fonts/README.md`
- `fonts/LICENSE.GL-Nummernschild.txt`
- `docs/B86_HACS_BUNDLED_FONT_README_CLEANUP.md`
- `HANDOVER.md`
- `package.json`
- `package-lock.json`
- `src/**/*.js` nur wegen Versions-Querymarkern
- `tuev-card.js`

## Nicht geändert

- TÜV-Plakettenrenderer.
- Kennzeichen-Geometrie/Rendererwerte aus b84/b85.
- Font-Erkennung außer Versionsmarker/Bundle.
- Card-/Editor-Gruppenlogik.
- Floating Panels.
- Sortier-Bestätigungsdialog.
- „Alle hinzufügen“-Workflow.
- Kein Systemschrift-Fallback.

## Build-/Check-Status

Ausführen für b86:

```text
npm run check
npm run build
```

Erwartet:

- JavaScript-Syntaxcheck erfolgreich.
- Bundle erfolgreich erzeugt.
- Bundle-Header: `// TÜV Card bundled b86`.
- Keine aktiven `?v=b85`-Imports mehr in `src/`.

## Testanweisung für b86

1. In deinem lokalen GitHub-/HACS-Ordner die Fontdateien ablegen:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

2. b86-Dateien übernehmen, ohne die lokalen `.ttf`-Dateien zu löschen.
3. Über HACS oder lokale Kopie installieren.
4. Dashboard neu laden.
5. Prüfen, ob grafische Kennzeichen ohne manuelle `/local/...`-Fontinstallation verfügbar bleiben.
6. Danach Screenshots/Referenzwerte für b87 Renderer-Feintuning bereitstellen.

## Aktuelle Todo-Liste nach b86

### Nächster sinnvoller Schritt

1. b87 GL-Kennzeichenrenderer feintunen:
   - Mtl/Eng Umschaltgrenze prüfen.
   - Plate-Höhe/Breite prüfen.
   - EU-Balken, Textabstand, Schriftgröße und Baseline prüfen.
   - Firefox/Chrome/Android vergleichen.
   - gespeicherte Referenzseite/Werte einbeziehen.

### Danach

2. Card Richtung stabiler Release-Kandidat prüfen.
3. Integration Architektur V3 angehen.

### Später / bewusst verschoben

- Sonderkennzeichen: Saisonkennzeichen, Wechselkennzeichen, grüne Kennzeichen, zweizeilige Kennzeichen.
- Option TÜV-Plakette ausblenden / Compact-Card.
- Browser-/App-Rendering grundsätzlich robuster prüfen.

## Fortsetzungstext bei Chatlimit

Bitte mit `tuev-card-full-b86-hacs-bundled-font-readme-cleanup.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. Stand: b79 Overlay bestanden, Editor-Gruppenfunktionen bestanden, Floating Panels bestanden, b81 Sortier-Bestätigungsdialog modal bestanden, b82 Button-Zustände und „Alle hinzufügen“ bestanden, b83 README auf Endnutzer-Level, b84/b85 GL-Font-/Renderer-Grundlage, b86 README bereinigt und HACS-Font-Bundling-Pfad dokumentiert. Das generierte ChatGPT-ZIP enthält keine Font-Binärdateien; im echten GitHub-/HACS-Repo sollen `fonts/GL-Nummernschild-Mtl.ttf` und `fonts/GL-Nummernschild-Eng.ttf` lokal mitgeführt werden. Nächster Schritt: b87 GL-Kennzeichenrenderer anhand Screenshot/Referenzwerten feintunen. TÜV-Plakettenrenderer nicht ändern. Systemschrift-Fallback bleibt ausgeschlossen.
