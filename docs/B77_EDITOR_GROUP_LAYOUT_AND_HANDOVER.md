# b77 - Editor group layout controls and handover protocol

## Ausgangsstand

- Input ZIP: `tuev-card-full-b76-groups-side-by-side-gap-scale.zip`
- Ermittelter Stand: `0.1.1-b76`
- Neuer Stand: `0.1.1-b78`
- Fokus: Editor-Bedienung rund um Gruppen und Gruppenlayout.
- Renderer-/Kennzeichen-/Plakettenlogik wurde nicht absichtlich verändert.

## Änderungen

### Gruppenlayout-Schalter repariert

Der Schalter für `groups_layout: auto` wurde im Editor nicht korrekt mit dem gerenderten Zustand verbunden, weil `groupsLayout` beim Aufruf von `renderGroupsSection()` nicht übergeben wurde.

- `src/editor/editor.js`
  - Übergibt `groupsLayout` jetzt explizit an `renderGroupsSection()`.
  - Übergibt `groupsLayout` auch an die Floating-Panels.
- `src/editor/floating-panels.js`
  - Der Schalter `Kleine Gruppen nebeneinander` sitzt jetzt im globalen Darstellungsdialog.
- `src/editor/render-parts.js`
  - Der alte einzelne Schalter neben „Gruppe hinzufügen“ wurde entfernt.

### Einordnung in den Darstellungsdialog

Der Punkt `Kleine Gruppen nebeneinander` ist eine Darstellungsoption der gesamten Card und passt daher besser in den globalen Darstellungsdialog als als einzelner Schalter in der Gruppen-Kopfzeile.

Das reduziert Sonderlogik im Gruppenbereich und hält die Gruppen-Kopfzeile ruhiger.

### Klickverhalten im Editor stabilisiert

Der Document-Click-Handler hat bisher auch bei Klicks innerhalb des Editors Panels geschlossen. Dadurch konnte ein Klick auf `Zur Gruppe hinzufügen` zuerst nur ein geöffnetes Panel schließen, sodass der eigentliche Button erst beim zweiten Klick wirkte.

- Klicks innerhalb des Editors schließen Floating Panels jetzt nicht mehr über den globalen Document-Click-Handler.
- Explizite Button-Handler können Panels weiterhin gezielt schließen oder umschalten.
- Klicks außerhalb schließen Floating Panels weiterhin.

### Zweiter „Gruppe hinzufügen“-Button bei längeren Gruppenlisten

Ab 3 Gruppen wird zusätzlich unter der letzten Gruppe ein weiterer `Gruppe hinzufügen`-Button gerendert.

Ziel: Wenn die Gruppenliste so lang wird, dass man nach unten scrollt, muss man nicht wieder ganz nach oben zum Hinzufügen.

### Gemeinsamer Add-Group-Handler

Der Add-Group-Button nutzt jetzt `data-add-group`, damit oberer und unterer Button denselben Handler verwenden können.

- `src/editor/buttons.js`
  - `id` ist jetzt optional, damit Buttons ohne doppelte IDs sauber gerendert werden können.
- `src/editor/editor.js`
  - Lauscht auf alle `[data-add-group]` Buttons.

### Syntax-/Altlast-Fix

In `src/editor/floating-panels.js` war in der Gruppen-Darstellung ein doppeltes `const estimatedHeight` vorhanden. Das wurde bereinigt.

## Betroffene Dateien

- `package.json`
- `package-lock.json`
- `src/editor/buttons.js`
- `src/editor/editor.js`
- `src/editor/floating-panels.js`
- `src/editor/render-parts.js`
- `src/editor/styles.js`
- `tuev-card.js`
- `docs/B77_EDITOR_GROUP_LAYOUT_AND_HANDOVER.md`
- `HANDOVER.md`

## Nicht geändert

- TÜV-Plakettenrenderer
- Jahresziffern-/SVG-Experimente
- Kennzeichenrenderer
- EuroPlate-/TTF-Verfügbarkeit
- Systemschrift-Fallback bleibt ausgeschlossen
- Gruppen-Farbkonzept wurde nicht umgedacht

## Tests

Ausgeführt:

```bash
npm run check
npm run build
node --check src/editor/floating-panels.js
node --check src/editor/editor.js
node --check src/editor/render-parts.js
node --check src/editor/buttons.js
```

## Manuell zu testen

1. Globalen Darstellungsdialog öffnen und `Kleine Gruppen nebeneinander` ein-/ausschalten.
2. Prüfen, ob die Checkbox sichtbar ihren Zustand ändert und mehrfach umschaltbar bleibt.
3. YAML prüfen:
   - aktiv: `groups_layout: auto`
   - inaktiv: `groups_layout: stacked` bzw. keine Auto-Darstellung.
4. `Zur Gruppe hinzufügen` bei geöffnetem Darstellungsdialog/anderem Floating Panel testen: erster Klick soll direkt wirken.
5. Ab 3 Gruppen prüfen, ob der zusätzliche `Gruppe hinzufügen`-Button unter der letzten Gruppe erscheint.
6. Klick außerhalb des Editors: Floating Panel soll schließen.
7. Klick innerhalb eines Floating Panels: Panel soll offen bleiben, außer bei expliziten Aktionen.

## Nächster sinnvoller Schritt

Wenn b77 im Editor stabil wirkt, danach die eigentliche Laufzeitdarstellung von `groups_layout: auto` nochmal mit echten Beispielen prüfen:

- 2 Gruppen mit je 2 Fahrzeugen
- 3 kleine Gruppen
- 1 große Gruppe mit 6 Fahrzeugen + 1 kleine Gruppe
- schmale/mobile Ansicht
