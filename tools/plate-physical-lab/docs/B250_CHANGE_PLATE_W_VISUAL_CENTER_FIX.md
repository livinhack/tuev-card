# b250 – Change Plate W Visual Center Fix

Basis: b249.

## Ziel

Beim Kraftrad-Wechselkennzeichen war das W im 35-mm-Siegelkreis vertikal passend, aber sichtbar horizontal zu weit rechts. b249 hatte nur die 25-mm-Textbox des W zentriert; die sichtbare GL-W-Glyphe hat innerhalb dieser Box einen seitlichen Versatz.

## Änderung

- Keine Schätzung nach Gefühl.
- Der Versatz wurde aus dem Nutzer-Screenshot gegen den 35-mm-Siegelkreis abgeleitet.
- Neue Wechselkennzeichen-Option intern: `wVisualCenterCorrectionX: -4.0`.
- Die W-Textbox wird um diesen gemessenen Betrag nach links verschoben, sodass die sichtbare W-Glyph-Mitte auf der Siegelkreis-Mitte liegt.
- Gilt nur für den Wechselkennzeichen-W-Renderer.

## Nicht geändert

- Normale Renderer bleiben unverändert.
- Fahrzeugbezogener Wechselteil bleibt unverändert.
- Behördensiegelposition bleibt unverändert.
- Reduced-Wechselkennzeichen bleibt deaktiviert.

## Checks

- Lab Regression: 41/41 OK.
- b249 → b250 with Wechselkennzeichen disabled: model hashes 41/41 identical, SVG hashes 41/41 identical.
- Kraftrad-Wechsel-Smoke: W-Text-X nutzt `cx - wWidth / 2 + wVisualCenterCorrectionX`.
