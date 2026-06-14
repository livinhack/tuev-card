# TÜV Reminder Card - Übergabeprotokoll b79

## Projektkontext

- Projekt: Home Assistant Custom Card / Integration „TÜV Reminder“.
- Aktueller Schwerpunkt: `tuev-card`, besonders Gruppen-/Editor-Darstellung und kleine UI-Feinschliffe.
- Code, Dateinamen und Funktionen grundsätzlich Englisch halten.
- Deutsche UI-Texte nur über Übersetzungen/Lokalisierung lösen.
- ZIP-Versionierung fortlaufend weiterzählen.
- Bei jedem neuen Arbeitsstand einen neuen ZIP mit nächster Versionsnummer erzeugen.
- Ab b77/b78 enthält jedes neue ZIP ein vollständiges Übergabeprotokoll.

## Version / Stand

- Vorheriger Arbeitsstand: `tuev-card-full-b78-single-column-stamp-scale.zip`
- Tatsächlich erkannte Version im Input: `0.1.1-b78`
- Neuer Stand: `0.1.1-b79`
- Neuer ZIP-Name: `tuev-card-full-b79-single-column-stamp-rethink-version-sync.zip`

## Stabile Grundlagen, die nicht unnötig geändert werden sollen

- Frühere stabile Basis: `tuev-card-full-a91-cleanup.zip`.
- Danach b-Versionen; aktueller Arbeitszweig ist b-Serie.
- Kennzeichenrenderer ist grundsätzlich stabil.
- Grafische Kennzeichen sind nur verfügbar, wenn die benötigte Schrift vorhanden ist.
- Kein Systemschrift-Fallback für grafische Kennzeichen.
- TÜV-Plakettenrenderer nicht unnötig ändern.
- Alte Plaketten-/Ziffern-Experimente nach „Zentrierung sieht gut aus“ bleiben verworfen, bis neue SVG-Daten vorliegen.
- Gruppenabhängige Färbung der Buttons/Badges ist gut und soll nicht grundsätzlich umgedacht werden.

## Ausgangslage b78

b78 sollte den roten/grünen TÜV-Dialog in der 1-Spalten-Darstellung vergrößern.

Der Nutzer meldete danach:

- Keine sichtbare Änderung.
- In 1 Spalte ist der Dialog weiter zu klein im Verhältnis zum verfügbaren Platz.
- 2-, 3- und 4-Spalten wirken inzwischen gut.
- Nebenbemerkung: Versionsnummern innerhalb der Dateien müssen mitgehen; in `tuev-card.js` stand noch `b75`.

## Ursache der fehlenden b78-Wirkung

b78 hat die größere Stempelvariante an `compact === false` gekoppelt.

In der echten gezeigten 1-Spalten-Situation mit mehreren Fahrzeugen ist `compact` aber weiterhin `true`, weil `compact` bisher aus `sectionIsMulti` abgeleitet wird. Es bedeutet also eher „mehrere Fahrzeuge im Abschnitt“ und nicht „aktuell mehrere Spalten“.

Deshalb blieb der betroffene 1-Spalten-Fall im alten kompakten Stempelmodus.

Zusätzlich war in `scripts/build-bundle.mjs` noch `const version = "b75"` hart kodiert. Dadurch wurde der Header von `tuev-card.js` trotz neuer Paketversion weiterhin als b75 gebaut.

## Was b79 ändert

### 1. TÜV-Dialog in echter 1-Spalten-Darstellung neu gedacht

Datei: `src/card/render-parts.js`

`renderCompactConfirmPanel()` erhält zusätzlich:

- `badgeSize`
- `layoutColumns`

Neue Logik:

- `badgeSingleColumn = withBadge && layoutColumns <= 1`

Damit richtet sich die Overlay-Größe nach der tatsächlichen Layout-Spaltenzahl, nicht mehr nach `compact`.

Für `badgeSingleColumn` werden diese Werte proportional zur Plakettengröße skaliert:

- rote Warnstempel-Schrift
- grüner Aktionsstempel-Schrift
- Mindestbreiten
- Padding
- Abstand zwischen rotem und grünem Stempel
- X-Versatz des grünen Stempels
- Checkbox-/Hakenfeldgröße
- maximale Overlaybreite

Die Skalierung ist begrenzt, damit sie in 1 Spalte sichtbar größer wird, aber nicht unkontrolliert wächst.

### 2. Echte Layoutdaten an den Overlay-Renderer übergeben

Datei: `src/tuev-card-entry.js`

Beim Aufruf von `renderCompactConfirmPanel()` werden jetzt übergeben:

- `badgeSize`
- `layoutColumns: layout.effectiveColumns`

Damit kann der Renderer unterscheiden:

- 1 Spalte mit mehreren Fahrzeugen: großer Stempel
- 2/3/4 Spalten: bestehender kompakter Stempel

### 3. Bundle-Version automatisch synchronisiert

Datei: `scripts/build-bundle.mjs`

Vorher:

```js
const version = "b75";
```

Jetzt:

- `package.json` wird gelesen.
- Aus `0.1.1-b79` wird automatisch `b79` extrahiert.
- Der Bundle-Header wird daraus erzeugt.

Ergebnis nach Build:

```js
// TÜV Card bundled b79
```

### 4. Source-Version / Cachebuster aktualisiert

- `src/tuev-card-entry.js` beginnt jetzt mit `// TÜV Card source entry b79`.
- Alle `src/**/*.js` Import-Cachebuster stehen auf `?v=b79`.
- `package.json` und `package-lock.json` stehen auf `0.1.1-b79`.

## Betroffene Dateien in b79

- `package.json`
  - Version auf `0.1.1-b79`.
- `package-lock.json`
  - Version auf `0.1.1-b79`.
- `scripts/build-bundle.mjs`
  - Bundle-Version wird aus `package.json` abgeleitet.
- `src/card/render-parts.js`
  - echte 1-Spalten-Erkennung und skalierte Stempelwerte.
- `src/tuev-card-entry.js`
  - Übergabe von `badgeSize` und `layout.effectiveColumns` an den Stempelrenderer.
  - Source-Kommentar auf b79.
- `src/**/*.js`
  - Import-Cachebuster auf `?v=b79`.
- `tuev-card.js`
  - Bundle neu gebaut; Header b79.
- `docs/B79_SINGLE_COLUMN_STAMP_AND_VERSION_SYNC.md`
  - technische b79-Dokumentation.
- `HANDOVER.md`
  - dieses vollständige Übergabeprotokoll.
- aktuelle Check-/Release-Dokumente
  - Current-Version-/Cachebuster-Hinweise auf b79 aktualisiert, soweit sie den aktuellen Stand beschreiben.

## Bewusst nicht geändert

- Kein Refactor des TÜV-Plakettenrenderers.
- Keine inhaltliche Änderung an `src/badge/*` außer Import-Cachebuster.
- Keine Änderung am Kennzeichenrenderer oder an der EuroPlate-/Font-Logik außer Import-Cachebuster.
- Kein Systemschrift-Fallback eingeführt.
- Keine Änderung an Editor-Floating-Panels.
- Keine Änderung an Gruppen-nebeneinander-Logik.
- 2-/3-/4-Spalten-Stempelwerte sollten durch die neue Bedingung unverändert bleiben.

## Tests ausgeführt

```bash
node --check src/card/render-parts.js
node --check src/tuev-card-entry.js
node --check scripts/build-bundle.mjs
npm run check
npm run build
```

Ergebnis:

- Alle 27 JavaScript-Dateien geprüft.
- Build erfolgreich.
- `tuev-card.js` beginnt mit `// TÜV Card bundled b79`.
- Im Bundle ist `// TÜV Card source entry b79` enthalten.

## Manuelle Testpunkte für den Nutzer

1. 1-Spalten-Ansicht mit mehreren Fahrzeugen und sichtbarer Plakette testen.
   - Erwartung: Der rote/grüne TÜV-Dialog ist jetzt deutlich größer als in b78.
2. 2-Spalten-Darstellung testen.
   - Erwartung: Stempel bleibt ungefähr wie vorher und läuft nicht über.
3. 3- und 4-Spalten-Darstellung testen.
   - Erwartung: keine übergroßen Stempel, kein Layoutbruch.
4. Cache prüfen.
   - Empfohlene Ressourcen-URL: `/hacsfiles/tuev-card/tuev-card.js?v=b79`
   - Zusätzlich Browser-/HA-Cache leeren, falls weiter alte Darstellung sichtbar ist.
5. Geladenes Bundle prüfen.
   - `tuev-card.js` sollte im Header `b79` zeigen, nicht mehr `b75`.

## Offene / spätere Punkte

- Falls b79 noch zu klein oder zu groß wirkt, nur die `badgeSingleColumn`-Werte in `src/card/render-parts.js` feinjustieren.
- Nicht wieder an `compact` koppeln; der Fehler in b78 kam genau daher.
- Danach zum Gruppen-/Editor-Thema zurückkehren:
  - `Kleine Gruppen nebeneinander` mehrfach ein-/ausschalten.
  - `Zur Gruppe hinzufügen` beim ersten Klick prüfen.
  - Zusätzlicher `Gruppe hinzufügen`-Button unten ab 3 Gruppen prüfen.
  - Gruppen nebeneinander nur für kleine Gruppen ruhig/kontrolliert halten.
- Kennzeichen-Rendering zwischen Firefox, Chrome und Android-App später umfassender prüfen.
- Preview-Darstellung später eventuell an aktuelles Kennzeichenrendering angleichen.
- Keine größeren Renderer-Refactors als Nebenänderung einschleusen.

## Fortsetzung nach Chatlimit

In einem neuen Chat diesen Stand hochladen und sagen:

„Bitte mit `tuev-card-full-b79-single-column-stamp-rethink-version-sync.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. Fokus: Testauswertung der 1-Spalten-Stempelgröße; danach zurück zu Gruppen-/Editor-Darstellung.“
