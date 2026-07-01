# b237 – Formula Width Helpers Cleanup

Base: b236

## Summary

A tiny formula-only cleanup in the authoritative Lab renderer.

New helpers centralise only repeated formulas:

- `sumItemWidths(items, getWidth)`
- `createItemWidthMap(items, getWidth)`

All specialist rules stay in the existing caller-provided getter functions.

## Safety

No solver families were merged. No geometry or format rules were changed.

## Validation

- Lab regression: `41/41 cases OK`
- b236 vs b237 model hashes: `41/41 identical`
- b236 vs b237 SVG hashes: `41/41 identical`
- Full/Card check: passed
