# b114 – Physical Lab renderer as production Card variant

b114 replaces the old productive Home Assistant Card plate renderer with the current Physical Lab mm model.

## Change

The Card renderer now uses the same CAD-like one-line plate model that was built in `tools/plate-physical-lab/`:

- all internal coordinates, widths, heights and gaps stay in millimetres
- one complete physical SVG model is built first
- the Card only scales the complete SVG afterwards
- no individual post-scaling of characters, seals, the Euro field or other elements
- `widthMode: balanced` is the production default
- middle script remains the default; narrow script is only selected by the solver when middle script cannot satisfy the allowed one-line layout
- final H/E suffix plates use the b112 seal-column exception: `58.0–67.5 mm`
- normal one-line plates keep the seal-column range: `63.5–67.5 mm`
- the calibrated shared GL `I` width stays `35.5 mm`

## Files changed

- `src/plate/mm-model.js`
  - new shared physical mm model copied from the current Physical Lab logic
- `src/plate/renderer.js`
  - old simplified Card renderer replaced by production rendering based on `buildPlateModelMm()`
  - SVG output now uses model mm dimensions and only applies whole-SVG display scaling
- `tools/plate-physical-lab/mm-model.js`
  - synchronized with the shared model implementation
- `src/tuev-card-entry.js`
  - source version comment updated
- `package.json` / `package-lock.json`
  - version updated to `0.1.1-b114`
- `HANDOVER.md`
  - updated to b114

## Validation examples

Using `fontMode: auto`, `widthMode: balanced`, `specialIWidth: 35.5`:

| Plate | Font | Width | Seal column | Outside margins | Result |
| --- | --- | ---: | ---: | ---: | --- |
| `BIT GT500` | narrow | 520 mm | 64.7 mm | 8.0 / 8.0 mm | fits |
| `K S 70` | middle | 380 mm | 67.5 mm | 17.3 / 17.3 mm | fits |
| `TR M 6` | middle | 380 mm | 67.5 mm | 15.8 / 15.8 mm | fits |
| `HH EV 204E` | narrow | 520 mm | 58.6 mm | 8.0 / 8.0 mm | fits with H/E rule |
| `DA CI 500` | middle | 520 mm | 67.5 mm | 8.5 / 8.5 mm | fits |

## Not changed

- The Physical Lab remains available under `tools/plate-physical-lab/index.html`.
- Font binary files are still not included in the Chat ZIP.
- Local/repo fonts remain external assets for the user environment.
- Badge/stamp renderer logic outside the license-plate SVG was not changed.
