# TÜV Card / TÜV Reminder – Handover b102

## Current package

- Version: `0.1.1-b102`
- Main ZIP: `tuev-card-full-b102-font-calibration-profile-horizontal-check.zip`
- Standalone Lab ZIP: `plate-physical-lab-b102-font-calibration-profile-horizontal-check-vscode-liveserver.zip`
- Main focus: standalone physical plate renderer lab, not Home Assistant card integration.

## Stable project context

- Home Assistant card/editor/group work through b83 was stable.
- HACS/dist structure from b87 works: HACS serves `dist/tuev-card.js` and copied assets from `dist/fonts/`.
- GL font support exists, but generated ChatGPT ZIPs intentionally do not include font binaries. Local repo should keep fonts in `fonts/`.
- Card renderer experiments b90-b94 were not considered good enough. The plate renderer is being rebuilt outside HA in a physical lab first.
- Physical lab is CAD-like: all geometry is in millimetres; pixels/DPR/monitor calibration are only viewer concerns.

## b102 changes

- Keeps DIN1451Alt support from b101 for the Euro-field `D`.
- Freezes the current manual GL-Mittelschrift calibration profile:
  - target glyph height: 75 mm
  - Font-Kalibriergröße: 125
  - Baseline Y: 92.5 mm
- Renames UI wording from `Font-Ausgabegröße` to `Font-Kalibriergröße (SVG)`.
- Leaves automatic font measuring available, but it is not the default for current manual measurement work.
- Adds a new lab stage: `6 · Horizontale Zeichen-/Zellprüfung`.
- The horizontal stage shows cell borders, cell centers, cell widths, gap widths and the seal column without altering geometry.

## Important physical rules currently used

- Outer one-line plate height: 110 mm.
- Inner white height: 101 mm.
- Inner inset / black border: 4.5 mm.
- Outer corner radius: 9.25 mm.
- Inner corner radius: 4.75 mm.
- Euro field: x 4.5, y 4.5, 45 × 101 mm.
- Character band: 75 mm high.
- Letter cell: 47.5 mm.
- Digit cell: 44.5 mm.
- Character gap: 8 mm.
- Group gap: 24 mm.
- Seal column: 63.5 mm inner / 67.5 mm reference.
- HU seal: 35 mm diameter, y 29.5.
- Authority placeholder: 45 mm diameter, y 75.5.
- No extra gap before or after the seal column.

## Files changed

- `tools/plate-physical-lab/index.html`
- `tools/plate-physical-lab/app.js`
- `tools/plate-physical-lab/mm-model.js`
- `tools/plate-physical-lab/font-calibration.js`
- `tools/plate-physical-lab/viewer-calibration.js`
- `tools/plate-physical-lab/README.md`
- `docs/B102_FONT_CALIBRATION_PROFILE_AND_HORIZONTAL_CHECK.md`
- `docs/RELEASE_CHECK.md`
- `package.json`
- `package-lock.json`
- `src/**/*.js` import cache-busters to b102
- `dist/tuev-card.js` rebuilt

## Test next

1. Open `tools/plate-physical-lab/index.html` with VS Code Live Server.
2. Put local fonts in either `tools/plate-physical-lab/fonts/` or root `fonts/`:
   - `GL-Nummernschild-Mtl.ttf`
   - `GL-Nummernschild-Eng.ttf`
   - optional `din1451alt.ttf` for the Euro-field `D`
3. Use manual font settings: `125` and `92.5`.
4. Choose `6 · Horizontale Zeichen-/Zellprüfung`.
5. Compare: `HH HU 199`, `BKS R 95`, `DA CI 500`, `K S 70`, `TR M 6`.
6. Check whether letters are visually centered in their fixed cells before changing any further geometry.

## Next likely step

If the horizontal cells are correct but individual glyphs look optically off-center, add per-character optical offset tables in millimetres inside the physical model. Do not use CSS/px transforms and do not scale individual elements.
