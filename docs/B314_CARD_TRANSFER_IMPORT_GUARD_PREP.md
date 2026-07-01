# B314 – Card Transfer Import Guard Prep

Stand: `0.1.1-b314`

## Ziel

b314 ergänzt eine automatisierte Import-Grenzprüfung für den späteren Transfer des Lab-Renderers in die Home-Assistant-Card.

Der Stand ändert keine Geometrie und keine Renderer-Fachlogik. Er macht nur prüfbar, dass produktive Renderer-Einstiege nicht versehentlich Lab-/Debug-only-Module importieren.

## Neuer Guard

Neu im Lab:

- `scripts/check-production-import-boundary.mjs`

Neue npm-Scripts im Lab:

- `npm run check:production-boundary`
- `npm run check`

Neue npm-Scripts im Full-ZIP:

- `npm run check:production-boundary`
- `npm run check` führt zusätzlich zur bisherigen JS-/Release-Prüfung auch den Boundary-Guard aus.

## Produktive Einstiege

Der Guard prüft die statische Import-Closure dieser produktiven Renderer-Grenzen:

- `src/plate/mm-model.js`
- `src/plate/plate-public-api.js`
- `src/plate/plate-svg-renderer.js`
- `src/plate/plate-render-shell.js`
- `src/plate/spacing-solver.js`

## Verbotene Lab-/Debug-only-Module in produktiver Closure

Diese Module dürfen von den produktiven Einstiegen nicht transitiv erreicht werden:

- `src/plate/debug-dimensions.js`
- `src/plate/plate-lab-debug-renderers.js`
- `src/plate/regression-cases.js`
- `app.js`
- `viewer-calibration.js`
- `font-calibration.js`
- `scripts/run-regression.mjs`

## Ergebnis b314

Der Guard bestätigt:

```text
Production import boundary OK: 5 entries, 35 production files, 0 lab/debug-only imports.
```

Damit ist b312/b313 jetzt nicht nur dokumentiert, sondern auch maschinell abgesichert.

## Nicht geändert

- keine Geometrie
- keine Solver-Zusammenführung
- keine Builder-Zusammenführung
- keine Wechselkennzeichen-Fachlogik
- keine UI-Control-Änderung
- kein Card-Code
- keine sichtbare SVG-Änderung

## Nächster sinnvoller Schritt

Nach b314 kann als nächster Sicherheitsstand ein Smoke-Checkpoint gebaut werden oder die spätere Card-Transfer-Liste weiter in konkrete Modulgruppen zerlegt werden.
