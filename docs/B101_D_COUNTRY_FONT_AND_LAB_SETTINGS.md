# b101 · D country font and lab settings

## Goal

Continue the external Physical Lab workflow. Home Assistant/Card runtime stays outside of the current renderer work.

b101 incorporates the current manual Lab adjustments and prepares the `D` country mark in the Euro field to use the supplied DIN 1451 Alt style font when the file is available locally.

## Main changes

- `tools/plate-physical-lab/mm-model.js`
  - Uses the user's b100 Lab adjustments as the working basis.
  - Keeps the no-extra-gap seal-column model.
  - Keeps the DXF-based body/euro/seal geometry.
  - Sets the manual font defaults to:
    - font output size: `125 mm`
    - baseline Y: `92.5 mm`
  - Changes the country mark `D` to the font family:
    - `DIN1451Alt`
    - `AlteDIN1451Mittelschrift`
    - browser fallback only if the font is missing.

- `tools/plate-physical-lab/styles.css`
  - Adds `@font-face` entries for `din1451alt.ttf`.
  - Accepted local paths:
    - `tools/plate-physical-lab/fonts/din1451alt.ttf`
    - `fonts/din1451alt.ttf`

- `tools/plate-physical-lab/index.html`
  - Updates Lab version to b101.
  - Updates manual default UI values to `125` / `92.5`.
  - Adds a fixed rule note for the `D` country mark font.

- `tools/plate-physical-lab/fonts/README.md`
  - Documents `din1451alt.ttf` as optional local font for the Lab.

## Important

The font binary is intentionally not included in the Chat ZIP. Place the file locally as:

```text
tools/plate-physical-lab/fonts/din1451alt.ttf
```

or:

```text
fonts/din1451alt.ttf
```

## Test

1. Open `tools/plate-physical-lab/index.html` via VS Code Live Server.
2. Put `din1451alt.ttf` in one of the supported font folders.
3. Reload the browser.
4. Check the Euro field: the `D` should use the DIN-style font.
5. Continue physical model work outside Home Assistant.
