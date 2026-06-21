# b106 · I width status label

## Goal

Keep the b105 physical geometry unchanged, but document the `I` special width correctly.

The shared `I = 35.5 mm` rule is useful for the supplied GL-Nummernschild middle/narrow fonts, but it must not be presented as an officially proven individual dimension from Anlage 4.

## Changes

- Lab title/version updated to b106.
- `I` hint text now states:
  - shared GL-Mittel/Eng calibration value
  - not an officially documented individual `I` dimension
- Metrics policy text updated accordingly.
- README/HANDOVER/RELEASE_CHECK updated.

## Unchanged

- No change to plate geometry.
- No change to seal geometry.
- No change to font-size/baseline defaults.
- No change to the Home Assistant card renderer.

## Next step

Use `6 · Horizontale Zeichen-/Zellprüfung` to decide whether other characters require physical cell overrides. Do not apply CSS/px transforms or per-element post-scaling.
