# b318 – Card Transfer Dry Run Scaffold

b318 baut auf **b317 – Card Renderer Transfer Plan** auf.

Dieser Stand erzeugt ein isoliertes Dry-Run-Scaffold für die spätere Card-Übernahme des Lab-Renderers. Es wird noch kein produktiver Card-Renderer ersetzt und keine Card-Darstellung umgeschaltet.

## Ziel

Der spätere Transfer soll nicht nur als Textplan existieren, sondern eine maschinenprüfbare Manifest-Struktur haben:

- welche produktiven Lab-Dateien später kopiert werden dürfen,
- welche Lab-/Debug-only-Dateien ausgeschlossen bleiben,
- welche bestehenden Card-Dateien später behalten oder ersetzt werden,
- dass der aktive Card-Renderer in diesem Stand unverändert bleibt.

## Neue Dateien

- `scripts/card-transfer-dry-run.config.mjs`
- `scripts/check-card-transfer-dry-run.mjs`

## Neue Checks

Im Lab:

```text
npm run check:card-transfer-dry-run
npm run check
```

Der Full-Check ruft den Lab-Spiegel-Check ebenfalls über `tools/plate-physical-lab/` auf.

## Dry-Run-Regeln

Das Scaffold ist absichtlich **manifest-only**:

- keine Dateien werden automatisch in die Card kopiert,
- kein aktiver Card-Import wird geändert,
- `src/plate/renderer.js` bleibt unangetastet,
- `src/plate/mm-model.js` bleibt unangetastet,
- Debug-/Lab-only-Dateien bleiben ausgeschlossen.

## Guard-Ergebnis

```text
Card transfer dry run scaffold OK: 35 production files, 8 lab-only exclusions, active Card renderer unchanged.
```

Zusätzlich bleibt der Production Import Boundary Guard grün:

```text
Production import boundary OK: 5 entries, 35 production files, 0 lab/debug-only imports.
```

## Status b318

- Keine Geometrieänderung.
- Keine Rendererlogikänderung.
- Keine Card-Code-Änderung.
- Keine sichtbare SVG-Änderung.
- Full-Spiegel bleibt mit separatem Lab-ZIP synchronisiert, aber nicht autoritativ.
