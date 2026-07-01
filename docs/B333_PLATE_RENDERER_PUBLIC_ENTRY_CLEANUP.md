# b334 – Plate Renderer Public Entry Cleanup

b334 protects the thin Card-facing renderer entry.

## Goal

Keep `src/plate/renderer.js` as the only public renderer boundary used by Card and Editor while preventing it from accumulating geometry, fallback, or legacy behavior.

## Changes

- `src/plate/renderer.js` delegates only to `src/plate/lab-renderer-adapter.js?v=b334`.
- Card and Editor imports were moved to the b334 cache marker.
- Added `scripts/check-plate-renderer-public-entry.mjs`.
- Added `check:plate-renderer-public-entry` to `npm run check`.

## Guarded API

The public entry intentionally keeps these exports:

- `checkPlateFontAvailable`
- `ensurePlateFont`
- `getPlateFontStatus`
- `isPlateFontLoaded`
- `normalizePlate`
- `getLicensePlateMetrics`
- `renderLicensePlate`

## Not changed

- No plate geometry.
- No HU badge behavior.
- No change-plate supplement geometry.
- No font loading behavior.
- No additional file deletion.
