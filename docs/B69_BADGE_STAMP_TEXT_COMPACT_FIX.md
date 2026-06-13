# b70 - Badge stamp text compact fix

Basis: b67.

This change fixes the compact four-column case with `show_badge: true`, where the stamp text could visually overflow the stamp frame.

## Scope

Only the stamp text sizing changes in compact badge layouts:

- the red/orange stamp frame stays at the previous size
- the green HU confirmation frame stays at the previous size
- padding, frame, checkbox, animation, and position remain unchanged
- only the text size/line-height is reduced when the stamp is rendered over a badge in compact layouts

`show_badge: false` is not changed.

## Reason

The frame itself was visually acceptable. The problem was the text in the four-column badge layout, so the fix should not scale down the complete stamp.
