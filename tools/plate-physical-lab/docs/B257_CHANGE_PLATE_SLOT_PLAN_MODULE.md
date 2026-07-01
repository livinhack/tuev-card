# b257 – Change Plate Slot Plan Module

b257 lagert den Wechselkennzeichen-Slotplan für die Hauptschild-Siegel/W-Belegung aus `seal-components.js` in ein eigenes Modul aus.

## Neue Datei

- `src/plate/change-plate-slot-plan.js`

## Änderung

- `seal-components.js` fragt die effektive Wechselkennzeichen-Slotbelegung über `getChangePlateSealSlotPlan()` ab.
- Die W-/Zulassungssiegel-Positionen bleiben geometrisch identisch zu b256.
- Der fahrzeugbezogene Wechselteil aus b256 bleibt unverändert im eigenen Supplement-Renderer.

## Nicht geändert

- keine Änderung an normalem Einzeiler/Zweizeiler/Kraftrad/Reduced
- keine Änderung an Wechselkennzeichen-Geometrie
- keine UI-Änderung
- kein Card-Code geändert

## Checks

- Lab Regression: 41/41 OK
- Wechselkennzeichen-Smoke b256 → b257: Modell-/SVG-Hashes identisch für einzeilig, zweizeilig und Kraftrad mit/ohne H/E
- Full/Card Check: bestanden
