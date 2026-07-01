# b225 – Layout model / metrics cleanup

b225 is a Lab-only cleanup handover.

## Lab change

- add `src/plate/plate-layout-model.js`
- group already-solved model data for render/debug consumers
- preserve the legacy model fields used by the existing render shell

## Full/Card status

- no Card renderer code changed
- `tools/plate-physical-lab/` remains intentionally frozen / not synchronised
- the separate Lab ZIP is authoritative

## Validation

- Lab: `npm run check:regression`
- Full: `npm run check`
