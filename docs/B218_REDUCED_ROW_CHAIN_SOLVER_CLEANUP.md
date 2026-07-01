# b218 – Reduced row-chain solver cleanup

b218 is a small Lab-only cleanup after b217.

## Goal

Start isolating the real layout solver without changing the measured geometry. The Reduced row-chain solving math is now in a dedicated module.

## New file

- `src/plate/reduced-row-chain-solver.js`

## Moved into the module

- Reduced row-chain statistics
- compact row-chain solving
- preferred-internal-spacing solving
- shared vertical seal X-axis solving
- fixed-seal row solving
- critical row minimum width calculation

## Still owned by `plate-svg-renderer.js`

- rule constants
- plate type selection
- row item construction
- SVG item positioning
- metrics object
- debug data

## Validation

```text
Regression passed: 41/41 cases OK.
```

## Notes

No intended change to Reduced Standard, H/E, Saison, 8-slot or 9-slot behavior.
