# b279 – Exact Unbounded Distribution Helper Cleanup

## Goal

Continue the defensive exact-duplicate cleanup line without changing physical renderer behavior.

## Extracted helper

`src/plate/chain-solver.js` now exports:

- `distributeRemainingToUnboundedItems({ itemWidths, items, getVariableRangeForItem, remaining, outsideSurfaceCount })`

It contains only the repeated formula/flow for distributing remaining width over unbounded variable items.

## Call sites

`src/plate/reduced-row-chain-solver.js` keeps the fachliche decision at the call sites:

- normal reduced row: `outsideSurfaceCount: 2`
- before fixed seal: `outsideSurfaceCount: 1`

## Guardrails

No geometry, UI, Wechselkennzeichen, solver-policy or builder behavior was changed.

## Checks

- Regression: 41/41 OK
- b278 → b279 model hashes: 41/41 identical
- b278 → b279 SVG hashes: 41/41 identical
