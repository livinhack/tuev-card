# b121 · Two-line Euro field inner geometry

## Scope

b121 is a Physical Lab refinement on top of b120. It does not integrate the two-line renderer into the Card yet. The production Card remains on the one-line Physical Lab renderer path.

## Reason

The Anlage 4 detail reference for the two-line Euro field specifies more than the outer field size. The Euro field itself is 40 × 88 mm and its vertical content is split into:

- 10 mm top clearance
- 30 mm star field
- 17 mm gap between stars and country mark
- 20 mm country mark field
- 11 mm bottom clearance

Total: 88 mm.

## Changes

- `TWO_LINE_RULES_MM.euro` now stores the inner vertical Euro field segments explicitly.
- Star center Y changed from the previous rough value to the segment-derived center at 29.5 mm.
- Country mark baseline was moved to the bottom of the 20 mm country mark field at 81.5 mm.
- The Lab metrics table now reports the Euro field inner segments.
- Dimension overlays in the two-line Lab view now show the Euro field internal segment lines.

## Notes

The star drawing is still a simplified symbolic SVG representation. The mm model now has the correct reference boxes; a later optical tuning step may replace the symbolic star dots with a more accurate star glyph/path if needed.
