# b91 - Law plate inner border and width bands

b91 corrects the one-line license plate renderer after b90 exposed two issues:

1. The 110 mm plate height must be treated as the complete outside height, including the black border.
2. Very short plate texts must not create tiny physical plates that then get vertically inflated by the card scaling rule.

## Physical model

The one-line model now uses millimetres:

```text
outside height: 110 mm
border band:     4.5 mm inside the outside dimensions
white area:      about 101 mm high
max width:       520 mm
```

The black border is inside the outside dimensions. The white face, EU field, text, neutral authority seal placeholder and small HU placeholder are placed in the inner area.

## Width bands

The renderer uses practical one-line width bands:

```text
340 / 380 / 420 / 460 / 480 / 520 mm
```

The text and seal block is measured, then the smallest fitting width band is selected. Mittelschrift is tried first. Engschrift is only used after Mittelschrift does not fit.

These width bands are renderer practice, not presented as a new legal minimum. The legal hard maximum for the normal one-line model remains 520 mm.

## Card scale basis

Each plate metric now reports:

```text
scaleBasisWidth: 520
```

This keeps the common visible plate height based on a standard 520 mm reference even when all displayed plates are short. Short plates therefore keep their shorter width, but they no longer become disproportionately tall in wide single-column cards.

## Changed files

- `src/plate/renderer.js`
- `src/card/plate-layout.js`
- `package.json`
- `package-lock.json`
- `dist/tuev-card.js`
- `HANDOVER.md`

## Test focus

- `K S 70`, `TR M 6`, `5` should no longer visually balloon in height.
- `WIL CL 212`, `WIL LM 216`, `HH EV 204E` should still choose wide plates.
- Text and seals should sit inside the white area, not on top of the border.
- The big TÜV badge renderer is unchanged.
