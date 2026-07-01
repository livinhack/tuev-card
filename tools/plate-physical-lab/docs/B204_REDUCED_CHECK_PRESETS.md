# b204 – Reduced check-chain input presets

b204 is a usability/checkpoint update on top of b203. It does not change renderer geometry.

## Added

The Lab UI now contains direct preset buttons for the current Reduced visual check chain:

- Reduced Standard
- Reduced H/E
- Reduced Saison 04/10
- Reduced H/E + Saison 04/10

Each preset sets the Lab to `reducedTwoLine`, balanced auto width, auto font mode and the reduced font calibration defaults. Season presets enable the season field with `04/10`.

## Visual status from the first group

The first Reduced Standard group confirms that automatic width selection and template switching are working:

- `W Q1` -> 180 mm, vertical seals
- `W QU1` -> 200 mm, vertical seals
- `WIL QU1` -> 220 mm, vertical seals
- `HVL D191` -> 240 mm, vertical seals
- `W QU111` -> 220 mm, upper side-by-side seals
- `WI QU111` -> 220 mm, upper side-by-side seals
- `WIL QU111` -> 255 mm, upper side-by-side seals

Open visual cleanup: the upper district centering/debug semantics of the short vertical standard template still need a later solver cleanup.
