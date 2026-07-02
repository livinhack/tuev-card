# Handover – b354 Editor Preview Scale Cleanup

Current stand: **b354**.

b354 is a targeted follow-up to the b352 editor-preview diagnostics. The b353 screenshot confirmed `scaled: true` with a safer inner-width scale target and no obvious right-edge clipping. b354 is the cleanup checkpoint that keeps the scale fix and removes the temporary diagnostics.

## Changed in b354

- Kept `getPreviewScaleSafetyPx()`.
- Kept scale calculation on `outerVisiblePreviewWidth - previewScaleSafetyPx`.
- Kept `outerVisiblePreviewWidth` capped by measured card width when available.
- Kept the outer scale wrapper on visible preview width while the inner simulated layout scales to the safer usable width.
- Removed the temporary preview diagnostic overlay.
- Updated `check:card-editor-preview-inner-width-scale` to verify the scale fix stays and diagnostics are gone.

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

Historical b338/b354 note: Sortierlogik remains on the b337 rollback path, and group Farben continue to move with their groups.

Historical b344/b354 note: Final Release Audit status remains preserved.
Reminder-ZIP integration remains a later End-to-End step after the Card-side preview issue is resolved.
