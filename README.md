# TÜV Reminder Card b353

Full/Card handover ZIP for **b353 Editor Preview Inner Width Scale Fix**.

b353 follows the b352 diagnostic screenshot: the preview scale path was active, but the scale target still used too much of the outer editor-preview width. The remaining right-edge clipping is addressed by scaling to an inner usable preview width that reserves scrollbar/edge space.

## Changed in b353

- Editor-preview scale target now subtracts a named safety inset.
- `outerVisiblePreviewWidth` is capped by measured card width when available.
- `visiblePreviewWidth` now means inner usable preview width for scale calculation.
- Diagnostic overlay remains temporarily visible and now reports `outer` and `safety` values.
- New check: `check:card-editor-preview-inner-width-scale`.

## Not changed

- No Kennzeichen geometry.
- No HU logic.
- No Wechselkennzeichen geometry.
- No sorting logic.
- No Reminder integration.
- No popup experiment.

ChatGPT-ZIPs contain no TTF binaries. A local build with the GL font files in `fonts/` copies them to `dist/fonts/`.

No plate geometry changed. Do not continue broad number-plate renderer cleanup in this step. Reminder integration remains a later phase.

Historical b338/b353 note: Kennzeichen grafisch darstellen remains the editor option that switches between graphical and text plate rendering.

Historical b344/b353 note: Final Release Audit status remains preserved.
ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal vorhanden sein.
Nicht-Ziele b353: keine Kennzeichen-Geometrie, keine Reminder-Integration, keine Sortierlogik, keine HU-Logik.
