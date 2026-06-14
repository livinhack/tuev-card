# Release check

Current checked version: `b91`.

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

- `dist/tuev-card.js` starts with `// TÜV Card bundled b91`.
- `src/tuev-card-entry.js` starts with `// TÜV Card source entry b91`.
- Source imports use `?v=b91`.
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
- b91 one-line license plates use black border inside the 110 mm outside height.
- b91 short plates keep a shorter width without ballooning the common display height.
