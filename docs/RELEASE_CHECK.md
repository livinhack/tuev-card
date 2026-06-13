# TÜV Card release check

Current checked version: `b64`.

## b64 release note

`b64` is the first semantic test release. It is based on the confirmed release-candidate and repository-cleanup checkpoints and should not introduce new runtime behavior compared with the tested candidate state.

This release keeps the current EuroPlate rule unchanged:

- Graphical plates are only available when `EuroPlate.ttf` is reachable.
- No graphical system-font fallback is used.

## Local test install

Copy these files/folders into the local test resource folder, for example `/config/www/community/tuev-card/`:

```text
tuev-card.js
```

For source-level modular debugging, copy `src/` as well and point the resource to `src/tuev-card-entry.js`.

Reload the Lovelace resource with a fresh cache-buster, for example:

```text
/local/community/tuev-card/tuev-card.js?v=b64
```

## HACS release install

The current repository configuration uses the generated root bundle:

```text
tuev-card.js
```

Important files for a HACS release package:

```text
tuev-card.js
hacs.json
README.md
LICENSE
NOTICE.md
package.json
package-lock.json
scripts/build-bundle.mjs
src/
```

## Versioning

The package version for this release is:

```json
"version": "0.1.1-b64"
```

The GitHub Release tag should be:

```text
b64
```

See `docs/VERSIONING_AND_RELEASE_PREP.md` and `docs/HACS_RELEASE_FLOW.md` for the release/update trigger checklist.

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

## Post naming migration checks

Verify that HACS and Home Assistant load the production file directly from the repository root:

```text
/config/www/community/tuev-card/tuev-card.js
/hacsfiles/tuev-card/tuev-card.js?v=b64
```

Make sure these old names are not present in the installed HACS folder or Lovelace resource configuration:

```text
tuev-card-test.js
dist/tuev-card.js
/hacsfiles/tuev-card-test/
```

The dashboard card type remains unchanged:

```yaml
type: custom:tuev-card
```

## Functional smoke test

- Add/remove ungrouped entities.
- Add all new TÜV entities.
- Open display panel; click column chips and checkboxes.
- Open color picker; select multiple colors.
- Switch manual group sorting to an automatic mode and confirm/cancel the discard dialog.
- Sort ungrouped entities by name, plate, HU, status.
- Check grouped and ungrouped dashboard rendering.
- Verify graphical license plates with reachable `EuroPlate.ttf`; verify text rendering when `EuroPlate.ttf` is missing or unreachable.

## Responsive / Browser test

See `docs/RESPONSIVE_BROWSER_TEST.md` for the dedicated cross-browser and Home Assistant view checklist introduced during the release-candidate phase.


## b64 handoff checkpoint

See `docs/B50_HANDOFF_CHECKPOINT.md` for the 50-version continuation checkpoint.


## b64 restore note

The no-badge confirmation overlay was restored to the b50/b49 baseline after b51/b52 did not improve the layout. See `docs/B53_RESTORE_B50_CONFIRM_OVERLAY.md`.


## b64 note

`b64` tunes only the background/contrast and rotation of the stamp-style confirmation overlay for `show_badge: false`. The b55 frame and typography concept remain unchanged.

## b64 stamp animation note

See `docs/B57_STAMP_CONFIRM_ANIMATION.md` for the no-badge stamp confirmation animation tuning.

## b64 cleanup and stamp click fix

`b64` fixes the stamp confirmation click/service flow after the b58 animation work. It also removes a small obsolete wrapper in the delayed confirmation path. No layout, renderer, editor or EuroPlate behavior was intentionally changed.

See `docs/B59_CLEANUP_AND_STAMP_CLICK_FIX.md`.


## b64 stamp animation sequence

See `docs/B60_STAMP_ANIMATION_SEQUENCE.md` for the fixed stamp confirmation animation sequence.


## b64 stamp animation rebuild

See `docs/B62_STAMP_ANIMATION_REBUILD.md` for the rebuilt no-badge stamp confirmation animation.

## b64 stamp flash fix

`b64` fixes the short flash after the no-badge HU stamp confirmation animation. The overlay is now hidden before the delayed service call, so a re-render cannot restart the faded-out stamp animation.


## b64 stamp with badge trial

See `docs/B64_STAMP_WITH_BADGE_TRIAL.md`.


## b65 stamp confirm cleanup

See `docs/B65_STAMP_CONFIRM_FINAL_CLEANUP.md` for the cleanup that made the stamp-based confirmation flow the single confirm UI and removed the unused legacy dialog/button helpers.
