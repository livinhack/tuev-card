# b246 – Change Plate High-Format HU Margin Fix

Basis: b245.

## Änderung

Der hohe fahrzeugbezogene Wechselteil für zweizeilige Kennzeichen und Kraftrad bleibt als separater Renderer erhalten, aber die HU-Position wird korrigiert:

- Wechselteil: 60 × 200 mm
- HU: 35 mm
- HU-Mittelpunkt Y: 30 mm
- Damit ist der obere Randabstand 12,5 mm und entspricht dem linken/rechten Randabstand bei 60 mm Breite.

Zusätzlich wird beim Kraftrad-Wechselkennzeichen die W-/Behördensiegel-Darstellung im Hauptschild gespiegelt:

- Behördensiegel links
- W rechts

Der normale Kraftrad-Renderer bleibt unverändert. Die Spiegelung gilt nur für den Wechselkennzeichen-Zweig.

## Nicht geändert

- normale Einzeiler
- normale Zweizeiler
- normales Kraftrad
- Reduced bleibt für Wechselkennzeichen deaktiviert
- Einzeiliger 60 × 110 mm Wechselteil bleibt unverändert
- Fahrzeugzeichen-Kalibrierung bleibt aus b243/b245 übernommen
