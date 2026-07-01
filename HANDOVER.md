# Handover – b335 Card Editor/Preview Final Check

Current stand: b335.

b335 is the second condensed finalization step after b334. It combines the planned renderer options audit with the editor/preview stability checkpoint.

## Base

Started from:

- `plate-physical-lab-b334-lab-public-api-boundary-audit.zip`
- `tuev-card-full-b334-lab-public-api-boundary-audit-handover.zip`

## b335 changes

- Updated version/cache markers to b335:
  - Card entry imports `./plate/renderer.js?v=b335`.
  - Editor imports `../plate/renderer.js?v=b335`.
  - `src/plate/renderer.js` re-exports from `./lab-renderer-adapter.js?v=b335`.
- Stabilized the editor font availability check:
  - added in-progress guard;
  - added 10-second throttle;
  - retained the existing UI availability flag;
  - removed automatic config mutation from the font check.
- The editor no longer rewrites `plate_style` to `text` when fonts are temporarily unavailable.
- The editor font check no longer fires config changes.
- Removed one duplicate unreachable return in `src/plate/lab-renderer-adapter.js`.
- Added `scripts/check-card-editor-preview-final.mjs`.
- Added npm script `check:card-editor-preview-final` and included it in `npm run check`.
- Added `docs/B335_CARD_EDITOR_PREVIEW_FINAL_CHECK.md`.

## Still protected from earlier checkpoints

```text
Card/Editor
→ src/plate/renderer.js
→ src/plate/lab-renderer-adapter.js
→ src/plate/lab-renderer/plate-public-api.js
→ Lab renderer internals
```

The b335 check additionally verifies:

- Card/Editor use the b335 public renderer cache boundary.
- Editor font checks are guarded and throttled.
- Editor font checks do not mutate `plate_style`.
- Editor font checks do not call `fireConfigChanged()`.
- Card runtime keeps its guarded graphical-plate availability gate.
- `huBadgeRenderer: "full"` remains active in the Card adapter.
- `huYear`, `huMonth`, `huRotation`, and `changePlate` remain explicit pass-through values.
- The adapter/editor remain legacy-toggle free.

## Not changed

- No plate geometry changed.
- No HU badge rendering changed.
- No Wechselkennzeichen geometry changed.
- No font file paths changed.
- No renderer boundary was collapsed.
- No legacy/old renderer toggle was added.

## Checks run

Standalone Lab:

- `npm run check` passed.

Full/Card:

- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/tuev-card.js` for b335.

## Font note

As in previous ChatGPT ZIPs, the actual GL font binaries are not included. The release asset check therefore reports missing local font binaries but passes with the existing handover warning. A real GitHub/HACS release still needs the GL TTF files present before building.

## Next recommended step

Proceed with the condensed plan:

- b336: Final Smoke Matrix + Docs/HACS/Release Checkpoint.

b335 should be used as the editor/preview/options final checkpoint.

## Artifacts

- Matching standalone Lab ZIP: `plate-physical-lab-b335-card-editor-preview-final-check.zip`.
- Full/Card handover ZIP: `tuev-card-full-b335-card-editor-preview-final-check-handover.zip`.
