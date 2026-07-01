# b327 – HU Badge Card Activation and Change Supplement

Goal: close the b326 gap after the full HU badge looked good in the 35 mm slot.

Changes:

- The render shell resolves `huBadge` once and passes it to both the normal seal renderer and the Wechselkennzeichen supplement renderer.
- `change-plate-supplement-renderer.js` now uses the same `renderFullHuBadgeMarker()` bridge for the vehicle-specific HU slot when `huBadgeRenderer: "full"` is active.
- The old blue placeholder remains available only when the full renderer is not requested, so existing Lab comparison checks are still possible.

No geometry change:

- The supplement frame, HU center and diameter are still supplied by the existing change-plate model.
- b327 only replaces the marker drawn inside that existing 35 mm area.

Next Card step:

- The matching full ZIP activates `huBadgeRenderer: "full"` at the Card adapter boundary so reminder year/month/rotation data drives the real badge instead of the placeholder.
