# b217 – Debug and dimension layer cleanup

b217 is a Lab-only cleanup after b216.

The separate Physical Lab moves grid, horizontal diagnostics and dimension/measurement overlay rendering into `src/plate/debug-dimensions.js`.

No Card renderer code was changed. The Full ZIP keeps `tools/plate-physical-lab/` intentionally frozen; the separate Lab ZIP is authoritative.

## Validation

- Lab: `Regression passed: 41/41 cases OK.`
- Full: `npm run check` passed.
