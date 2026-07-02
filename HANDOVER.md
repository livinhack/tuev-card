# Handover – b352 Editor Preview Layout Diagnostics

Current stand: **b352**.

b352 is a diagnostic checkpoint after b351. The b351 forced-scale contract did not visibly change the remaining Home Assistant editor-preview clipping. Therefore b352 deliberately avoids another guessed fix and exposes the live layout values in the editor preview.

## Changed in b352

- Added `renderPreviewDiagnostics(layoutContext)` in `src/tuev-card-entry.js`.
- In editor preview context, the Card now renders a small bottom-right diagnostic overlay.
- The overlay prints:
  - build marker
  - reason/debug branch
  - plate style
  - requested columns
  - measured width
  - raw visible preview width
  - stabilized visible preview width
  - simulated preview width
  - layout width
  - whether scaled preview is active
  - scale value
- `getLayoutContext()` now carries diagnostic values through the returned context.
- Version/cache markers updated to b352.

## Intentionally not changed

- No new preview fix beyond diagnostics.
- No geometry changes.
- No HU logic changes.
- No change-plate geometry changes.
- No sorting changes.
- No Reminder integration.
- No popup outside-click experiment.

## What to do next

1. Build/install b352 in Home Assistant.
2. Open the editor preview in the broken/clipped state.
3. Send a screenshot that includes the b352 diagnostic overlay.
4. Use the values to decide whether the next real fix must target:
   - `getPreviewVisibleWidth()` measurement,
   - the scale wrapper,
   - `layoutWidth`,
   - or an outer HA clipping/scroll container.

## Checks

- Full/Card `npm run build` passed.
- Full/Card `npm run check` passed.
- Lab `npm run check` passed.

## Font note

ChatGPT ZIPs do not include TTF binaries. Local GitHub/HACS release builds must include the GL font files in `fonts/`.

No plate geometry changed. Reminder integration remains a later phase.

Historical b338/b352 note: Sortierlogik remains on the b337 rollback path, and group Farben continue to move with their groups. The Kennzeichen grafisch darstellen option remains effective.

b352 also preserves the prior Card Final Release Audit status. The current Reminder-ZIP integration remains a later End-to-End step.
