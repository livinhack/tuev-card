# TÜV Reminder Card b350

Full/Card handover ZIP for **b350 Editor Preview Visible Width Bypass Fix**.

b350 builds on b349 and fixes the root cause of the editor preview clipping/jitter: the preview scale bypass could use a too-wide Home Assistant editor dialog ancestor as `measuredWidth`.

## Current stand

- Current Card stand: **b350**
- Based on: b349 Editor Preview Scroll Edge Polish
- Scope: Editor preview width/scale decision only

## Changed in b350

- `getLayoutContext()` no longer uses `this.getPreviewVisibleWidth() || measuredWidth`.
- A first render where the visible preview width is still `0` gets a safe fallback using the simulated preview width.
- The scale-bypass condition now checks `visiblePreviewWidth`, not `measuredWidth`.
- Existing width refreshes can then correct the preview after the first measurable frame.

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

- keine Kennzeichen-Geometrie
- Reminder integration remains later.


## Preserved editor fixes

- Kennzeichen grafisch darstellen remains the user-facing switch for graphical vs text plates.
- Sortier controls keep the b337 config flow.
- Gruppen-Farben remain preserved when groups are moved.


## Final Release Audit / guardrails

This b350 handover keeps the Final Release Audit status while applying only the editor preview visible-width bypass fix.

- ChatGPT-ZIPs enthalten keine TTF-Binaries.
- keine Kennzeichen-Geometrie
- keine Reminder-Integration
