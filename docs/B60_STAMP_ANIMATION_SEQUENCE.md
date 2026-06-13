# b62 – Stamp animation sequence fix

This change keeps the previous stamp stamp look and fixes the confirmation animation timing for `show_badge: false`.

## Goal

The visible sequence should be:

1. The check mark draws in a handwriting-like stroke animation.
2. The red status stamp fades out softly.
3. The green HU confirmation stamp fades out softly.
4. The existing `tuev_reminder.confirm_passed` service call runs afterwards.

## Notes

- No changes to `show_badge: true`.
- No card layout changes.
- No plate renderer changes.
- The service call is intentionally delayed for the stamp animation, with double clicks blocked by the existing confirming state.
