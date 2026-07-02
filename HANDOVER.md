# Handover – b350 Editor Preview Visible Width Bypass Fix

Current stand: **b350**.

b350 builds on b349 and addresses the concrete root cause found in the editor preview: `getLayoutContext()` could bypass preview scaling because it used a too-wide `measuredWidth` from HA editor ancestors when `getPreviewVisibleWidth()` returned `0` during first render.

## Change

- `rawVisibleWidth = this.getPreviewVisibleWidth()` is kept separate from measured card/ancestor width.
- `rawVisibleWidth === 0` uses a safe simulated-width fallback instead of falling back to an oversized ancestor width.
- The preview scale-bypass guard now uses `visiblePreviewWidth >= simulatedWidth - 4`.
- The older `measuredWidth >= simulatedWidth - 4` bypass is rejected by checks.

## Preserved from previous stands

- b347/b348 text-preview scrollbar stability remains.
- b348 popup rollback remains.
- b349 preview edge polish remains.
- b337 sort rollback remains.

## Not changed

- no Kennzeichen geometry
- no HU logic
- no Wechselkennzeichen geometry
- no Sortierlogik
- no Reminder integration

## Checks

- `npm run check`
- `npm run build`

If b350 is confirmed in Home Assistant, this should replace b349 as the current Card-side editor-preview stability checkpoint before the Reminder ZIP integration.


## Guardrail

- keine Kennzeichen-Geometrie
- Reminder integration remains later.


## Preserved editor fixes

- Sortier controls keep the b337 config-only flow.
- Gruppen-Farben travel with moved groups.
- Kennzeichen grafisch darstellen remains the text/graphic switch.


## Final Release Audit / later integration

b350 keeps the Final Release Audit status after the editor preview visible-width bypass fix. The current Reminder-ZIP integration remains a later End-to-End step.
