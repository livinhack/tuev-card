# Handover – b329 Card Renderer Legacy Audit

Current Lab stand: b329.

b329 keeps the b328 HU smoke checkpoint unchanged and adds a conservative renderer legacy-path audit. No geometry was changed and no renderer files were deleted.

## Changes

- Added `check:renderer-legacy-audit`.
- The audit confirms the standalone Lab still exposes the active renderer through `src/plate/plate-public-api.js`.
- Compatibility boundaries such as `src/plate/mm-model.js` and `src/plate/spacing-solver.js` remain present, but they are documented rather than mixed into the active Card cleanup.
- The blue HU placeholder remains available only when the full badge option is not enabled, so Lab A/B comparison is still possible.

## Validation

- `npm run check` passed.

Matching full ZIP: `tuev-card-full-b329-card-renderer-legacy-audit-handover.zip`.
Rollback: previous ZIP b328.
