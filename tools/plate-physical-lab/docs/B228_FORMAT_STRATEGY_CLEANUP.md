# b228 – Format strategy cleanup

b228 adds a small strategy helper module without changing intended geometry.

## New file

- `src/plate/plate-format-strategy.js`

## Purpose

Centralise repeated format checks so the renderer does not repeatedly spell out raw `layoutType` / `formatKey` comparisons.

## No geometry change

All Reduced, H/E, season, Eurofield, seal, row-chain and green-frame behaviour remains unchanged from b227.
