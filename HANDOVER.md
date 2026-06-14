# TÜV Reminder Card - Übergabeprotokoll b91

## Kurzstand

- Projekt: Home Assistant Lovelace Card `tuev-card` für die Integration `tuev_reminder`.
- Neuer Stand: `0.1.1-b91`.
- Neuer ZIP-Name: `tuev-card-full-b91-law-plate-inner-border-width-bands.zip`.
- Ausgangspunkt: `tuev-card-full-b90-law-based-plate-renderer-rebuild.zip`.
- Fokus b91: Kennzeichenrenderer auf ein korrekt getrenntes Außen-/Innenmaßmodell umstellen und kurze Kennzeichen über praxisnahe Breitenstufen beruhigen.

## Direkt vor b91 bestätigte Punkte

- b79 Overlay in Einzelspalte: bestanden.
- b82 Editor-Gruppenfunktionen: bestanden.
- b81 Floating Panels / Sortier-Bestätigungsdialog: bestanden.
- b82 Button-Aktivzustände und „Alle hinzufügen“: bestanden.
- b83 README auf Endnutzer-Level: erledigt.
- b87 HACS-Auslieferung über `dist/`: bestätigt, Fonts kommen nach Update über HACS im Card-Ordner an.
- b90 Card-Kennzeichenrenderer: deutlich besser als b88, aber Kennzeichenhöhe/Skalierung und physische Innenfläche waren noch nicht sauber genug.

## Wichtige Entscheidungen b91

### Außenmaß inklusive Rand

Das einzeilige Kennzeichenmodell verwendet jetzt:

```text
Außenmaß:  Höhe 110 mm
Randband:  4,5 mm oben/unten/links/rechts innerhalb des Außenmaßes
Innenfläche: ca. 101 mm hoch
```

Damit wird die 110-mm-Höhe nicht mehr als komplett nutzbare weiße Fläche behandelt. Eurofeld, Text, HU-Plakette und neutraler Behördensiegelplatz liegen innerhalb der Innenfläche.

### Kurze Kennzeichen nicht frei schrumpfen lassen

Für normale einzeilige Pkw-Kennzeichen ist weiterhin kein gesetzliches Mindestmaß als harte Behauptung im Code hinterlegt. Für die Renderer-Praxis verwendet b91 aber abgestufte Breiten:

```text
340 / 380 / 420 / 460 / 480 / 520 mm
```

Der Renderer berechnet den benötigten Platz und wählt die kleinste passende Stufe. Sehr kurze Kennzeichen wie `K S 70`, `TR M 6` oder `5` landen dadurch nicht mehr bei einer winzigen freien Breite.

### Skalierungsbasis bleibt 520 mm

Auch wenn ein reales kurzes Kennzeichen z. B. nur 340 mm breit gerendert wird, verwendet die Card für die gemeinsame Anzeigehöhe weiterhin ein virtuelles 520-mm-Referenzschild als Skalierungsbasis. Dadurch werden kurze Kennzeichen nicht vertikal aufgeblasen, nur weil sie physisch schmaler sind. Ihre sichtbare Breite bleibt trotzdem kürzer.

## Was b91 geändert hat

### `src/plate/renderer.js`

- Renderer neu auf Außen-/Innenmaßmodell korrigiert.
- `FZV_ONE_LINE` enthält jetzt:
  - `maxWidth: 520`
  - `height: 110`
  - `widthBands: [340, 380, 420, 460, 480, 520]`
  - `borderBand: 4.5`
  - abgeleitete Innenfläche ca. 101 mm.
- Eurofeld füllt jetzt die Innenfläche statt eine separate alte 88-mm-Höhe zu verwenden.
- Text läuft zentral auf der Innenfläche.
- Plaketten-/Siegelspalte wird innerhalb der Innenfläche gesetzt.
- HU-Plakette bleibt klein/generisch und verwendet Jahresfarbe/Rotation.
- Behördensiegel bleibt generisch grau/silbern ohne amtliche Grafik.
- Breitenwahl:
  - Mittelschrift zuerst.
  - kleinste passende Breitenstufe.
  - Engschrift erst danach als Ausweichpfad, wenn Mittelschrift nicht passt.
- `scaleBasisWidth: 520` für Card-Skalierung ergänzt.

### `src/card/plate-layout.js`

- Gemeinsame Skalierung nutzt jetzt `metrics.scaleBasisWidth || metrics.width`.
- Dadurch bleibt die sichtbare Kennzeichenhöhe auch in Karten mit ausschließlich kurzen Kennzeichen ruhig.
- Kurze Kennzeichen behalten ihre kürzere sichtbare Breite.

### Versionierung

- `package.json`: `0.1.1-b91`
- `package-lock.json`: `0.1.1-b91`
- `src/**/*.js`: Import-Querymarker `?v=b91`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b91`
- `dist/tuev-card.js`: `// TÜV Card bundled b91`

### Neue Doku

- `docs/B91_LAW_PLATE_INNER_BORDER_WIDTH_BANDS.md`

## Nicht geändert

- Keine Editor-/Floating-Panel-Funktionsänderung.
- Keine Gruppenlayout-Änderung.
- Keine große TÜV-Plakettenrenderer-Änderung.
- Keine alten Plaketten-/Ziffern-Experimente übernommen.
- Keine Systemschrift als grafischer Kennzeichenfallback.
- Keine echten amtlichen Behörden-/Landessiegelgrafiken.
- Keine Integration neuer Sonderkennzeichenarten in die Card-Config.

## Font-/HACS-Regel ab b91

Im echten lokalen GitHub-Repository sollen die Fontdateien erhalten bleiben:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

Beim Build werden sie nach `dist/fonts/` gespiegelt. HACS installiert die Inhalte aus `dist/`, sodass Home Assistant danach diese Pfade hat:

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

Danach commit/push und in HACS Redownload/Update.

## Testanweisung für b91

1. b91 in den lokalen GitHub-Ordner übernehmen, ohne lokale `.ttf`-Dateien aus `fonts/` zu löschen.
2. `npm run build` und `npm run check` ausführen.
3. Prüfen, ob `dist/fonts/` die beiden Fontdateien enthält.
4. Commit + Push.
5. HACS Redownload/Update.
6. Dashboard hart neu laden.
7. Screenshots mit diesen Kennzeichen prüfen:

```text
WIL CL 212
BKS R 95
WIL LM 216
TR A 77
S AB 1234
DA CI 500
WIL DE 13H
HH EV 204E
K S 70
TR M 6
5
```

## Erwartete b91-Wirkung

- Schwarzer Rand gehört sichtbar zum Außenmaß.
- Weiße Innenfläche wirkt flacher/korrekter als in b90.
- Kurze Kennzeichen werden physisch kurz, aber nicht mehr vertikal aufgeblasen.
- Lange Kennzeichen können weiterhin die Card-Spaltenbreite bestimmen.
- Alle einzeiligen Kennzeichen derselben Card haben eine ruhige gemeinsame Anzeigehöhe.

## Aktuelle Todo-Liste nach b91

### Direkt als nächstes

1. b91 visuell in Home Assistant prüfen.
2. Falls nötig b92-Feintuning:
   - Text-Baseline
   - Eurofeldbreite/-Position
   - Breitenstufen bei 420/460/480
   - Siegelspalte und Siegelgröße
   - Mini-HU-Plakette ggf. durch einfache farbige Fläche ersetzen.
3. Wenn einzeilig stabil ist, Renderer-Lab und Card-Kern wieder angleichen.

### Danach

4. Zweizeilige/Kraftrad/verkleinerte Kennzeichen als eigene Rendererprofile vorbereiten.
5. Saison/Kurzzeit/Ausfuhr/Wechsel später auf dem Maßmodell ergänzen.
6. Firefox / Chrome / Android-App prüfen.
7. Release Candidate vorbereiten, falls Card stabil genug.
8. Danach Integrationsarchitektur V3.

### Später

- Preview-Darstellung an aktuelles Kennzeichenrendering angleichen.
- Kompaktmodus / TÜV-Plakette optional ausblenden.
- Sonderkennzeichen sauber modellieren.
- Zentrale Integrationsarchitektur V3.
