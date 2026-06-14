# TÜV Card release check

Current checked version: `b83`.

`b83` is a README/release-readiness cleanup. It keeps the confirmed b79-b82 runtime/editor behavior and does not intentionally change card behavior.

See also:

```text
docs/B83_README_RELEASE_CLEANUP_NEXT_STEP.md
```

## Current stable notes

- b79 HU stamp overlay in 1-column layout: confirmed by user.
- b81 modal sort-discard confirmation: confirmed by user.
- b82 button state and `Alle hinzufügen`: confirmed by user.
- b83 README is end-user oriented and uses the normal HACS resource path.

The current EuroPlate rule remains unchanged:

- Graphical plates are only available when `EuroPlate.ttf` is reachable.
- No graphical system-font fallback is used.

## HACS / root bundle

The repository uses the generated root bundle:

```text
tuev-card.js
```

HACS should load:

```text
/hacsfiles/tuev-card/tuev-card.js
```

The dashboard card type remains:

```yaml
type: custom:tuev-card
```

These old names should not return:

```text
tuev-card-test.js
dist/tuev-card.js
/hacsfiles/tuev-card-test/
```

## Versioning

The package version for this checkpoint is:

```json
"version": "0.1.1-b83"
```

The internal GitHub Release tag can be:

```text
b83
```

For a future public semantic release, use `v0.1.x` or later tags instead of `bXX` tags.

## Build/check commands

```bash
npm run build
npm run check
```

Equivalent explicit commands:

```bash
node scripts/build-bundle.mjs
node scripts/check-js.mjs
```

## Functional smoke test

- Add/remove ungrouped entities.
- Add all new TÜV entities.
- Open the display panel; click column chips and checkboxes.
- Open the color picker; select multiple colors.
- Switch manual group sorting to an automatic mode and confirm/cancel the discard dialog.
- Sort ungrouped entities by name, plate, HU, and status.
- Check grouped and ungrouped dashboard rendering.
- Verify graphical license plates with reachable `EuroPlate.ttf`.
- Verify plain text plates when `EuroPlate.ttf` is missing or unreachable.

## HU stamp confirmation smoke test

Test both display modes:

```yaml
show_badge: true
show_badge: false
```

For due and expired vehicles:

- The red/orange TÜV status stamp is visible.
- The green `HU bestanden?` / `HU passed?` stamp field is clickable.
- The checkmark starts drawing immediately after the click.
- The red/orange status stamp fades out.
- The green action stamp fades out.
- The `tuev_reminder.confirm_passed` service runs afterwards.
- The card does not change size because the confirmation overlay is present.
- No old dialog/button confirmation overlay appears.

## Responsive / browser test

See `docs/RESPONSIVE_BROWSER_TEST.md` for the dedicated cross-browser and Home Assistant view checklist.
