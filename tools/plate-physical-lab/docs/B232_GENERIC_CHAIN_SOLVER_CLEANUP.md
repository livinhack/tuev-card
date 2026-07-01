# b232 – Generic chain-solver cleanup

b232 keeps the confirmed b230 geometry unchanged and starts separating format-neutral chain mechanics from Reduced-specific legal/template logic.

## Lab changes

- Added `src/plate/chain-solver.js`.
- `reduced-row-chain-solver.js` delegates generic primitives to the new module.
- Reduced-specific legal constants, 8-slot/9-slot behaviour and row templates are not changed.

## Generic primitives

The new module centralises:

- fixed item width and variable gap statistics
- common chain solution diagnostics
- finite variable growth up to max values
- preferred-internal-spacing growth

## Intentionally unchanged

- Reduced auto-width selection
- H/E and season template switching
- 8-slot / 9-slot upper-seal edge rules
- Eurofield, seal and season rendering
- Card code

## Validation

- `npm run check:regression` → `Regression passed: 41/41 cases OK.`
