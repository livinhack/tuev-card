# Handover – b337 Post-Plate Card Cleanup / Open Tasks Audit

Current stand: **b337**.

b337 follows the technically prepared number-plate renderer checkpoint b336. The user clarified that many of the real-world smoke cases can only be tested after the corresponding options/data are implemented in the Reminder. Therefore b337 does **not** claim that every plate variant has been manually verified in Home Assistant. Instead, it freezes the Card-side plate renderer as prepared and starts sorting the remaining Card work.

## Base

Started from:

- `plate-physical-lab-b336-final-plate-smoke-release-checkpoint.zip`
- `tuev-card-full-b336-final-plate-smoke-release-checkpoint-handover.zip`

## b337 changes

- Updated version/cache markers to b337:
  - Card entry imports `./plate/renderer.js?v=b337`.
  - Editor imports `../plate/renderer.js?v=b337`.
  - `src/plate/renderer.js` re-exports from `./lab-renderer-adapter.js?v=b337`.
- Added post-plate Card audit documentation:
  - `docs/B337_POST_PLATE_CARD_OPEN_TASKS_AUDIT.md`.
- Added check:
  - `scripts/check-post-plate-card-open-tasks.mjs`.
  - npm script `check:post-plate-card-open-tasks`.
  - included in `npm run check`.
- Updated README/HANDOVER to mark b337 as the Card cleanup/open-task audit after the plate checkpoint.

## Plate renderer status

The plate renderer is now treated as **Card-side prepared/frozen**:

- The active renderer chain remains protected:

```text
Card/Editor
→ src/plate/renderer.js
→ src/plate/lab-renderer-adapter.js
→ src/plate/lab-renderer/plate-public-api.js
→ Lab renderer internals
```

- b336 remains the technical plate smoke/release checkpoint.
- b337 adds the clarification that full manual verification of all variants waits for Reminder-side options/data.
- Future plate work should be bug-fix driven or part of the explicit Reminder integration pass.

## Remaining Card work buckets

1. **Card/editor finish work**
   - Re-check editor controls and config handling outside the plate renderer.
   - Keep renderer entry boundaries unchanged unless a concrete bug appears.

2. **Layout/group/overlay follow-ups**
   - Group layout behavior and small-groups-side-by-side behavior.
   - Overlay/visual polish that is independent of plate geometry.
   - Preview polish outside the plate SVG internals.

3. **HACS/font/release readiness**
   - Ensure GL TTF binaries are present in the real build/release environment.
   - Keep README/HACS notes user-facing and accurate.

4. **Later Reminder integration**
   - When the current Reminder ZIP is supplied, map actual Reminder data/options to the Card.
   - Then run the real end-to-end plate matrix in Home Assistant.

## Not changed

- No plate geometry changed.
- No HU badge rendering changed.
- No Wechselkennzeichen geometry changed.
- No font file paths changed.
- No Reminder integration added yet.
- No renderer boundary was collapsed.
- No legacy/old renderer toggle was added.

## Checks run

Standalone Lab:

- `npm run check` passed.

Full/Card:

- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/tuev-card.js` for b337.

## Font note

As in previous ChatGPT ZIPs, the actual GL font binaries are not included. The release asset check therefore reports missing local font binaries but passes with the existing handover warning. A real GitHub/HACS release still needs the GL TTF files present before building.

## Status

b337 should be used as the **post-plate Card cleanup/open-task audit checkpoint**.

The next logical step is Card work outside the plate renderer, unless the user provides concrete b337 HA findings.

## Artifacts

- Matching standalone Lab ZIP: `plate-physical-lab-b337-post-plate-card-open-tasks-audit.zip`.
- Full/Card handover ZIP: `tuev-card-full-b337-post-plate-card-open-tasks-audit-handover.zip`.
