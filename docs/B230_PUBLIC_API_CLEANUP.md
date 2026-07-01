# b230 – Public API / renderer-entry cleanup

b230 updates the Lab handover and Full transition package for the Lab-side public API cleanup.

## Lab intent

- Add `src/plate/plate-public-api.js` as stable public API boundary.
- Keep `mm-model.js` as compatibility entry.
- Keep `spacing-solver.js` as compatibility boundary.
- Expose `renderPlateSvg` alias next to `renderPlateSvgMm`.

## Full/Card status

- Card code unchanged.
- Full ZIP handover updated only.
- `tools/plate-physical-lab/` remains intentionally not synchronised/frozen.

## Validation

- Full: `npm run check`
- Lab: `npm run check:regression`
