# b135 Season X-offset Control Fix

## Problem

In b132 the seasonal validity field provided a `Saison X-Korrektur in mm` input, but the Lab read it through the generic positive-only `numberValue()` helper.

That helper intentionally rejects values that are not greater than zero. This is correct for dimensions such as font sizes and baselines, but wrong for an offset control. As a result:

- negative X offsets were ignored,
- `0` was treated as fallback/default,
- only positive offsets could be passed through reliably.

For centering season month glyphs this made the control appear ineffective whenever the required correction was leftward or exactly zero.

## Fix

Added a signed numeric helper in the Physical Lab app:

```js
function signedNumberValue(input, fallback) {
  const value = Number(input?.value);
  return Number.isFinite(value) ? value : fallback;
}
```

The season X correction now uses this helper both when rendering and when applying measured calibration.

## Scope

- No renderer geometry changes.
- No Card renderer changes.
- b129 seal-circle changes remain reverted.
- Two-line seasonal validity remains Lab-only.

## Expected behavior

Changing `Saison X-Korrektur in mm` to negative, zero or positive values should visibly move both season month strings horizontally inside their 30 × 20 mm fields.
