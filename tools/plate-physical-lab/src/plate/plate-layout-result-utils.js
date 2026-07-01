// Kennzeichen Physical Lab b302 / layout result object helpers
// Shared helpers for identical, already-solved layout result object fields only.

export function createLayoutResultBase({
  minFits,
  allowOverflow,
  preferredFits,
  maxFits,
  width,
  strategy,
  modeLabel,
  policy,
  reason,
  available,
  contentLimits,
  minContentWidth,
  preferredContentWidth,
  maxContentWidth,
  minNeededWidth,
  preferredNeededWidth,
  maxNeededWidth,
  contentWidth,
  sideMarginLeft,
  sideMarginRight,
  positionedContent
}) {
  return {
    fits: minFits,
    renderable: minFits || allowOverflow,
    minFits,
    preferredFits,
    maxFits,
    width,
    strategy,
    modeLabel,
    policy,
    reason,
    availableWidth: available,
    contentLimits,
    minContentWidth,
    preferredContentWidth,
    maxContentWidth,
    minNeededWidth,
    preferredNeededWidth,
    maxNeededWidth,
    contentWidth,
    sideMarginLeft,
    sideMarginRight,
    positionedContent
  };
}


export function createHorizontalBounds(left, right) {
  return { left, right, width: right - left };
}
