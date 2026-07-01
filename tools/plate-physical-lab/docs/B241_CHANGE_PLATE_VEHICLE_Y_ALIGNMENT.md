# b241 – Change Plate Vehicle Y Alignment

Basis: b240 – Change Plate Supplement Dimensions.

## Ziel

Vertikale Lage der fahrzeugbezogenen Zeichen im Wechselteil anhand der Nutzerreferenz präzisieren.

## Umsetzung

- Wechselteil bleibt 60 mm breit inkl. Rahmen.
- HU-Plakette bleibt in Originalgröße 35 mm.
- Fahrzeugbezogene Zeichen erhalten explizite Mess-/Debugwerte:
  - `supplementVehicleTopY = 55 mm`
  - `supplementVehicleTargetHeight = 34 mm`
  - `supplementVehicleBaselineY = 84 mm`
- Untere gemeinsame Kennzeichenkennung auf `100 mm` Baseline gesetzt.
- Ziffer-Zielbreite bleibt 18,5 mm.
- H/E-Zielbreite bleibt 14 mm.

## Sicherheit

Der normale Einzeilerpfad bleibt unverändert. Wechselkennzeichen bleibt ein separater Pfad über `changePlate.enabled`.
