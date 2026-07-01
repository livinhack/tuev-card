# b225 – Layout model / metrics cleanup

b225 introduces a small solved-layout model helper without changing the intended plate geometry.

## Scope

- add `src/plate/plate-layout-model.js`
- centralise the solved model shape used by render/debug layers
- group already-solved rows, seals, season fields and spacing items
- keep the existing `content`, `metrics`, `rules` and `font` fields intact for compatibility

## Non-goals

- no Reduced width/layout changes
- no H/E or Saison rule changes
- no Eurofield, seal, season, debug or Card integration changes

## Validation

- `npm run check:regression` must remain green
