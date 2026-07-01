# b281 – Exact Range Min Width Map Helper Cleanup

## Goal

Continue the defensive exact-duplicate cleanup line without changing physical renderer behavior.

## Extracted helper

`src/plate/plate-sequence-width-utils.js` now exports:

- `createRangeMinWidthMap(items, getRange)`

It contains only the repeated initialization formula for an item-width map seeded with range minimum widths:

```js
const itemWidths = new Map();
variableItems.forEach((item) => itemWidths.set(item.key, getVariableRangeForItem(item)?.min ?? 0));
```

## Call sites

Used in three `src/plate/reduced-row-chain-solver.js` branches:

- normal Reduced row chain
- preferred-internal-spacing row chain
- row chain before a fixed seal

The solver branches, distribution order and format-specific decisions remain at their call sites.

## Guardrails

No geometry, UI, Wechselkennzeichen, solver-policy or builder behavior was changed.

## Checks

- Regression: 41/41 OK
- b280 → b281 model hashes: 41/41 identical
- b280 → b281 SVG hashes: 41/41 identical
