# b226 – Row / sequence builder cleanup

b226 extracts repeated row and sequence construction from `plate-svg-renderer.js` into `src/plate/row-sequence-builder.js`.

## Intent

Reduce repeated code for building:

- one-line sequence variable items
- two-line top and bottom sequences
- Reduced top and bottom sequences
- Reduced seal row chains
- Reduced 8-slot / 9-slot helper rules used by sequence construction

## No intended geometry change

The cleanup does not alter:

- width selection
- row-chain solving
- H/E or season behavior
- 8-slot / 9-slot tight-fit behavior
- Eurofield geometry
- seal geometry
- season field rendering
- debug dimensions

Regression remains `41/41`.
