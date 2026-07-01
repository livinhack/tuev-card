# b216 – Season field component cleanup

b216 is a Lab-only cleanup after b215.

## Summary

The Physical Lab moves seasonal validity field SVG rendering into `src/plate/season-field.js`. The Card code is unchanged.

## Validation

- Lab: `Regression passed: 41/41 cases OK.`
- Full: `npm run check` passed.

## Full/Lab sync status

`tools/plate-physical-lab/` inside the Full ZIP is intentionally not synchronized / frozen. The separate Lab ZIP remains authoritative.
