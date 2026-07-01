# b229 – Format strategy smoke checkpoint

b229 is a checkpoint build after b228. It intentionally does not change renderer geometry or layout behaviour.

Kept from recent steps:

- b226 row/sequence builder cleanup
- b227 green frame fix
- b228 format strategy helper cleanup

Validation target:

- `npm run check:regression` → `Regression passed: 41/41 cases OK.`
