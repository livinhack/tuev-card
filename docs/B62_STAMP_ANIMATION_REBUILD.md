# b62 stamp animation rebuild

This build rebuilds the `show_badge: false` HU stamp confirmation animation instead of patching the previous sequence.

Goals:

- The checkmark starts drawing immediately after the click.
- The checkmark is drawn with an SVG `pathLength` stroke animation.
- The red/orange warning stamp keeps its color and then fades out.
- The green HU confirmation stamp keeps its color and then fades out.
- The service call is delayed until after the visible sequence.
- The expired/due stamp color is frozen while confirmation is in progress so a state refresh cannot recolor the warning stamp.

Expected timing:

1. Click → checkmark draw starts immediately.
2. Around 0.7 s → warning stamp fades.
3. Around 1.3 s → HU stamp fades.
4. Around 2.1 s → `tuev_reminder.confirm_passed` service is called.

No changes to `show_badge: true`, EuroPlate detection, layout, groups, or plate rendering.
