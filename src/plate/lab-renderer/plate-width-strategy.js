import { positiveNumber } from "./plate-number-utils.js";
import { TWO_LINE_WIDTH_BANDS, TWO_LINE_WIDTH_RULES } from "./plate-variant-rules.js";

export function resolveTwoLineWidthRule(value = "standard") {
  if (value === "motorcycle" || value === "motorcyclePlate" || value === "kraftrad") return TWO_LINE_WIDTH_RULES.motorcycle;
  if (value === "reducedTwoLine" || value === "reduced-two-line" || value === "verkleinertTwoLine") return TWO_LINE_WIDTH_RULES.reducedTwoLine;
  return value === "twoAndThreeWheel" || value === "two-and-three-wheel" || value === "two_or_three_wheel"
    ? TWO_LINE_WIDTH_RULES.twoAndThreeWheel
    : TWO_LINE_WIDTH_RULES.standard;
}

export function getTwoLineWidthBandsForFont(fontMode, widthRule = resolveTwoLineWidthRule()) {
  const bands = widthRule.widthBands?.[fontMode] || widthRule.widthBands?.middle || TWO_LINE_WIDTH_BANDS.middle;
  return bands.filter((width) => width <= widthRule.maxWidth);
}

export function resolveTwoLineWidthCapMm(widthMode, widthRule = resolveTwoLineWidthRule()) {
  const number = Number(widthMode);
  return Number.isFinite(number) && number > 0 ? Math.min(number, widthRule.maxWidth) : widthRule.maxWidth;
}

export function resolveWidthCapMm(widthMode, fallback) {
  return positiveNumber(widthMode, fallback);
}

export function resolveWidthStrategy(widthMode) {
  if (widthMode === "balanced") return "balanced";
  if (widthMode === "auto" || !widthMode) return "compact";
  return "fixed";
}
