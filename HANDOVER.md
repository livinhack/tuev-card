# TÜV Reminder Card - Übergabeprotokoll b83

## Zweck dieses Dokuments

Dieses Übergabeprotokoll ist Pflichtbestandteil jedes neuen ZIPs. Es soll bei erneutem Chatlimit den direkten Wiedereinstieg ermöglichen, ohne alte Nachrichten rekonstruieren zu müssen.

## Aktueller Stand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration „TÜV Reminder“
- Fokus aktuell: Card-/Editor-Darstellung ist stabil; b83 ist ein README-/Release-Readiness-Checkpoint ohne Runtime-Änderung
- Vorheriger Arbeitsstand: `tuev-card-full-b82-cleanup-button-state-add-all-check.zip`
- Erkannte Ausgangsversion: `0.1.1-b82`
- Neuer Stand: `0.1.1-b83`
- Neuer ZIP-Name: `tuev-card-full-b83-readme-release-cleanup-next-step.zip`

## Grundregeln / Projektentscheidungen

- Code, Dateinamen und Funktionen grundsätzlich Englisch halten.
- Deutsche UI-Texte nur über Übersetzungen/Lokalisierung lösen.
- ZIP-Versionierung fortlaufend weiterzählen.
- Bei jedem neuen Arbeitsstand einen neuen ZIP mit nächster Versionsnummer erzeugen.
- Keine alten stabilen Renderer-Entscheidungen unnötig anfassen.
- TÜV-Plakettenrenderer nicht ohne konkreten Grund ändern.
- Kennzeichenrenderer nicht nebenbei refactoren.
- Grafische Kennzeichen nur anbieten, wenn die benötigte Schrift erreichbar ist.
- Systemschrift-Fallback für grafische Kennzeichen bleibt ausgeschlossen.
- Änderungen an alten Plaketten-/Ziffern-Experimenten nach „Zentrierung sieht gut aus“ nicht übernehmen, bis neue SVG-Daten vorliegen.
- In jedem ZIP muss ein vollständiges `HANDOVER.md` enthalten sein.
- `README.md` soll auf Endnutzer-Level bleiben; Entwickler-/Build-/Debugdetails gehören in `docs/`.
- Für normale HACS-Installation wird im README kein Cachebuster empfohlen.
- Das frühere dynamische Auto-Hinzufügen bleibt verworfen; bevorzugt ist der explizite Button `Alle hinzufügen`, der in die Config schreibt.

## Wichtige stabile Grundlagen

- Frühere stabile Basis: `tuev-card-full-a91-cleanup.zip`
- b75 war der Übergabepunkt für Gruppen nebeneinander / Editor-Darstellung.
- b79 wurde vom Nutzer visuell bestätigt:
  - 1-Spalten-HU-Stempel/Overlay: bestanden.
  - Editor-Gruppenfunktionen: bestanden.
- b80 verbesserte den Außenklick für normale Floating Panels.
- b81 machte den Dialog „Manuelle Sortierung verwerfen?“ modal-artig.
- b82 wurde vom Nutzer bestätigt:
  - Button-Aktiv/Inaktiv-Verhalten: bestanden.
  - `Alle hinzufügen`: bestanden.
  - Sortier-Bestätigungsdialog: bestanden.
  - Floating Panels: bestanden.

## Nutzerfeedback direkt vor b83

Der Nutzer meldete nach b82 sinngemäß:

- Alles Gegebene passt.
- README nur auf Endnutzer-Level halten.
- Cachebuster ist bei Installation über HACS vermutlich nicht nötig.
- Danach entweder Font-Tausch oder Architektur V3.

## Was b83 ändert

### 1. README auf Endnutzer-Level reduziert

`README.md` wurde als Nutzer-/HACS-Installationsanleitung neu geschrieben.

Enthalten bleiben:

- Kurzbeschreibung und Features.
- Requirements.
- HACS-Installation mit normalem Resource-Pfad:
  - `/hacsfiles/tuev-card/tuev-card.js`
- Manuelle Installation mit normalem Resource-Pfad:
  - `/local/community/tuev-card/tuev-card.js`
- Card-Beispiele.
- Visual-Editor-Überblick.
- HU-Bestätigung.
- Options-Tabelle inklusive `groups_layout`.
- Aktueller Hinweis: grafische Kennzeichen benötigen derzeit `EuroPlate.ttf`.

Entfernt aus dem README:

- Source-Level modular debugging.
- Build-Kommandos.
- Projektstruktur-Interna.
- Release-/Entwicklerformulierungen.
- Cachebuster als normaler HACS-Testpfad.

### 2. Versionierung synchronisiert

- `package.json`: `0.1.1-b83`
- `package-lock.json`: `0.1.1-b83`
- `src/**/*.js`: Import-Querymarker `?v=b83`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b83`
- `tuev-card.js`: nach Build `// TÜV Card bundled b83`

### 3. Aktive Doku aktualisiert

Neue Datei:

- `docs/B83_README_RELEASE_CLEANUP_NEXT_STEP.md`

Aktive Release-/Repo-Check-Dokumente wurden auf b83 gebracht und zeigen für normale HACS-Pfade keinen Cachebuster mehr.

## Bewusst nicht geändert

- Kein Runtime-Verhalten geändert.
- Kein Editor-Verhalten geändert.
- Kein Floating-Panel-Verhalten geändert.
- Kein Sortierdialog-Verhalten geändert.
- Kein Gruppenlayout-Verhalten geändert.
- Kein HU-Stempel-/Overlay-Verhalten geändert.
- Kein TÜV-Plakettenrenderer geändert.
- Kein Kennzeichenrenderer geändert.
- Keine EuroPlate-/TTF-/Font-Verfügbarkeitslogik geändert.
- Kein neues Feature eingeschleust.

## Betroffene Hauptdateien in b83

- `README.md`
- `package.json`
- `package-lock.json`
- `src/tuev-card-entry.js`
- `src/**/*.js` wegen `?v=b83`
- `tuev-card.js`
- `HANDOVER.md`
- `docs/B83_README_RELEASE_CLEANUP_NEXT_STEP.md`
- aktive Release-/Repo-Check-Dokumente

## Prüfungen ausgeführt

```bash
npm run check
npm run build
```

Zusätzlich geprüft:

- `package.json` meldet `0.1.1-b83`.
- `tuev-card.js` beginnt mit `// TÜV Card bundled b83`.
- Source-Kommentar in `src/tuev-card-entry.js` ist `b83`.
- Aktive Source-Imports verwenden `?v=b83`.
- `README.md` enthält keinen HACS-Cachebuster-Pfad.

## Testanweisung für b83

Normale HACS-Resource:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

Bitte nur kurz smoke-testen, da b83 keine Runtime-Änderung sein soll:

1. Card lädt weiterhin.
2. Editor öffnet weiterhin.
3. Gruppen-/Floating-Panel-Verhalten bleibt wie in b82.
4. `Alle hinzufügen` bleibt vorhanden.
5. README kurz gegenlesen: wirkt es ausreichend endnutzerorientiert?

## Empfehlung für den nächsten großen Schritt

Empfehlung: **erst Font-Tausch / Font-Evaluierung, danach Integration Architektur V3.**

Begründung:

- Die Card ist jetzt nahe an einem stabilen nutzerseitigen Stand.
- Der manuelle `EuroPlate.ttf`-Schritt ist noch ein spürbarer Nutzer-/Release-Reibungspunkt.
- Ein gebündelter, sauber lizenzierter Kennzeichenfont würde die Card vor V3 deutlich runder machen.
- Architektur V3 ist größer und betrifft die Integration/Datenhaltung; sie sollte besser starten, wenn die Card als Paket sauberer abgeschlossen ist.

Wichtig: Font-Tausch nicht blind direkt einbauen. Nächster sinnvoller Schritt wäre:

- `b84`: GL-Fontpaket/Lizenz/Dateien prüfen und Plate Renderer v2 planen.
- Erst wenn Lizenz und Font-Dateien sauber sind: Implementierung in `b85+`.
- Danach Architektur V3.

## Aktuelle Todo-Liste nach b83

### Nahe nächste Schritte

1. b83 README/Release-Readiness kurz prüfen.
2. GL-Fontpaket und Lizenz prüfen.
3. Plate Renderer v2 planen:
   - bundled font(s)
   - Mittelschrift/Engschrift
   - Pfade/Assets
   - Entfernen des manuellen EuroPlate-Zwangs, sofern Lizenz passt
   - keine Systemschrift-Fallbacks

### Danach

4. Integration Architektur V3 angehen:
   - zentrale Integrations-/Datenarchitektur statt einzelner Fahrzeug-Config-Entries als primäres Modell
   - bestehende Kalender-/Geräte-/Sensorlogik sauber migrieren/neu denken

### Später / verschoben

5. Preview-Darstellung an aktuelles Kennzeichenrendering angleichen.
6. Renderer-Stabilität Firefox/Chrome/Android grundsätzlich prüfen.
7. Sonderkennzeichen prüfen.
8. Option TÜV-Plakette ausblenden / Compact-Card prüfen.
9. Gruppen nebeneinander nur bei konkreten neuen Testausreißern weiter feinjustieren.

## Kurzer Fortsetzungstext für neuen Chat

Bitte mit `tuev-card-full-b83-readme-release-cleanup-next-step.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. Stand: b79 Overlay bestanden, Editor-Gruppenfunktionen bestanden, Floating Panels bestanden, b81 Sortier-Bestätigungsdialog modal bestanden, b82 Button-Zustände und `Alle hinzufügen` bestanden. b83 hat keine Runtime-Änderungen, sondern reduziert README auf Endnutzer-Level und entfernt Cachebuster als normalen HACS-Pfad aus README/aktiven Release-Hinweisen. Nächste Empfehlung: erst GL-Fontpaket/Lizenz/Plate Renderer v2 prüfen, dann Integration Architektur V3. Systemschrift-Fallback bleibt ausgeschlossen; Kennzeichenrenderer nicht blind umbauen.
