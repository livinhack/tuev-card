# TÜV Reminder Card - Übergabeprotokoll b88

## Kurzstand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration `tuev_reminder`.
- Neuer Stand: `0.1.1-b88`.
- Neuer ZIP-Name: `tuev-card-full-b88-physical-plate-renderer-v2.zip`.
- Ausgangspunkt: `tuev-card-full-b87-hacs-dist-bundle-font-assets.zip`.
- Fokus b88: Start des Kennzeichenrenderer-v2 mit physischem, mm-orientiertem einzeiligen Standardkennzeichenmodell.

## Direkt vor b88 bestätigte Punkte

- b79 Overlay in Einzelspalte: bestanden.
- b82 Editor-Gruppenfunktionen: bestanden.
- b81 Floating Panels / Sortier-Bestätigungsdialog: bestanden.
- b82 Button-Aktivzustände und „Alle hinzufügen“: bestanden.
- b83 README auf Endnutzer-Level: erledigt.
- b84/b85 GL-Font-/Renderer-Grundlage: vorhanden.
- b86 README-Fontblock entfernt und HACS-Fontpfad vorbereitet.
- b87 HACS-Auslieferung über `dist/`: bestätigt, Fonts kommen nach Update über HACS im Card-Ordner an.

## Wichtige Entscheidung b88

Der grafische Kennzeichenrenderer wird nicht weiter durch frei geschätzte Pixelgeometrie aufgebaut, sondern zuerst als normnahes physisches Modell in mm-ähnlichen SVG-Koordinaten erzeugt. Danach skaliert die Card das Kennzeichen wie bisher über die gemeinsame Card-Skalierung.

Grundregel:

```text
Kennzeicheninhalt -> physisches Kennzeichenmodell -> intrinsische SVG-Größe
                  -> breitestes Kennzeichen bestimmt Card-Skalierung
                  -> alle Kennzeichen derselben Card nutzen dieselbe Zielhöhe
```

Für Siegel gilt:

```text
echte Maße/Positionen: ja
echte Behörden-/Landessiegelgrafik: nein
neutrale Behördensiegel-Platzhalter: ja
HU-Plakette als TÜV-Reminder-Element: ja, zunächst vereinfacht und klein skaliert
```

## Was b88 geändert hat

### Neuer physischer Layout-Layer

- Neue Datei: `src/plate/physical-layout.js`
- Enthält ein einzeiliges Standardkennzeichenmodell:
  - Höhe: 110 mm-ähnliche Einheiten
  - Maximalbreite: 520
  - Mindestbreite: 255
  - Eurofeld
  - Außenrand
  - Textzone
  - Siegelspalte
  - Positionen für HU-Plakette und Behördensiegel-Platzhalter
  - getrennte Schriftgrößen/Spacing für GL-Mittelschrift und GL-Engschrift
  - automatische Engschrift-Neuberechnung, wenn Mittelschrift-Inhalt die maximale einzeilige Breite überschreiten würde

### GL-Renderer umgebaut

- Datei: `src/plate/renderer.js`
- GL-Schriften nutzen jetzt den neuen physischen Layoutpfad.
- Bei Kennzeichen mit Leerzeichen wird gerendert als:

```text
[Eurofeld] [Ortskennung] [HU/Behörden-Platzhalter] [Erkennungsnummer]
```

- Beispiel: `GL AB 1234`
  - `GL` links der Siegelspalte
  - `AB 1234` rechts der Siegelspalte
- Bei Kennzeichen ohne Leerzeichen wird weiterhin ein einzelner Textblock gerendert.
- Behördensiegelstelle ist neutral grau/silbern und absichtlich nicht amtlich.
- HU-Stelle rendert eine kleine vereinfachte TÜV-Reminder-Plakette:
  - Jahresfarbe aus dem bestehenden TÜV-Farbzyklus
  - Rotation aus dem Fahrzeugmonat
  - kleine Ticks und Jahreszahl
- Der bestehende TÜV-Plakettenrenderer für die große Card-Plakette wurde nicht verändert.
- EuroPlate bleibt nur Legacy-Fallback.
- Es gibt weiterhin keinen Systemschrift-Fallback.

### Card-Anbindung

- Datei: `src/tuev-card-entry.js`
- Der Plate-Renderer bekommt jetzt zusätzlich:
  - `huYear: year`
  - `huRotation: rotation`
- Dadurch kann die Mini-HU-Plakette im Kennzeichen dieselbe Jahresfarbe und Monatsrotation nutzen wie das Fahrzeug.

### Versionierung

- `package.json`: `0.1.1-b88`
- `package-lock.json`: `0.1.1-b88`
- `src/**/*.js`: Import-Querymarker `?v=b88`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b88`
- `dist/tuev-card.js`: `// TÜV Card bundled b88`

### Neue Doku

- `docs/B88_PHYSICAL_PLATE_RENDERER_V2.md`
- Aktive Release-/Repo-Dokus auf b88 aktualisiert.

## Nicht geändert

- Keine Editor-/Floating-Panel-Funktionsänderung.
- Keine Gruppenlayout-Änderung.
- Keine große TÜV-Plakettenrenderer-Änderung.
- Keine alten Plaketten-/Ziffern-Experimente übernommen.
- Keine Systemschrift als grafischer Kennzeichenfallback.
- Keine echten amtlichen Siegelgrafiken.
- Keine zweizeiligen Kennzeichen.
- Keine Saison-/Wechsel-/Sonderkennzeichen.

## Font-/HACS-Regel ab b88

Das ChatGPT-ZIP enthält weiterhin keine Font-Binärdateien (`.ttf`, `.otf`, `.woff`, `.woff2`).

Im echten lokalen GitHub-Repository sollen die Fontdateien erhalten bleiben:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

Beim Build werden sie nach `dist/fonts/` gespiegelt. HACS installiert die Inhalte aus `dist/`, sodass Home Assistant danach diese Pfade haben sollte:

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

Erwartet:

```text
dist/tuev-card.js
dist/fonts/GL-Nummernschild-Mtl.ttf
dist/fonts/GL-Nummernschild-Eng.ttf
```

Wenn das ChatGPT-ZIP übernommen wird, aber die lokalen `.ttf`-Dateien bereits im Root-`fonts/`-Ordner liegen, danach `npm run build` ausführen, damit sie nach `dist/fonts/` gespiegelt werden.

## Testanweisung für b88

1. b88 in den lokalen GitHub-Ordner übernehmen, ohne lokale `.ttf`-Dateien aus `fonts/` zu löschen.
2. `npm run build` ausführen.
3. Commit + Push.
4. In HACS Update/Redownload ausführen.
5. Dashboard mit normaler HACS-Resource laden.
6. Grafische Kennzeichen testen, besonders:

```text
K A 1
TR LR 123
GL AB 1234
M MW 9999
```

7. Prüfen:
   - Ist die Siegelspalte zwischen Ortskennung und restlichem Kennzeichen an der richtigen Stelle?
   - Ist das neutrale Behördensiegel unauffällig genug?
   - Ist die Mini-HU-Plakette erkennbar oder zu unruhig?
   - Skaliert das breiteste Kennzeichen die übrigen Kennzeichen derselben Card sauber mit?
   - Gibt es Unterschiede zwischen Firefox, Chrome und Android-App?

## Aktuelle Todo-Liste nach b88

### Direkt als nächstes

1. b88 Renderer per Screenshot prüfen.
2. b89 Renderer-Feintuning:
   - Textgröße / Baseline
   - Zeichenabstand
   - Siegelspaltenbreite
   - HU-Mini-Plakette vs. einfache farbige Fläche entscheiden
   - Mindestbreite kurzer Kennzeichen prüfen

### Danach

3. Renderer-Stabilität Firefox / Chrome / Android-App prüfen.
4. GL-Mittelschrift/Engschrift-Werte finalisieren.
5. Release Candidate vorbereiten, falls Card stabil genug.
6. Danach Integrationsarchitektur V3.

### Später

- Preview-Darstellung an aktuelles Kennzeichenrendering angleichen.
- Zweizeilige Kennzeichen.
- Saisonkennzeichen.
- Wechselkennzeichen.
- Grüne Kennzeichen.
- Option TÜV-Plakette ausblenden / Compact-Card.
- Gruppen nebeneinander ggf. weiter verfeinern, falls Praxisfälle auffallen.

## Fortsetzungshinweis für neuen Chat

Bitte mit `tuev-card-full-b88-physical-plate-renderer-v2.zip` fortsetzen. Zuerst `HANDOVER.md` lesen. Stand: b79 Overlay bestanden, Editor-Gruppenfunktionen bestanden, Floating Panels bestanden, b81 Sortier-Bestätigungsdialog modal bestanden, b82 Button-Zustände und „Alle hinzufügen“ bestanden, b83 README auf Endnutzer-Level, b84/b85 GL-Font-/Renderer-Grundlage, b86 Fontblock entfernt, b87 HACS-Auslieferung auf `dist/` bestätigt, b88 startet den physischen einzeiligen Kennzeichenrenderer-v2. Das ChatGPT-ZIP enthält keine Font-Binärdateien; im echten lokalen GitHub-Repo müssen `fonts/GL-Nummernschild-Mtl.ttf` und `fonts/GL-Nummernschild-Eng.ttf` erhalten bleiben und per `npm run build` nach `dist/fonts/` gespiegelt werden. Nächster Schritt: b88 per Screenshot prüfen und in b89 Rendererwerte feinjustieren. TÜV-Plakettenrenderer nicht unnötig ändern. Systemschrift-Fallback bleibt ausgeschlossen. Echte Behörden-/Landessiegelgrafik wird nicht nachgebaut; nur neutrale Platzhalter sind vorgesehen.
