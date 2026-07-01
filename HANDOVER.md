# Übergabe Full b325 – Direct Card Plate Renderer Integration

b325 baut auf **b324 – Direct Card Renderer Replacement Prep** auf.

## Kurzstatus

Die Card nutzt ab b325 den vorbereiteten Physical-Lab-Renderer-Adapter direkt als aktiven Kennzeichenrenderer.
Es gibt keinen Umschalter, keinen Legacy-Fallback und keinen parallelen Alt-/Neu-Pfad. Rollback erfolgt über das vorherige ZIP.

## Änderungen

- `src/plate/renderer.js` ersetzt durch direkte Delegation auf `src/plate/lab-renderer-adapter.js`
- der alte direkte `mm-model.js`-Rendererpfad ist nicht mehr in `renderer.js` enthalten
- `isGraphicalPlateAvailable()` hängt nicht mehr an `config.plate_style === "plate"`
- neuer Check `scripts/check-card-renderer-direct-integration.mjs`
- `package.json` Script `check:card-renderer-direct-integration` ergänzt
- Full-/Lab-Version auf `0.1.1-b325` aktualisiert
- Doku `docs/B325_DIRECT_CARD_PLATE_RENDERER_INTEGRATION.md` ergänzt

## Projekttrennung

`tools/plate-physical-lab/` ist in diesem Full-ZIP bewusst mit dem separaten Lab-ZIP b325 synchronisiert. Autoritativ bleibt weiterhin das separate Lab-ZIP.

## Nicht geändert

- keine Lab-Geometrie
- keine Lab-Solverlogik
- keine Wechselkennzeichen-Fachlogik
- keine Debug-/Lab-only-Abhängigkeit im produktiven Renderer
- kein Toggle/Legacy-Fallback

## Checks

- Lab Regression: 41/41 OK
- Production Import Boundary Guard: bestanden
- Card Transfer Dry Run Scaffold: bestanden
- Card Transfer Manifest Preview: bestanden
- Card Transfer Staged Copy: 35/35 OK
- Card Renderer Adapter Scaffold: bestanden
- Card Renderer Adapter Smoke: bestanden
- Card Renderer Direct Integration: bestanden
- Full/Card JS Check: bestanden
- Release Asset Check: bestanden
- ZIP-Test: beide ZIPs fehlerfrei

## Artefakte

- `plate-physical-lab-b325-direct-card-plate-renderer-integration.zip`
- `tuev-card-full-b325-direct-card-plate-renderer-integration-handover.zip`

## Nächster sinnvoller Schritt

Nach Installation/Sichttest in Home Assistant: prüfen, ob die Kennzeichen in der Card wieder grafisch erscheinen und ob Font-/Größenskalierung passt. Danach ggf. gezielte Card-Anpassungen statt weiterer Transfer-Gerüste.
