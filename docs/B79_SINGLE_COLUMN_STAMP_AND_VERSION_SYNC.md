# b79 - Single-column stamp rethink and version sync

## Input / Ausgangspunkt

- Input ZIP: `tuev-card-full-b78-single-column-stamp-scale.zip`
- Erkannte Version: `0.1.1-b78`
- Neuer Stand: `0.1.1-b79`

## Anlass

Der Nutzer meldete nach b78:

- Keine sichtbare Änderung am roten/grünen TÜV-Dialog in der 1-Spalten-Darstellung.
- Die Stempelgröße wirkt in 1 Spalte weiterhin zu klein im Verhältnis zur verfügbaren Plakettenfläche.
- 2-, 3- und 4-Spalten wirken gut und sollen möglichst unverändert bleiben.
- Zusätzlich fiel auf, dass `tuev-card.js` noch den Bundle-Kommentar `b75` enthielt.

## Ursache

b78 hatte die größere Stempelvariante an `compact === false` gekoppelt.

In der echten 1-Spalten-Situation mit mehreren Fahrzeugen ist `compact` aber weiterhin `true`, weil `compact` bisher aus `sectionIsMulti` abgeleitet wird. Dadurch blieb der betroffene Fall im alten kompakten Stempelmodus und die b78-Werte wurden nicht sichtbar.

Außerdem enthielt `scripts/build-bundle.mjs` noch eine fest kodierte Bundle-Version `b75`. Dadurch wurde der gebaute `tuev-card.js`-Header nicht automatisch mit der Paketversion aktualisiert.

## Änderungen

### Sichtbare Stempelgröße für echte 1-Spalten-Darstellung

Datei: `src/card/render-parts.js`

- `renderCompactConfirmPanel()` erhält zusätzlich:
  - `badgeSize`
  - `layoutColumns`
- Neue Erkennung:
  - `badgeSingleColumn = withBadge && layoutColumns <= 1`
- Diese Erkennung basiert auf der tatsächlichen Layout-Spaltenzahl statt auf `compact`.
- Für `badgeSingleColumn` werden rote/grüne Stempel proportional zur Plakettengröße skaliert.
- Die Skalierung ist begrenzt, damit der Dialog nicht übertreibt:
  - Mindestskalierung ca. `1.14`
  - Maximalskalierung ca. `1.42`
- Betroffene Werte:
  - Schriftgröße
  - Mindestbreiten
  - Padding
  - Abstand zwischen rotem und grünem Stempel
  - X-Versatz des grünen Stempels
  - Checkbox-/Hakenfeldgröße
  - Maximalbreite des Overlay-Containers

### Übergabe der echten Layoutdaten

Datei: `src/tuev-card-entry.js`

- Beim Aufruf von `renderCompactConfirmPanel()` werden jetzt übergeben:
  - `badgeSize`
  - `layoutColumns: layout.effectiveColumns`

Damit kann der Overlay-Renderer unterscheiden zwischen:

- 1 Spalte mit mehreren Fahrzeugen: größerer Stempel
- 2/3/4 Spalten: bestehender kompakter Stempel

### Versionsnummern im Bundle synchronisiert

Datei: `scripts/build-bundle.mjs`

- Die Bundle-Version wird nicht mehr fest auf `b75` gesetzt.
- Der Build liest jetzt `package.json` und extrahiert den Suffix, z. B. `0.1.1-b79` -> `b79`.
- Dadurch schreibt `npm run build` künftig automatisch den passenden Header:
  - `// TÜV Card bundled b79`

### Cachebuster und Source-Kommentar

- Alle `src/**/*.js` Import-Cachebuster wurden auf `?v=b79` aktualisiert.
- `src/tuev-card-entry.js` beginnt jetzt mit:
  - `// TÜV Card source entry b79`

## Betroffene Dateien

- `package.json`
- `package-lock.json`
- `scripts/build-bundle.mjs`
- `src/card/render-parts.js`
- `src/tuev-card-entry.js`
- `src/**/*.js` Import-Cachebuster
- `tuev-card.js`
- `HANDOVER.md`
- `docs/B79_SINGLE_COLUMN_STAMP_AND_VERSION_SYNC.md`
- aktuelle Release-/Check-Dokumente mit Cachebuster-/Current-Version-Hinweisen

## Bewusst nicht geändert

- Kein Refactor des TÜV-Plakettenrenderers.
- Keine Änderung an `src/badge/*` außer Import-Cachebuster.
- Keine Änderung am Kennzeichenrenderer oder an der EuroPlate-/Font-Logik außer Import-Cachebuster.
- Keine Änderung am Systemschrift-Fallback; dieser bleibt ausgeschlossen.
- Keine Änderung an Editor-Floating-Panels oder Gruppenlogik.
- Keine Änderung an der 2-/3-/4-Spalten-Stempeloptik beabsichtigt.

## Tests

Ausgeführt:

```bash
node --check src/card/render-parts.js
node --check src/tuev-card-entry.js
node --check scripts/build-bundle.mjs
npm run check
npm run build
```

Zusätzlich geprüft:

- `tuev-card.js` beginnt jetzt mit `// TÜV Card bundled b79`.
- `tuev-card.js` enthält `// TÜV Card source entry b79`.

## Manuelle Testpunkte

1. 1-Spalten-Ansicht mit mehreren Fahrzeugen und sichtbarer Plakette testen.
   - Erwartung: roter/grüner TÜV-Dialog ist jetzt deutlich größer als in b78.
2. 2-Spalten-Ansicht testen.
   - Erwartung: Stempel bleibt ungefähr wie bisher und läuft nicht über.
3. 3- und 4-Spalten testen.
   - Erwartung: keine übergroßen Stempel, keine Layoutverschlechterung.
4. Browsercache/HACS-Ressourcen-URL prüfen:
   - empfohlen: `/hacsfiles/tuev-card/tuev-card.js?v=b79`
5. In den Entwicklerwerkzeugen oder im geladenen JS prüfen:
   - Bundle-Header sollte `b79` zeigen.

## Nächster Einstieg

Falls b79 visuell passt:

- Danach wieder zum Gruppen-/Editor-Thema zurückkehren.
- Besonders prüfen:
  - `Kleine Gruppen nebeneinander` mehrfach ein-/ausschalten.
  - `Zur Gruppe hinzufügen` reagiert beim ersten Klick.
  - Zusätzlicher `Gruppe hinzufügen`-Button unten ab 3 Gruppen.
  - Gruppen nebeneinander nur bei kleinen Gruppen sinnvoll aktiv.

Falls b79 noch nicht passt:

- Nur die `badgeSingleColumn`-Werte in `src/card/render-parts.js` feinjustieren.
- Nicht wieder an `compact` koppeln.
- 2/3/4-Spalten nur anfassen, wenn dort tatsächlich ein neuer Fehler sichtbar ist.
