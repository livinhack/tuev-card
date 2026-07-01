# Übergabe Full b310 – Renderer Cleanup Smoke Checkpoint

Aktueller Stand: **b310**

## Artefakte

- Lab: `plate-physical-lab-b310-renderer-cleanup-smoke-checkpoint.zip`
- Full: `tuev-card-full-b310-renderer-cleanup-smoke-checkpoint-handover.zip`

b310 baut auf **b309 – Exact Remaining Typed Finder Helper Cleanup** auf.

## Änderung b310

b310 ist ein defensiver Smoke-Checkpoint nach der Exact-Duplicate-Cleanup-Strecke b272–b309.

Keine Änderungen an:

- Renderer-Geometrie
- Solver-Fachlogik
- Builder-Fachlogik
- Wechselkennzeichen-Fachlogik
- UI-Controls
- Card-Code

Aktualisiert wurden nur Versionen, sichtbare Titel/Beschreibungen, README/HANDOVER/Doku und der Full-Lab-Spiegel.

## Projekttrennung

- Autoritativ bleibt das separate Lab-ZIP.
- `tools/plate-physical-lab/` ist mit dem separaten Lab-ZIP b310 synchronisiert, bleibt aber nicht autoritativ.
- Es gibt weiterhin kein dauerhaft gemeinsam genutztes Paket zwischen Lab und Card.

## Debug-/Card-Hinweis

Bei einer späteren Übernahme Lab → Card müssen Debugmodule explizit ausgeschlossen bleiben. Produktive Card-Renderer dürfen nicht von `debug-dimensions.js` oder anderen Debug-Layern abhängen. Gemeinsame Utility-Helper ohne Debug-Semantik sind zulässig; Debug-Code bleibt Lab-only.

## Checks

- Lab Regression: **41/41 OK**
- b309 → b310 Regression-Modell-Hashes: **41/41 identisch**
- b309 → b310 Regression-SVG-Hashes: **41/41 identisch**
- Full/Card JS Check: **bestanden**
- Release Asset Check: **bestanden**
- ZIP-Test: **bestanden**

## Nächster Schritt

Weiter ab **b310**. Die Reduktion wirklich identischer Duplikate ist weitgehend ausgeschöpft. Weitere Cleanups nur noch bei klar belegbarer Identität/Formelgleichheit. Sinnvoller nächster Schwerpunkt: produktive Transfer-Grenze Lab → Card vorbereiten und Debug-Abhängigkeitsprüfung definieren.
