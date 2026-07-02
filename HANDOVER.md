# Handover – b349 Editor Preview Scroll Edge Polish

Current stand: **b349**.

b349 builds on b348. The text-mode editor preview jitter fix remains, and the popup outside-click rollback remains. This step only cleans up the visual right edge of the stabilized editor preview scrollbar/gutter area.

## Change in b349

- `src/tuev-card-entry.js`
  - `data-preview-scale-outer` now uses `scrollbar-gutter: stable;` instead of `stable both-edges`.
  - The preview wrapper paints a card-background edge.
  - The preview wrapper draws a subtle inset right border using `var(--divider-color)`.
  - Right-side border radii are preserved so the preview edge does not look like an unbounded grey strip.

- `scripts/check-card-editor-text-preview-scrollbar-stability.mjs`
  - Updated to require the b349 edge polish and to reject the old `stable both-edges` style.

## Kept from b348

- Popup outside-click handling remains on the safer b344-style deferred `click` capture path.
- No `pointerdown` capture experiment is restored.
- No new `keydown` popup listener is restored.

## Kept from b347

- Text-mode editor preview width/height hysteresis.
- Stable scrollbar reservation to avoid the permanent text-mode preview jitter.
- Fixed text plate fallback line box.

## Not changed

- keine Kennzeichen-Geometrie
- keine HU-Logik
- keine Wechselkennzeichen-Geometrie
- keine Sortierlogik
- keine Reminder-Integration
- kein grafischer Renderer-Umbau
- kein Legacy-/Umschalter

## Validation

- `npm run check`
- `npm run build`

Both passed in this handover build.

## Next recommended manual test

In the Home Assistant card editor:

1. Open the editor.
2. Toggle **Kennzeichen grafisch darstellen** off.
3. Confirm the permanent text-mode jitter stays gone.
4. Confirm the right preview edge/scrollbar area now looks visually bounded.
5. Confirm floating panels still close on outside click and the editor page does not hang.

## Preserved earlier editor behaviour

b349 preserves the earlier editor fixes: **Kennzeichen grafisch darstellen** still gates graphical plate rendering, Sortier controls keep the b337 config flow, and Gruppen-Farben continue to travel with moved groups. The b348 popup rollback remains active.

## Final Release Audit / later Reminder boundary

b349 keeps the Final Release Audit status. The later Reminder-ZIP integration remains a separate End-to-End step after the Card-side editor/preview polish is confirmed.
