# v0.1 release candidate notes

Current checked version: `b88`.

## Current release shape

- HACS delivery uses `dist/tuev-card.js`.
- Bundled non-JS assets live under `dist/fonts/`.
- The Home Assistant resource remains `/hacsfiles/tuev-card/tuev-card.js`.
- Graphical license plates prefer bundled GL-Nummernschild fonts.
- No graphical system-font fallback is used.
- TÜV sticker renderer is stable and should not be changed in release cleanup.

## Before tagging

1. Keep the GL `.ttf` files in root `fonts/`.
2. Run `npm run build`.
3. Confirm the font files are mirrored to `dist/fonts/`.
4. Run `npm run check`.
5. Test HACS redownload/update in Home Assistant.
6. Confirm `fonts/` is present in `/config/www/community/tuev-card/` after HACS install.

## Deferred after release candidate

- GL license plate renderer geometry tuning.
- Browser/app renderer stability pass for Firefox, Chrome and Android app.
- Integration Architecture V3.
- Sonderkennzeichen and compact-card ideas.
