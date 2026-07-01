# Übergabe Full b322 – Card Renderer Adapter Scaffold

b322 baut auf **b321 – Card Transfer Staged Copy Preview** auf.

## Änderung in b322

- Full-/Übergabe-Dokumentation auf b322 aktualisiert
- Lab-Spiegel unter `tools/plate-physical-lab/` auf b322 synchronisiert
- inaktive staged Renderer-Kopie bleibt unter `src/plate/lab-renderer/`
- neuer inaktiver Card-Adapter:
  - `src/plate/lab-renderer-adapter.js`
- neuer Check:
  - `scripts/check-card-renderer-adapter-scaffold.mjs`
- neues npm-Script:
  - `npm run check:card-renderer-adapter-scaffold`
- Full-`npm run check` prüft den Adapter-Scaffold mit

## Adapter-Status

- aktiver Card-Renderer bleibt `src/plate/renderer.js`
- aktiver Card-Code importiert `lab-renderer-adapter.js` nicht
- Adapter nutzt als staged Renderer-Einstieg nur `src/plate/lab-renderer/plate-public-api.js`
- Adapter nutzt Card-Font-Anbindung über `src/plate/font.js`
- Adapter importiert keine Debug-/Lab-only-Module

## Full-Lab-Spiegel

`tools/plate-physical-lab/` ist in diesem Full-ZIP bewusst mit dem separaten Lab-ZIP b322 synchronisiert. Autoritativ bleibt weiterhin das separate Lab-ZIP.

## Nicht geändert

- kein aktiver Card-Code
- keine Renderer-Umschaltung
- keine Geometrie
- keine Rendererlogik
- keine Solver-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine sichtbare SVG-Änderung

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- Card Transfer Staged Copy: 35/35 OK
- Card Renderer Adapter Scaffold: bestanden
- b321 → b322 Modell-Hashes: 41/41 identisch
- b321 → b322 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
- ZIP-Test: beide ZIPs fehlerfrei

## ZIPs

- `plate-physical-lab-b322-card-renderer-adapter-scaffold.zip`
- `tuev-card-full-b322-card-renderer-adapter-scaffold-handover.zip`

## Nächster sinnvoller Schritt

Weiter ab **b322**. Sinnvoller nächster Schritt: `b323 – Card Renderer Adapter Smoke Checkpoint` oder danach ein kontrollierter Adapter-Vergleich, weiterhin ohne Default-Umschaltung.
