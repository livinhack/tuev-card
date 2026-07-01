# TÜV Reminder Full b286

## b286 – Exact Layout Result Base Helper Cleanup

Dieses Full-/Übergabe-Artefakt dokumentiert den autoritativen Lab-Stand b286. Die Card bleibt unverändert.

Lab-ZIP:

`plate-physical-lab-b286-exact-layout-result-base-helper-cleanup.zip`

Full-ZIP:

`tuev-card-full-b286-exact-layout-result-base-helper-cleanup-handover.zip`

## Änderungen im Full-Stand

- Lab-Version auf `0.1.1-b286` aktualisiert
- Full-Version auf `0.1.1-b286` aktualisiert
- `tools/plate-physical-lab/` mit b286 synchronisiert
- Full-README/HANDOVER/Doku auf b286 aktualisiert
- Card-Code unverändert

## Lab-Änderung b286

Neu:

- `src/plate/plate-layout-result-utils.js`
  - `createLayoutResultBase(...)`

Aus dem Lab-Renderer wurde nur der identische Basisblock mehrerer Layout-Result-Objekte ausgelagert. Die fachlichen Solver und Zusatzfelder bleiben getrennt.

## Strenge Refactor-Grenze

Nur wirklich identische Abläufe/Formeln wurden zentralisiert. Fachlich ähnliche Solver oder Builder wurden nicht zusammengeführt.

## Nicht geändert

- keine Card-Renderlogik
- keine Card-UI
- keine Lab-Geometrie
- keine Solver-Zusammenführung
- keine Wechselkennzeichenänderung
- keine Reduced-Regeländerung

## Checks

- Lab Regression: 41/41 OK
- b285 → b286 Modell-Hashes: 41/41 identisch
- b285 → b286 SVG-Hashes: 41/41 identisch
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
- ZIP-Test: bestanden

## Full-Lab-Spiegel

Das separate Lab-ZIP ist autoritativ. `tools/plate-physical-lab/` ist für diesen Full-Stand mit b286 synchronisiert, bleibt aber nicht die maßgebliche Quelle für weitere Lab-Arbeit.
