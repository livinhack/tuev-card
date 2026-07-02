# TÜV Reminder Card b349

Full/Card handover ZIP for **b349 Editor Preview Scroll Edge Polish**.

b349 keeps the b347/b348 text-mode editor preview stability fix and the b348 popup rollback. It only polishes the right edge of the stabilized editor preview so the permanent scrollbar/gutter area has a clear visual boundary.

## Current status

- Current Card stand: **b349**
- Based on: **b348 Editor Popup Rollback / Text Preview Stability**
- Scope: Editor-preview visual edge polish only.
- Reminder integration remains a later end-to-end step.

## Changed in b349

- The scaled editor preview wrapper now reserves a stable scrollbar gutter without the previous `both-edges` ghost gutter.
- The preview wrapper paints its own card-background edge.
- A subtle inset right border gives the stabilized preview a clearer visual end next to the Home Assistant editor scrollbar/grey background.
- Existing text-mode jitter stabilization remains unchanged.
- Popup outside-click handling remains on the safer b344/b348 deferred click path.

## Not changed

- keine Kennzeichen-Geometrie
- keine HU-Logik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- kein grafischer Renderer-Umbau
- kein neues Popup-Experiment

## Checks

Run:

```bash
npm run check
npm run build
```

Expected:

- JavaScript check passes.
- Release asset check passes when local GL font binaries exist in `fonts/`.
- Card/Lab renderer boundary checks pass.
- Text-preview scrollbar stability check also validates the b349 right-edge polish.

## Font note

The release must include the GL font binaries as TTF files in `fonts/` and `dist/fonts/` when built locally. ChatGPT-generated ZIPs may omit binary font files; the local build script copies existing font binaries into `dist/fonts/`.

## Preserved earlier editor fixes

b349 preserves the earlier **Kennzeichen grafisch darstellen** option fix: the checkbox controls text vs. graphical plate rendering, while the preview edge polish only changes the editor preview wrapper. The b337 sort rollback, group color preservation when moving groups, and b348 popup rollback remain unchanged.

## Final Release Audit note

b349 keeps the Final Release Audit status from the previous release-audit checkpoint; this build only polishes the editor preview edge. ChatGPT-ZIPs enthalten keine TTF-Binaries. A local GitHub/HACS release must include the GL TTF files before building.
