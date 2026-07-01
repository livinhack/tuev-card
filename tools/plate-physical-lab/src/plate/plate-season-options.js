import { clampNumber, numberOrFallback, positiveNumber } from "./plate-number-utils.js";
// Kennzeichen Physical Lab b266 / season option normalization helpers
// Keeps season input/default normalization outside of the main SVG renderer orchestrator.

import { TWO_LINE_RULES_MM } from "./plate-variant-rules.js";
import { normalizeSeasonMonth } from "./season-field.js";

export function resolveRulesForSeason(rules, season) {
  if (!season?.enabled) return rules;
  return {
    ...rules,
    content: {
      ...rules.content,
      season: {
        ...rules.content.season,
        targetDigitHeight: season.targetDigitHeight,
        fontSize: season.fontSize,
        widthScale: season.widthScale,
        digitGap: season.digitGap,
        upperBaselineY: rules.formatKey === "motorcycle" ? rules.content.season.upperBaselineY : season.upperBaselineY,
      }
    }
  };
}

export function resolveSeasonOptions(season = {}, rules = TWO_LINE_RULES_MM) {
  const defaults = rules?.content?.season || TWO_LINE_RULES_MM.content.season;
  const enabled = season?.enabled === true;
  return {
    enabled,
    from: normalizeSeasonMonth(season?.from, "04"),
    to: normalizeSeasonMonth(season?.to, "10"),
    targetDigitHeight: positiveNumber(season?.targetDigitHeight, defaults.targetDigitHeight),
    fontSize: positiveNumber(season?.fontSize, defaults.fontSize),
    widthScale: clampNumber(positiveNumber(season?.widthScale, defaults.widthScale), 0.6, 1.2),
    digitGap: clampNumber(numberOrFallback(season?.digitGap, defaults.digitGap), -5, 10),
    upperBaselineY: positiveNumber(season?.baselineY, defaults.upperBaselineY)
  };
}

