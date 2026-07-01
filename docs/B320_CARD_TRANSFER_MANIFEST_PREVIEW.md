# b320 – Card Transfer Manifest Preview

## Ziel

b320 ergänzt zum bestehenden Dry-Run eine manifestartige Prüfschicht für die geplante Card-Übernahme. Damit wird nicht nur geprüft, welche Dateien wohin gehen sollen, sondern auch, ob die Quellen lesbar, nicht leer und deterministisch in der geplanten Reihenfolge abbildbar sind.

## Ergebnis

- Die produktive Transferliste bleibt bei 35 Dateien.
- Der aktive Card-Renderer bleibt unverändert.
- Das Verfahren bleibt weiterhin `manifest-only`.
- Jede geplante Quelle wird mit Byte-Größe und SHA-256-Hash geprüft.
- Mapping-Reihenfolge muss der `productionFiles`-Reihenfolge folgen.
- Lab-/Debug-only-Dateien bleiben ausgeschlossen.

## Geänderte Dateien

- `scripts/check-card-transfer-manifest.mjs`
- `scripts/card-transfer-dry-run.config.mjs`
- `package.json`
- `README.md`
- `HANDOVER.md`

## Nicht geändert

- keine Rendererlogik
- keine Geometrie
- kein Card-Code
- keine aktive Umschaltung
- keine Debug-Abhängigkeit im produktiven Pfad

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- b319 → b320 Modell-Hashes: 41/41 identisch
- b319 → b320 SVG-Hashes: 41/41 identisch
