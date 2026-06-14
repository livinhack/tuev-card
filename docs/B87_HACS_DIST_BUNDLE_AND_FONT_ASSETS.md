# b87 - HACS dist bundle and bundled font asset structure

## Reason

After testing b86 through HACS, the `fonts/` folder was not installed into the Home Assistant card folder. The repository still used the root bundle layout, while HACS dashboard/plugin repositories that need non-JS files should package the card file and required assets together under `dist/`.

## Decision

Starting with b87, the generated HACS delivery layout is:

```text
dist/
  tuev-card.js
  fonts/
    GL-Nummernschild-Mtl.ttf
    GL-Nummernschild-Eng.ttf
    LICENSE.GL-Nummernschild.txt
    GL-Nummernschild-Mtl-readme.txt
    GL-Nummernschild-Eng-readme.txt
```

The generated ChatGPT ZIP still omits font binary files. In the user's local GitHub repository, the `.ttf` files should stay in root `fonts/`; `npm run build` mirrors everything from `fonts/` into `dist/fonts/`.

## Files changed

- `scripts/build-bundle.mjs`
  - writes the bundle to `dist/tuev-card.js`
  - recreates `dist/` on every build
  - copies `fonts/` to `dist/fonts/`
- `scripts/check-js.mjs`
  - checks `dist/tuev-card.js` instead of a root bundle
- `build-tuev-card.bat`
  - reports `dist\tuev-card.js`
- `hacs.json`
  - no longer declares `content_in_root: true`
  - keeps `filename: "tuev-card.js"`
- `.gitignore`
  - documents that the generated `dist` bundle should stay tracked
- `README.md`
  - manual installation now says to copy the contents of `dist/`
- `NOTICE.md` and `fonts/README.md`
  - describe the source `fonts/` to delivered `dist/fonts/` flow
- `package.json` / `package-lock.json`
  - version updated to `0.1.1-b87`
- `src/**/*.js`
  - import cache markers updated to `?v=b87`

## HACS runtime path

The Home Assistant Lovelace resource remains:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

The runtime font URLs remain:

```text
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

## Not changed

- No renderer geometry tuning yet.
- No TÜV sticker renderer changes.
- No system-font fallback.
- EuroPlate remains only as legacy fallback.

## Checks

Run:

```bash
npm run build
npm run check
```

Expected output files:

```text
dist/tuev-card.js
dist/fonts/...
```

## Next step

After HACS installs the `dist/fonts/` files correctly, continue with b88 renderer tuning using screenshots/reference values from the saved license plate renderer page.
