# TÜV Card release check

Current checked version: `b69`.

## Current release/checkpoint note

`b69` is a concept/documentation checkpoint for later group-specific display overrides. It should not introduce UI or runtime behavior changes.

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
/hacsfiles/tuev-card/tuev-card.js?v=b69
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
"version": "0.1.1-b69"
```

The internal GitHub Release tag can be:

```text
b69
```

For a future public semantic release, use `v0.1.x` tags instead of `bXX` tags.

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

## Related checkpoint docs

- `docs/B50_HANDOFF_CHECKPOINT.md`
- `docs/B53_RESTORE_B50_CONFIRM_OVERLAY.md`
- `docs/B54_HU_STAMP_CONFIRM_OVERLAY.md`
- `docs/B55_STAMP_READABILITY_TUNING.md`
- `docs/B56_STAMP_BACKGROUND_TUNING.md`
- `docs/B57_STAMP_CONFIRM_ANIMATION.md`
- `docs/B59_CLEANUP_AND_STAMP_CLICK_FIX.md`
- `docs/B60_STAMP_ANIMATION_SEQUENCE.md`
- `docs/B61_STAMP_ANIMATION_NO_SUCCESS_FLASH.md`
- `docs/B62_STAMP_ANIMATION_REBUILD.md`
- `docs/B63_STAMP_FLASH_FIX.md`
- `docs/B64_STAMP_WITH_BADGE_TRIAL.md`
- `docs/B65_STAMP_CONFIRM_FINAL_CLEANUP.md`
- `docs/B66_STAMP_CONFIRM_DOCS.md`
- `docs/B67_GROUP_DISPLAY_OVERRIDES_CONCEPT.md`
