# b117 – HACS release font asset guard

## Purpose

b117 does not change the license plate renderer geometry.

The b116 Card renderer already uses the Physical Lab path successfully:

```text
mm model -> complete physical SVG -> scale only the final SVG in the Card
```

The issue found after b116 was a release/build workflow trap: ChatGPT handover ZIPs intentionally do not contain font binary files, so a ZIP-derived `dist/fonts/` folder can only contain readme/license text. If that state is pushed to GitHub/HACS without rebuilding locally with the real font files, Home Assistant loads a browser fallback font and the otherwise correct mm geometry looks wrong.

## Added checks

b117 adds `scripts/check-release-assets.mjs` and wires it into `npm run check`.

The release asset check verifies:

- `dist/tuev-card.js` exists.
- Every local font binary in `fonts/` is mirrored to `dist/fonts/`.
- Mirrored font file sizes match the source files.
- The required Card fonts are explicitly checked when present locally:
  - `fonts/GL-Nummernschild-Mtl.ttf`
  - `fonts/GL-Nummernschild-Eng.ttf`

If no font binaries exist in `fonts/`, the check prints a warning but does not fail. This keeps ChatGPT handover ZIPs usable while still documenting that a real GitHub/HACS release build must be run locally with the fonts present.

## Build script output

`scripts/build-bundle.mjs` now reports how many files and font binaries were copied from `fonts/` to `dist/fonts/`. If no font binaries were copied, it prints a warning.

## Windows BAT output

`build-tuev-card.bat` now labels the check step as JavaScript and release-asset check and prints explicit hints for missing `dist/fonts/GL-Nummernschild-*.ttf` files.

## Required local release flow

```text
1. Copy/update the ChatGPT ZIP contents into the local repository.
2. Do not delete or overwrite the local font binaries in fonts/.
3. Run build-tuev-card.bat or npm run build && npm run check.
4. Confirm that dist/fonts/ contains the GL .ttf files.
5. Commit and push.
```

Expected Home Assistant/HACS files:

```text
/config/www/community/tuev-card/tuev-card.js
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

## Files changed

- `scripts/check-release-assets.mjs`
- `scripts/build-bundle.mjs`
- `build-tuev-card.bat`
- `package.json`
- `package-lock.json`
- `README.md`
- `docs/HACS_RELEASE_FLOW.md`
- `docs/RELEASE_CHECK.md`
- `HANDOVER.md`
