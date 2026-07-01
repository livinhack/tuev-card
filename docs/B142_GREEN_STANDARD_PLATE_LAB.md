# b142 · Green standard plate mode in Physical Lab

b142 keeps the b141 one-line and two-line seasonal Lab work unchanged and adds a Lab-only green standard plate visual mode.

## Scope

- One-line standard geometry can be rendered with green text.
- Two-line standard geometry can be rendered with green text.
- The green mode is intended for standard plates only and is not combined with H/E suffix or seasonal validity in this quick Lab check.
- When the green mode is enabled in the Lab UI, seasonal rendering is disabled for that render.
- Plate geometry, width solving, cell widths, seal positions, Euro field and borders stay unchanged.

## Colour

The model adds a shared text colour registry:

- `black`: `#080808`
- `green`: `#287233`

`#287233` is used as the project approximation for green plate lettering / RAL 6001 style. The colour is kept in the mm-model layer as a visual style setting; it does not affect physical layout.

## Files

- `tools/plate-physical-lab/index.html`: adds the green plate checkbox.
- `tools/plate-physical-lab/app.js`: passes the visual style to the renderer and disables season when green mode is active.
- `tools/plate-physical-lab/mm-model.js`: adds `PLATE_TEXT_COLORS_MM`, visual-style metrics and colour-aware text rendering.
- `src/plate/mm-model.js`: synchronized shared model.

## Card status

The production Card is not switched to format/season/green selection in this step. It remains on the existing productive one-line Lab renderer path.
