# TÜV Reminder Card b354

Full/Card handover ZIP for **b354 Editor Preview Scale Cleanup**.

b354 follows the b352 diagnostic screenshot: the preview scale path was active, but the scale target still used too much of the outer editor-preview width. The remaining right-edge clipping is addressed by scaling to an inner usable preview width that reserves scrollbar/edge space.

## Changed in b354

- Editor-preview scale target now subtracts a named safety inset.
- `outerVisiblePreviewWidth` is capped by measured card width when available.
- `visiblePreviewWidth` now means inner usable preview width for scale calculation.
- Temporary b352/b353 diagnostic overlay removed again after the b353 values confirmed the inner-width scale fix.
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

Historical b338/b354 note: Kennzeichen grafisch darstellen remains the editor option that switches between graphical and text plate rendering.

Historical b344/b354 note: Final Release Audit status remains preserved.
ChatGPT-ZIPs enthalten keine TTF-Binaries. Für GitHub/HACS müssen die GL-Fonts lokal vorhanden sein.
Nicht-Ziele b354: keine Kennzeichen-Geometrie, keine Reminder-Integration, keine Sortierlogik, keine HU-Logik.
