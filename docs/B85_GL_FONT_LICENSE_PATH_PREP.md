# b85 - GL font license notes and renderer path cleanup

## Goal

Continue the card-side font/renderer block after b84. The user provided a FontSpace ZIP for GL-Nummernschild and asked to proceed after the license check.

## Important limitation of this generated ZIP

This generated development ZIP intentionally does not contain font binary files (`.ttf`, `.otf`, `.woff`, ...). It contains the license/readme notes and the runtime path support only.

Expected font file names when a release/package contains the font files:

- `fonts/GL-Nummernschild-Mtl.ttf`
- `fonts/GL-Nummernschild-Eng.ttf`

## Changed files

- `src/plate/font.js`
- `README.md`
- `NOTICE.md`
- `fonts/README.md`
- `fonts/LICENSE.GL-Nummernschild.txt`
- `fonts/GL-Nummernschild-Mtl-readme.txt`
- `fonts/GL-Nummernschild-Eng-readme.txt`
- `HANDOVER.md`
- `package.json`
- `package-lock.json`
- `src/**/*.js` import cache markers
- `tuev-card.js` after build

## Runtime font paths

`src/plate/font.js` now checks the regular GL font names first and supports the usual packaged/manual paths:

- `/hacsfiles/tuev-card/fonts/GL-Nummernschild-Mtl.ttf`
- `/hacsfiles/tuev-card/fonts/GL-Nummernschild-Eng.ttf`
- `/local/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf`
- `/local/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf`
- `/local/tuev-card/fonts/GL-Nummernschild-Mtl.ttf`
- `/local/tuev-card/fonts/GL-Nummernschild-Eng.ttf`
- `/local/GL-Nummernschild-Mtl.ttf`
- `/local/GL-Nummernschild-Eng.ttf`
- `/local/EuroPlate.ttf` as legacy fallback

The old optional bold GL candidate names from b84 were removed from the probe list because the provided FontSpace package contains regular `Mtl` and `Eng` files.

## License notes

The uploaded FontSpace package contained:

- `info.txt` with `license: Freeware`
- GL-Nummernschild Mtl readme
- GL-Nummernschild Eng readme

The readmes state that unlimited permission is granted to use, copy, and distribute the fonts, with or without modification, commercially and noncommercially, and that the fonts are provided "AS IS" without warranty.

The license/readme notes were copied into the generated ZIP under `fonts/`.

## Not changed

- No TÜV badge renderer changes.
- No plate geometry tuning yet.
- No editor behavior changes.
- No system-font fallback added.
- EuroPlate remains only as legacy fallback.

## Test notes

Because this generated ZIP contains no font binaries, testing graphical GL plates requires placing compatible font files at one of the supported paths above.

Recommended first test path for manual Home Assistant testing:

```text
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

Recommended first test path for HACS-style testing:

```text
/config/www/community/tuev-card/fonts/GL-Nummernschild-Mtl.ttf
/config/www/community/tuev-card/fonts/GL-Nummernschild-Eng.ttf
```

If the card is served through HACS as `/hacsfiles/tuev-card/tuev-card.js`, the package path should map to `/hacsfiles/tuev-card/fonts/...`.

## Next likely step

After GL font loading is confirmed in Home Assistant, make b86 as a renderer tuning pass based on screenshots from Firefox, Chrome and Android app.
