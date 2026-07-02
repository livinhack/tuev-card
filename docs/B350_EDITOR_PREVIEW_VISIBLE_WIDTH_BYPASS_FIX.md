# b353 Editor Preview Visible Width Bypass Fix

Fixes the Home Assistant editor preview clipping/jitter root cause identified after b349.

## Change

`getLayoutContext()` now treats `getPreviewVisibleWidth()` as the authoritative width for preview scale/bypass decisions. It no longer falls back from `0` to `measuredWidth`, because `measuredWidth` can include a wider HA editor dialog ancestor.

## Guard

The scale bypass now uses `visiblePreviewWidth >= simulatedWidth - 4` instead of `measuredWidth >= simulatedWidth - 4`. First render with no visible width uses a safe non-scaled simulated-width fallback until the existing width-refresh pass measures the preview pane.

No renderer geometry, HU logic, sorting, popup handling, or Reminder integration changed.
