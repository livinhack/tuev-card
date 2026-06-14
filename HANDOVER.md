# TÜV Reminder Card - Übergabeprotokoll b87

## Kurzstand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration `tuev_reminder`.
- Neuer Stand: `0.1.1-b87`.
- Neuer ZIP-Name: `tuev-card-full-b87-hacs-dist-bundle-font-assets.zip`.
- Ausgangspunkt: `tuev-card-full-b86-hacs-bundled-font-readme-cleanup.zip`.
- Fokus b87: HACS-Auslieferungsstruktur korrigieren, damit nicht-JS-Dateien wie Fonts mitinstalliert werden können.

## Direkt vor b87 bestätigte Punkte

- b79 Overlay in Einzelspalte: bestanden.
- b82 Editor-Gruppenfunktionen: bestanden.
- b81 Floating Panels / Sortier-Bestätigungsdialog: bestanden.
- b82 Button-Aktivzustände und „Alle hinzufügen“: bestanden.
- b83 README auf Endnutzer-Level: erledigt.
- b84/b85 GL-Font-/Renderer-Grundlage: vorhanden.
- b86 README-Fontblock entfernt und HACS-Fontpfad vorbereitet.
- Problem nach b86: Nach HACS-Update lag der `fonts/`-Ordner nicht im Card-Ordner.

## Wichtige Entscheidung b87

Die HACS-Auslieferung wird auf `dist/` umgestellt.

Bisher:

```text
tuev-card.js
fonts/
```

Neu:

```text
dist/
  tuev-card.js
  fonts/
```

Grund: Für HACS Dashboard-/Plugin-Repositories mit Nicht-JS-Dateien sollen Card-Datei und Assets gemeinsam unter `dist/` liegen. Die Lovelace-Resource bleibt trotzdem unverändert:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

`dist` erscheint nicht in der Resource-URL, weil HACS die Inhalte von `dist/` in den installierten Card-Ordner übernimmt.

## Font-Regel ab b87

Das erzeugte ChatGPT-ZIP enthält weiterhin keine Font-Binärdateien (`.ttf`, `.otf`, `.woff`, `.woff2`).

Im echten lokalen GitHub-Repository sollen die Fontdateien in Root-`fonts/` liegen:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

Beim Build werden alle Dateien aus Root-`fonts/` nach `dist/fonts/` gespiegelt. Dadurch werden die Fontdateien durch HACS zusammen mit der Card ausgeliefert.

## Was b87 geändert hat

### Build / HACS layout

- `scripts/build-bundle.mjs`
  - schreibt den Bundle jetzt nach `dist/tuev-card.js`
  - erstellt `dist/` bei jedem Build neu
  - kopiert `fonts/` nach `dist/fonts/`
- `scripts/check-js.mjs`
  - prüft `dist/tuev-card.js` statt Root-`tuev-card.js`
- `build-tuev-card.bat`
  - meldet jetzt `dist\tuev-card.js`
- Root-`tuev-card.js`
  - ist nicht mehr Bestandteil des ZIPs und nicht mehr aktiver HACS-Bundle

### HACS metadata

- `hacs.json`
  - `filename` bleibt `tuev-card.js`
  - `content_in_root: true` wurde entfernt

### Docs / Hinweise

- `README.md`
  - manuelle Installation: Inhalte aus `dist/` kopieren
  - HACS-Resource bleibt `/hacsfiles/tuev-card/tuev-card.js`
- `NOTICE.md`
  - beschreibt `fonts/` → `dist/fonts/` → `/hacsfiles/...`
- `fonts/README.md`
  - erklärt Root-`fonts/` als Quellordner und `dist/fonts/` als HACS-Lieferordner
- Neue Doku:
  - `docs/B87_HACS_DIST_BUNDLE_AND_FONT_ASSETS.md`
- Aktive Release-Dokus aktualisiert:
  - `docs/HACS_RELEASE_FLOW.md`
  - `docs/RELEASE_CHECK.md`
  - `docs/V0_1_RELEASE_CANDIDATE.md`
  - `docs/VERSIONING_AND_RELEASE_PREP.md`
  - `docs/REPO_CLEANUP.md`

### Versionierung

- `package.json`: `0.1.1-b87`
- `package-lock.json`: `0.1.1-b87`
- `src/**/*.js`: Import-Querymarker `?v=b87`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b87`
- `dist/tuev-card.js`: `// TÜV Card bundled b87`

## Nicht geändert

- Keine Renderer-Geometrie korrigiert.
- Keine TÜV-Plakettenrenderer-Änderung.
- Keine Editor-/Floating-Panel-Funktionsänderung.
- Kein Systemschrift-Fallback.
- EuroPlate bleibt nur Legacy-Fallback.
- GL-Mittelschrift/Engschrift-Auswahl aus b84/b85 bleibt bestehen.

## Build- und Prüfanweisungen

Im lokalen GitHub-Repository:

```bash
npm run build
npm run check
```

Erwartet:

```text
dist/tuev-card.js
dist/fonts/GL-Nummernschild-Mtl.ttf
dist/fonts/GL-Nummernschild-Eng.ttf
```

Wenn das ChatGPT-ZIP übernommen wird, aber die lokalen `.ttf`-Dateien bereits im Root-`fonts/`-Ordner liegen, unbedingt danach `npm run build` ausführen, damit sie nach `dist/fonts/` gespiegelt werden.

## Testanweisung für b87

1. b87 in den lokalen GitHub-Ordner übernehmen, ohne lokale `.ttf`-Dateien aus `fonts/` zu löschen.
2. `npm run build` ausführen.
3. Prüfen, ob die `.ttf`-Dateien in `dist/fonts/` liegen.
4. Commit + Push.
5. HACS: Repository neu herunterladen oder Update/Redownload erzwingen.
6. In Home Assistant prüfen:

```text
/config/www/community/tuev-card/tuev-card.js
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

7. Dashboard mit normaler HACS-Resource laden:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

8. Grafische Kennzeichen prüfen.

## Aktuelle Todo-Liste nach b87

### Direkt als nächstes

1. HACS-dist-Struktur testen: Kommt `fonts/` jetzt im installierten Card-Ordner an?
2. Wenn ja: b88 Renderer-Feintuning anhand Screenshot/Referenzwerten.

### Danach

3. Renderer-Stabilität Firefox / Chrome / Android-App prüfen.
4. GL-Mittelschrift/Engschrift-Werte finalisieren.
5. Falls Card stabil genug: Release Candidate vorbereiten.
6. Danach Integrationsarchitektur V3.

### Später

- Preview-Darstellung an aktuelles Kennzeichenrendering angleichen.
- Sonderkennzeichen prüfen.
- Option TÜV-Plakette ausblenden / Compact-Card.
- Gruppen nebeneinander ggf. weiter verfeinern, falls Praxisfälle auffallen.

## Fortsetzungshinweis für neuen Chat

Bitte mit `tuev-card-full-b87-hacs-dist-bundle-font-assets.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. Stand: b79 Overlay bestanden, Editor-Gruppenfunktionen bestanden, Floating Panels bestanden, b81 Sortier-Bestätigungsdialog modal bestanden, b82 Button-Zustände und „Alle hinzufügen“ bestanden, b83 README auf Endnutzer-Level, b84/b85 GL-Font-/Renderer-Grundlage, b86 Fontblock entfernt, b87 HACS-Auslieferung auf `dist/` umgestellt. Das generierte ChatGPT-ZIP enthält keine Font-Binärdateien; im echten lokalen GitHub-Repo müssen `fonts/GL-Nummernschild-Mtl.ttf` und `fonts/GL-Nummernschild-Eng.ttf` erhalten bleiben und per `npm run build` nach `dist/fonts/` gespiegelt werden. Nächster Schritt: HACS-redownload testen; danach b88 GL-Kennzeichenrenderer anhand Screenshot/Referenzwerten feintunen. TÜV-Plakettenrenderer nicht ändern. Systemschrift-Fallback bleibt ausgeschlossen.
