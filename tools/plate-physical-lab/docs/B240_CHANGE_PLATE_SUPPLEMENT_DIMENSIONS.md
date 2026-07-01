# b240 – Change Plate Supplement Dimensions

Basis: `plate-physical-lab-b239-change-plate-hu-full-size-fix.zip`.

## Ziel

Korrektur des fahrzeugbezogenen Wechselkennzeichen-Teils nach Nutzerhinweis:

- Feldbreite inklusive Rahmen: 60 mm
- HU-Plakette bleibt 35 mm und darf etwas höher sitzen, um Überlappung zu vermeiden
- fahrzeugbezogene Zeichenhöhe: Zielbereich 32–37 mm
- Zielbreite Ziffer: 17–20 mm
- Zielbreite H/E: 14 mm

## Umsetzung

Geändert wurde nur der separate Wechselkennzeichen-Zweig in `src/plate/change-plate.js`.

- `supplementWidth`: 60 mm
- `supplementSealCenterY`: 26,5 mm
- `supplementVehicleFontSize`: 58 mm als GL-Kalibrierung für ca. 35 mm sichtbare Höhe
- `supplementVehicleBaselineY`: 84 mm
- `supplementDigitTargetWidth`: 18,5 mm
- `supplementHeTargetWidth`: 14 mm
- `supplementVehicleCharGap`: 1,5 mm
- `supplementLabelBaselineY`: 101,5 mm

Die Breiten der fahrzeugbezogenen Zeichen werden per SVG `textLength`/`lengthAdjust="spacingAndGlyphs"` auf die Zielmaße gebracht. Ziffern und H/E werden als einzelne Zeichen-Items gerendert, damit Ziffern- und H/E-Zielbreiten getrennt bleiben.

## Sicherheit

Nicht-Wechselkennzeichen bleiben unverändert. Der bestätigte b237-Einzeiler bleibt Originalpfad; der Wechselkennzeichen-Zweig wird nur aktiv, wenn `changePlate.enabled === true` ist.

Checks:

- Lab Regression: 41/41 OK
- b239 → b240 mit deaktiviertem Wechselkennzeichen: Modell-Hashes 41/41 identisch
- b239 → b240 mit deaktiviertem Wechselkennzeichen: SVG-Hashes 41/41 identisch
- Wechselkennzeichen-Smoke:
  - `B VM 1461`: Wechselteil 60 mm, HU 35 mm, Fahrzeugteil `1`, Ziffer-Zielbreite 18,5 mm
  - `B VM 1461E`: Wechselteil 60 mm, HU 35 mm, Fahrzeugteil `1E`, Ziffer-Zielbreite 18,5 mm, E-Zielbreite 14 mm
  - `HH EV 204E`: Wechselteil 60 mm, Fahrzeugteil `4E`
