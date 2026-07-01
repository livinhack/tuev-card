# b239 – Change Plate HU Full Size Fix

Basis: `plate-physical-lab-b238-change-plate-one-line-model.zip`.

## Problem

Im b238-Wechselkennzeichenmodell wurde die HU-Plakette im fahrzeugbezogenen Wechselteil verkleinert dargestellt. Das ist falsch: Die HU-Plakette gibt es nur in einer physischen Größe.

## Änderung

- `src/plate/change-plate.js` nutzt für die HU-Plakette im Wechselteil jetzt die aktive Standard-HU-Geometrie aus `rules.content.seal`.
- Durchmesser: `rules.content.seal.huDiameter`
- vertikale Position: `rules.content.seal.huCenterY`, sofern nicht explizit überschrieben
- keine Änderung am normalen b237/b238-Einzeilerpfad
- keine Änderung an bestehenden Nicht-Wechselkennzeichen-Layouts

## Prüfung

- Regression der bestehenden Fälle bleibt unverändert.
- Bei deaktiviertem Wechselkennzeichen bleiben Modell- und SVG-Ausgabe gegenüber b238 identisch.
- Wechselkennzeichen-Smoke prüft, dass das Wechselteil eine 35-mm-HU-Plakette rendert.
