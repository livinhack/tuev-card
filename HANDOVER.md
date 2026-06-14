# TÜV Reminder Card - Übergabeprotokoll b81

## Zweck dieses Dokuments

Dieses Übergabeprotokoll ist Pflichtbestandteil jedes neuen ZIPs. Es soll bei erneutem Chatlimit den direkten Wiedereinstieg ermöglichen, ohne alte Nachrichten rekonstruieren zu müssen.

## Aktueller Stand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration „TÜV Reminder“
- Fokus aktuell: Card-/Editor-Darstellung, Gruppen, Floating Panels
- Vorheriger Arbeitsstand: `tuev-card-full-b80-floating-panel-outside-click-cleanup.zip`
- Erkannte Ausgangsversion: `0.1.1-b80`
- Neuer Stand: `0.1.1-b81`
- Neuer ZIP-Name: `tuev-card-full-b81-sort-confirm-modal.zip`

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

## Wichtige stabile Grundlagen

- Frühere stabile Basis: `tuev-card-full-a91-cleanup.zip`
- b-Versionen setzen darauf auf.
- b75 war der Übergabepunkt für Gruppen nebeneinander / Editor-Darstellung.
- b79 wurde vom Nutzer visuell bestätigt:
  - 1-Spalten-HU-Stempel/Overlay: bestanden.
  - Editor-Gruppenfunktionen: bestanden.
- b80 verbesserte den Außenklick für normale Floating Panels.
- Für das frühere Todo „Automatisches Hinzufügen neuer Fahrzeuge“ gilt: kein dynamisches Auto-Hinzufügen ohne Config-Schreibweise; der Button „Alle hinzufügen“ ist der bevorzugte Ansatz.

## Nutzerfeedback direkt vor b81

Der Nutzer meldete zu b80:

- `Manuelle Sortierung auf automatisch wechseln → Bestätigungsdialog darf nicht sofort verschwinden.`
- Korrekturwunsch: Bei diesem Bestätigungsdialog den Klick außerhalb deaktivieren.
- Gewünschtes Verhalten: Der Dialog soll nur bei Klick auf `Abbrechen` oder `Ja` schließen.

## Was b81 ändert

### 1. Sortier-Bestätigungsdialog verhält sich modal-artig

Datei: `src/editor/editor.js`

Während `_pendingGroupSort` gesetzt ist:

- Klicks innerhalb `.tuev-editor-sort-confirm` werden durchgelassen.
- `Abbrechen` / `Cancel` und `Ja` / `Yes` funktionieren unverändert.
- Klicks außerhalb des Dialogs werden ignoriert.
- Klicks außerhalb schließen den Dialog nicht mehr.
- Andere Editor-Controls hinter dem Dialog dürfen diesen Außenklick nicht ausführen.

Damit kann der Dialog „Manuelle Sortierung verwerfen?“ nicht mehr versehentlich durch einen Außenklick verschwinden.

### 2. Normale Floating Panels behalten b80-Verhalten

Wenn kein Sortier-Bestätigungsdialog offen ist, bleibt das b80-Verhalten erhalten:

- Klick im Floating Panel: offen lassen.
- Klick auf Panel-Trigger: Trigger-Aktion zulassen.
- Klick außerhalb: Panel verzögert schließen, damit der eigentliche Button-Klick nicht verloren geht.

### 3. Versionierung synchronisiert

- `package.json`: `0.1.1-b81`
- `package-lock.json`: `0.1.1-b81`
- `src/**/*.js`: Import-Cachebuster `?v=b81`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b81`
- `tuev-card.js`: nach Build erwarteter Header `// TÜV Card bundled b81`

## Betroffene Hauptdateien in b81

- `src/editor/editor.js`
  - `handleDocumentClick()` erweitert: `_pendingGroupSort` wird vor normaler Außenklick-Logik geschützt.
- `package.json`
- `package-lock.json`
- `src/tuev-card-entry.js`
- `tuev-card.js`
- `docs/B81_SORT_CONFIRM_MODAL.md`
- `HANDOVER.md`
- Current-Checklist-Dokumente mit aktivem Cachebuster/Checkpoint.

## Bewusst nicht verändert

- Badge-/Plakettenrenderer.
- HU-Stempelgröße aus b79.
- Kennzeichenrenderer.
- EuroPlate-/TTF-/Font-Logik.
- Systemschrift-Fallback bleibt ausgeschlossen.
- Gruppen-nebeneinander-Laufzeitlogik wurde nicht weiter umgebaut.
- Editor-Button-Zustände wurden noch nicht vereinheitlicht.
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
docs/B81_SORT_CONFIRM_MODAL.md
HANDOVER.md
```

## Testanweisung für b81

In Home Assistant die Ressource mit Cachebuster laden:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js?v=b81
```

Dann testen:

1. Eine Gruppe auf manuelle Sortierung stellen.
2. Auf automatische Sortierung wechseln, z. B. Name, Kennzeichen, Fälligkeit oder Status.
3. Der Dialog „Manuelle Sortierung verwerfen?“ erscheint.
4. Klick außerhalb des Dialogs, aber innerhalb des Editors:
   - Erwartung: Dialog bleibt offen.
   - Erwartung: kein Button hinter dem Dialog führt eine Aktion aus.
5. Klick außerhalb des Editors / der Card:
   - Erwartung: Dialog bleibt offen.
6. Klick auf `Abbrechen`:
   - Erwartung: Dialog schließt, manuelle Sortierung bleibt erhalten.
7. Dialog erneut öffnen und `Ja` klicken:
   - Erwartung: Dialog schließt und die automatische Sortierung wird angewendet.

Regression gegen b80:

1. Globales Darstellungs-/Auge-Panel öffnen.
2. Klick im Panel: Panel bleibt offen.
3. Klick außerhalb des Panels, aber innerhalb des Editors: Panel schließt.
4. Klick außerhalb des Editors: Panel schließt.
5. Gruppenspezifisches Darstellungs-/Auge-Panel und Farbpanel genauso testen.
6. „Zur Gruppe hinzufügen“ testen:
   - Soll weiterhin beim ersten Klick reagieren.

## Aktuelle Todo-Liste nach b81

### Direkt nach b81 prüfen

1. Sortier-Bestätigungsdialog:
   - Außenklick darf nicht schließen.
   - Nur `Abbrechen` oder `Ja` schließen.
2. Normale Floating Panels:
   - Außenklick bleibt konsistent.
3. „Zur Gruppe hinzufügen“:
   - Weiterhin erster Klick.

### Nächster sinnvoller Schritt bei bestandenem b81-Test

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
Bitte mit `tuev-card-full-b81-sort-confirm-modal.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. b79 Overlay und Editor-Gruppenfunktionen waren bestanden. b80 fokussierte Floating-Panel-Außenklicks. b81 macht den Dialog „Manuelle Sortierung verwerfen?“ modal-artig: Außenklick darf ihn nicht schließen; nur Abbrechen/Ja. Wichtig: Auto-Hinzufügen wurde zugunsten des Buttons „Alle hinzufügen“ verworfen. Renderer/Fontlogik nicht unnötig anfassen.
```
