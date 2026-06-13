# b63 – Stamp animation without success color flash

This patch keeps the no-badge HU confirmation stamp in its warning/action colors during the local animation.

Fixes:
- the no-badge stamp no longer switches the red warning stamp to green during `showSuccess`;
- the compact stamp panel is not rendered for the post-service success overlay;
- the checkmark keyframes are now included directly with the compact stamp panel, so the no-badge path can animate without depending on badge/crossfade markup;
- the service call delay was slightly extended so the animation sequence can finish before Home Assistant state updates.

No changes to the badge-visible confirmation overlay, EuroPlate handling, group logic, or plate renderer.
