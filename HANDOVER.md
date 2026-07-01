# Handover – b327 HU Badge Card Activation and Change Supplement

Current stand: b327.

b327 turns the successful b326 HU-badge Lab test into the active Card path and closes the Wechselkennzeichen supplement gap.

Main changes:

- `src/plate/lab-renderer-adapter.js` now sets `huBadgeRenderer: "full"` for the active Card renderer.
- Existing Card data from `src/tuev-card-entry.js` (`huYear`, `huMonth`, `huRotation`) is still used; b327 only activates the full renderer path.
- The staged Lab renderer resolves one `huBadge` object and passes it to both normal seals and the Wechselkennzeichen vehicle-specific supplement.
- `change-plate-supplement-renderer.js` now uses the same `renderFullHuBadgeMarker()` bridge for the supplement HU slot.
- `changePlate` options are forwarded through the Card adapter so the supplement path can be smoke-tested through the active Card renderer boundary.

Intentionally unchanged:

- No legacy/old-renderer toggle was added.
- No plate geometry was changed. The existing 35 mm HU slot/supplement positions are reused.
- The blue placeholder remains available only in standalone Lab comparison mode when the full renderer is not requested. The Card requests the full renderer by default.

Checks run:

- `npm run check` passed.
- `npm run build` passed and rebuilt `dist/tuev-card.js` for b327.

Known release note:

- The ZIP intentionally contains only font readmes/placeholders, not local `.ttf` font binaries. The release asset check reports this as expected for ChatGPT handover ZIPs; GitHub/HACS release builds still need the GL font binaries present locally.

Rollback: previous ZIP b326.
