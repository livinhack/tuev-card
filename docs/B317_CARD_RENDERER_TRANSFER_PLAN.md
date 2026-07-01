# b317 – Card Renderer Transfer Plan

b317 baut auf **b316 – Production Boundary Guard Smoke Checkpoint** auf.

Dieser Stand ist ein reiner Plan-/Dokustand für die spätere Übernahme des Lab-Renderers in die Card. Es werden keine Rendererformeln, keine Geometrie, keine Solver, keine UI-Controls und kein Card-Code geändert.

## Ziel

Der spätere Card-Transfer soll nicht ad hoc erfolgen, sondern anhand einer festen Datei- und Reihenfolge-Liste. Dadurch bleibt klar:

- welche Lab-Dateien produktiv übernommen werden dürfen,
- welche Lab-/Debug-Dateien ausdrücklich nicht in die Card dürfen,
- welche bestehenden Card-Dateien später ersetzt, angepasst oder behalten werden,
- welche Checks nach jedem Transfer-Schritt laufen müssen.

## Produktive Renderer-Closure

Der Boundary-Guard meldet weiterhin:

```text
Production import boundary OK: 5 entries, 35 production files, 0 lab/debug-only imports.
```

Diese **35 Dateien** bilden die produktive Lab-Renderer-Closure und sind die maximal relevante Übernahmebasis für die spätere Card-Integration:

- `src/plate/chain-solver.js`
- `src/plate/change-plate-slot-plan.js`
- `src/plate/change-plate-supplement-renderer.js`
- `src/plate/change-plate.js`
- `src/plate/eu-country-mark.js`
- `src/plate/eu-star-wreath.js`
- `src/plate/euro-field.js`
- `src/plate/mm-model.js`
- `src/plate/plate-body.js`
- `src/plate/plate-format-strategy.js`
- `src/plate/plate-layout-model.js`
- `src/plate/plate-layout-result-utils.js`
- `src/plate/plate-number-utils.js`
- `src/plate/plate-public-api.js`
- `src/plate/plate-render-context.js`
- `src/plate/plate-render-shell.js`
- `src/plate/plate-rules.js`
- `src/plate/plate-season-options.js`
- `src/plate/plate-sequence-width-utils.js`
- `src/plate/plate-spacing-surface-utils.js`
- `src/plate/plate-svg-renderer.js`
- `src/plate/plate-variant-rules.js`
- `src/plate/plate-visual-style.js`
- `src/plate/plate-width-strategy.js`
- `src/plate/reduced-row-chain-solver.js`
- `src/plate/row-layout-adapter.js`
- `src/plate/row-sequence-builder.js`
- `src/plate/seal-components.js`
- `src/plate/seal-geometry-plan.js`
- `src/plate/seal-marker-plan.js`
- `src/plate/seal-slot-marker.js`
- `src/plate/season-field.js`
- `src/plate/spacing-solver.js`
- `src/plate/svg-escape-utils.js`
- `src/plate/text-utils.js`

## Nicht in die Card übernehmen

Diese Dateien/Ordner bleiben Lab-only oder Debug-only:

- `src/plate/debug-dimensions.js`
- `src/plate/plate-lab-debug-renderers.js`
- `src/plate/regression-cases.js`
- `app.js`
- `viewer-calibration.js`
- `font-calibration.js`
- `scripts/run-regression.mjs`
- `reference/`
- `fonts/*.ttf (nie im Chat-ZIP; lokal separat)`

Besonders wichtig:

```text
Card darf nicht importieren:
- src/plate/debug-dimensions.js
- src/plate/plate-lab-debug-renderers.js
```

## Bestehende Card-Dateien beim späteren Transfer

Aktueller Card-Renderer-Bereich im Full-Projekt:

- `src/plate/font.js` – **behalten/anpassen**: Card-spezifisches Font-Laden, HACS-/local-Pfade, Fontstatus.
- `src/plate/renderer.js` – **später Adapter neu bauen**: Card-API (`renderLicensePlate`, `getLicensePlateMetrics`, Fontstatus-Exports) soll erhalten bleiben, aber intern den neuen Lab-Renderer verwenden.
- `src/plate/mm-model.js` – **später ersetzen/ablösen**: alter monolithischer Rendererstand; nicht manuell mit dem Lab-Modul vermischen.

## Empfohlene Transfer-Reihenfolge

### Schritt 1 – Card-Transfer-Arbeitszweig vorbereiten

- neuen Stand aus aktuellem Full-ZIP erzeugen,
- noch keine produktive Integration erzwingen,
- Boundary-Guard behalten und vor/nach jedem Transfer laufen lassen.

### Schritt 2 – Lab-Closure in Card-Spiegel kopieren

- produktive 35-Dateien-Closure aus dem Lab in einen klaren Card-Pfad übernehmen,
- keine `debug-*`-/Lab-only-Dateien übernehmen,
- keine Font-Binärdateien im Chat-ZIP mitschicken.

### Schritt 3 – Card-Adapter bauen

- `src/plate/renderer.js` als Card-Adapter erhalten,
- bestehende öffentliche Card-Funktionen beibehalten,
- intern gezielt auf `plate-public-api.js` / `plate-svg-renderer.js` umstellen,
- Card-spezifisches Font-Handling weiter über `src/plate/font.js` führen.

### Schritt 4 – alten Card-mm-model-Pfad ablösen

- alten `src/plate/mm-model.js` nicht teilweise weiterverwenden,
- entweder ersetzen oder als Legacy-Datei vollständig aus dem Card-Rendererpfad entfernen,
- keine Mischung aus altem Card-Monolith und neuem Lab-Modulbaum.

### Schritt 5 – Checks

Nach jedem kleinen Transfer-Schritt:

```text
npm run check
Production Import Boundary Guard
Lab Regression gegen separaten Lab-Stand
Card JS Check
Release Asset Check
visueller Smoke in HA/Card
```

## Transfer-Regeln

- Keine Geometrieänderungen während der Übernahme.
- Keine Solver-Zusammenführungen während der Übernahme.
- Keine Debug-Module in produktive Card-Imports.
- Card-spezifische Daten-/Font-/HA-Anbindung bleibt in der Card.
- Der Lab-Renderer bleibt fachlich autoritativ.
- Bei Abweichungen zuerst Adapter/Font/SVG-Einbettung prüfen, nicht Geometrieformeln ändern.

## Status b317

- Reiner Plan-/Dokustand.
- Keine Renderlogik geändert.
- Keine Card-Dateien fachlich geändert.
- Full-Spiegel bleibt mit separatem Lab-ZIP synchronisiert, aber nicht autoritativ.
