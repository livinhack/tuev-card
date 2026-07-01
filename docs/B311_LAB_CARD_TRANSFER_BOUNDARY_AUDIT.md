# b311 – Lab → Card Transfer Boundary Audit

## Ziel

Dieser Stand bewertet die Transfer-Grenze vom autoritativen Physical Lab zur späteren produktiven Home-Assistant-Card. Es wurden keine Renderer-Fachregeln geändert.

## Ergebnis kurz

Der bereinigte Rendererstand b310/b311 ist fachlich als Grundlage für eine spätere Card-Übernahme geeignet, aber **nicht als blindes Kopieren aller Lab-Dateien**.

Vor der produktiven Integration muss die Render-Shell-Grenze sauber gezogen werden:

- Produktionspfad darf keine Lab-Debug-Module statisch importieren.
- Debug-/Mess-/Kalibrierungsfunktionen bleiben im Lab.
- Utility-Helper ohne Debug-Semantik dürfen gemeinsam genutzt oder übernommen werden.
- Das separate Lab bleibt weiterhin autoritativ für Geometrievalidierung.

## Modulklassifikation

### Produktivrelevanter Kern

Diese Module gehören fachlich zum Renderer-/Modellkern und sind Kandidaten für spätere Card-Übernahme:

- `mm-model.js`
- `plate-public-api.js`
- `plate-svg-renderer.js`
- `plate-rules.js`
- `plate-variant-rules.js`
- `plate-format-strategy.js`
- `plate-layout-model.js`
- `row-sequence-builder.js`
- `row-layout-adapter.js`
- `chain-solver.js`
- `reduced-row-chain-solver.js`
- `text-utils.js`
- `plate-render-context.js`
- `plate-width-strategy.js`
- `plate-season-options.js`
- `plate-visual-style.js`
- `change-plate.js`
- `change-plate-slot-plan.js`
- `change-plate-supplement-renderer.js`
- `seal-components.js`
- `seal-geometry-plan.js`
- `seal-marker-plan.js`
- `seal-slot-marker.js`
- `euro-field.js`
- `eu-star-wreath.js`
- `eu-country-mark.js`
- `season-field.js`
- `plate-body.js`

### Utility-Module ohne Debug-Semantik

Diese Module sind nach aktuellem Stand grundsätzlich produktiv unkritisch, solange sie keine Lab-UI-Abhängigkeit bekommen:

- `plate-number-utils.js`
- `plate-sequence-width-utils.js`
- `plate-spacing-surface-utils.js`
- `plate-layout-result-utils.js`
- `svg-escape-utils.js`

### Render-Shell mit Transfer-Aufgabe

`plate-render-shell.js` ist fachlich relevant, enthält aber aktuell eine Lab-Transfer-Hürde:

```js
import { renderDimensions, renderGrid, renderHorizontalDiagnostics } from "./debug-dimensions.js";
```

Das ist im Lab korrekt, darf aber später nicht ungetrennt in die Card wandern. Für die Card braucht es einen produktiven Shell-Pfad ohne statischen Debug-Import.

Mögliche spätere Lösung:

- `plate-render-shell-core.js` für produktive SVG-Komposition ohne Debug
- `plate-render-shell-lab.js` oder Lab-Wrapper für Grid/Dimension/Horizontaldiagnose
- `debug-dimensions.js` bleibt ausschließlich Lab-only

### Lab-only / nicht produktiv übernehmen

Diese Dateien/Funktionen sind für Messung, UI, Regression oder Entwicklung gedacht und sollen nicht in den produktiven Card-Renderer:

- `debug-dimensions.js`
- `regression-cases.js`
- `app.js`
- `styles.css`
- `viewer-calibration.js`
- `font-calibration.js`
- `scripts/`
- `reference/`
- Lab-spezifische `docs/`
- Lab-HTML/Controls aus `index.html`

## Aktuelle Import-Feststellung

Direkte Debug-Abhängigkeit im Lab:

- `plate-render-shell.js` → `debug-dimensions.js`

Weitere produktive Kernmodule importieren nach aktuellem Audit nicht direkt `debug-dimensions.js`.

## Transfer-Regeln für die spätere Card

1. Keine direkte oder indirekte Card-Abhängigkeit auf `debug-dimensions.js`.
2. Keine Card-Abhängigkeit auf Lab-UI-Dateien (`app.js`, `index.html`, `styles.css`).
3. Keine Card-Abhängigkeit auf Regression/Testdateien.
4. Pixel/DPR/Kalibrierung bleibt außerhalb des physischen Modells.
5. Card übernimmt nur Darstellungsoptionen; fahrzeugbezogene Eigenheiten bleiben in Entitäten/Integration.
6. Debug-/Mess-Layer dürfen im Lab weiter existieren, aber nicht im produktiven Bundle landen.
7. Vor der ersten echten Card-Übernahme einen Import-Check ergänzen, der verbotene Lab-only-Imports im produktiven Renderer verhindert.

## Empfohlener nächster Schritt

**b312 – Production Render Shell Boundary Prep**

Noch keine vollständige Card-Integration. Erst die Shell-Grenze vorbereiten:

- produktive SVG-Shell ohne Debug-Import entwerfen
- Lab-Shell/Wrapper behält Debug-Layer
- Hashgleichheit gegen b311 anstreben
- danach erneut Smoke-Checkpoint
