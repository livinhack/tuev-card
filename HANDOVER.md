# Handover – b351 Editor Preview Force Scale Contract

Current stand: **b351**.

b351 builds on b350 and applies the next editor-preview fix suggested by the external review: in the Home Assistant editor preview, a simulated four-column layout must stay scaled whenever the simulated width is wider than the actually visible preview pane.

## Problem addressed

b350 removed the main measured-width bypass, but the preview could still show a clipped, oversized slice in narrow HA editor panes. The remaining issue was that the preview wrapper could still behave as if the simulated layout width were the visible width.

## Changed in b351

- `getLayoutContext()` now computes an explicit force-scale contract:
  - `const shouldScalePreview = simulatedWidth > visiblePreviewWidth + 4;`
- If the simulated editor preview width is larger than the visible preview width, `previewScaled: true` is returned before any non-scaled return path.
- The scaled preview layout context now exposes `visiblePreviewWidth`.
- The outer scaled preview wrapper uses the visible preview width instead of a possibly oversized host/card width:
  - `width: ${layoutContext.visiblePreviewWidth ? ... : "100%"}`
  - `max-width: 100%`
- Added check:
  - `check:card-editor-preview-force-scale-contract`
- Existing preview/popup/stability checks were updated to protect the new b351 contract.

## Preserved from previous stands

- b347/b348 text-preview scrollbar stability remains.
- b348 popup rollback remains.
- b349 preview edge polish remains.
- b350 visible-width bypass fix remains.
- b337 sort rollback remains.

## Not changed

- no Kennzeichen geometry
- no HU logic
- no Wechselkennzeichen geometry
- no Sortierlogik
- no Reminder integration
- no popup experiment

## Checks

Passed in this handover environment:

- `npm run check`
- `npm run build`

Font note: ChatGPT ZIPs do not include TTF binaries. A local GitHub/HACS build with the GL fonts present in `fonts/` copies them to `dist/fonts/`.

## Guardrail

No plate geometry changed. Keine Kennzeichen-Geometrie. Reminder integration remains later.

## Preserved editor fixes

Kennzeichen grafisch darstellen remains the text/graphic switch. Sortier controls keep the b337 config-only flow. Gruppen-Farben travel with moved groups.

## Final Release Audit / later integration

b351 keeps the Card Final Release Audit status. The current Reminder-ZIP integration remains a later End-to-End step.
