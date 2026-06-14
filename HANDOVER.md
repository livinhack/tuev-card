# TÜV Reminder Card - Übergabeprotokoll b80

## Zweck dieses Dokuments

Dieses Übergabeprotokoll ist ab b77/b78 Bestandteil jedes neuen ZIPs. Es soll bei erneutem Chatlimit den direkten Wiedereinstieg ermöglichen, ohne alte Nachrichten rekonstruieren zu müssen.

## Aktueller Stand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration „TÜV Reminder“
- Fokus aktuell: Card-/Editor-Darstellung, Gruppen, Floating Panels
- Vorheriger Arbeitsstand: `tuev-card-full-b79-single-column-stamp-rethink-version-sync.zip`
- Erkannte Ausgangsversion: `0.1.1-b79`
- Neuer Stand: `0.1.1-b80`
- Neuer ZIP-Name: `tuev-card-full-b80-floating-panel-outside-click-cleanup.zip`

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
- Ab diesem Arbeitsstand bleibt das vollständige `HANDOVER.md` Pflichtbestandteil jedes ZIPs.

## Wichtige stabile Grundlagen

- Frühere stabile Basis: `tuev-card-full-a91-cleanup.zip`
- b-Versionen setzen darauf auf.
- b75 war der Übergabepunkt für Gruppen nebeneinander / Editor-Darstellung.
- b79 wurde vom Nutzer visuell bestätigt:
  - 1-Spalten-HU-Stempel/Overlay: bestanden.
  - Editor-Gruppenfunktionen: bestanden.

## Nutzerfeedback direkt vor b80

Der Nutzer meldete:

- `1. b79 Overlay final prüfen = Bestanden`
- `2. Editor-Gruppenfunktionen prüfen = Bestanden`
- `3. Floating Panels = Klick außen schließt nicht Konsistent. An manchen stellen geht es, an anderen passiert nichts beim außerhalb klicken.`
- Zum früheren Todo „Automatisches Hinzufügen neuer Fahrzeuge“: Das wurde bereits diskutiert. Ergebnis: Ein Button „Alle hinzufügen“ ist sinnvoller, weil ein dynamisches, nicht in die Config schreibendes System zu umständlicher Konfiguration führte.

## Was b80 ändert

### 1. Floating-Panel-Außenklick konsistenter gemacht

Datei: `src/editor/editor.js`

Vor b80 wurde jeder Klick innerhalb des Editor-Elements geschützt. Dadurch blieb ein geöffnetes Floating Panel offen, wenn der Nutzer zwar außerhalb des Panels, aber noch innerhalb des Editors klickte.

b80 trennt jetzt genauer:

- Klick innerhalb eines echten Floating Panels: offen lassen.
- Klick auf echte Panel-Trigger: offen lassen bzw. Trigger-Aktion ausführen lassen.
- Klick außerhalb des Panels, auch innerhalb des Editors: Panel schließen.

### 2. Klick wird nicht mehr vorzeitig „verbraucht“

Der globale Click-Handler läuft weiterhin im Capture-Pfad, schließt aber nicht mehr sofort. Stattdessen wird das Schließen per `setTimeout(..., 0)` verzögert.

Ziel:

- Der ursprünglich geklickte Editor-Button kann zuerst seinen eigenen Handler ausführen.
- Danach werden eventuell offene Floating Panels geschlossen.
- Damit soll der frühere Effekt vermieden werden, dass ein Button wie „Zur Gruppe hinzufügen“ erst beim zweiten Versuch reagiert.

### 3. Sortier-Bestätigungsdialog bleibt geschützt

Beim Wechsel von manueller Gruppensortierung zu einer automatischen Sortierung kann der Dialog „Manuelle Sortierung verwerfen?“ erscheinen.

b80 verhindert, dass dieser Dialog durch denselben Sortierklick sofort wieder geschlossen wird.

### 4. Versionierung synchronisiert

- `package.json`: `0.1.1-b80`
- `package-lock.json`: `0.1.1-b80`
- `src/**/*.js`: Import-Cachebuster `?v=b80`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b80`
- `tuev-card.js`: nach Build erwarteter Header `// TÜV Card bundled b80`

## Betroffene Hauptdateien in b80

- `src/editor/editor.js`
  - `handleDocumentClick()` neu gedacht.
  - `hasOpenFloatingPanel()` ergänzt.
  - `closeFloatingPanels()` ergänzt.
- `package.json`
- `package-lock.json`
- `src/tuev-card-entry.js`
- `tuev-card.js`
- `docs/B80_FLOATING_PANEL_OUTSIDE_CLICK_CLEANUP.md`
- `HANDOVER.md`
- Current-Checklist-Dokumente mit aktivem Cachebuster/Checkpoint.

## Bewusst nicht verändert

- Badge-/Plakettenrenderer.
- HU-Stempelgröße aus b79.
- Kennzeichenrenderer.
- EuroPlate-/TTF-/Font-Logik.
- Systemschrift-Fallback bleibt ausgeschlossen.
- Gruppen-nebeneinander-Laufzeitlogik wurde nicht weiter umgebaut.
- Keine Renderer-v2-/GL-Fontpaket-Arbeit.

## Relevante Dateien / Struktur

```text
package.json
package-lock.json
tuev-card.js
src/tuev-card-entry.js
src/card/
src/editor/editor.js
src/editor/floating-panels.js
src/editor/render-parts.js
src/editor/styles.js
src/translations/de.js
src/translations/en.js
docs/B80_FLOATING_PANEL_OUTSIDE_CLICK_CLEANUP.md
HANDOVER.md
```

## Testanweisung für b80

In Home Assistant die Ressource mit Cachebuster laden:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=b80
```

Dann testen:

1. Globales Darstellungs-/Auge-Panel öffnen.
2. Klick im Panel: Panel bleibt offen.
3. Klick außerhalb des Panels, aber innerhalb des Editors: Panel schließt.
4. Klick außerhalb des Editors: Panel schließt.
5. Gruppenspezifisches Darstellungs-/Auge-Panel öffnen und dieselben Außenklicks testen.
6. Gruppen-Farbpanel öffnen:
   - Klick auf Farbe funktioniert.
   - Klick außerhalb schließt.
7. Sortierung von manuell auf automatisch ändern:
   - Bestätigungsdialog bleibt nach dem Sortierklick sichtbar.
   - Bestätigen/Abbrechen schließt ihn.
8. „Zur Gruppe hinzufügen“ testen:
   - Soll beim ersten Klick reagieren.
9. Bereits bestandene b79-Punkte nur kurz gegenprüfen:
   - 1-Spalten-HU-Stempel weiterhin passend.
   - Editor-Gruppenfunktionen weiterhin stabil.

## Aktuelle Todo-Liste nach b80

### Direkt nach b80 prüfen

1. Floating Panels: Außenklick konsistent?
2. „Zur Gruppe hinzufügen“ weiterhin erster Klick?
3. Sortier-Bestätigungsdialog nicht sofort geschlossen?

### Nächster sinnvoller Schritt bei bestandenem b80-Test

4. Editor-Button-Zustände vereinheitlichen:
   - Auge/Darstellung
   - Sortierung
   - Gruppen-Freigabe
   - manuelle Sortierung
   - aktive/inaktive/hover/focus-Zustände
   - gruppenabhängige Färbung beibehalten

### Danach / später

5. Gruppen-nebeneinander-Logik final polieren, falls in echten Beispielen noch Unruhe sichtbar wird.
6. „Alle hinzufügen“-Button ggf. weiter verbessern; kein dynamisches Auto-Hinzufügen ohne Config-Schreibweise einführen.
7. Preview-Darstellung später an aktuelles Kennzeichenrendering angleichen.
8. Renderer-Stabilität Firefox/Chrome/Android grundsätzlich prüfen.
9. Kennzeichenrenderer v2 mit GL-Fontpaket evaluieren.
10. Sonderkennzeichen prüfen.
11. Option TÜV-Plakette ausblenden / Compact-Card prüfen.
12. Architektur V3 der Integration später angehen.

## Nächster Einstieg im neuen Chat

Falls wieder ein Chatlimit erreicht wird, mit diesem Text starten:

```text
Bitte mit `tuev-card-full-b80-floating-panel-outside-click-cleanup.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. b79 Overlay und Editor-Gruppenfunktionen waren bestanden. b80 fokussiert Floating-Panel-Außenklicks. Wichtig: Auto-Hinzufügen wurde zugunsten des Buttons „Alle hinzufügen“ verworfen. Renderer/Fontlogik nicht unnötig anfassen.
```
