# Release check

Current checked version: `b94`.

## Package layout

The HACS-delivered files are in `dist/`:

```text
dist/tuev-card.js
dist/fonts/
```

The root source layout remains modular under `src/`.

## Required checks

```bash
npm run build
npm run check
```

Confirm:

- `dist/tuev-card.js` starts with `// TÜV Card bundled b94`.
- `src/tuev-card-entry.js` starts with `// TÜV Card source entry b94`.
- Source imports use `?v=b94`.
- Root `tuev-card.js` is not the active HACS bundle anymore.
- `hacs.json` does not use `content_in_root: true`.
- If local `.ttf` files exist in `fonts/`, they are copied to `dist/fonts/` by the build.

## Runtime checks

- Lovelace resource: `/hacsfiles/tuev-card/tuev-card.js`.
- GL font URLs: `/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf` and `/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf`.
- Graphical plate option visible only when a supported GL or legacy plate font is reachable.
- No graphical system-font fallback.

## Functional regression checks

- b79 single-column HU overlay still correct.
- b81 sort-confirm dialog closes only via **Cancel/Abbrechen** or **Yes/Ja**.
- b82 button active/open states still consistent.
- Group side-by-side auto layout still behaves calmly.
- b91+ one-line license plates use black border inside the 110 mm outside height.
- b91+ short plates keep a shorter width without ballooning the common display height.

- b94 one-line license plates use fixed mm cells before whole-SVG scaling, practical width bands, 35 mm HU/authority placeholders and a 45 mm reserved authority embossing area.


## b94 renderer check notes

- One-line plate renderer is a fixed physical mm model before display scaling.
- Display scaling must only affect the complete SVG, never individual text/seal/Euro elements.
- Practical one-line width bands documented in `docs/B94_PHYSICAL_PLATE_RULES_AND_WIDTH_BANDS.md`.
