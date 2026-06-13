# b70 – Stamp confirm documentation update

`b70` documents the confirmed stamp-style HU confirmation flow after the `b65` cleanup.

## Scope

No runtime behavior, UI styling, editor logic, renderer logic, grouping logic, or HACS naming is intentionally changed in this checkpoint.

## Confirmed behavior

The stamp confirmation is the single confirm UI for both display modes:

- `show_badge: true`
- `show_badge: false`

When a vehicle is due or expired:

1. The card shows a red/orange TÜV status stamp.
2. The green `HU bestanden?` / `HU passed?` stamp field is clickable.
3. Clicking the green stamp starts the local confirmation animation.
4. The checkmark is drawn visibly.
5. The warning stamp fades out.
6. The HU action stamp fades out.
7. The existing `tuev_reminder.confirm_passed` service flow runs afterwards.

The overlay must not change the card size.

## Removed legacy path

The old dialog/button overlay is no longer the active confirm UI. The removed helpers remain intentionally removed:

- `getOverlayStyleOptions()`
- `renderConfirmOverlay()`

The old translation keys for the legacy dialog/button are intentionally not required anymore.
