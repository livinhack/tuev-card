# TÜV Card versioning and release preparation

Current checked version: `b83`.

The project currently uses internal `bXX` checkpoint labels for ZIP/test handoffs. A future public release should use semantic tags such as `v0.1.x` or later.

## Current development checkpoint

```json
"version": "0.1.1-b83"
```

The generated root bundle should start with:

```text
TÜV Card bundled b83
```

## HACS file naming

The HACS filename stays unchanged:

```json
{
  "filename": "tuev-card.js",
  "content_in_root": true
}
```

The dashboard resource should use the root bundle:

```yaml
url: /hacsfiles/tuev-card/tuev-card.js
type: module
```

## Internal checkpoint flow

1. Start from the latest confirmed ZIP checkpoint.
2. Increment the `bXX` version.
3. Update `package.json`, `package-lock.json`, source import query markers, and source/bundle headers.
4. Run:

```bash
npm run build
npm run check
```

5. Create a new ZIP with the matching version number.
6. Update `HANDOVER.md` fully.

## Later public release flow

1. Start from a confirmed release-candidate checkpoint.
2. Change the package version to the chosen semantic version.
3. Run build/check.
4. Commit and push with GitHub Desktop.
5. Create a GitHub Release with the semantic tag.
6. Let HACS discover the update, or use **Informationen aktualisieren** for immediate testing.

## What should not change accidentally

Do not rename the card type:

```yaml
type: custom:tuev-card
```

Do not reintroduce old file names:

```text
tuev-card-test.js
dist/tuev-card.js
```

Do not change the current EuroPlate rule until the bundled-font replacement is intentionally implemented:

```text
Graphical license plates require reachable EuroPlate.ttf.
No graphical system-font fallback.
```

## Deferred after b83

- GL-Fontpaket/Lizenz prüfen.
- Plate Renderer v2 planen und ggf. implementieren.
- Mittelschrift / Engschrift selection.
- Integration Architecture V3.
- Compact mode / hide TÜV badge.
- README screenshots.
