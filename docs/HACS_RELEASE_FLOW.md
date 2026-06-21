# HACS release / update trigger flow

Current checked version: `b117`.

## Delivery layout

The repository uses a `dist` delivery layout for HACS because the card needs non-JS assets for bundled GL-Nummernschild fonts.

```text
dist/
  tuev-card.js
  fonts/
    GL-Nummernschild-Mtl.ttf
    GL-Nummernschild-Eng.ttf
```

The Lovelace resource remains:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

The resource URL does not include `dist`; HACS installs the contents of `dist` into the card folder.

## Important ChatGPT ZIP note

ChatGPT handover ZIPs do not include font binary files. This is expected. A ZIP-derived `dist/fonts/` folder can therefore contain only readme/license text until the project is rebuilt locally with the real font files present.

Before pushing to GitHub/HACS, always rebuild locally with the user's real local font files.

## Local build before commit

1. Keep the GL font files in root `fonts/`:

```text
fonts/GL-Nummernschild-Mtl.ttf
fonts/GL-Nummernschild-Eng.ttf
```

2. Run:

```bash
npm run build
npm run check
```

3. Confirm that these files exist:

```text
dist/tuev-card.js
dist/fonts/GL-Nummernschild-Mtl.ttf
dist/fonts/GL-Nummernschild-Eng.ttf
```

`npm run check` now includes the release asset guard from b117. It fails if local font binaries exist in `fonts/` but were not mirrored into `dist/fonts/` or have a different file size.

## Manual release flow with GitHub Desktop

1. Copy the new ZIP contents into the local repository folder without deleting local font binaries.
2. Run `npm run build` so the local fonts are mirrored into `dist/fonts/`.
3. Run `npm run check`.
4. Open GitHub Desktop.
5. Review the changed files, especially `dist/tuev-card.js` and `dist/fonts/`.
6. Commit to `main`.
7. Push origin.
8. Create a GitHub Release or let HACS use the default branch while testing.
9. In Home Assistant/HACS, use **Update information** or redownload the repository for immediate testing.

## Expected installed files

After HACS installs or redownloads the card, the Home Assistant folder should contain:

```text
/config/www/community/tuev-card/tuev-card.js
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

The fonts should be reachable at:

```text
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

If the graphical plate uses a fallback font, check the two font URLs above first before changing renderer code.
