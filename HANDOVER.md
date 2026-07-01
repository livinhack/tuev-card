# Handover – b334 Lab Public API Boundary Audit

Current stand: b334.

b334 is the first condensed finalization step after b333. It combines the planned Lab public API audit and Lab-internal boundary audit into one guarded checkpoint.

## Base

Started from:

- `plate-physical-lab-b333-plate-renderer-public-entry-cleanup.zip`
- `tuev-card-full-b333-plate-renderer-public-entry-cleanup-handover.zip`

## b334 changes

- Added `scripts/check-lab-public-api-boundary.mjs` to the Full/Card package.
- Added the same boundary check to the standalone Lab package.
- Added npm script `check:lab-public-api-boundary`.
- Added the new check to `npm run check` in both packages.
- Updated version/cache markers to b334:
  - Card entry imports `./plate/renderer.js?v=b334`.
  - Editor imports `../plate/renderer.js?v=b334`.
  - `src/plate/renderer.js` re-exports from `./lab-renderer-adapter.js?v=b334`.
- Added `docs/B334_LAB_PUBLIC_API_BOUNDARY_AUDIT.md`.

## Boundary now protected

```text
Card/Editor
→ src/plate/renderer.js
→ src/plate/lab-renderer-adapter.js
→ src/plate/lab-renderer/plate-public-api.js
→ Lab renderer internals
```

The new check verifies:

- `plate-public-api.js` remains the single Lab entry from the Card adapter.
- Card-facing source does not bypass the Lab public API.
- The public API only delegates to the established renderer/rules helper modules.
- The public API remains declarative export glue and does not grow executable renderer logic, defaults, font handling, placeholder handling, or legacy toggles.
- Stable public exports remain present.

## Not changed

- No plate geometry changed.
- No HU badge rendering changed.
- No Wechselkennzeichen geometry changed.
- No font loading logic changed.
- No further files were removed.
- No legacy/old renderer toggle was added.

## Checks run

Standalone Lab:

- `npm run check` passed.

Full/Card:

- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/tuev-card.js` for b334.

## Font note

As in previous ChatGPT ZIPs, the actual GL font binaries are not included. The release asset check therefore reports missing local font binaries but passes with the existing handover warning. A real GitHub/HACS release still needs the GL TTF files present before building.

## Next recommended step

Proceed with the condensed plan:

- b335: Renderer Options + Editor/Preview Final Check.
- b336: Final Smoke Matrix + Docs/HACS/Release Checkpoint.

b334 should be used as the boundary/Public-API checkpoint.

## Artifacts

- Matching standalone Lab ZIP: `plate-physical-lab-b334-lab-public-api-boundary-audit.zip`.
- Full/Card handover ZIP: `tuev-card-full-b334-lab-public-api-boundary-audit-handover.zip`.
