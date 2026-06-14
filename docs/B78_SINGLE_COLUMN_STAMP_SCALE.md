# b78 - Single column stamp overlay scale

## Goal

Tune only the due/expired confirmation stamp overlay size for the 1-column badge view.

The 2-, 3-, and 4-column layouts were reported as visually good and should not be changed as a side effect.

## Change

- In `src/card/render-parts.js`, the stamp overlay now distinguishes between:
  - compact badge text: multi-column badge overlay, unchanged in practice
  - spacious badge text: single-column badge overlay with badge visible
- The spacious single-column overlay uses larger font sizes, min-widths, padding, gap, and a slightly larger checkbox.
- The max overlay width for the spacious single-column case was raised so the red/green stamp pair can use more of the available badge area.

## Files touched

- `src/card/render-parts.js`
- `package.json`
- `package-lock.json`
- `src/**/*.js` import cachebuster updates to `?v=b78`
- `tuev-card.js` after build
- `docs/B78_SINGLE_COLUMN_STAMP_SCALE.md`
- `HANDOVER.md`

## Not changed

- TÜV badge renderer geometry/digits/colors
- License plate renderer
- EuroPlate/font availability logic
- Group/editor layout logic

## Manual test focus

1. Single-column card with an expired/due vehicle and visible TÜV badge.
   - The red/green stamp overlay should be noticeably larger and better matched to the available space.
2. Two-column grouped/multi-card view.
   - Stamp overlay should still look like before.
3. Three- and four-column views.
   - Stamp overlay should still look like before and not overflow.
