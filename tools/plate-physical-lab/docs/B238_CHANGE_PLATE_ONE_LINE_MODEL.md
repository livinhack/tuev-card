# b238 – Wechselkennzeichen One-Line Physical Model

Basis: `plate-physical-lab-b237-formula-width-helpers-cleanup-titlefix`.

## Ziel

Der bestätigte b237-Einzeiler bleibt als Originalpfad erhalten. Für Wechselkennzeichen wurde ein separater Einzeiler-Zweig ergänzt, damit das Wechselkennzeichen-Modell weiterentwickelt werden kann, ohne den b237-Einzeiler oder andere Formate zu beeinflussen.

## Umsetzung

- Neue Datei: `src/plate/change-plate.js`
- `buildPlateModelMm()` routet nur bei `changePlate.enabled === true` und einzeiligem Format in den Wechselkennzeichen-Zweig.
- Der Wechselkennzeichen-Zweig verwendet das bestätigte b237-Einzeiler-Modell als Basis.
- Im gemeinsamen Hauptteil wird die HU-Position in der vorhandenen Siegelspalte durch ein `W` ersetzt.
- Das `W` wird als GL-Mittelschrift-Markierung mit Zielmaßen 20 mm Höhe / 25 mm Breite gerendert.
- Der fahrzeugbezogene letzte Ziffernteil wird als separates gerahmtes Wechselteil rechts neben dem Hauptteil gerendert.
- Das Wechselteil enthält:
  - oben zentriertes HU-Platzhalterfeld,
  - mittig die fahrzeugbezogene Ziffer,
  - unten klein die gemeinsame Kennzeichenkennung.

## Bewusst nicht geändert

- b237-Einzeiler ohne Wechselkennzeichen bleibt unverändert.
- Zweizeilig, Kraftrad und Reduced bleiben unverändert.
- Keine Saison-/H/E-/Reduced-Regeln geändert.
- Keine Card-Integration.
- Wechselkennzeichen ist noch ein Labmodell, kein final bestätigtes Normmodell.

## Prüfungen

- `npm run check:regression` → 41/41 OK
- b237 → b238 bei deaktiviertem Wechselkennzeichen:
  - Modell-Hashes: 41/41 identisch
  - SVG-Hashes: 41/41 identisch
- Wechselkennzeichen-Smoke:
  - `B VM 1461` → gemeinsamer Text `B VM 146`, fahrzeugbezogener Teil `1`
  - `DA CI 500` → gemeinsamer Text `DA CI 50`, fahrzeugbezogener Teil `0`
  - `AB CD 1234` → gemeinsamer Text `AB CD 123`, fahrzeugbezogener Teil `4`
