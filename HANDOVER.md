# TÜV Reminder Card – Handover b114

Version: `0.1.1-b114`

## Current focus

The license-plate renderer was rebuilt outside Home Assistant in the Physical Lab and is now used as the productive Card renderer.

The current architecture is:

1. Build the complete physical plate model in millimetres.
2. Render one complete SVG from that model.
3. Let the Card scale only the complete SVG to the available UI size.
4. Do not individually scale characters, seals, the Euro field or other elements after solving the physical model.

## Important project rules

- Code, file names and functions should stay English.
- German Home Assistant UI text should go through translations/localization.
- ZIP versions must continue monotonically.
- Every new work ZIP must include an updated `HANDOVER.md`.
- No font binary files should be included in the Chat ZIP.
- Local fonts live separately in the repo/Home Assistant project.

## Change b114

b114 replaces the old Card-side plate renderer with the current Physical Lab renderer logic.

### New production path

- `src/plate/mm-model.js`
  - shared CAD-like mm model based on the Physical Lab logic
  - internal dimensions are millimetres only
  - includes the b112 H/E suffix seal-column exception
  - includes b110/b111 balanced spacing behaviour and solved variable gaps
- `src/plate/renderer.js`
  - now calls `buildPlateModelMm()`
  - outputs a complete physical SVG
  - applies only whole-SVG display scaling via SVG `width` / `height` and `viewBox`
  - keeps the Card’s shared-height behaviour because all plates share the same physical height of 110 mm and the Card applies one shared scale

### Physical rules now active in the Card

- One-line outer height: `110 mm`
- Inner white height: `101 mm`
- Border band: `4.5 mm`
- Euro field and seal positions are based on the Lab/DXF model
- HU and authority seal positions are solved separately
- Normal seal column: `63.5–67.5 mm`
- Final H/E suffix seal column: `58.0–67.5 mm`
- HU circle: `35 mm`
- Authority seal circle: `45 mm`
- Equal outside margins, minimum `8 mm` when the layout fits
- Variable character gaps and group gaps are distributed by the layout solver
- `Auto balanced` / `widthMode: balanced` is now the production default
- Middle script remains the default
- Narrow script is used only if middle script cannot satisfy the allowed layout
- Shared GL middle/narrow `I` width remains `35.5 mm`

## Validation results

Checked with `fontMode: auto`, `widthMode: balanced`, `specialIWidth: 35.5`:

| Plate | Font | Width | Seal column | Outside margins | Result |
| --- | --- | ---: | ---: | ---: | --- |
| `BIT GT500` | narrow | 520 mm | 64.7 mm | 8.0 / 8.0 mm | fits |
| `K S 70` | middle | 380 mm | 67.5 mm | 17.3 / 17.3 mm | fits |
| `TR M 6` | middle | 380 mm | 67.5 mm | 15.8 / 15.8 mm | fits |
| `HH EV 204E` | narrow | 520 mm | 58.6 mm | 8.0 / 8.0 mm | fits with H/E rule |
| `DA CI 500` | middle | 520 mm | 67.5 mm | 8.5 / 8.5 mm | fits |

## Checks performed

- `npm run check` passed.
- `npm run build` passed.
- The generated bundle is `dist/tuev-card.js`.
- No `.ttf`, `.otf`, `.woff` or `.woff2` files are included in the generated Chat ZIPs.

## Files changed in b114

- `src/plate/mm-model.js`
  - new shared production mm model
- `src/plate/renderer.js`
  - old Card plate renderer replaced by production Physical Lab renderer path
- `tools/plate-physical-lab/mm-model.js`
  - synchronized with the shared mm model implementation
- `tools/plate-physical-lab/index.html`
  - version text updated to b114
- `tools/plate-physical-lab/app.js`
  - version notes updated to b114
- `tools/plate-physical-lab/README.md`
  - version heading updated to b114
- `src/tuev-card-entry.js`
  - source comment updated to b114
- `docs/B114_CARD_PHYSICAL_LAB_RENDERER.md`
  - new implementation note
- `package.json` / `package-lock.json`
  - version updated to `0.1.1-b114`
- `dist/tuev-card.js`
  - rebuilt from source

## Not changed

- The Card/editor grouping features were not intentionally changed.
- The HU badge renderer outside the plate SVG was not intentionally changed.
- The Physical Lab remains available as a separate test environment.
- Font binaries are not included in the Chat ZIP.

## Next suggested checks

1. Install b114 in Home Assistant and check graphical plates in the Card.
2. Compare the Card output against the Physical Lab for:
   - `BIT GT500`
   - `K S 70`
   - `TR M 6`
   - `HH EV 204E`
   - `DA CI 500`
3. Check single-column and multi-column Card scaling.
4. If the Card output visually matches the Lab, the next step is cleanup/polish rather than more geometry rewrites.
