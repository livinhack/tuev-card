# Handover – b353 Editor Preview Inner Width Scale Fix

Current stand: **b353**.

b353 is a targeted follow-up to the b352 editor-preview diagnostics. The screenshot showed `scaled: true` with `scale: 0.653`, but the right edge was still clipped. Therefore the remaining issue was not the old bypass anymore; the scale target was still too wide because it used the outer preview pane width instead of the inner usable width.

## Changed in b353

- Added `getPreviewScaleSafetyPx()`.
- Scale calculation now uses `outerVisiblePreviewWidth - previewScaleSafetyPx`.
- `outerVisiblePreviewWidth` is capped by the measured card width when available.
- The outer scale wrapper keeps the visible preview width; the inner simulated layout scales to the safer usable width.
- Diagnostic overlay remains for this test build and now shows `outer` and `safety`.
- Added `check:card-editor-preview-inner-width-scale`.

## Preserved

- b350 visible-width bypass fix.
- b351 force-scale contract.
- b347/b348 text preview stability and popup rollback.
- b349 scroll edge polish.
- Sortierung remains on the b337 rollback path.

## Not changed

- No Kennzeichen geometry.
- No HU logic.
- No Wechselkennzeichen geometry.
- No sorting logic.
- No Reminder integration.

No plate geometry changed. Do not continue broad number-plate renderer cleanup in this step. Reminder integration remains a later phase.

Historical b338/b353 note: Sortierlogik remains on the b337 rollback path, and group Farben continue to move with their groups.

Historical b344/b353 note: Final Release Audit status remains preserved.
Reminder-ZIP integration remains a later End-to-End step after the Card-side preview issue is resolved.
