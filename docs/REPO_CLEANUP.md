# TÜV Card repo cleanup notes

Current checked version: `b84`.

This checkpoint is a repository/readiness cleanup. It does not intentionally change UI behavior, editor behavior, card rendering, EuroPlate handling, grouping, sorting, or HACS naming.

## Verified release layout

The productive HACS bundle is generated into the repository root:

```text
tuev-card.js
```

The modular source entry remains here:

```text
src/tuev-card-entry.js
```

The HACS metadata points to the root bundle:

```json
{
  "filename": "tuev-card.js",
  "content_in_root": true
}
```

Expected Home Assistant resource path:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

## Files that should not return

```text
tuev-card-test.js
dist/tuev-card.js
dist/tuev-card-test.js
/hacsfiles/tuev-card-test/
```

These names were only part of the earlier test-repository phase or intermediate bundle layout.

## Build and check workflow

The package scripts are intentionally simple:

```bash
npm run build
npm run check
```

`npm run check` uses a small Node script so it works consistently on Windows and Linux instead of relying on Unix shell tools.

The Windows helper:

```text
build-tuev-card.bat
```

runs both build and syntax check before reporting success.

## README scope

`README.md` should stay end-user oriented:

- install through HACS or manual resource
- add the card
- use the visual editor
- show simple YAML examples
- explain current graphical license plate requirement

Developer/build/release details belong in `docs/`, not in the README.

## License and font notes

For the current checkpoint:

- Graphical plate rendering remains available only when a supported GL-Nummernschild font or legacy a supported plate font is reachable.
- There is no graphical system-font fallback.
- GL-Nummernschild fonts are the recommended next evaluation before Integration Architecture V3, but are not included in b84.

## Deferred / later

- Plate Renderer v2 based on FZV Anlage 4.
- Bundled GL-Nummernschild Mittel-/Engschrift fonts, after license documentation.
- Integration Architecture V3.
- Compact mode / hiding the TÜV badge.
- Screenshot refresh shortly before broader public promotion.
