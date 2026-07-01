// Kennzeichen Physical Lab b307 / render context helpers
// Keeps renderer input/font normalization outside the main renderer orchestrator.

import { positiveNumber } from "./plate-number-utils.js";

export function resolveSpecialIWidth(baseFont, options = {}) {
  return positiveNumber(options.specialIWidth, baseFont.specialWidths?.I || baseFont.letterWidth);
}

export function createOneLineRenderFont(baseFont, options = {}) {
  const specialIWidth = resolveSpecialIWidth(baseFont, options);
  return {
    ...baseFont,
    specialWidths: {
      ...(baseFont.specialWidths || {}),
      I: specialIWidth
    },
    fontSize: positiveNumber(options.fontSize, baseFont.fontSize),
    baselineY: positiveNumber(options.baselineY, baseFont.baselineY),
    fit: options.fontFit || null
  };
}

export function createTwoLineRenderFont(baseFont, options = {}) {
  const specialIWidth = resolveSpecialIWidth(baseFont, options);
  const fixedReducedFont = options.fixedReducedFont === true;
  return {
    ...baseFont,
    specialWidths: {
      ...(baseFont.specialWidths || {}),
      I: fixedReducedFont ? baseFont.specialWidths?.I ?? specialIWidth : specialIWidth
    },
    fontSize: fixedReducedFont ? baseFont.fontSize : positiveNumber(options.fontSize, baseFont.fontSize),
    baselineY: fixedReducedFont ? baseFont.baselineY : positiveNumber(options.baselineY, baseFont.baselineY),
    fit: fixedReducedFont ? null : options.fontFit || null
  };
}

export function resolveChangePlateBaseInput(input, changePlate, split) {
  return split.commonLabel || changePlate.commonText || input;
}

export function createFontResolutionResult({
  requestedFontMode,
  fontMode,
  reason,
  policy,
  widthCapMm,
  middleLayout,
  narrowLayout,
  chosenLayout,
  middleFitsWidthCap,
  narrowFitsWidthCap
}) {
  return {
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
  };
}
