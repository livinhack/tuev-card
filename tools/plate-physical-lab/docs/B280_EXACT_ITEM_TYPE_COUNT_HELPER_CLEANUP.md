# b280 – Exact Item Type Count Helper Cleanup

## Goal

Continue the defensive exact-duplicate cleanup line without changing physical renderer behavior.

## Extracted helper

`src/plate/plate-sequence-width-utils.js` now exports:

- `countItemsOfType(items, type)`

It contains only the repeated formula for counting items with a given `type`:

```js
items.filter((item) => item.type === type).length
```

## Call sites

Used in:

- `src/plate/chain-solver.js`
- `src/plate/reduced-row-chain-solver.js`
- `src/plate/plate-svg-renderer.js`

Format-specific solver logic and count labels remain at their call sites.

## Guardrails

No geometry, UI, Wechselkennzeichen, solver-policy or builder behavior was changed.

## Checks

- Regression: 41/41 OK
- b279 → b280 model hashes: 41/41 identical
- b279 → b280 SVG hashes: 41/41 identical
