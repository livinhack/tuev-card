# TÜV Reminder Card - Übergabeprotokoll b94

## Stand

- Version: `0.1.1-b94`
- ZIP: `tuev-card-full-b94-physical-plate-rules-width-bands.zip`
- Ausgangspunkt: `b93`
- Fokus: Kennzeichenrenderer weiter von optischem Raten lösen und die Regel festziehen, dass vor der Skalierung ein physisches Kennzeichenmodell in Millimetern entsteht.

## Nutzerentscheidung / Vorgabe

- Feste Regeln für den physikgleichen Renderer vor Skalierung.
- Skalierung darf danach nur auf das Gesamtbild/SVG wirken, nicht auf einzelne Elemente.
- Recherche und Ergänzung der Breitenstufen von Mindest- bis Maximalbreite.
- Offizielle Mindestbreite für einzeilige Pkw-Kennzeichen nicht als Gesetzeswert behaupten; praktische Breitenstufen dürfen als Renderer-/Herstellerlogik genutzt werden.

## Quellen- und Datenstand

- Offizielle FZV/BMV-Angaben: einzeilig max. 520 × 110 mm, zweizeilig max. 340 × 200 mm, Kraftrad 180–220 × 200 mm, verkleinert zweizeilig max. 255 × 130 mm.
- Nutzerdatei `kennzeichenmasse_liste.xlsx` ausgewertet: enthält konsolidierte Werte wie Rand 4,5 mm, Eurofeld 45 mm, Zeichenabstand 8–10 mm, Siegelbereich 63,5–67,5 mm, HU/Plakette 35 mm, Mittelschrift-/Engschrift-Zellbreiten.
- Praktische Breitenstufen aus Hersteller-/Händlerquellen ergänzt.

## Geänderte Dateien

- `src/plate/renderer.js`
  - Breitenstufen getrennt nach Mittelschrift und Engschrift ergänzt.
  - Siegelmodell korrigiert: sichtbare neutrale Behördensiegelfläche 35 mm, reservierter Außenprägungsbereich 45 mm.
  - Zwei 35-mm-Siegelpositionen im 75-mm-Zeichenband mit festem 5-mm-Zwischenraum.
  - Kommentare im Code präzisieren: feste mm-Geometrie vor Skalierung; kein Per-Element-Scaling.
- `docs/B94_PHYSICAL_PLATE_RULES_AND_WIDTH_BANDS.md`
  - neue Detaildoku zu festen Regeln und Breitenbändern.
- `docs/RELEASE_CHECK.md`
  - b94-Prüfnotizen ergänzt.
- `package.json`, `package-lock.json`, `src/**/*.js`
  - Version/Import-Cachebuster auf b94.
- `dist/tuev-card.js`
  - neu gebaut.

## Aktive Breitenbänder im Renderer

Mittelschrift:

```text
340 / 380 / 420 / 460 / 480 / 520 mm
```

Engschrift:

```text
320 / 340 / 380 / 420 / 480 / 520 mm
```

Engschrift wird weiterhin erst nach Mittelschrift versucht. Die 320-mm-Stufe wird dadurch nicht genutzt, nur weil ein kurzes Kennzeichen damit optisch noch kürzer wäre.

## Nicht geändert

- Großer TÜV-Plakettenrenderer.
- Gruppen-/Editorlogik.
- Floating Panels.
- HACS/dist-Struktur.
- Font-Binärdateien im Chat-ZIP: weiterhin nicht enthalten.

## Build/Check

Ausgeführt:

```bash
npm run check
npm run build
```

## Nächster Test

Bitte b94 übernehmen, lokale Fontdateien in `fonts/` behalten, `npm run build`, commit/push, HACS Redownload.

Testkennzeichen:

```text
K S 70
TR M 6
DA CI 500
WIL CL 212
HH EV 204E
BIT GT500
5
```

Wichtigste Prüfung:

1. Wirken die Breitenstufen natürlicher?
2. Sind HU-/Behördensiegelgröße und vertikale Position plausibler?
3. Bleibt das Kennzeichen als Ganzes skaliert, ohne dass Einzelteile unterschiedlich wirken?

## Nächster Einstieg

Falls b94 grundsätzlich besser ist: b95 nur noch Feintuning an festen Werten, z. B. 24 vs. 30 mm Gruppentrennung, 58/63,5/67,5 mm Siegelzone, 8/10 mm Zeichenabstand. Keine Rückkehr zu Canvas-/Glyphbreitenmessung.
