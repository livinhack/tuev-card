# b223 – Variant rules cleanup

Full/Card handover for the Lab b223 refactor.

## Lab change

- Added `src/plate/plate-variant-rules.js`.
- Moved shared plate/rule objects and `resolvePlateRules()` out of `plate-svg-renderer.js`.
- Kept the public API compatible through renderer re-exports.

## Card change

None. Card renderer/runtime code was not changed.

## Validation

- Lab: `Regression passed: 41/41 cases OK.`
- Full: `Checked 33 JavaScript files.` and `Release asset check passed.`

## Full ZIP Lab mirror status

`tools/plate-physical-lab/` is not synchronised / frozen. Use the separate Lab ZIP.
