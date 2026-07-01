# b282 – Exact Variable Type Grow Order Helper Cleanup

## Goal

Continue the strict exact-duplicate cleanup line after b281 without merging format-specific or solver-specific business rules.

## Changed

Added a local helper in `src/plate/reduced-row-chain-solver.js`:

- `growVariableItemsByTypeOrder(itemWidths, variableItems, types, grow, remaining)`

It replaces only the repeated mini-flow:

```js
remaining = grow(itemWidths, variableItems.filter((item) => item.type === type), remaining);
```

applied over an explicit ordered list of item types.

## Kept separate

The caller still owns the domain-specific choices:

- which item types are grown
- in which order they are grown
- whether finite growth or preferred-internal growth is used

## Not changed

- no geometry
- no SVG output
- no UI
- no change-plate logic
- no solver merge
- no builder merge
- no Card code

## Checks

- Lab regression: 41/41 OK
- b281 → b282 model hashes: 41/41 identical
- b281 → b282 SVG hashes: 41/41 identical
