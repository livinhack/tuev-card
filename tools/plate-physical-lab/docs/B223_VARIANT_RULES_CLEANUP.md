# b223 – Plate variant rules cleanup

b223 centralises plate variant/rule constants in the standalone Physical Lab.

## Goal

Reduce repeated rule boilerplate in `plate-svg-renderer.js` without changing any measured geometry.

## Changed

- New module: `src/plate/plate-variant-rules.js`
- Moved shared rule objects and `resolvePlateRules()` out of `plate-svg-renderer.js`.
- The renderer imports and re-exports the rule objects so the public Lab API remains compatible.

## Not changed

- Plate layout
- Reduced auto width
- Reduced H/E/Saison templates
- 8-slot / 9-slot tight cases
- Eurofield / seal / season rendering
- Card code

## Check

`npm run check:regression` → `Regression passed: 41/41 cases OK.`
