# b329 – Card Renderer Legacy Path Audit

Purpose: create a conservative audit checkpoint after b328 before deleting or merging renderer code.

## What changed

- Added `check:renderer-legacy-audit` to the standalone Lab and Full/Card packages.
- The audit proves that the active Card boundary is still:
  - `src/tuev-card-entry.js` / editor
  - `src/plate/renderer.js`
  - `src/plate/lab-renderer-adapter.js`
  - staged Physical-Lab renderer modules below `src/plate/lab-renderer/`
- The audit also documents intentionally retained non-active paths instead of removing them blindly.

## Audit result

- `src/plate/renderer.js` is only a public delegation boundary.
- `src/plate/lab-renderer-adapter.js` is the active Card adapter and uses `src/plate/lab-renderer/plate-public-api.js`.
- `src/plate/mm-model.js` has no incoming imports in the active source graph. It is a removal candidate, but b329 does not delete it yet.
- Lab compatibility files such as `src/plate/lab-renderer/mm-model.js` and `src/plate/lab-renderer/spacing-solver.js` are not Card-facing imports.
- Old blue `#1ea5ff` remains allowed only in Lab/debug/placeholder contexts; b328 smoke checks still guarantee the active full HU path does not emit it.

## Deliberate non-changes

- No geometry changes.
- No renderer switch or legacy toggle.
- No deletion of old files yet.
- No merging of merely similar logic.

## Next cleanup candidate

If b329 is visually confirmed, the safest next code cleanup is a dedicated removal step for the unimported old `src/plate/mm-model.js` path in the Full/Card package, with checks proving the active renderer still passes.
