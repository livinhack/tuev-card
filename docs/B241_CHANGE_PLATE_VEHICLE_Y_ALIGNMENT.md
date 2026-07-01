# b241 – Change Plate Vehicle Y Alignment

Basis: b240 – Change Plate Supplement Dimensions.

The separate Lab ZIP remains the authoritative renderer validation project. Card code was not changed in b241. `tools/plate-physical-lab/` inside the Full ZIP is intentionally frozen/non-authoritative and was not synchronised as the working Lab source.

## Change

- Vehicle-specific Zeichen in the Wechselteil use explicit vertical reference values:
  - `supplementVehicleTopY = 55 mm`
  - `supplementVehicleTargetHeight = 34 mm`
  - `supplementVehicleBaselineY = 84 mm`
- Lower common label baseline is set to `100 mm`.
- HU stays full-size at 35 mm.
- Wechselteil width stays 60 mm including frame.
- Digit width stays 18.5 mm; H/E width stays 14 mm.

## Safety

- Normal one-line path is not changed.
- Existing non-Wechselkennzeichen layouts remain hash-identical with disabled Wechselkennzeichen.
- Wechselkennzeichen remains a separate branch via `changePlate.enabled`.

## Checks

- Lab Regression: 41/41 OK
- b240 → b241 with disabled Wechselkennzeichen: model hashes 41/41 identical
- b240 → b241 with disabled Wechselkennzeichen: SVG hashes 41/41 identical
- Full/Card Check: passed
