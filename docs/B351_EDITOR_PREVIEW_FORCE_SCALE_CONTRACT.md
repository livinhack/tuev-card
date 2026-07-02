# b352 Editor Preview Force Scale Contract

b352 is a targeted follow-up to b350 for the Home Assistant card editor preview.

## Goal

The editor preview may simulate a wider dashboard layout so the configured column count can be shown. If this simulated width is wider than the visible preview pane, the content must be scaled into the pane and must not be rendered as an oversized clipped slice.

## Contract

- `getPreviewVisibleWidth()` is the source for the visible preview pane.
- `measuredWidth` from wider HA editor ancestors must not disable scaling.
- If `simulatedWidth > visiblePreviewWidth + 4`, the preview must return `previewScaled: true`.
- The scaled preview wrapper must use the visible preview width and `max-width: 100%`.

## Guardrails

- No Kennzeichen geometry changes.
- No HU logic changes.
- No sorting changes.
- No Reminder integration.
