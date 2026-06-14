# Repo cleanup notes

Current checked version: `b88`.

## Active structure

```text
src/                 modular source
dist/tuev-card.js    generated HACS bundle
fonts/               source font/license folder
dist/fonts/          generated HACS-delivered font folder
```

The root `tuev-card.js` is no longer the active HACS bundle.

## Keep tracked

- `dist/tuev-card.js`
- `dist/fonts/` including GL font binaries in the real GitHub repository
- `fonts/` including GL font binaries and license/readme notes
- `HANDOVER.md`
- `docs/` release/checkpoint notes

## Do not reintroduce

- root-bundle HACS layout with `content_in_root: true`
- graphical system-font fallback
- old EuroPlate-only assumption
- large TÜV sticker renderer changes as incidental cleanup

## Useful cleanup target

Old historical b-docs may remain for traceability, but active release docs should describe the current `dist` layout.
