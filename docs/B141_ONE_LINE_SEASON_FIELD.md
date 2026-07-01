# b141 – One-line seasonal field in the Physical Lab

b141 adds the current season validity field to one-line plates in the Physical Lab.

## Geometry

- Season block: `30 x 75 mm`
- Upper month field: `30 x 20 mm`
- Lower month field: `30 x 20 mm`
- Separator: `30 x 3.25 mm`, vertically centered in the 75-mm block
- The block is aligned to the one-line 75-mm character band.

## Spacing

The season block is appended after the recognition number and is surrounded by `*` spacing surfaces. The gap before the season field has a minimum of 8 mm; the right side is the regular equal outside margin with the same minimum.

When season is enabled for one-line plates, the solver balances free width across outside margins, character gaps, group gaps, the season star gap and the seal column within the existing limits.

## Typography

The existing season typography controls are reused:

- visible target glyph height
- SVG font calibration size
- upper baseline Y
- width factor
- digit gap
- X correction
- measured block centering

## Scope

This is a Physical Lab step only. The production Card UI/integration has not yet been extended with seasonal input fields.
