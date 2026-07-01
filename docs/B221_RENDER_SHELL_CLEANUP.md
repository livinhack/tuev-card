# b221 – Renderer shell cleanup

b221 is a Lab-only cleanup after b220.

## Goal

Separate the final SVG document/layer composition from the large physical Lab renderer.

## Changed in the authoritative Lab ZIP

- Added `src/plate/plate-render-shell.js`.
- Moved final SVG shell, canvas expansion, layer ordering, text layer and DXF guide layer into that component.
- `plate-svg-renderer.js` keeps physical model building and layout solving.

## Full/Card status

No Card renderer code was changed. `tools/plate-physical-lab/` in the Full ZIP is intentionally not synchronized / frozen.

## Validation

- Lab `npm run check:regression` → `41/41 cases OK`
- Full `npm run check` → passed
