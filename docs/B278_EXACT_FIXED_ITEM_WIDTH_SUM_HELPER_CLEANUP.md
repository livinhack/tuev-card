# b278 – Exact Fixed Item Width Sum Helper Cleanup

## Scope

Full/Handover update for the synchronized Lab b278 mirror. Card runtime code is unchanged.

## Lab change

The separate authoritative Lab ZIP introduces `sumItemWidthsWhere(items, shouldInclude)` in `src/plate/plate-sequence-width-utils.js`.

Centralized formula:

```js
items.reduce((sum, item) => sum + (shouldInclude(item) ? (Number(item.width) || 0) : 0), 0)
```

The caller-owned include predicates remain at the fachliche call sites.

## Checks

- Lab regression: 41/41 OK
- b277 → b278 model hashes: 41/41 identical
- b277 → b278 SVG hashes: 41/41 identical
- Full/Card check: passed

## Full Lab mirror

`tools/plate-physical-lab/` is synchronized to b278 for handover convenience. The separate Lab ZIP remains authoritative.
