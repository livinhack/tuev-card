# b86 - HACS bundled font path and README cleanup

## Goal

Continue from b85 after the user confirmed that GL font loading appears to work and asked how the fonts should be loaded through HACS instead of being installed manually.

The decision for b86:

- The fonts should live in the card repository under `fonts/`.
- HACS should install them together with the dashboard card.
- The card should prefer `/hacsfiles/tuev-card/fonts/...` at runtime.
- End-user README should not include a separate manual font-installation explanation once the fonts are part of the package.

## Important artifact note

This generated ChatGPT ZIP still does not contain binary font files (`.ttf`, `.otf`, `.woff`, ...). The user's local GitHub working copy should contain the actual GL font files in `fonts/` with these names:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

This keeps the generated artifact font-free while preparing the repository/package structure for HACS.

## What changed

### README

The end-user README was simplified:

- Removed the GL font file requirement from Requirements.
- Removed the separate `Graphical license plates` manual installation section.
- Kept graphical plates as a normal card feature.

### Font/package notes

- `NOTICE.md` now describes the HACS-served package path for bundled fonts.
- `fonts/README.md` now describes the repository/package file location instead of a purely manual installation path.
- `fonts/LICENSE.GL-Nummernschild.txt` now documents release file names without saying that releases must omit the font binaries.

### Runtime paths

`src/plate/font.js` already preferred the HACS package paths from b85:

```text
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

Those paths remain the primary runtime source. Manual `/local/...` paths stay as development/fallback paths. EuroPlate remains a legacy fallback. There is still no system-font fallback.

## Versioning

- `package.json`: `0.1.1-b86`
- `package-lock.json`: `0.1.1-b86`
- `src/**/*.js`: import query markers updated to `?v=b86`
- `src/tuev-card-entry.js`: source entry marker updated to b86
- `tuev-card.js`: rebuilt as `// TÜV Card bundled b86`

## Checks

Run:

```text
npm run check
npm run build
```

Expected:

- JavaScript syntax check succeeds.
- Bundle builds successfully.
- Bundle header is b86.

## Next step

b87 should tune the GL license plate renderer using screenshots or the saved reference values:

- Mtl/Eng switch threshold.
- Plate width/height.
- EU stripe width and text gap.
- Font size and vertical baseline.
- Firefox/Chrome/Android comparison.

Do not change the TÜV sticker renderer as part of that tuning.
