# Handover – b328 HU Badge Full Renderer Change Supplement

Current Lab stand: b328.

b328 is a conservative HU smoke-check checkpoint after b327. It keeps the full badge integration unchanged and adds automated coverage for normal HU slots, Wechselkennzeichen supplements and the old Lab-only blue placeholder fallback.

The blue HU placeholder remains available only when the full badge option is not enabled, so Lab A/B comparison is still possible. No plate geometry was changed; the existing 35 mm HU positions and supplement frame are reused.

Changed files of interest:

- `src/plate/plate-render-shell.js` resolves one `huBadge` object and passes it to normal seals and the Wechselkennzeichen supplement.
- `src/plate/change-plate-supplement-renderer.js` uses `renderFullHuBadgeMarker()` for the supplement HU slot when the full renderer is active.
- `src/plate/hu-badge-marker.js` remains the bridge to the existing full badge renderer.

Checks run:

- `npm run check` passed.

Matching full ZIP: `tuev-card-full-b328-hu-badge-smoke-checkpoint-handover.zip`.
Rollback: previous ZIP b326.
