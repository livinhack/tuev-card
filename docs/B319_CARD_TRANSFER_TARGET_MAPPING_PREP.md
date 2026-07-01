# b319 – Card Transfer Target Mapping Prep

## Ziel

b319 ergänzt zum bestehenden Card-Transfer-Dry-Run eine explizite Zielpfad-Zuordnung. Damit ist nicht nur klar, **welche** Lab-Rendererdateien später produktiv übernommen werden sollen, sondern auch **wohin** sie im Card-Projekt gespiegelt werden sollen.

## Ergebnis

- Die produktive Transferliste bleibt bei 35 Dateien.
- Jede produktive Datei hat genau ein Ziel unter `src/plate/lab-renderer/`.
- Lab-/Debug-only-Dateien bleiben ausgeschlossen.
- Der aktive Card-Renderer bleibt unverändert.
- Das Verfahren bleibt manifest-only.

## Geänderte Dateien

- `scripts/card-transfer-dry-run.config.mjs`
- `scripts/check-card-transfer-dry-run.mjs`
- `README.md`
- `HANDOVER.md`
- `package.json`

## Nicht geändert

- keine Rendererlogik
- keine Geometrie
- kein Card-Code
- keine aktive Umschaltung
- keine Debug-Abhängigkeit im produktiven Pfad

## Validierung

Der Dry-Run-Check prüft zusätzlich:

- `targetMappings.length === productionFiles.length`
- jede Quelle steht in `productionFiles`
- jedes Ziel liegt unter `targetBase`
- keine doppelten Quellen
- keine doppelten Ziele
- keine Lab-/Debug-only-Dateien in der Zuordnung
- kein Pfad-Traversal

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- b318 → b319 Modell-Hashes: 41/41 identisch
- b318 → b319 SVG-Hashes: 41/41 identisch
