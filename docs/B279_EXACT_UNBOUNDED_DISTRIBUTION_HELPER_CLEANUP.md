# b279 – Exact Unbounded Distribution Helper Cleanup

Full/Handover update for the synchronized Lab b279 mirror. Card runtime code is unchanged.

## Lab change

The Lab extracted one exact duplicate flow into `src/plate/chain-solver.js`:

- `distributeRemainingToUnboundedItems({ itemWidths, items, getVariableRangeForItem, remaining, outsideSurfaceCount })`

Only the repeated unbounded-distribution formula/flow was centralized. The fachliche outside-surface count remains an explicit call-site parameter.

## Checks

- Lab regression: 41/41 OK
- b278 → b279 model hashes: 41/41 identical
- b278 → b279 SVG hashes: 41/41 identical
- Full/Card check: passed

## Full mirror note

`tools/plate-physical-lab/` is synchronized to b279 for handover convenience. The separate Lab ZIP remains authoritative.
