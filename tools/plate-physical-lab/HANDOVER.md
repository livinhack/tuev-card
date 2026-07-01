# Handover – b327 HU Badge Full Renderer Change Supplement

Current Lab stand: b327.

b327 continues the b326 full-HU-badge Lab test and closes the Wechselkennzeichen gap: when `huBadgeRenderer: "full"` is enabled, the existing complete TÜV badge renderer is now used both in the normal 35 mm HU slot and in the vehicle-specific Wechselkennzeichen supplement.

The blue HU placeholder remains available only when the full badge option is not enabled, so Lab A/B comparison is still possible. No plate geometry was changed; the existing 35 mm HU positions and supplement frame are reused.

Changed files of interest:

- `src/plate/plate-render-shell.js` resolves one `huBadge` object and passes it to normal seals and the Wechselkennzeichen supplement.
- `src/plate/change-plate-supplement-renderer.js` uses `renderFullHuBadgeMarker()` for the supplement HU slot when the full renderer is active.
- `src/plate/hu-badge-marker.js` remains the bridge to the existing full badge renderer.

Checks run:

- `npm run check` passed.

Matching full ZIP: `tuev-card-full-b327-hu-badge-card-activation-change-supplement-handover.zip`.
Rollback: previous ZIP b326.
