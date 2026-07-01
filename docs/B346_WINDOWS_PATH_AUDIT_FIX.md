# b347 – Windows Path Audit Fix

b347 builds on b345 and fixes a Windows-only check failure in `check:renderer-legacy-audit`.

## Problem

On Windows, Node `path.normalize()` returns backslash-separated paths such as:

```text
src\plate\lab-renderer\change-plate-supplement-renderer.js
```

Some audit scripts attempted to normalize paths with:

```js
replaceAll("\\\\", "/")
```

That only replaces a double-backslash sequence, not the single Windows path separator in the runtime string. As a result, allowed files containing the old blue HU/debug placeholder were not recognized by the allowlist and the release check failed.

## Change

The affected audit scripts now normalize single backslashes correctly:

```js
replaceAll("\\", "/")
```

Updated scripts:

- `scripts/check-renderer-legacy-audit.mjs`
- `scripts/check-card-lab-renderer-boundary.mjs`
- `scripts/check-lab-public-api-boundary.mjs`
- `scripts/check-plate-renderer-public-entry.mjs`
- `tools/plate-physical-lab/scripts/check-renderer-legacy-audit.mjs`

## No runtime changes

No Card runtime behavior, renderer geometry, HU logic, sort logic, popup logic, font logic or Reminder integration changed in b347.
