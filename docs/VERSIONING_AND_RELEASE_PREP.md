# Versioning and release prep

Current checked version: `b87`.

## Version files

For each new b-version, update:

```text
package.json
package-lock.json
src/**/*.js import query markers
src/tuev-card-entry.js source marker
dist/tuev-card.js bundle header after build
HANDOVER.md
```

The generated bundle should start with:

```text
// TÜV Card bundled b87
```

## HACS metadata

`hacs.json` should keep:

```json
{
  "filename": "tuev-card.js"
}
```

Do not set `content_in_root: true` while using the `dist` asset layout.

## Resource URL

The dashboard resource remains:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

Do not add cachebusters for normal HACS installation docs.

## Build output

```text
dist/tuev-card.js
dist/fonts/
```

`npm run build` recreates `dist/` and copies root `fonts/` to `dist/fonts/`.
