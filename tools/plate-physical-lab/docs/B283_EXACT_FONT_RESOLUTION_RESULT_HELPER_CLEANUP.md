# b283 – Exact Font Resolution Result Helper Cleanup

## Goal

Continue the strict exact-duplicate cleanup line after b282 without merging font-selection business rules.

## Changed

Added `createFontResolutionResult(...)` in `src/plate/plate-render-context.js`.

It replaces only the repeated font-resolution result object:

```js
{
  requestedFontMode,
  fontMode,
  reason,
  policy,
  widthCapMm,
  middleRawContentWidth: middleLayout.preferredContentWidth,
  narrowRawContentWidth: narrowLayout.preferredContentWidth,
  middleNeededWidth: middleLayout.preferredNeededWidth,
  narrowNeededWidth: narrowLayout.preferredNeededWidth,
  middleFitsWidthCap,
  narrowFitsWidthCap,
  middleLayout,
  narrowLayout,
  chosenLayout
}
```

## Kept separate

The callers still own all domain-specific choices:

- manual vs. auto mode
- one-line vs. two-line resolver flow
- motorcycle/reduced special case
- `reason` and `policy` texts
- chosen layout
- fit flags

## Not changed

- no geometry
- no SVG output
- no UI
- no change-plate logic
- no solver merge
- no builder merge
- no Card code

## Checks

- Lab regression: 41/41 OK
- b282 → b283 model hashes: 41/41 identical
- b282 → b283 SVG hashes: 41/41 identical
