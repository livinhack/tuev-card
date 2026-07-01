# b321 – Card Transfer Staged Copy Preview

## Ziel

b321 ergänzt den bisherigen Manifest-/Dry-Run-Plan um eine inaktive Staged-Copy im Full-ZIP. Die produktiven Lab-Rendererdateien werden dort unter `src/plate/lab-renderer/` gespiegelt, aber noch nicht vom aktiven Card-Renderer importiert oder genutzt.

## Sicherheitsgrenze

Die aktive Card bleibt unverändert. Insbesondere bleiben diese aktiven Dateien ohne Import auf `lab-renderer`:

- `src/plate/font.js`
- `src/plate/mm-model.js`
- `src/plate/renderer.js`

## Staged-Copy-Ziel

```text
src/plate/lab-renderer/
```

## Umfang

- 35 produktive Rendererdateien aus dem Lab-Manifest
- 8 Lab-/Debug-only-Ausschlüsse bleiben ausgeschlossen
- keine Debugmodule im Staged-Copy-Ziel
- keine aktive Renderer-Umschaltung

## Full-Check

Im Full-ZIP prüft `scripts/check-card-transfer-staged-copy.mjs`:

- alle 35 Ziel-Dateien existieren
- jede Ziel-Datei ist byte- und hashgleich zur Lab-Spiegel-Quelle
- keine Lab-/Debug-only-Datei wurde kopiert
- aktive Card-Dateien importieren `lab-renderer` noch nicht

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- Card Transfer Staged Copy: bestanden
- b320 → b321 Modell-Hashes: 41/41 identisch
- b320 → b321 SVG-Hashes: 41/41 identisch

## Ergebnis

b321 ist ein vorbereitender Transferstand. Der neue Renderer liegt im Full-ZIP inaktiv bereit, aber der produktive Card-Renderer bleibt unverändert.
