# b327 – HU Badge Card Activation and Change Supplement

Goal: turn the successful b326 Lab experiment into the active Card path and close the Wechselkennzeichen supplement gap.

Changes:

- `src/plate/lab-renderer-adapter.js` now sets `huBadgeRenderer: "full"` for the active Card renderer.
- Existing Card data (`huYear`, `huMonth`, `huRotation`) is still supplied from `src/tuev-card-entry.js`; b327 only activates the full renderer path at the adapter boundary.
- The staged Lab renderer now passes one resolved `huBadge` object to both normal seals and the Wechselkennzeichen vehicle-specific supplement.
- `change-plate-supplement-renderer.js` uses the same `renderFullHuBadgeMarker()` bridge as the normal HU slot when the full renderer is active.

Intentionally unchanged:

- No legacy/old renderer toggle was added. Rollback remains the previous ZIP.
- No plate geometry was changed; only the marker inside the existing HU areas changed.
- The blue placeholder remains available in the standalone Lab when the full renderer option is not active, but the Card now requests the full renderer by default.

Checks:

- Card adapter/direct integration checks verify that Card SVG output contains `data-hu-badge-renderer="full"` and no longer emits the old blue placeholder on the default smoke case.
- A change-plate smoke case verifies the supplement HU area also uses the full badge marker.
