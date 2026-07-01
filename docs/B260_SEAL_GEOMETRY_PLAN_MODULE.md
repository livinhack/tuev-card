# b260 – Seal Geometry Plan Module

b260 ist ein Lab-Modul-Cleanup. Die Card bleibt unverändert.

## Inhalt

Im autoritativen separaten Lab-ZIP wurde `src/plate/seal-geometry-plan.js` ergänzt. Dort liegen nun `getSealGeometry()` und `getEffectiveSealGeometry()`.

`seal-components.js` zeichnet/koordiniert Marker weiter, aber die physische Geometrie liegt nicht mehr dort.

## Full-ZIP Hinweis

`tools/plate-physical-lab/` im Full-ZIP bleibt bewusst eingefroren/nicht autoritativ. Maßgeblich ist das separate Lab-ZIP.

## Checks

- Lab Regression: `41/41 cases OK`
- b259 → b260 Regression-Modell-/SVG-Hashes: `41/41 identisch`
- b259 → b260 Wechselkennzeichen-Smoke Modell/SVG: `6/6 identisch`
- Full/Card Check: bestanden
