# b93 – Plate renderer Anlage-4 grid and Euro-field edge

## Goal

b92 improved the overall one-line plate proportions, but the renderer still used browser/font measurements for glyph advances. That made spacing feel guessed, especially for narrow glyphs such as `I` and for the seal column.

b93 changes the active Card plate renderer to use an explicit Anlage-4-style horizontal grid for one-line plates:

- 520 × 110 mm maximum one-line outside size.
- 110 mm outside height includes the black rim.
- 4.5 mm rim band, leaving roughly 101 mm usable white height.
- 45 mm Euro field width.
- 47.5 mm letter advance cells.
- 44.5 mm digit advance cells.
- 8 mm character gaps.
- 24 mm recognition letter/number group gap.
- 65.5 mm seal column between district and recognition group.
- 35 mm HU field above a 45 mm neutral authority field.

## Visual adjustment

The blue Euro field now fills the inner height instead of leaving a visible white light edge around it. This keeps the legal grid proportions but better matches the usual real-world plate appearance.

## Scope

- Active Card renderer only.
- One-line standard plate model only.
- No official authority seal artwork is reproduced.
- Large TÜV badge renderer unchanged.
- Editor, groups, floating panels unchanged.

## Files

- `src/plate/renderer.js`
- `package.json`
- `package-lock.json`
- `dist/tuev-card.js`
- `HANDOVER.md`
- `docs/B93_PLATE_ANLAGE4_GRID_AND_EURO_EDGE.md`

## Test focus

- `DA CI 500`
- `WIL CL 212`
- `K S 70`
- `TR M 6`
- `HH EV 204E`
- short demo values such as `5`

Look especially at:

- character spacing within `CI500`, `GT500`, `DE13H`, `EV204E`;
- seal vertical placement;
- Euro-field edge without white light border;
- whether long 8-character plates switch to Engschrift when the font is available.
