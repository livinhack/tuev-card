# b88 - Physical one-line plate renderer v2

## Goal

b88 starts the renderer-v2 work for graphical license plates. The renderer now builds a norm-oriented one-line German plate in physical, millimetre-like coordinates first and only then lets the card scale it to the available column width.

## Scope

Implemented in b88:

- one-line standard plates only
- GL-Nummernschild Mittelschrift/Engschrift path from b87
- automatic Engschrift retry when Mittelschrift content would exceed the one-line maximum width
- Euro field
- black plate border
- district group left of the seal column
- identifier group right of the seal column
- generic authority-seal placeholder
- compact TÜV Reminder HU seal placeholder using the due year color and month rotation
- shared card scaling remains active: the widest plate in a card determines the scale, and all other plates in the same card use that resulting display height

Not implemented yet:

- exact official authority seal artwork
- real state coats of arms or authority names
- two-line plates
- motorcycle plates
- seasonal plates
- green plates
- interchangeable plates
- electric/H suffix special spacing

## Important design decision

The card may render real positions and neutral placeholder areas, but it does not imitate official authority-seal graphics.

```text
real dimensions/positions: yes
authority-seal artwork: no
neutral authority placeholder: yes
TÜV Reminder HU seal: yes, simplified and scaled down
```

## Files changed

- `src/plate/physical-layout.js`
  - new mm-like standard one-line plate layout model
  - contains constants for plate height, max width, euro field, seal column, text positions and font sizes
- `src/plate/renderer.js`
  - GL path now uses the physical model
  - renders separated district / seal column / identifier groups when the plate text contains spaces
  - renders neutral authority placeholder and mini HU seal
  - keeps EuroPlate as legacy fallback
- `src/tuev-card-entry.js`
  - passes HU year and rotation to the plate renderer
- versioned imports and docs updated to b88

## Testing focus

1. Verify HACS still serves `dist/tuev-card.js` and `dist/fonts/`.
2. Test common plates with spaces, for example:
   - `TR LR 123`
   - `GL AB 1234`
   - `K A 1`
   - `M MW 9999`
3. Check whether the seal column sits in the expected place between district and identifier.
4. Check whether the mini HU seal is recognizable enough or should be replaced by a simple colored dot.
5. Compare Firefox, Chrome and Android app.
6. Send screenshots for b89 renderer tuning.

## Known likely tuning areas

- text baseline and vertical centering
- character spacing for GL-Mittelschrift and GL-Engschrift
- seal column width and vertical positions
- plate minimum width for short plates
- shared scale in narrow columns
