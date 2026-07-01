# b243 – Change Plate Vehicle Glyph Calibration Fix

Corrects the separate Wechselkennzeichen one-line Lab branch after b241.

The b237 original one-line renderer path remains untouched. b243 only changes the active Wechselkennzeichen supplement glyph rendering.

## Geometry

- Wechselteil width including frame: 60 mm
- HU diameter: 35 mm
- HU center-Y: 26.5 mm
- vehicle glyph top-Y: 55 mm
- vehicle glyph target height/font size: 34 mm
- vehicle glyph baseline-Y: 88 mm
- digit target width: 18.5 mm
- H/E target width: 14 mm
- common label baseline-Y: 100 mm

## Validation

- Regression: 41/41 OK
- Disabled Wechselkennzeichen b241 → b243: model hashes 41/41 identical
- Disabled Wechselkennzeichen b241 → b243: SVG hashes 41/41 identical
