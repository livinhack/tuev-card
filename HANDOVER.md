# Handover – b338 Card Editor Options / Sort / Group Color Fix

Current stand: **b338**.

b338 fixes concrete Card/editor findings reported after b337. It is intentionally not a renderer-geometry step.

## User-reported problems fixed

Kurz: b338 behebt Sortierfunktionen, Aufsteigend/Absteigend und Gruppen-Farben beim Verschieben.

1. Checkbox **Kennzeichen grafisch darstellen** was ineffective.
   - Before: graphical rendering was used whenever the renderer/font was available, regardless of `plate_style`.
   - Now: the Card only builds a graphical plate layout when `this.config.plate_style === "plate"` and the graphical renderer is available.
   - If the checkbox is unchecked, the Card falls back to the normal text display.

2. Sort controls and ascending/descending were ineffective for the ungrouped entity area.
   - Before: sort settings were changed, but the visible draft entity order was not sorted immediately.
   - Now: `setUngroupedSort()` and `toggleUngroupedSortDirection()` sort `_draftEntityIds` through `sortEntityIds()` and persist the resulting order through `applyDraftConfig()`.
   - The existing `releaseUngroupedEntities()` handler is now wired to the button.

3. Group colors did not move with reordered groups.
   - Before: groups without explicit colors used index-based fallback colors, so moving groups changed their visible colors.
   - Now: `moveGroup()` materializes each group's currently visible fallback color before moving, so the color travels with the group.

## Changed files

- `src/tuev-card-entry.js`
  - cache marker to b338
  - graphical plate layout gated by `plate_style === "plate"`
- `src/editor/editor.js`
  - cache marker to b338
  - imports b338 group helpers
  - sorted draft entity order for ungrouped sort controls
  - release ungrouped button wired
  - group reorder preserves visible color
- `src/card/groups.js`
  - entities helper cache marker to b338
- `src/plate/renderer.js`
  - adapter cache marker to b338
- `scripts/check-card-editor-options-fix.mjs`
  - new guard for the b338 fixes
- `docs/B338_CARD_EDITOR_OPTIONS_SORT_COLOR_FIX.md`
  - documents this step
- `package.json`
  - version `0.1.1-b338`
  - adds `check:card-editor-options-fix` to `npm run check`

## Not changed

- No plate geometry changed
- no number-plate geometry
- no HU badge rendering
- no Wechselkennzeichen geometry
- no Font paths
- no Reminder integration
- no legacy renderer switch

## Checks

Run from the Full/Card package:

```bash
npm run check
npm run build
```

Matching standalone Lab ZIP is included for continuity, but b338 is a Card/editor fix.
