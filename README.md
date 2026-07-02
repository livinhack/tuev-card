# TÜV Reminder Card b351

Full/Card handover ZIP for **b351 Editor Preview Force Scale Contract**.

b351 builds on b350 and tightens the editor-preview scaling rule: if the simulated four-column preview is wider than the actually visible Home Assistant editor preview pane, the scaled preview path must stay active and the wrapper must be bounded to the visible preview width.

## Current stand

- Current Card stand: **b351**
- Based on: b350 Editor Preview Visible Width Bypass Fix
- Scope: Editor preview scale/wrapper contract only

## Changed in b351

- `getLayoutContext()` explicitly detects `shouldScalePreview = simulatedWidth > visiblePreviewWidth + 4`.
- Simulated editor preview overflow now forces `previewScaled: true`.
- The scaled preview context exposes `visiblePreviewWidth`.
- The scaled preview outer wrapper uses `visiblePreviewWidth` and `max-width: 100%` so a too-wide HA editor host cannot expose only a clipped slice.
- New release check: `check:card-editor-preview-force-scale-contract`.

## Not changed

- no plate geometry
- no HU logic
- no change-plate geometry
- no sorting logic
- no popup experiment
- no Reminder integration

## Checks

Run:

```bash
npm run check
npm run build
```

ChatGPT ZIPs do not include TTF binaries. A local GitHub/HACS build must include the GL fonts in `fonts/` so they are copied to `dist/fonts/`.

## Guardrail

No plate geometry changed. Keine Kennzeichen-Geometrie. Reminder integration remains later.

## Preserved editor fixes

Kennzeichen grafisch darstellen remains the user-facing switch for graphical vs text plates. Sortier controls keep the b337 config flow. Gruppen-Farben remain preserved when groups are moved.

## Final Release Audit note

b351 keeps the Card Final Release Audit status while applying only the editor preview force-scale contract.

ChatGPT-ZIPs enthalten keine TTF-Binaries. Keine Kennzeichen-Geometrie. Keine Reminder-Integration.
