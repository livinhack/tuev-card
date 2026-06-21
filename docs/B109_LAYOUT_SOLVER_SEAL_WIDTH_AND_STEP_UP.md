# b109 – Physical Lab seal-width correction and width step-up

## Goal

b109 corrects the b108 physical layout solver. b108 allowed `K S 70` to fit on a 340-mm plate only because the model squeezed the seal column to its minimum and used the outside margins exactly at the minimum. That is a legal-looking boundary solution, but it is not the calm physical layout we want for the lab.

The CAD rule remains unchanged:

1. Build the complete physical plate in millimetres.
2. Scale only the final complete SVG in the viewer layer.
3. Never scale individual characters, seals, Euro field, or gaps after rendering.

## Corrections

- Normal one-line seal column now uses `63.5–67.5 mm`.
  - `63.5 mm` is both the normal minimum and preferred value.
  - The earlier `58 mm` value is not used as the general minimum for all normal plates.
- Rendered seal geometry now uses the solver's actual seal-column width.
  - b108 could solve one width but draw the reference seal geometry with a fixed `63.5 mm`, creating misleading overlaps in diagnostics.
- Auto compact now avoids exact boundary fits.
  - If a width only works with outside margins exactly at `8 mm` and variables at minimum, the solver tries the next standard width band.
  - If no larger band is available, it keeps the boundary fit and marks the reason.

## Expected result

`K S 70` should now choose `380 mm` instead of `340 mm` in auto compact, because `340 mm` was only a squeezed boundary case.

## Files changed

- `tools/plate-physical-lab/mm-model.js`
- `tools/plate-physical-lab/app.js`
- `tools/plate-physical-lab/index.html`
- `tools/plate-physical-lab/README.md`
- `docs/RELEASE_CHECK.md`
- `HANDOVER.md`

## Test cases

Use both `Auto kompakt` and `Auto ausgewogen`:

- `K S 70` → expected `380 mm`
- `TR M 6` → expected `380 mm`
- `HH HU 199`
- `DA CI 500`
- `MK GG 23H`
- `HH EV 204E`
