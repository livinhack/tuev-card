# Handover – b332 Card/Lab Adapter Options Audit

Current stand: b332.

b332 is a deliberately small cleanup/audit checkpoint after b331. It keeps the protected Card/Lab renderer boundary unchanged and only tidies the Card-specific option mapping inside the adapter.

## Previous checkpoint

- b327 activated the full HU badge renderer in the Card and in the Wechselkennzeichen vehicle-specific supplement.
- b328 added HU smoke checks.
- b329 audited legacy renderer paths.
- b330 removed only the old unimported Full/Card `src/plate/mm-model.js` file.
- b331 added the Card/Lab renderer boundary guard.

## b332 changes

- Centralized Card-owned Lab renderer defaults in `CARD_LAB_RENDERER_DEFAULTS` inside `src/plate/lab-renderer-adapter.js`.
- Kept Reminder/vehicle-specific data as explicit pass-through values:
  - `huYear`
  - `huMonth`
  - `huRotation`
  - `changePlate`
- Normalized the adapter debug option once before mapping it to Lab debug flags.
- Added `scripts/check-card-lab-adapter-options-audit.mjs`.
- Added npm script `check:card-lab-adapter-options-audit`.
- Included the new check in `npm run check`.
- Updated package/version markers to b332.
- Added `docs/B332_CARD_LAB_ADAPTER_OPTIONS_AUDIT.md`.

## Boundary still protected

```text
tuev-card-entry.js / editor.js
→ src/plate/renderer.js
→ src/plate/lab-renderer-adapter.js
→ src/plate/lab-renderer/plate-public-api.js
→ Lab renderer internals
```

## Not changed

- No geometry changes.
- No HU renderer logic changes.
- No Wechselkennzeichen geometry changes.
- No additional file removals.
- No legacy/alternate renderer switch.

## Checks run

- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/tuev-card.js` for b332.

## Next suggested step

Use b332 as the adapter-options checkpoint. The next safe step should again be audit-first: inspect the remaining Card-facing renderer/export compatibility names and remove only aliases that are proven unnecessary, or leave them if the editor/card boundary still uses them.

## Matching ZIPs

- Matching standalone Lab ZIP: `plate-physical-lab-b332-card-lab-adapter-options-audit.zip`.
- Full/Card handover ZIP: `tuev-card-full-b332-card-lab-adapter-options-audit-handover.zip`.
