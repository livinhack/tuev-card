# b354 Editor Preview Scale Cleanup

b354 follows the b352 diagnostics screenshot. The diagnostic values showed that `previewScaled=true` and `scale` were active, but the visible right edge was still clipped. The remaining issue was that the scale target used the outer preview pane width, while the usable content width is smaller because of the reserved scrollbar gutter and right edge polish.

## Change

- The editor-preview scale target now uses an inner usable width.
- `outerVisiblePreviewWidth` is capped by the measured card width when available.
- `previewScaleSafetyPx` reserves scrollbar and edge space before calculating scale.
- The outer wrapper still occupies the visible pane; the inner simulated 720px preview is scaled to the safer usable width.

## Not changed

- No plate geometry.
- No HU logic.
- No sorting logic.
- No Reminder integration.
- No popup handling changes.
