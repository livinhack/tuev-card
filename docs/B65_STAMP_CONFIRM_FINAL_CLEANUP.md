# b65 – Stamp confirm final cleanup

`b65` finalizes the stamp-based TÜV/HU confirmation flow after the successful `b64` trial.

## Confirmed behavior

The stamp confirmation is now the single confirm UI for both display modes:

- `show_badge: true`
- `show_badge: false`

The older classic dialog/button overlay is no longer used.

## Cleanup

Removed unused legacy confirm helpers:

- `getOverlayStyleOptions()`
- `renderConfirmOverlay()`

Removed unused legacy translation keys:

- `overlay.updating_text`
- `overlay.updated_text`
- `overlay.question`
- `button.confirm`

The stamp flow remains unchanged from the confirmed behavior:

1. Click/tap the green `HU bestanden?` stamp field.
2. The handwritten check mark starts immediately.
3. The red/orange status stamp fades out.
4. The green HU stamp fades out.
5. The existing `tuev_reminder.confirm_passed` service call runs afterwards.

## Not changed

- No visual stamp redesign.
- No timing change.
- No plate renderer change.
- No EuroPlate rule change.
- No editor/group logic change.
- No HACS/root bundle naming change.
