# b252 – Change Plate Motorcycle W Slot Center Fix

Basis: b250 – Change Plate W Visual Center Fix.

## Ziel

Der sichtbare Renderpfad für das Kraftrad-Wechselkennzeichen nutzte bereits die effektive, getauschte Siegelbelegung:

- Behördensiegel links mit 45 mm
- W rechts im 35-mm-HU-Slot

Der grafische Debug-Layer verwendete dagegen noch die ungewechselte Basis-Geometrie. Dadurch konnten im Debug falsche/alte Siegelkreise angezeigt werden.

## Änderung

- `src/plate/seal-components.js`
  - neuer Export `getEffectiveSealGeometry(rules, seal)`
  - berücksichtigt den Kraftrad-Wechselkennzeichen-Tausch inklusive Durchmesser
  - Renderpfad nutzt ebenfalls diese effektive Geometrie
- `src/plate/debug-dimensions.js`
  - Debug-Layer nutzt jetzt `getEffectiveSealGeometry(...)`
  - Debug und Renderpfad zeigen dieselbe effektive Siegelgeometrie

## Wichtig

- Keine Änderung am normalen Kraftrad-Renderer.
- Keine Änderung an Einzeiler/Zweizeiler/Reduced.
- Keine Änderung am fahrzeugbezogenen Wechselteil.
- Nur Debug-/Geometriequelle für den bereits vorhandenen Kraftrad-Wechselzweig vereinheitlicht.

## Checks

- Lab Regression: `41/41 cases OK`
- b250 → b252 bei deaktiviertem Wechselkennzeichen: Modell-Hashes `41/41 identisch`, SVG-Hashes `41/41 identisch`
- Smoke Kraftrad-Wechsel:
  - links Behördensiegel: `45 mm`
  - rechts W/HU-Slot: `35 mm`
  - Debug-Geometrie verwendet dieselbe effektive Geometrie
