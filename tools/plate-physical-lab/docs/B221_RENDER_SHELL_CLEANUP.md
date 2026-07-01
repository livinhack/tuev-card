# b221 – Renderer shell cleanup

b221 is a small Lab-only cleanup after b220.

## Goal

Separate final SVG document/layer composition from the large physical layout renderer.

## Changed

- Added `src/plate/plate-render-shell.js`.
- Moved the final SVG shell, canvas expansion, final layer ordering, text layer and DXF guide layer into that component.
- `plate-svg-renderer.js` now builds the physical model and delegates final SVG creation to `renderPlateSvgDocument()`.

## Unchanged

No intentional layout or dimension changes. Reduced auto-width, H/E/Saison switching, 8-slot/9-slot rules, Euro-field, seals, season field, debug dimensions, row-chain solver, text/glyph utilities and plate body rendering remain unchanged.

## Validation

- `npm run check:regression` → `41/41 cases OK`
