# b84 - GL font detection and license plate renderer v2 groundwork

## Goal

Start the card-side font/renderer block after the confirmed b83 release-readiness checkpoint.

This version does not touch the TÜV badge renderer, group layout, floating panels, or editor sorting behavior.

## User request

Proceed with the card font and license plate renderer work.

Important project rules retained:

- Code, file names, and internal functions stay English.
- User-facing text stays localized.
- No system-font fallback for graphical license plates.
- Do not make unrelated TÜV badge renderer changes.
- Every ZIP contains a complete `HANDOVER.md`.

## What changed

### Font detection

`src/plate/font.js` now detects multiple supported plate font candidates instead of only `/local/EuroPlate.ttf`.

Preferred GL-Nummernschild files:

- `GL-Nummernschild-Mtl.ttf`
- `GL-Nummernschild-Eng.ttf`
- `GL-Nummernschild-B Mtl.ttf` when available
- `GL-Nummernschild-B-Eng.ttf` when available

Supported lookup locations:

- `/hacsfiles/tuev-card/fonts/...`
- `/local/tuev-card/fonts/...`
- `/local/...`

Legacy compatibility remains:

- `/local/EuroPlate.ttf`

The renderer still remains unavailable when no supported font file is reachable.

### Renderer selection

`src/plate/renderer.js` now prefers GL fonts over EuroPlate.

Selection rule:

- Long plates with 8+ non-space characters prefer GL Engschrift when available.
- Other plates prefer GL Mittelschrift when available.
- If GL is missing but EuroPlate exists, the legacy renderer path is still used.
- If no supported font exists, the editor hides the graphical plate option and runtime falls back to text plates.

### Renderer metrics

The renderer now has separate geometry/metric profiles for:

- GL Mittelschrift
- GL Engschrift
- legacy EuroPlate

It also uses canvas text measurement when possible, with deterministic width estimates as fallback.

### Documentation

`README.md`, `NOTICE.md`, `LICENSE`, and `HANDOVER.md` were updated to describe the new GL-preferred behavior.

Font files are not included in this development ZIP.

## Versioning

- `package.json`: `0.1.1-b84`
- `package-lock.json`: `0.1.1-b84`
- `src/tuev-card-entry.js`: `// TÜV Card source entry b84`
- `src/**/*.js` imports: `?v=b84`
- `tuev-card.js`: `// TÜV Card bundled b84`

## Files changed

- `src/plate/font.js`
- `src/plate/renderer.js`
- `README.md`
- `NOTICE.md`
- `LICENSE`
- `HANDOVER.md`
- `package.json`
- `package-lock.json`
- `tuev-card.js`
- `docs/B84_GL_FONT_RENDERER_V2.md`

## Checks run

```bash
node --check src/plate/font.js
node --check src/plate/renderer.js
npm run check
npm run build
```

## Test focus

1. Without any font file:
   - Editor should hide graphical license plate option.
   - Card should show plain text plates.

2. With GL files in `/config/www/tuev-card/fonts/`:
   - Editor should show graphical license plate option.
   - Standard plates should use GL Mittelschrift.
   - Long plates with 8+ characters should use GL Engschrift if available.

3. With only `/config/www/EuroPlate.ttf`:
   - Graphical plates should still work as before via the legacy path.

4. Compare Firefox, Chrome, and Android app visually:
   - Check vertical centering.
   - Check plate width for short and long plates.
   - Check that shared plate scaling still keeps heights consistent.

## Known limitation

The ZIP does not include actual font files. The code is prepared for bundled fonts under `/hacsfiles/tuev-card/fonts/...`, but no font file is shipped in this development artifact.
