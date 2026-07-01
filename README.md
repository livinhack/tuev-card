# TÜV Reminder Card b330

Full handover ZIP for b330.

b330 is a small cleanup checkpoint on top of b329. It removes only the old, unimported Full/Card file `src/plate/mm-model.js` and updates the renderer legacy audit so the removal is checked automatically.

No renderer geometry, HU badge behavior, editor behavior, or legacy switch logic was changed.

## Checks

- `npm run check` passed.
- `npm run build` passed.

## Font note

This ChatGPT ZIP does not include GL TTF font binaries. For GitHub/HACS release builds, make sure the GL font files are present locally before building.
