# TÜV Reminder Card – Handover b115

## Current version

- ZIP/version: `b115`
- Package version: `0.1.1-b115`
- Previous baseline: `b114` (`tuev-card-full-b114-physical-lab-renderer-card.zip`)

## Project rules to keep

- Code, file names and function names stay English.
- German UI text must go through translations/localisation.
- ZIP versions must continue incrementally.
- Every new working ZIP must include an updated `HANDOVER.md`.
- Do not include font binary files in Chat ZIPs.
- Local GL font files live separately in the user repo/Home Assistant setup.

## Current focus

The license plate renderer is now based on the Physical Lab millimetre model and must match the Lab visually in Home Assistant.

The renderer architecture remains:

1. Build a complete physical model in millimetres.
2. Render one complete SVG from that model.
3. Scale only the full SVG for the Card display.
4. Do not post-scale individual characters, seals, the euro field or other elements.

## What changed in b115

b114 correctly moved the Card to the Lab mm model, but Home Assistant could still render a visually different plate. The issue was the production font selection:

- The Lab uses the canonical GL font-family names `GL-Nummernschild-Mtl` and `GL-Nummernschild-Eng`.
- The Card selected a transient candidate family from the async font availability check, for example HACS/local-specific names.
- If the availability list was not ready yet, or if the default candidate path was not the actually installed path, the SVG could fall back to a browser font.
- That made the glyph shapes/widths no longer match the calibrated mm cells from the Lab.

b115 fixes this by injecting canonical `@font-face` aliases for:

- `GL-Nummernschild-Mtl`
- `GL-Nummernschild-Eng`

Each canonical alias contains the known GL candidate URLs for the corresponding role. The per-candidate names are still injected for compatibility and availability checks, but the production SVG now always renders text with the canonical Lab names.

## Main files changed

- `src/plate/font.js`
  - Added canonical GL font-family constants.
  - Added canonical `@font-face` aliases for middle and narrow GL fonts.
  - Kept candidate-specific `@font-face` entries for compatibility.

- `src/plate/renderer.js`
  - Production SVG now selects the canonical GL family by resolved font mode.
  - Middle mode uses `GL-Nummernschild-Mtl`.
  - Narrow mode uses `GL-Nummernschild-Eng`.

- `dist/tuev-card.js`
  - Rebuilt from source.

- `docs/B115_CARD_CANONICAL_FONT_SYNC.md`
  - Documents the b115 fix.

## Physical Lab state

- Lab path: `tools/plate-physical-lab/`
- Entry point: `tools/plate-physical-lab/index.html`
- Lab remains on the b114/b115 mm model basis.
- b111 dimension lines remain in the Lab.
- b112 H/E seal-column rule remains active:
  - normal one-line plates: seal column `63.5–67.5 mm`
  - final H/E after digit: seal column `58.0–67.5 mm`

## Renderer rules currently active

- One-line outer height: `110 mm`, including black border.
- Inner white area height: `101 mm`.
- Border/inset: `4.5 mm`.
- Euro field, plate body and seal positions are based on the DXF references.
- HU and authority seal are computed separately.
- Visible HU circle: `35 mm`.
- Visible authority seal circle: `45 mm`.
- Left/right outside margins must stay equal and at least `8 mm` when the layout fits.
- Variable spacing is distributed by the layout solver.
- Middle script is preferred.
- Narrow script is only selected if middle script does not fit within the current Anlage-4-style solver constraints.
- Shared GL `I` width: `35.5 mm` for middle and narrow script. This is a calibrated GL value, not an individually official measure.

## Validation done

- `npm run check` passed.
- `npm run build` passed.
- No `.ttf`, `.otf`, `.woff` or `.woff2` files are included in the generated ZIPs.

## Suggested next test in Home Assistant

After installing b115, test at least:

- `DA CI 500`
- `HH HU 199`
- `HH EV 204E`
- `BIT GT500`
- `K S 70`
- `TR M 6`

Expected: Home Assistant should now use the same canonical GL font identities as the Physical Lab. If the Card still differs from the Lab, the next thing to inspect is not the mm solver but the browser-loaded font URL/path in Home Assistant.

## Next likely work item

If b115 visually matches the Lab, continue with final Card integration polish: shared scaling across vehicle tiles and responsive/browser checks. If the Card still does not match, add a small optional debug output showing the active SVG data attributes and resolved font mode/family directly in the Card for diagnosis.
