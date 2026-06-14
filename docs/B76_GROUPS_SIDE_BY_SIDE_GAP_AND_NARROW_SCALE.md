# b76 - Side-by-side group gap and narrow single-column scaling

## Scope

This update keeps the b75 group-layout behavior and only tightens two layout details.

## Group layout polish

When `groups_layout: auto` is enabled, consecutive small groups are still the only groups that can be placed side by side.

The inline group run now keeps a stable vertical gap in two cases that b75 could render too tightly:

- narrow containers where eligible groups fall back to stacked rendering
- multiple rows of eligible small groups

This keeps the layout calm without introducing a masonry layout.

## Single-column scaling check

Single-vehicle layouts now allow the TÜV badge to scale below the old 170px floor only in very narrow containers.

Normal single-card layouts still keep the previous large badge range, but very narrow section/tile contexts avoid forced overflow.

## Not changed

- TÜV badge renderer geometry
- Plate renderer
- EuroPlate/font availability rule
- Floating panel behavior
- Group sort and display override behavior
