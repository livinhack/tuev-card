# b102 · Font calibration profile and horizontal cell check

## Purpose

Continue the standalone physical plate lab without changing the Home Assistant card runtime. b102 freezes the current manual GL-Mittelschrift calibration as a named working profile and adds a dedicated horizontal cell-check stage.

## Changes

- Lab title/version updated to b102.
- Default font mode is manual again, using:
  - target glyph height: 75 mm
  - Font-Kalibriergröße: 125
  - Baseline Y: 92.5 mm
- UI wording changed from `Font-Ausgabegröße` to `Font-Kalibriergröße (SVG)` to avoid suggesting that 125 mm is the actual visible glyph height.
- Added `FONT_CALIBRATION_PROFILES_MM` to `tools/plate-physical-lab/mm-model.js`.
- Added stage `6 · Horizontale Zeichen-/Zellprüfung`.
- Horizontal check renders cell boundaries, cell centers, width labels and gap labels as an inspection overlay only.

## Non-goals

- No card renderer integration.
- No per-element scaling.
- No changes to the physical body, Euro field or seal geometry.
- No font binaries in generated ZIP files.

## Next test

Open `tools/plate-physical-lab/index.html`, keep manual values 125 / 92.5, choose stage `6 · Horizontale Zeichen-/Zellprüfung`, and compare `HH HU 199`, `BKS R 95`, `DA CI 500`, `K S 70`.
