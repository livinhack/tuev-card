# b64 – Stamp confirm overlay with badge trial

This build tests the HU stamp confirmation principle for the normal badge view as well.

## Scope

- Base: b63 confirmed stamp animation.
- Applies the stamp-style confirmation overlay to `show_badge: true` too.
- The old dialog-style confirmation overlay is no longer used for the badge view in this trial.
- `show_badge: false` keeps the b63 behavior.

## Intended sequence

For due/expired vehicles:

1. Stamp overlay is shown over the badge area.
2. Clicking the green HU field starts the handwritten checkmark animation immediately.
3. The red/orange status stamp fades out.
4. The green HU field fades out.
5. The existing `tuev_reminder.confirm_passed` service call runs afterwards.

## Notes

- This is a visual/interaction trial.
- No changes to EuroPlate detection or plate rendering.
- No changes to group/editor logic.
