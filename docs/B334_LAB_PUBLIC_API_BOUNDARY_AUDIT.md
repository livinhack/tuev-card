# b334 – Lab Public API Boundary Audit

b334 is the first condensed finalization step for the Card plate renderer.
It combines the planned Lab public API audit and Lab-internal boundary audit into one guarded checkpoint.

## Scope

No renderer geometry changed.
No HU badge logic changed.
No change-plate geometry changed.
No font loading logic changed.
No legacy toggle was added.

## Protected renderer chain

```text
Card/Editor
→ src/plate/renderer.js
→ src/plate/lab-renderer-adapter.js
→ src/plate/lab-renderer/plate-public-api.js
→ Lab renderer internals
```

## New check

`check:lab-public-api-boundary` verifies that:

- the Lab public API exists at the expected boundary,
- the Card adapter enters Lab internals only through `plate-public-api.js`,
- Card-facing source does not bypass the Lab public API,
- the public API remains a declarative export boundary,
- no Card, font-helper, placeholder, or legacy toggle logic leaks into the public API,
- the stable public exports remain present.

## Result

b334 keeps the b333 behavior unchanged and adds a stronger guard around the final Lab entry boundary.
