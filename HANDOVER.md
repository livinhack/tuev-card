# Handover – b330 Remove Unused Legacy mm-model

Current stand: b330.

b330 is a deliberately small cleanup checkpoint after the b329 Card renderer legacy audit. It removes only the demonstrably unimported old Full/Card path `src/plate/mm-model.js`. No renderer geometry was changed and no legacy/alternate renderer switch was added.

## Changes

- Removed obsolete Full/Card file:
  - `src/plate/mm-model.js`
- Kept the active Card renderer chain unchanged:
  - `src/plate/renderer.js`
  - `src/plate/lab-renderer-adapter.js`
  - `src/plate/lab-renderer/plate-public-api.js`
- Updated `check:renderer-legacy-audit` so it now proves the old Full/Card `src/plate/mm-model.js` path is absent and still not imported.
- Left standalone Lab compatibility boundaries intact. The Lab still keeps its own `src/plate/mm-model.js` compatibility facade.
- Updated visible b330 version markers/package versions.

## Explicit non-changes

- No geometry changes.
- No HU badge changes beyond b327/b328 behavior.
- No Card/editor UX changes.
- No additional renderer cleanup beyond the single unused file removal.
- No merging of fachlich ähnliche, aber nicht identische Abläufe.

## Checks

Full/Card:

- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/tuev-card.js` for b330.

Standalone Lab:

- `npm run check` passed.

Font note: the ChatGPT handover ZIP does not include GL TTF binaries. This remains expected here. For a real GitHub/HACS release, the GL font files must be present before building/releasing.

## ZIPs

- Matching standalone Lab ZIP: `plate-physical-lab-b330-remove-unused-legacy-mm-model.zip`.
- Full/Card handover ZIP: `tuev-card-full-b330-remove-unused-legacy-mm-model-handover.zip`.

## Suggested next step

After visual confirmation, continue with another one-at-a-time legacy audit/removal step. Do not remove compatibility files just because they look similar; only remove files that a check proves are not used by the active Card/Lab paths.
