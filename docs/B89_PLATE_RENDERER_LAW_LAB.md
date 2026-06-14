# b89 - Plate renderer law lab

b89 does not push the unfinished b88 physical renderer further into the card. Instead it creates a standalone renderer lab for VS Code Live Server and restores the card runtime to the compact b87 GL/EuroPlate renderer path.

## Why

The b88 screenshot showed that the physical renderer was not ready for the card: proportions, text placement, seal placement and scaling were not acceptable. The renderer now needs to be calibrated independently before it is wired back into the Home Assistant card.

## New lab

```text
tools/plate-renderer-lab/index.html
```

The lab contains:

- license plate input
- plate kind selector
- layout selector
- season / expiry / HU controls
- SVG preview
- debug overlays
- metric table
- font alternative table
- validation messages

## Rule basis implemented in the lab

- one-line plates: max 520 × 110 mm
- two-line plates: max 340 × 200 mm
- motorcycle plates: 180–220 × 200 mm
- small two-line plates: max 255 × 130 mm
- Euro field profiles for one-line, two-line/motorcycle and small two-line plates
- 75 mm Mittelschrift / Engschrift profiles
- 49 mm small profile
- general / oldtimer / electric / season / electric season / exchange / short-term / export / red / green modes
- neutral authority seal placeholder
- generic mini HU placeholder

Real authority seals, state crests, official security markings and serial numbers are intentionally not reproduced.

## Card runtime

The card runtime uses the compact b87 GL/EuroPlate renderer path again. The b89 lab renderer is not yet wired into the card.

## Files changed

- `tools/plate-renderer-lab/index.html` new
- `tools/plate-renderer-lab/app.js` new
- `tools/plate-renderer-lab/plate-renderer-core.js` new
- `tools/plate-renderer-lab/styles.css` new
- `tools/plate-renderer-lab/README.md` new
- `tools/plate-renderer-lab/fonts/README.md` new
- `src/plate/renderer.js` restored to compact GL/EuroPlate renderer and updated to b89 imports
- `src/plate/physical-layout.js` removed
- `scripts/check-js.mjs` now checks `tools/`
- `HANDOVER.md` updated
- `package.json`, `package-lock.json`, imports and bundle updated to b89

## Next step

Use the lab first. Once the one-line standard plate looks right there, migrate the lab core into the card renderer.
