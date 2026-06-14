# TÜV Reminder Card - Übergabeprotokoll b85

## Stand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration `tuev_reminder` / „TÜV Reminder“.
- Aktueller Fokus: Card, Kennzeichen-Font und Kennzeichenrenderer.
- Neuer Stand: `0.1.1-b85`.
- Neuer ZIP-Name: `tuev-card-full-b85-gl-font-license-path-prep.zip`.
- Ausgangspunkt: `tuev-card-full-b84-gl-font-renderer-v2.zip`.

## Feste Projektregeln

- Code, Dateinamen und Funktionen grundsätzlich auf Englisch halten.
- Deutsche UI-Texte nur über Übersetzungen/Lokalisierung lösen.
- ZIP-Versionierung fortlaufend weiterzählen.
- Jeder neue Arbeitsstand muss ein vollständiges `HANDOVER.md` enthalten.
- Alte stabile Renderer-Entscheidungen nicht unnötig anfassen.
- TÜV-Plakettenrenderer nicht nebenbei verändern.
- Systemschrift-Fallback für grafische Kennzeichen bleibt ausgeschlossen.
- Grafische Kennzeichen nur anbieten, wenn ein gültiger Kennzeichen-Font verfügbar ist.

## Direkt vor b85 bestätigte Punkte

- b79 Overlay final geprüft: bestanden.
- Editor-Gruppenfunktionen: bestanden.
- Floating Panels: bestanden.
- b81 Sortier-Bestätigungsdialog modal: bestanden.
- b82 Button-Zustände und „Alle hinzufügen“: bestanden.
- b83 README/Release-Cleanup: durchgeführt.
- b84 GL-Font-/Renderer-v2-Grundlage: vorhanden.
- Nutzer hat GL-Nummernschild-FontSpace-ZIP hochgeladen und nach Lizenzprüfung „ok, los“ gesagt.

## Wichtig zu b85

Dieses generierte Entwicklungs-ZIP enthält keine Font-Binärdateien (`.ttf`, `.otf`, `.woff`, ...). Es enthält die Lizenz-/Readme-Notizen und die vorbereiteten Runtime-Pfade.

Erwartete Font-Dateinamen für eine Paket-/Release-Variante mit GL-Fonts:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

## Was b85 ändert

### 1. Font-Pfade bereinigt

`src/plate/font.js` prüft jetzt die regulären GL-Dateinamen zuerst:

- `/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf`
- `/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf`
- `/local/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf`
- `/local/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf`
- `/local/tuev-card/fonts/GL-Nummernschild-Mtl.ttf`
- `/local/tuev-card/fonts/GL-Nummernschild-Eng.ttf`
- `/local/GL-Nummernschild-Mtl.ttf`
- `/local/GL-Nummernschild-Eng.ttf`
- `/local/EuroPlate.ttf` als Legacy-Fallback

Die b84-Kandidaten für optionale Bold-Dateien wurden entfernt, weil das bereitgestellte FontSpace-Paket reguläre `Mtl`-/`Eng`-Dateien enthält.

### 2. Lizenz-/Readme-Notizen aufgenommen

Neue/aktualisierte Dateien:

- `fonts/README.md`
- `fonts/LICENSE.GL-Nummernschild.txt`
- `fonts/GL-Nummernschild-Mtl-readme.txt`
- `fonts/GL-Nummernschild-Eng-readme.txt`
- `NOTICE.md`

Die hochgeladenen Readmes nennen Gutenberg Labo als Copyright-/Fontquelle und enthalten die Erlaubnis zur Nutzung, Kopie und Weitergabe mit oder ohne Änderung, kommerziell und nicht-kommerziell, ohne Gewährleistung.

### 3. README angepasst

`README.md` beschreibt grafische Kennzeichen jetzt auf GL-Nummernschild-Basis. EuroPlate wird nur noch als Legacy-Fallback erwähnt.

### 4. Versionierung synchronisiert

- `package.json`: `0.1.1-b85`
- `package-lock.json`: `0.1.1-b85`
- `src/**/*.js`: Import-Querymarker `?v=b85`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b85`
- `tuev-card.js`: nach Build `// TÜV Card bundled b85`

## Betroffene Hauptdateien

- `src/plate/font.js`
- `README.md`
- `NOTICE.md`
- `fonts/*`
- `docs/B85_GL_FONT_LICENSE_PATH_PREP.md`
- `HANDOVER.md`
- `package.json`
- `package-lock.json`
- `tuev-card.js`

## Nicht geändert

- TÜV-Plakettenrenderer.
- Kennzeichen-Geometrie aus b84.
- Card-/Editor-Gruppenlogik.
- Floating Panels.
- Sortier-Bestätigungsdialog.
- „Alle hinzufügen“-Workflow.
- Keine Systemschrift als Fallback.

## Build-/Check-Status

Ausführen für b85:

```text
npm run check
npm run build
```

Erwartet:

- JavaScript-Syntaxcheck erfolgreich.
- Bundle erfolgreich erzeugt.
- Bundle-Header: `// TÜV Card bundled b85`.
- Keine aktiven `?v=b84`-Imports mehr in `src/`.
- Keine `.ttf`/`.otf`-Dateien im generierten ZIP.

## Testanweisung für b85

1. ZIP installieren/kopieren.
2. Ohne Fontdateien testen:
   - grafische Kennzeichenoption soll verborgen bleiben.
   - Textkennzeichen sollen funktionieren.
3. Zum GL-Test kompatible Fontdateien an einen unterstützten Pfad legen, bevorzugt:

```text
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

4. Home Assistant Dashboard neu laden.
5. Grafische Kennzeichen aktivieren.
6. Kurze und lange Kennzeichen vergleichen.
7. Firefox, Chrome und Android-App gegenprüfen.

## Aktuelle Todo-Liste nach b85

### Nächster sinnvoller Schritt

1. GL-Fontladung in Home Assistant prüfen.
2. Screenshots mit kurzer/mittlerer/langer Platte sammeln.
3. b86 Renderer-Feintuning anhand echter Screenshots:
   - Mtl/Eng Umschaltgrenze prüfen.
   - Breite/Höhe/Abstände prüfen.
   - Firefox/Chrome/Android vergleichen.
   - Preview ggf. separat und vorsichtig behandeln.

### Danach

4. Card Richtung stabiler Release-Kandidat prüfen.
5. Integration Architektur V3 angehen.

### Später / bewusst verschoben

- Kennzeichenrenderer v2 weiter ausbauen.
- Sonderkennzeichen: Saisonkennzeichen, Wechselkennzeichen, grüne Kennzeichen, zweizeilige Kennzeichen.
- Option TÜV-Plakette ausblenden / Compact-Card.
- Browser-/App-Rendering grundsätzlich robuster prüfen.

## Fortsetzungstext bei Chatlimit

Bitte mit `tuev-card-full-b85-gl-font-license-path-prep.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. Stand: b79 Overlay bestanden, Editor-Gruppenfunktionen bestanden, Floating Panels bestanden, b81 Sortier-Bestätigungsdialog modal bestanden, b82 Button-Zustände und „Alle hinzufügen“ bestanden, b83 README auf Endnutzer-Level, b84 GL-Renderer-v2-Grundlage, b85 GL-Lizenz-/Readme-Notizen und bereinigte Fontpfade. Dieses generierte ZIP enthält keine Font-Binärdateien; für GL-Tests müssen `GL-Nummernschild-Mtl.ttf` und `GL-Nummernschild-Eng.ttf` an einen unterstützten Pfad gelegt werden. Systemschrift-Fallback bleibt ausgeschlossen. Nächster Schritt: GL-Fontladung testen und dann b86 Renderer-Feintuning anhand Screenshots.
