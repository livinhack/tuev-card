# b63 cleanup and stamp click fix

`b63` is a targeted cleanup and bug-fix checkpoint after the stamp confirmation overlay work.

## Why this checkpoint exists

The previous stamp animation state could visually switch the checkbox to green without completing the confirmation flow. The root cause was in the card entry confirm path: the delayed `show_badge: false` branch referenced an obsolete config field instead of the normalized card config.

## Fixed

- The stamp confirmation path now checks `this.config.show_badge`.
- The obsolete delayed-confirmation wrapper was removed.
- The confirm click listener now prevents default handling and propagation before starting the confirmation flow.
- The delayed service call remains intentional for `show_badge: false`, so the stamp animation has time to play before `tuev_reminder.confirm_passed` is called.

## Cleanup scope

This is deliberately small cleanup, not a broad refactor.

Removed/avoided:

- obsolete `_config` usage in the card runtime confirmation path
- unnecessary `finishDelayedConfirmation()` wrapper

Kept unchanged:

- stamp look from b56/b58
- `show_badge: true` confirmation behavior
- EuroPlate rule
- card layout
- group behavior
- editor behavior

## Validation

- `npm run build`
- `npm run check`
